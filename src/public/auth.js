// src/public/auth.js

const msalConfig = {
    auth: {
        clientId: "5e24adce-63ed-4c99-86d3-d8b4d1dfb211",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: window.location.origin + "/app", 
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    }
};

const myMSALObj = new msal.PublicClientApplication(msalConfig);

async function signIn() {
    try {
        await myMSALObj.loginRedirect({ 
            scopes: ["User.Read"] 
        });
    } catch (error) {
        console.error("Login Error:", error);
    }
}

async function handleRedirect() {
    try {
        const response = await myMSALObj.handleRedirectPromise();
        if (response) {
            console.log("Logged in successfully");
            return response.account;
        } else {
            const currentAccounts = myMSALObj.getAllAccounts();
            if (currentAccounts.length === 0) {
                return null;
            }
            return currentAccounts[0];
        }
    } catch (error) {
        console.error("Redirect Error:", error);
        return null;
    }
}

async function getToken() {
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
        console.error("Token Acquisition Error:", error);
    }
}

function signOut() {
    const currentAccount = myMSALObj.getAllAccounts()[0];
    if (!currentAccount) {
        // Already signed out or no session
        window.location.href = "/";
        return;
    }
    const logoutRequest = {
        account: myMSALObj.getAccountByHomeId(currentAccount.homeAccountId),
        postLogoutRedirectUri: window.location.origin,
    };
    myMSALObj.logoutRedirect(logoutRequest);
}
