# Project: finnminn.com

## Overview
This project contains the infrastructure as code (IaC) to deploy and host the static website `finnminn.com` on Microsoft Azure.

The infrastructure is managed using **Terraform**.

### Architecture
- **Azure Resource Group:** A container for all related Azure resources.
- **Azure Storage Account:** A standard LRS storage account is configured to host the static website content (HTML, CSS, JS, images).
- **Azure Front Door:** A Standard tier Front Door profile is set up to provide:
    - A global entry point for the website.
    - A custom domain (`finnminn.com`).
    - Free, managed TLS/SSL certificate for HTTPS.
    - Caching and routing rules.
- **Azure DNS (Optional):** The Terraform code includes configuration to manage DNS records if the domain's DNS zone is hosted in Azure.

## Building and Running

### Prerequisites
- [Terraform CLI](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) and authenticated (`az login`)

### Deployment Commands

All commands should be run from the `app/` directory.

1.  **Initialize Terraform:**
    Downloads the necessary providers.
    ```bash
    terraform init
    ```

2.  **Plan Changes:**
    Previews the infrastructure changes that will be made.
    ```bash
    terraform plan
    ```

3.  **Apply Changes:**
    Creates or updates the Azure resources. This will require manual intervention on the first run to validate domain ownership.
    ```bash
    terraform apply
    ```

### Custom Domain Validation
As documented in `app/README.md`, the first time you run `terraform apply`, it will fail at the custom domain creation step. You must:
1.  Go to the Azure Portal and find the `_dnsauth` TXT record value for the pending domain.
2.  Add this TXT record to your DNS provider.
3.  Re-run `terraform apply`.

## Key Files
- `index.html`: The main landing page for the website.
- `finn.jpg`: An image asset used by the website.
- `app/main.tf`: Defines the core Azure resources (Resource Group, Storage Account).
- `app/frontdoor.tf`: Defines the Azure Front Door profile, endpoint, and custom domain.
- `app/dns.tf`: Defines the DNS records for the custom domain.
- `app/variables.tf`: Contains the input variables for the Terraform configuration, such as resource names and location.
- `app/outputs.tf`: Declares the output values from the Terraform deployment, such as the website URL and Front Door endpoint.
- `app/README.md`: Detailed instructions for deploying the infrastructure.

## Folder Structure
```
/Users/leecostello/Documents/code/lee/finnminn.com/
├───.DS_Store
├───GEMINI.md
├───.git/...
├───.github/
│   └───workflows/
│       └───azure-static-web-apps-white-water-0a6c7270f.yml
├───app/
│   ├───finn.jpg
│   └───index.html
├───docs/
│   └───architecture/
│       ├───20251225-private-section/
│       │   ├───01_ARCHITECTURE_OVERVIEW.md
│       │   ├───02_COMPONENTS.md
│       │   └───03_DIAGRAM.md
│       └───20251227-user-authentication/
│           ├───01_ARCHITECTURE_OVERVIEW.md
│           └───02_COMPONENTS.md
└───infra/
    ├───.gitignore
    ├───.terraform.lock.hcl
    ├───dns.tf
    ├───frontdoor.tf
    ├───main.tf
    ├───outputs.tf
    ├───README.md
    ├───variables.tf
    └───versions.tf
```