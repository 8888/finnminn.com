# Incident Report: NecroBloom Production 404 on Plant Details and Deletion

**Date:** 2026-01-19
**Status:** Resolved
**Service:** NecroBloom API
**Severity:** High (Broken core functionality in production)

## Issue Description
Users encountered `404 Resource Not Found` errors when attempting to view a specific plant's details or delete a plant in the production environment (`necrobloom.finnminn.com`). However, the "Collection" view (listing all plants) and the same individual plant routes worked correctly in the local development environment (`localhost:7071`).

## Identification & Root Cause Analysis
The issue was identified through the following steps:

1.  **Local vs. Production Verification:** Confirmed that the API route `GET /api/plants/{id}` was fully functional on the local machine but failed on the production domain.
2.  **Log Analysis:** Queried Azure Application Insights (`AppRequests` and `AppTraces`).
    - Observed that `GetPlants` (GET `/api/plants`) requests were successfully reaching the Function App and returning `200 OK`.
    - Observed that `GetPlant` (GET `/api/plants/{id}`) and `DeletePlant` (DELETE `/api/plants/{id}`) requests were **completely absent** from the backend logs.
3.  **Infrastructure Audit:** Inspected the infrastructure chain: `Frontend (SWA)` -> `API Management (Gateway)` -> `Function App (Backend)`.
4.  **APIM Inspection:** Listed the operations defined in the `necrobloom-gateway` API Management service.
    - **Root Cause:** The APIM gateway was missing the specific operation definitions for `/plants/{id}`. 
    - Because the gateway didn't recognize the route pattern with the `{id}` parameter, it rejected the requests with a 404 before they could be forwarded to the Function App backend.

## Fix Applied
The missing operations were manually added to the API Management gateway to mirror the routes defined in the backend code.

### 1. Added GetPlant Operation
Created the GET operation for individual plant retrieval:
```bash
az apim api operation create \
  --resource-group necrobloom-rg \
  --service-name necrobloom-gateway \
  --api-id necrobloom-api \
  --url-template "/plants/{id}" \
  --method "GET" \
  --display-name "GetPlant" \
  --operation-id get-getplant \
  --template-parameters name=id type=string required="true"
```

### 2. Added DeletePlant Operation
Created the DELETE operation for plant banishment:
```bash
az apim api operation create \
  --resource-group necrobloom-rg \
  --service-name necrobloom-gateway \
  --api-id necrobloom-api \
  --url-template "/plants/{id}" \
  --method "DELETE" \
  --display-name "DeletePlant" \
  --operation-id delete-deleteplant \
  --template-parameters name=id type=string required="true"
```

## Prevention & Lessons Learned
- **APIM Sync:** When adding new routes to the Azure Functions backend, the API Management gateway must be updated to include these new operations. 
- **Tooling:** Future deployments should consider automating the APIM import process from the Function App's OpenAPI/Swagger definition to ensure the gateway and backend remain in sync.
- **Monitoring:** The absence of logs in the backend for a known client request is a key indicator that the request is being dropped at the gateway layer.
