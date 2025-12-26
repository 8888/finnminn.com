# Architecture Overview: Private Authenticated Zone

## 1. Introduction
This document outlines the architecture for adding a private, authenticated section to the `finnminn.com` website. The primary goal is to host content that is only accessible to users after they have successfully logged in, leveraging native Azure services for identity management and application hosting.

## 2. Guiding Principles
- **Leverage Managed Services:** Prioritize the use of Azure's managed Platform-as-a-Service (PaaS) offerings to reduce operational overhead.
- **Configuration over Code:** Utilize built-in platform features for common tasks like authentication to minimize custom development.
- **Seamless Integration:** Ensure the new private section works harmoniously with the existing public-facing static site and infrastructure.

## 3. Architecture and Data Flow
The solution integrates a new Azure App Service and Azure AD B2C tenant into the existing Azure Front Door setup.

The user flow is as follows:

1.  **Request Initiation:** A user navigates to `https://finnminn.com/app`.
2.  **Routing:** Azure Front Door receives the request. Its ruleset identifies the `/app` path and routes the request to the origin configured for the **Azure App Service**. Requests to the root or other paths are routed to the existing **Azure Storage Account** hosting the public site.
3.  **Authentication Challenge:** The Azure App Service has its "Easy Auth" feature enabled and configured to use the **Azure AD B2C** tenant. Upon receiving the unauthenticated request, App Service issues an HTTP 302 redirect to the user's browser, sending them to the Azure AD B2C sign-in page.
4.  **User Authentication:** The user interacts with the Azure AD B2C page to sign up or sign in. Upon successful authentication, B2C generates a JSON Web Token (JWT) and redirects the user back to the Azure App Service, including the token.
5.  **Session & Access:** The App Service middleware validates the token from B2C, creates an authenticated session, and grants access. It then serves the requested private content (e.g., a static `index.html` page).
6.  **Subsequent Requests:** For subsequent requests to `/app/*`, the user's browser includes the session cookie, which the App Service validates to grant continued access without requiring a re-login.

This flow ensures a complete separation between public and private content while providing a robust and secure authentication experience managed entirely by Azure.
