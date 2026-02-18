import React, { useCallback } from "react";
import { PublicClientApplication, EventType, EventMessage } from "@azure/msal-browser";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";

export const msalConfig = {
    auth: {
        clientId: "5e24adce-63ed-4c99-86d3-d8b4d1dfb211",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "http://localhost:3000",
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    }
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Helper to check if we are in a PWA/Standalone environment
const isStandalone = () => {
    return (typeof window !== "undefined" && 
           (window.matchMedia('(display-mode: standalone)').matches || 
            (window.navigator as any).standalone || 
            document.referrer.includes('android-app://')));
};

if (typeof window !== "undefined") {
    msalInstance.initialize().then(() => {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0]);
        } else {
            // Attempt SSO Silent if no accounts are found in local cache
            // This leverages the session cookie from other subdomains
            msalInstance.ssoSilent({
                scopes: ["openid", "profile", "User.Read"]
            }).then((response) => {
                if (response.account) {
                    msalInstance.setActiveAccount(response.account);
                }
            }).catch((error) => {
                // Silently fail if no session exists - this is normal for first-time users
                console.log("SSO Silent failed or no session found:", error.errorCode);
            });
        }
        
        msalInstance.addEventCallback((event: EventMessage) => {
            if (event.eventType === EventType.LOGIN_SUCCESS && event.payload && (event.payload as any).account) {
                const account = (event.payload as any).account;
                msalInstance.setActiveAccount(account);
            }
        });
    });
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    );
};

export const useAuth = () => {
    const { instance, accounts, inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    const login = useCallback(() => {
        instance.loginRedirect({
            scopes: ["User.Read"],
            prompt: "select_account"
        });
    }, [instance]);

    const logout = useCallback(() => {
        instance.logoutRedirect({
            postLogoutRedirectUri: window.location.origin,
        });
    }, [instance]);

    const getToken = useCallback(async () => {
        const account = instance.getActiveAccount() || accounts[0];
        if (!account) throw new Error("NO_ACTIVE_ACCOUNT");

        try {
            const response = await instance.acquireTokenSilent({
                scopes: ["User.Read"],
                account: account
            });
            return response.accessToken;
        } catch (error) {
            // If in PWA standalone, popups usually fail or feel broken. Prefer Redirect.
            if (isStandalone()) {
                console.warn("Silent token acquisition failed in PWA, triggering redirect...");
                instance.acquireTokenRedirect({
                    scopes: ["User.Read"],
                    account: account
                });
                return null;
            }

            console.warn("Silent token acquisition failed, attempting popup...", error);
            try {
                const response = await instance.acquireTokenPopup({
                    scopes: ["User.Read"],
                    account: account
                });
                return response.accessToken;
            } catch (popupError) {
                console.error("Popup token acquisition failed:", popupError);
                throw popupError;
            }
        }
    }, [instance, accounts]);

    const getIdToken = useCallback(async () => {
        const account = instance.getActiveAccount() || accounts[0];
        if (!account) throw new Error("NO_ACTIVE_ACCOUNT");

        try {
            const response = await instance.acquireTokenSilent({
                scopes: ["openid", "profile"],
                account: account
            });
            return response.idToken;
        } catch (error) {
            if (isStandalone()) {
                console.warn("Silent ID token acquisition failed in PWA, triggering redirect...");
                instance.acquireTokenRedirect({
                    scopes: ["openid", "profile"],
                    account: account
                });
                return null;
            }

            console.warn("Silent ID token acquisition failed, attempting popup...", error);
            try {
                const response = await instance.acquireTokenPopup({
                    scopes: ["openid", "profile"],
                    account: account
                });
                return response.idToken;
            } catch (popupError) {
                console.error("Popup ID token acquisition failed:", popupError);
                throw popupError;
            }
        }
    }, [instance, accounts]);

    return {
        login,
        logout,
        getToken,
        getIdToken,
        isAuthenticated,
        inProgress,
        user: accounts[0] || null,
        instance
    };
};
