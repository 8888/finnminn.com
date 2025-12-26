# Component Deep Dive

## 1. Azure App Service
- **SKU:** App Service Plan (e.g., Basic B1, Standard S1). A production workload should use at least a Basic tier.
- **Role:** Hosts the private web content. Although the initial content is a static HTML page, using App Service provides the flexibility to host dynamic applications in the future without re-architecting.
- **Key Configuration:**
    - **Authentication / Authorization ("Easy Auth"):** This is the cornerstone of the design. It will be configured to use Azure Active Directory B2C as the identity provider.
        - **Action to take when request is not authenticated:** "Log in with Azure Active Directory B2C".
    - **Managed Identity:** A system-assigned managed identity can be enabled for secure access to other Azure resources if needed in the future.
    - **Custom Domain:** The App Service will not have a custom domain directly assigned. It will be accessed via the Azure Front Door origin configuration.

## 2. Azure Active Directory (AD) B2C
- **Role:** Provides a fully managed "Identity-as-a-Service" solution. It is responsible for all aspects of the user lifecycle for this application.
- **Key Configuration:**
    - **Tenant:** A new Azure AD B2C tenant will be created, separate from any existing Azure AD directories used for corporate identities.
    - **Identity Providers:** Initially configured for "Local Accounts," allowing users to sign up with an email address and password. Social providers (Google, Facebook, etc.) can be added later with minimal effort.
    - **User Flows / Custom Policies:**
        - **Sign-up and Sign-in:** A combined user flow will be created to handle both new user registration and existing user login.
        - **Profile Editing:** A flow for users to manage their own profile information.
        - **Password Reset:** A self-service password reset flow.
    - **App Registration:** The Azure App Service will be registered as an application within the B2C tenant. This registration defines the trust relationship, allowing the App Service to delegate authentication to B2C.

## 3. Azure Front Door (Update)
- **Role:** Continues to act as the global entry point, CDN, and SSL offloader for `finnminn.com`.
- **Key Configuration Changes:**
    - **Backend Pool / Origin Group:** A new origin will be added pointing to the Azure App Service.
    - **Routing Rule:** A new rule will be created with a higher priority:
        - **Pattern to Match:** `/app`, `/app/*`
        - **Action:** Route to the new App Service origin.
    - The existing default routing rule (`/*`) will continue to forward all other traffic to the public static website in Azure Storage.
