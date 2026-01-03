# Project: finnminn.com

## Overview
This project contains the source code and configuration for the static website `finnminn.com`, hosted on **Azure Static Web Apps**.

### Architecture
- **Azure Resource Group:** `Finnminn-rg`
- **Azure Static Web Apps:** A Free tier Static Web App named `Finnminn` hosts the website content.
    - Provides global hosting, CI/CD integration, and free SSL.
- **Azure DNS:** A DNS zone `Finnminn.com` manages the domain records.

## Deployment
Deployment is automated using GitHub Actions.
- **Workflow File:** `.github/workflows/azure-static-web-apps-mango-pebble-0e55b260f.yml`
- **Trigger:** Pushes to the repository trigger a build and deploy to the Static Web App.

### Manual Resources
The Azure resources were created manually in the Azure Portal.
- Resource Group: `Finnminn-rg`
- Static Web App: `Finnminn`
- DNS Zone: `Finnminn.com`

## Key Files
- `src/public/index.html`: The main landing page.
- `src/public/finn.jpg`: Image asset.
- `.github/workflows/...`: CI/CD pipeline definition.

## Folder Structure
```
/Users/leecostello/Documents/code/lee/finnminn.com/
├───.DS_Store
├───GEMINI.md
├───.git/...
├───.github/
│   └───workflows/
│       └───azure-static-web-apps-mango-pebble-0e55b260f.yml
├───docs/
│   └───architecture/
│       ├───20251225-private-section/
│       │   ├───01_ARCHITECTURE_OVERVIEW.md
│       │   ├───02_COMPONENTS.md
│       │   └───03_DIAGRAM.md
│       └───20251227-user-authentication/
│           ├───01_ARCHITECTURE_OVERVIEW.md
│           └───02_COMPONENTS.md
└───src/
    └───public/
        ├───finn.jpg
        └───index.html
```
