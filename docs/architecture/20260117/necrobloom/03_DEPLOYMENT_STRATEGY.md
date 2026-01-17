# NecroBloom Deployment Strategy

This application is deployed manually via the Azure Portal to maintain the simplest possible setup for a hobby project.

## Step 1: Resource Group
- Create a new Resource Group: `necrobloom-rg`.
- Region: `eastus` (or same as your existing Pip resources for proximity).

## Step 2: Storage Account
1. Create a Storage Account: `necrobloomstorage`.
2. Performance: `Standard`, Replication: `LRS`.
3. Create a container named `vessel-images`.
4. Set "Allow Blob public access" to `Disabled`.

## Step 3: Cosmos DB
1. Create an Azure Cosmos DB for NoSQL account.
2. Capacity Mode: **Serverless**.
3. Create Database: `NecroBloomDB`.
4. Create Container: `Plants` with Partition Key `/userId`.

## Step 4: Function App
1. Create a Function App (Linux).
2. Runtime Stack: `Java 21`.
3. Plan: `Consumption (Serverless)`.
4. **Application Settings**:
    - `GEMINI_API_KEY`: [Your Key]
    - `COSMOS_CONNECTION_STRING`: [From Cosmos DB Keys]
    - `BLOB_CONNECTION_STRING`: [From Storage Access Keys]
5. Enable **System Assigned Managed Identity** under Identity settings.

## Step 5: Static Web App
1. Create a Static Web App: `necrobloom-web`.
2. Plan Type: `Free`.
3. Deployment Source: `GitHub`.
4. Build Details:
    - App location: `apps/necrobloom`
    - API location: `apps/necrobloom/api`
    - Output location: `dist`

## Step 6: Authentication
1. In the Azure Portal, go to **Microsoft Entra ID** > **App registrations**.
2. Add the `necrobloom.finnminn.com` URL to the redirect URIs of the existing Finnminn SPA registration.
