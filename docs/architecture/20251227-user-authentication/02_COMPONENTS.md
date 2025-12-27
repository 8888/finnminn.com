# Component Deep Dive

This document provides details on the primary component of the authentication architecture.

## 1. Azure Static Web App

*   **Category:** App Platform / PaaS
*   **Official Documentation:** [https://docs.microsoft.com/en-us/azure/static-web-apps/](https://docs.microsoft.com/en-us/azure/static-web-apps/)

### Role in the System

The Azure Static Web App is the central component of this architecture. It will host the **entire** website and is responsible for:
1.  **Unified Hosting:** Storing and serving all website files, both the existing **public content** (e.g., `index.html`) and the new **private content**.
2.  **Global Distribution:** Caching and delivering all content from points-of-presence around the world for fast load times.
3.  **Authentication:** Managing the entire user login and session lifecycle for the private sections.
4.  **Authorization:** Enforcing access control rules defined in `staticwebapp.config.json` to protect specific routes.

### Configuration Details

#### a. Authentication Providers

The service will be configured to allow two authentication methods:

1.  **Built-in Invitations:** This provider handles username/password authentication. An administrator will use the Azure Portal to invite users by email. Each invited user receives a link to set their password and log in. This fulfills the "no public sign-up" requirement.
2.  **Google:** This provider will be enabled by creating an OAuth 2.0 application in the Google Cloud console and adding the Client ID and Client Secret to the Static Web App configuration in the Azure Portal. This allows users to log in with their existing Google accounts.

#### b. Routing and Authorization (`staticwebapp.config.json`)

To protect content, we will add a `staticwebapp.config.json` file to the root of our application code. This file will define which routes are public and which require authentication.

**Example `staticwebapp.config.json`:**

```json
{
  "routes": [
    {
      "route": "/login",
      "redirect": "/.auth/login/github"
    },
    {
      "route": "/private/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/google",
      "statusCode": 302
    }
  }
}
```

**Explanation:**

*   **`routes` array:**
    *   The first rule is an optional convenience rule to create a friendly login URL.
    *   The second rule is the core of our security. It matches any URL starting with `/private/` (e.g., `/private/page1.html`, `/private/secrets/data.html`).
    *   `"allowedRoles": ["authenticated"]`: This is the enforcement action. It specifies that a user must be logged in (belong to the built-in `authenticated` role) to access any route matching the pattern. If they are not logged in, the service automatically initiates the authentication flow.
*   **`responseOverrides`:**
    *   This section customizes system responses. Here, if a user is unauthorized (401 error), we automatically redirect them to the Google login page instead of the default page that shows all provider options. This provides a slightly smoother user experience if Google is the preferred login method.
*   **`navigationFallback`:**
    *   This is useful for single-page applications (SPAs), ensuring that client-side routes are correctly served the main `index.html` file.

### User Information

After a user logs in, the Static Web App service makes the user's data available via a special endpoint: `/.auth/me`. A simple client-side JavaScript `fetch` call to this endpoint will return a JSON object containing the user's name and email, which can be used to personalize the user experience (e.g., "Welcome, Finn!").
