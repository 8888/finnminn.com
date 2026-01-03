# Deployment Strategy & Implementation Guide

This guide covers the manual setup of the Azure resources and the implementation code.

## Phase 1: Azure Portal Setup (Manual)

### Step 1: Create the App Registration
1. Sign in to the [Azure Portal](https://portal.azure.com).
2. Search for and select **Microsoft Entra ID**.
3. In the left menu, select **App registrations** > **New registration**.
4. **Name:** Enter `Finnminn-Web`.
5. **Supported account types:** Select **Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)**.
   - *Note: This provides the most flexibility for a public-facing hobby site.*
6. **Redirect URI:**
   - Select platform: **Single-page application (SPA)**.
   - URI: `https://finnminn.com/app`
7. Click **Register**.

### Step 2: Configure Platform Settings
1. On the app overview page, copy the **Application (client) ID**. You will need this for the code.
2. Go to **Authentication** in the left menu.
3. Under **Single-page application**, add another URI for local testing: `http://localhost:4280` (or whichever port your local static server uses).
4. Ensure **Access tokens** and **ID tokens** checkboxes (under Implicit grant) are **unchecked**. MSAL.js 2.0 uses the more secure Code Flow.
5. Click **Save**.

### Step 3: Enforce User Assignment (Optional - "Provisioning" Feature)
*If you want to restrict access to only specific people:*
1. Search for **Enterprise applications** in the main portal search bar.
2. Find `Finnminn-Web` in the list (remove the "Application Type" filter if you don't see it).
3. Under **Manage**, select **Properties**.
4. Set **Assignment required?** to **Yes**.
5. Click **Save**.
6. Go to **Users and groups**.
7. Click **Add user/group** and invite the specific email addresses you want to allow.

---

## Phase 2: Code Implementation

### Step 1: Create the Private Section
Create the folder structure `src/public/app/`.

### Step 2: Create `src/public/auth.js`
Create a JavaScript file to handle the MSAL logic.

```javascript
// src/public/auth.js

const msalConfig = {
    auth: {
        clientId: "REPLACE_WITH_YOUR_CLIENT_ID",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: window.location.origin + "/app", 
    },
    cache: {
        cacheLocation: "localStorage"
    }
};

const myMSALObj = new msal.PublicClientApplication(msalConfig);

async function signIn() {
    try {
        await myMSALObj.loginRedirect({ scopes: ["User.Read"] });
    } catch (error) {
        console.error(error);
    }
}

async function handleRedirect() {
    try {
        const response = await myMSALObj.handleRedirectPromise();
        if (response) {
            // User just logged in
            console.log("Logged in:", response.account);
            return response.account;
        } else {
            // Check if user is already logged in from previous session
            const currentAccounts = myMSALObj.getAllAccounts();
            if (currentAccounts.length === 0) {
                return null;
            }
            return currentAccounts[0];
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getToken() {
    // Call this function when you need a token for an API call
    const account = myMSALObj.getAllAccounts()[0];
    if (!account) return null;

    try {
        const response = await myMSALObj.acquireTokenSilent({
            scopes: ["User.Read"],
            account: account
        });
        return response.accessToken;
    } catch (error) {
        if (error instanceof msal.InteractionRequiredAuthError) {
             return myMSALObj.acquireTokenPopup({ scopes: ["User.Read"] });
        }
        console.error(error);
    }
}
```

### Step 3: Create `src/public/app/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Finnminn App - Private</title>
    <!-- Import MSAL.js -->
    <script type="text/javascript" src="https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js"></script>
    <script src="/auth.js"></script>
</head>
<body>
    <h1>Finnminn Private App</h1>
    <div id="content" style="display:none">
        <p>Welcome, <span id="username"></span>!</p>
        <button onclick="callMyApi()">Call External Function</button>
    </div>
    <div id="loading">Verifying authentication...</div>

    <script>
        // Init logic
        (async () => {
            await myMSALObj.initialize(); // Required for MSAL v2
            const user = await handleRedirect();
            
            if (!user) {
                // Not signed in, force redirect
                signIn();
            } else {
                // Signed in, show content
                document.getElementById("loading").style.display = "none";
                document.getElementById("content").style.display = "block";
                document.getElementById("username").innerText = user.name;
            }
        })();

        // Example of leveraging the token for an API call
        async function callMyApi() {
            const token = await getToken();
            const response = await fetch('https://my-external-func.azurewebsites.net/api/DoWork', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.text();
            alert("API Response: " + data);
        }
    </script>
</body>
</html>
```

---

## Phase 3: Securing External Functions (Future Reference)

To make your standalone Azure Functions accept this token:

1. Navigate to the **Function App** in the Azure Portal.
2. Select **Settings** > **Authentication**.
3. Click **Add identity provider**.
4. Select **Microsoft**.
5. **App registration type:** Pick "Provide the details of an existing app registration".
6. **Application (client) ID:** Paste the ID from **Phase 1, Step 2**.
7. **Issuer URL:** `https://login.microsoftonline.com/common/v2.0` (Use `common` if you selected "Any Entra ID + Personal", otherwise use your Tenant ID).
8. **Allowed token audiences:** Add the Application ID URI (usually `api://<client-id>`).
9. Click **Add**.

Now, requests to this Function App will be rejected **unless** they include the valid Bearer token from `finnminn.com`.
