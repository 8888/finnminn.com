# Authentication Guide: Debugging & Implementing Authenticated APIs

This guide details the "Opaque Token" issue encountered in January 2026, how it was diagnosed and corrected, and how to implement new authenticated APIs in the Finnminn monorepo correctly.

---

## 1. The Issue: The "Opaque Token" Trap

### Symptom
The NecroBloom frontend was logged in and could view protected client-side pages, but all calls to the Kotlin Azure Function backend returned `401 Unauthorized`.

### Root Cause
The frontend was calling `getToken()` from `@finnminn/auth`, which requested an **Access Token** using the `User.Read` scope.
*   **What we expected:** A standard 3-part JWT (Header.Payload.Signature) containing an `oid` (Object ID) claim.
*   **What we got:** An **Opaque Token** (starting with `EwA...`). Because the `User.Read` scope belongs to the Microsoft Graph API, Entra ID issued a token optimized for Graph, which does not follow the standard JWT format readable by custom backends.

The backend `SecurityUtils.kt` failed to split the token by dots (`.`), returned a `null` user ID, and triggered the 401 response.

---

## 2. The "403 Forbidden" Trap (EasyAuth Interception)

### Symptom
The frontend is sending a valid 3-part JWT (starts with `eyJ...`), but the browser console shows `403 Forbidden` for all API calls. The backend logs are completely empty, indicating the request never reached the Kotlin code.

### Root Cause
**Azure App Service Authentication (EasyAuth)** is active. Even if set to "Allow unauthenticated access," EasyAuth still attempts to validate any token present in the `Authorization` header. If the token's **Issuer (iss)** does not match the specific tenant configured in the portal (e.g., a multi-tenant user logging into a single-tenant app config), Azure returns a 403 immediately.

### The Correction: Disable EasyAuth
Since our backends (`CaptureFunction.kt`, etc.) use `SecurityUtils.kt` to perform internal JWT decoding and validation, EasyAuth is redundant and often counter-productive for multi-tenant or cross-service calls.

**Resolution:**
1.  Navigate to the Function App in the Azure Portal.
2.  Go to **Authentication**.
3.  Remove the Microsoft identity provider and **Remove authentication** entirely.
4.  Ensure your code uses `SecurityUtils.getUserId()` to enforce its own security boundary.

---

## 3. Diagnosis Workflow

When encountering 401 errors in a new app, follow these steps to identify if the token is the culprit:

### A. Inspect the Token
Use the **Cryptid Console** (`/console`) or Browser DevTools to grab the token and check its structure:
*   **Valid JWT:** Starts with `eyJ...` and contains two dots (`.`).
*   **Opaque Token:** Starts with `EwA...` (for MSAs) or other non-standard prefixes and often has no dots.

### B. Backend Debugging
We added debug hooks to the backend to expose the token's nature without logging the whole sensitive string:
1.  **Header Length:** Check if the `Authorization` header is even reaching the app.
2.  **Token Parts:** Count how many `.` segments exist.
3.  **Fragments:** Log the first 10 and last 10 characters to identify the token type (e.g., `EwA...`).

---

## 3. The Correction

### Frontend: ID Tokens vs. Access Tokens
We updated `@finnminn/auth` to provide `getIdToken()`.
*   **Access Tokens** are for specific APIs (like Graph).
*   **ID Tokens** are for proving user identity to *your* application. They are **always** standard JWTs.

**Correction in `packages/auth/src/index.tsx`:**
```typescript
const getIdToken = async () => {
    const response = await instance.acquireTokenSilent({
        scopes: ["openid", "profile"], // Standard OIDC scopes
        account: account
    });
    return response.idToken;
};
```

### Backend: Hardening
We improved `SecurityUtils.kt` to be more resilient:
1.  **Padding Recovery:** Manual addition of `=` characters to Base64 strings (Java's `Base64` decoder is stricter than some browser implementations).
2.  **Regex Splitting:** Used `Regex("\.")` for more robust segment extraction.

---

## 4. Implementing New Authenticated APIs

To ensure your new API works with the existing auth system, follow these patterns:

### Frontend Implementation
Always use `getIdToken()` when calling Finnminn backends.

```typescript
const { getIdToken } = useAuth();

const callApi = async () => {
  const token = await getIdToken();
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

### Backend Implementation (Kotlin)
Use the shared `SecurityUtils` logic to extract the `userId`.

```kotlin
val debug = StringBuilder()
val userId = SecurityUtils.getUserId(request.headers, debug)

if (userId == null) {
    return request.createResponseBuilder(HttpStatus.UNAUTHORIZED)
        .body("Unauthenticated. Details: $debug")
        .build()
}
```

### Entra ID Configuration
If you eventually need a "Real" Access Token (e.g., for cross-service API calls):
1.  Register an **App URI** in the Entra ID Portal (e.g., `api://necrobloom-api`).
2.  Define a **Scope** (e.g., `access_as_user`).
3.  In the frontend, request that specific scope instead of `User.Read`. Entra will then issue a standard JWT Access Token for that audience.

---

## 5. Single Sign-On (SSO) & PWA Strategy

### Cross-Subdomain SSO
Since each app (e.g., `pip.finnminn.com`) has its own `localStorage`, tokens are not shared across subdomains. To solve this, `@finnminn/auth` implements `ssoSilent` on initialization.
*   **How it works:** If no account is found locally, MSAL attempts to silently sign in using the session cookie from `login.microsoftonline.com`.
*   **Requirement:** All subdomains must be registered as Redirect URIs in the same Entra ID App Registration.

### PWA / Standalone Mode
PWAs in standalone mode often block popups or handle them poorly.
*   **Strategy:** `@finnminn/auth` detects `display-mode: standalone`.
*   **Behavior:** If a silent token acquisition fails, it defaults to `acquireTokenRedirect` instead of `acquireTokenPopup`.
*   **Code Impact:** `getIdToken()` may return `null` if a redirect is triggered. Your components should handle this gracefully.

---

## 6. Security Checklist
- [ ] Does the token start with `eyJ`? (Use `getIdToken()`, not `getToken()`).
- [ ] Does the token have 3 parts separated by `.`?
- [ ] Is **EasyAuth disabled** on the Function App? (Or configured with `/common/v2.0` issuer for multi-tenant).
- [ ] Is the backend using `Base64.getUrlDecoder()` for Bearer tokens?
- [ ] Is the `oid` (Object ID) used as the primary key? (Preferred over `sub`).
- [ ] Does APIM have the specific **Operation** (GET/POST) defined for the route? (Missing operations return 404).
