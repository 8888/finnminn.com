# NecroBloom: API Management & Custom Domain Guide (Path B)

This guide provides a exhaustive, step-by-step walkthrough for configuring **NecroBloom** using **Azure API Management (APIM)**. Following these steps precisely will allow you to maintain the frontend on the **Free Tier** while serving the API via `api.necrobloom.finnminn.com`.

---

## 1. Create API Management Instance
1.  **Search**: In the Azure Portal search bar, type `API Management services` and select it.
2.  **Create**: Click **+ Create**.
3.  **Basics Tab**:
    - **Subscription**: Select the subscription containing `necrobloom-rg`.
    - **Resource group**: Select `necrobloom-rg`.
    - **Region**: Select `Canada Central` (Matches your Function App location).
    - **Resource name**: `necrobloom-gateway` (Must be globally unique).
    - **Organization name**: `Finnminn`
    - **Administrator email**: `your-email@example.com`
    - **Pricing tier**: Select **Consumption (SLA 99.9%)**. This is the serverless tier.
4.  **Review + Create**: Click **Review + Create**, then **Create**. 
    - *Note: Consumption tier deployment is usually fast (~2-5 mins), unlike dedicated tiers.*

---

## 2. Import NecroBloom Function App
1.  Navigate to your new **API Management service**.
2.  **APIs Menu**: Select **APIs** (under the APIs section in the sidebar).
3.  **Add API**: Under "Create from Azure resource", select **Function App**.
4.  **Configure**:
    - Click **Browse**.
    - Select **necrobloom-api**.
    - Select the functions to import (check all: `GetPlants`, `CreatePlant`, `IdentifyPlant`, `HealthCheck`, `Ping`). Click **Select**.
5.  **Create from Function App (Full View)**:
    - **Display name**: `NecroBloom API`
    - **Name**: `necrobloom-api`
    - **Description**: `Gothic Plant Tracking API for NecroBloom.`
    - **API URL suffix**: `api` (Resulting URL: `https://necrobloom-gateway.azure-api.net/api`)
    - **Protocols**: `HTTPS`
    - **Products**: Select **Unlimited**.
    - **Gateways**: `Managed`
    - **Subscription required**: **Uncheck** (Since we are using custom auth tokens in the code, we don't want to require the `Ocp-Apim-Subscription-Key` header for now).
6.  Click **Create**.

---

## 3. Configure Custom Domain & SSL
### A. DNS Record (Azure DNS)
1.  Navigate to your **DNS Zone** `finnminn.com` (in `finnminn-rg`).
2.  Click **+ Record set**.
3.  **Fields**:
    - **Name**: `api.necrobloom`
    - **Type**: `CNAME`
    - **TTL**: `1 hour`
    - **Alias record**: `No`
    - **Alias**: `necrobloom-gateway.azure-api.net` (Or your specific APIM name).
4.  Click **OK**.

### B. Create Certificate in Key Vault
Since `necrobloom-vault` is empty, you must add a certificate for `api.necrobloom.finnminn.com` first:

1.  Navigate to **necrobloom-vault** in the Azure Portal.
2.  Select **Certificates** > **+ Generate/Import**.
3.  **Method of Certificate Creation**: `Generate`.
4.  **Certificate Name**: `api-necrobloom-cert`.
5.  **Subject**: `CN=api.necrobloom.finnminn.com`
6.  **DNS Names**: Add `api.necrobloom.finnminn.com`.
7.  **Validity Period**: `12 months`.
8.  **Content Type**: `PKCS #12` (Default).
9.  **Lifetime Action Type**: `Email all contacts at a given percentage lifetime` (e.g., 80%).
10. Click **Create**.

### C. APIM Custom Domain Configuration
**IMPORTANT**: Azure has suspended the creation of new Managed Certificates from August 15, 2025, to March 15, 2026. You must use the **Key Vault** method.

1.  **Enable APIM Managed Identity**:
    - In your **API Management service**, select **Managed identities** (under Security).
    - Set the **System assigned** status to **On** and click **Save**.
2.  **Grant Key Vault Access (Access Policy)**:
    - This project uses **Access Policies** for Key Vault security.
    - Navigate to your **Key Vault** (e.g., `pip-vault`).
    - Select **Access policies** > **+ Create**.
    - **Permissions**: Select `Get` and `List` under **Certificate permissions**. Select `Get` under **Secret permissions**.
    - **Principal**: Search for and select your APIM instance (`necrobloom-gateway`).
    - **Review + Create**: Complete the wizard to grant the gateway access to the certificates.
3.  **Add Custom Domain**:
    - Return to your **API Management service** > **Custom domains**.
    - Click **+ Add**.
    - **Type**: `Gateway`
    - **Hostname**: `api.necrobloom.finnminn.com`
    - **Certificate Type**: Select **Key Vault**.
    - **Certificate**: Click **Select** and choose your vault and the pre-uploaded certificate.
    - **Default SSL binding**: `Yes`
    - **Minimum TLS version**: `1.2`
4.  Click **Add**.

---

## 4. Security & CORS Handshake
### A. APIM Global Policy (Handle Preflight)
To allow the frontend to call the API, APIM must handle CORS.
1.  In APIM, select **APIs** -> **All APIs**.
2.  In the **Inbound processing** section, click the **</> (code editor)** icon.
3.  Paste the following `<cors>` policy inside `<inbound>`:
```xml
<inbound>
    <cors allow-credentials="true">
        <allowed-origins>
            <origin>https://necrobloom.finnminn.com</origin>
            <origin>http://localhost:5173</origin>
        </allowed-origins>
        <allowed-methods preflight-result-max-age="300">
            <method>GET</method>
            <method>POST</method>
            <method>OPTIONS</method>
        </allowed-methods>
        <allowed-headers>
            <header>*</header>
        </allowed-headers>
        <expose-headers>
            <header>*</header>
        </expose-headers>
    </cors>
    <base />
</inbound>
```
4.  Click **Save**.

### B. Function App CORS (Internal Trust)
1.  Navigate to the `necrobloom-api` **Function App**.
2.  Select **CORS** (under "API" section).
3.  **Add the following Origins**:
    - `https://necrobloom.finnminn.com` (Production Frontend)
    - `http://localhost:5173` (Local Development - allows testing your local UI against the cloud API)
4.  Check **Enable Access-Control-Allow-Credentials**.
5.  Click **Save**.

---

## 5. Code Integration

### A. Environment Files
**`apps/necrobloom/.env.production`**
```env
VITE_API_URL=https://api.necrobloom.finnminn.com
```

**`apps/necrobloom/.env`**
```env
VITE_API_URL=http://localhost:7071
```

### B. Dynamic Fetch Implementation
Update `Dashboard.tsx`, `AddPlantModal.tsx`, and `HealthCheckModal.tsx`.

```typescript
// Define a utility or constant for the API base
const API_BASE = import.meta.env.VITE_API_URL;

// Usage:
const response = await fetch(`${API_BASE}/api/plants`, { ... });
```

---

## 6. Verification Checklist
- [ ] `curl -I https://api.necrobloom.finnminn.com/api/Ping` returns `200 OK`.
- [ ] Browser DevTools -> Network shows calls to `api.necrobloom.finnminn.com` with no CORS errors.
- [ ] Local dev continues to work using `localhost:7071`.