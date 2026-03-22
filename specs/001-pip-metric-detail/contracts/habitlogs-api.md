# API Contract: HabitLogs Endpoint

**Branch**: `001-pip-metric-detail` | **Date**: 2026-03-21
**Change type**: Additive extension (non-breaking)

## Existing Endpoint (unchanged behaviour)

### `GET /habitlogs`

Fetches habit log entries for the authenticated user.

**Authentication**: Bearer token (`Authorization: Bearer <id_token>`)
**User resolution**: `x-ms-client-principal` header (injected by APIM in production; mocked by Vite proxy in dev)

#### Existing query parameters

| Parameter   | Type   | Required | Description                            |
| ----------- | ------ | -------- | -------------------------------------- |
| `startDate` | string | Yes\*    | `YYYY-MM-DD` — range start (inclusive) |
| `endDate`   | string | Yes\*    | `YYYY-MM-DD` — range end (inclusive)   |

\*Required when `ritualId` is **not** provided (see below).

#### Response

```json
[
  {
    "id": "string",
    "userId": "string",
    "type": "habitLog",
    "ritualId": "string",
    "date": "YYYY-MM-DD",
    "completed": true,
    "timestamp": "ISO 8601"
  }
]
```

**Status codes**: `200 OK`, `401 Unauthorized`

---

## New Parameter (this feature)

### `ritualId` query parameter

When `ritualId` is provided, the endpoint returns **all** habit logs for that specific ritual across **all dates** (no date range required).

| Parameter  | Type   | Required | Description                                               |
| ---------- | ------ | -------- | --------------------------------------------------------- |
| `ritualId` | string | No       | When present, returns all logs for this ritual (all time) |

**Mutual exclusivity**: When `ritualId` is provided, `startDate` and `endDate` are ignored. When `ritualId` is absent, `startDate` and `endDate` are required (existing behaviour preserved).

#### Example request

```
GET /habitlogs?ritualId=abc-123
Authorization: Bearer <token>
```

#### Example response

```json
[
  {
    "id": "log-uuid-1",
    "userId": "user-uuid",
    "type": "habitLog",
    "ritualId": "abc-123",
    "date": "2026-03-21",
    "completed": true,
    "timestamp": "2026-03-21T08:30:00.000Z"
  },
  {
    "id": "log-uuid-2",
    "userId": "user-uuid",
    "type": "habitLog",
    "ritualId": "abc-123",
    "date": "2026-03-20",
    "completed": true,
    "timestamp": "2026-03-20T09:15:00.000Z"
  }
]
```

**Ordering**: Returned unordered from Cosmos DB; client sorts by `timestamp` descending for display.

**Empty result**: Returns `[]` (not 404) when no logs exist for the ritual.

**Status codes**: `200 OK`, `401 Unauthorized`, `400 Bad Request` (if neither `ritualId` nor `startDate`+`endDate` provided)

---

## Frontend Hook Contract

### `useRitualDetail(ritualId: string)`

New hook at `apps/pip/src/hooks/useRitualDetail.ts`.

```typescript
interface UseRitualDetailResult {
  logs: HabitLog[]; // All HabitLogs for this ritual (all time)
  isLoading: boolean;
  error: string | null;
}

function useRitualDetail(ritualId: string): UseRitualDetailResult;
```

**Behaviour**:

- Fetches `GET /habitlogs?ritualId={ritualId}` on mount and when `ritualId` changes.
- Returns raw `HabitLog[]`; graph and log components derive their display types client-side.
- Does not re-fetch on time range changes (time range filtering is client-side).
