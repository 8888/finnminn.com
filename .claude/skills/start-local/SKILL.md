# Skill: start-local

Start the full Finnminn local development suite safely. Follow this checklist in order. **No step may be skipped.**

---

## Suite Map

| App          | Frontend port | Backend port | API health endpoint                 |
| ------------ | ------------- | ------------ | ----------------------------------- |
| `web`        | 5175          | —            | —                                   |
| `pip`        | 5173          | 7071         | `GET /api/hello` → "hello world"    |
| `necrobloom` | 5174          | 7072         | `GET /api/Ping` → "Vitality stable" |

Shared emulators: Cosmos DB on 8081, Azurite on 10000.

---

## Phase 0 — Credential Safety Check (BLOCKING)

Read both settings files and verify each `COSMOS_ENDPOINT` value is exactly `https://localhost:8081/`.
Also verify `STORAGE_CONNECTION_STRING` (if present) does **not** contain `core.windows.net`.

```bash
# Check pip
grep -E '"COSMOS_ENDPOINT"' apps/pip/api/local.settings.json

# Check necrobloom
grep -E '"COSMOS_ENDPOINT"|"STORAGE_CONNECTION_STRING"' apps/necrobloom/api/local.settings.json
```

**If any file contains a non-localhost endpoint: STOP IMMEDIATELY.**

- Do not start any services.
- Report which file(s) are misconfigured with the exact key and value found.
- Tell the user to reset the file from its example template:
  ```bash
  cp apps/pip/api/local.settings.example.json apps/pip/api/local.settings.json
  cp apps/necrobloom/api/local.settings.example.json apps/necrobloom/api/local.settings.json
  ```
- Do not proceed until the user confirms the files have been corrected.

---

## Phase 1 — Emulators

Start both emulators via Docker Compose:

```bash
npm run emulators:start
```

**Poll Cosmos DB** — `https://localhost:8081/_explorer/index.html`, max 60s, 5s intervals:

```bash
curl -sk -o /dev/null -w "%{http_code}" https://localhost:8081/_explorer/index.html
```

Wait for HTTP 200. If not ready after 60s: halt and instruct the user to check `docker ps` and Docker logs.

**Poll Azurite** — port 10000, max 30s:

```bash
nc -z localhost 10000
```

Wait for exit code 0.

---

## Phase 2 — Backends (start concurrently)

Before starting each backend, check for `GEMINI_API_KEY` in necrobloom:

```bash
grep '"GEMINI_API_KEY"' apps/necrobloom/api/local.settings.json
```

If the value is empty or `YOUR_GEMINI_API_KEY_HERE`: record a **non-blocking warning** — CreatePlant will fail at runtime, read-only flows work.

Start both backends as background processes (they can run concurrently):

```bash
# pip API — port 7071
cd apps/pip/api && nohup ./gradlew azureFunctionsRun > /tmp/finnminn-pip-backend.log 2>&1 &
cd ../../../

# necrobloom API — port 7072
cd apps/necrobloom/api && nohup ./gradlew azureFunctionsRun > /tmp/finnminn-necrobloom-backend.log 2>&1 &
cd ../../../
```

**Poll pip** — `GET http://localhost:7071/api/hello`, max 120s, 5s intervals.
Expected response body: `hello world` (case-insensitive). If not up after 120s:

```bash
tail -20 /tmp/finnminn-pip-backend.log
```

Halt and show the tail output.

**Poll necrobloom** — `GET http://localhost:7072/api/Ping`, max 120s, 5s intervals.
Expected response body contains: `Vitality stable`. If not up after 120s:

```bash
tail -20 /tmp/finnminn-necrobloom-backend.log
```

Halt and show the tail output.

---

## Phase 3 — Data Checks

**necrobloom:**

```bash
curl -s -H 'x-ms-client-principal: eyJ1c2VySWQiOiAibG9jYWwtZGV2LWFnZW50IiwgInVzZXJEZXRhaWxzIjogImFnZW50QGZpbm5taW5uLmxvY2FsIiwgInVzZXJSb2xlcyI6IFsiYXV0aGVudGljYXRlZCJdfQ==' \
  http://localhost:7072/api/Plants
```

If the response is an empty array `[]`:

- Check for a seed script: `ls scripts/seed-necrobloom.* 2>/dev/null`
- If found: run it
- If not found: record a **non-blocking warning** — data-dependent UI (stats panel, enriched cards) cannot be validated without plant data

**pip:**

The items endpoint is `GET /api/habitlogs` and requires `startDate` / `endDate` query params (ISO date, e.g. `2026-01-01`):

```bash
curl -s -H 'x-ms-client-principal: eyJ1c2VySWQiOiAibG9jYWwtZGV2LWFnZW50IiwgInVzZXJEZXRhaWxzIjogImFnZW50QGZpbm5taW5uLmxvY2FsIiwgInVzZXJSb2xlcyI6IFsiYXV0aGVudGljYXRlZCJdfQ==' \
  "http://localhost:7071/api/habitlogs?startDate=$(date -v-7d +%Y-%m-%d)&endDate=$(date +%Y-%m-%d)"
```

If the response is an empty array: record a **non-blocking warning** — habit log data is empty.

---

## Phase 4 — Frontends

Start all frontends via Turborepo (runs vite for all workspace apps concurrently):

```bash
nohup npm run dev > /tmp/finnminn-frontend.log 2>&1 &
```

**Poll each port** until accepting connections, max 45s:

```bash
nc -z localhost 5173  # pip
nc -z localhost 5174  # necrobloom
nc -z localhost 5175  # web
```

Also confirm Vite output in the log:

```bash
grep -E "Local:|VITE" /tmp/finnminn-frontend.log
```

If any port is not accepting after 45s: tail the frontend log and report.

---

## Phase 5 — Status Report

Print this table with actual status for each service:

```
Service               Status    URL
─────────────────────────────────────────────────────────────────
Cosmos DB emulator    ✅        https://localhost:8081
Azurite storage       ✅        http://localhost:10000
pip API               ✅        http://localhost:7071
necrobloom API        ✅        http://localhost:7072
web (finnminn.com)    ✅        http://localhost:5175
pip (pip.finnminn)    ✅        http://localhost:5173
necrobloom            ✅        http://localhost:5174
```

Use ❌ for any service that failed to start. List all non-blocking warnings below the table (missing `GEMINI_API_KEY`, empty DB collections, etc.).

---

## Cleanup

To stop all local services:

```bash
# Kill all frontend and backend processes
lsof -ti:5173,5174,5175,7071,7072,10000 | xargs kill -9

# Stop emulators
npm run emulators:stop
```
