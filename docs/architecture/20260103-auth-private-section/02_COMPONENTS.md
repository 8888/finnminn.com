# Component Detail

This document details the configuration of the specific components required to implement the Client-Side Authentication architecture.

## 1. Microsoft Entra ID: App Registration
The "App Registration" is the identity definition of the application in the Microsoft cloud.

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Name** | `Finnminn-WebApp` | Display name seen by users during login. |
| **Supported Account Types** | *Accounts in this organizational directory only* (Single Tenant) OR *Personal Microsoft accounts* | "Single Tenant" allows strict control. "Personal Accounts" allows broader access (friends/family). **Recommended: Personal Microsoft accounts** (Multi-tenant + Personal) for a hobby app to allow flexible sign-up. |
| **Platform** | **Single Page Application (SPA)** | Critical setting. Enables PKCE (Proof Key for Code Exchange) flow for security in browsers. |
| **Redirect URIs** | `http://localhost:3000` (Dev)<br>`https://finnminn.com/app` (Prod) | The strict whitelist of URLs where Microsoft is allowed to send tokens. |
| **Implicit Grant** | **Disabled** | We use Authorization Code Flow with PKCE (more secure). Do not enable Access/ID tokens here. |

### 1.1 Enterprise Application (Service Principal)
When the App Registration is created, a corresponding "Service Principal" is created in "Enterprise Applications".
- **Assignment Required:** Set this to **Yes** to strictly control who can log in.
- **Users and Groups:** If Assignment is Yes, you must manually add specific users (by email) here.

## 2. Frontend: MSAL.js Configuration
The `src/public/auth.js` file will initialize the MSAL PublicClientApplication.

### Configuration Object (`msalConfig`)
```javascript
const msalConfig = {
    auth: {
        clientId: "<YOUR_CLIENT_ID>", // GUID from App Registration
        authority: "https://login.microsoftonline.com/common", // or <TENANT_ID> for single tenant
        redirectUri: "https://finnminn.com/app", // Must match App Registration
    },
    cache: {
        cacheLocation: "localStorage", // Persists login across tab closes
        storeAuthStateInCookie: false,
    }
};
```

### Login Request Object
```javascript
const loginRequest = {
    scopes: ["User.Read"] // Permissions requested. User.Read allows reading the profile.
};
```

## 3. External Azure Functions
To allow the frontend to call external functions using the same login.

### Authentication Settings ("Easy Auth")
The Azure Function App must be configured to use the **same** Identity Provider configuration.
- **Provider:** Microsoft
- **App Registration:** Pick an existing app registration -> Select `Finnminn-WebApp`.
- **Issuer URL:** `https://login.microsoftonline.com/<TENANT_ID>/v2.0`
- **Allowed Token Audiences:** The `Application ID URI` of the App Registration.

**Note:** This allows the Function App to validate the signature of the token sent by `finnminn.com` automatically.
