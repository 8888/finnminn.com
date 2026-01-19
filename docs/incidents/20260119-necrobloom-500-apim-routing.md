# Incident Report: NecroBloom Production 500 on Plant Details and Deletion

**Date:** 2026-01-19
**Status:** Resolved
**Service:** NecroBloom API
**Severity:** High (Broken core functionality in production)

## Issue Description
Following the resolution of a `404 Not Found` issue by manually adding operations to API Management (APIM), users encountered `500 Internal Server Error` when accessing individual plant details or performing deletions.

## Identification & Root Cause Analysis
1.  **Symptom:** Requests to `GET /api/plants/{id}` and `DELETE /api/plants/{id}` returned a 500 error. 
2.  **Investigation:** Observed that the requests were reaching APIM but not the Function App backend (no logs in App Insights).
3.  **Root Cause:** The manually added operations were missing the `set-backend-service` policy. In Azure APIM, manually created operations do not automatically inherit the backend mapping if it's explicitly set at the operation level in other endpoints. Without this policy, APIM failed to route the requests to the `necrobloom-api` backend.

## Fix Applied
Applied the `set-backend-service` policy to the affected operations to explicitly route traffic to the backend.

```xml
<policies>
    <inbound>
        <base />
        <set-backend-service id="apim-generated-policy" backend-id="necrobloom-api" />
    </inbound>
</policies>
```

Affected Operations:
- `get-getplant` (GET `/plants/{id}`)
- `delete-deleteplant` (DELETE `/plants/{id}`)
- `post-healthcheck` (POST `/plants/{id}/health-check`)

## Prevention & Lessons Learned
- **Manual APIM Management:** When creating operations manually in APIM, always verify that the routing policies (like `set-backend-service`) are correctly configured.
- **Backend Verification:** A 500 error from a gateway that is not reflected in backend logs usually indicates a routing or policy failure within the gateway itself.
