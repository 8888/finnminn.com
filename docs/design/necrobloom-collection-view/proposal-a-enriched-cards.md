# Proposal A: Enriched Cards

## Problem Solved

Addresses root causes **#1, #3, and #5** directly:

| Root Cause                                            | Current State          | After Proposal A                           |
| ----------------------------------------------------- | ---------------------- | ------------------------------------------ |
| #1 Health status truncated to 15 chars                | `"Plant appears h..."` | Full first sentence of AI diagnosis        |
| #3 Data hidden (`carePlan`, `environment`, last date) | Not shown              | Care chips + last-check date on every card |
| #5 Useless ID fragment                                | `ID: a3f9c2b1`         | Removed; replaced with care metadata       |

Root causes #2 (no priority signals) and #4 (no collection summary) are **not addressed** — see Proposals B and C for those.

---

## User Workflow

1. User opens `/` dashboard — collection loads as 3-column card grid (layout unchanged).
2. Each card now shows a **health Badge** derived from keyword matching on `healthStatus`:
   - Contains `"critical"` / `"dying"` / `"severe"` → `Badge variant="error"` → `CRITICAL`
   - Contains `"warning"` / `"yellow"` / `"wilting"` → `Badge variant="warning"` → `WARNING`
   - Contains `"healthy"` / `"thriving"` / `"good"` → `Badge variant="success"` → `HEALTHY`
   - No report or unmatched → `Badge variant="default"` → `UNKNOWN`
3. Below the species name, the **first sentence** of `healthStatus` from the most recent report is shown (no truncation, wraps naturally within the card width).
4. A row of **care chips** shows: watering interval (`WATER/7D`), light needs (`INDIRECT`), toxicity level (`NON-TOXIC` or `TOXIC`). Chips are rendered as `Badge variant="info"` or `variant="error"` for toxic.
5. Bottom of card shows **"X DAYS AGO"** — days elapsed since `historicalReports.at(-1).date`.
6. User clicks any card → navigates to `/plant/:id` (unchanged behavior).

---

## User Value

- **Immediate triage without clicking**: health status visible at a glance via color-coded Badge.
- **Context without navigation**: care schedule and last-check age on the card eliminates the need to open the detail view just to answer "when did I last check this?"
- **Zero layout disruption**: existing 3-column grid is preserved; no new navigation patterns to learn.
- **Measurable**: reduces clicks-to-information from 2 (open card, read detail) to 0 (visible on collection view).

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  COLLECTION FROM THE VOID                                          [+ RESURRECT]     │
│  12 specimens currently under observation.                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ ┌─────────────────┐ │  │ ┌─────────────────┐ │  │ ┌─────────────────┐ │
│ │                 │ │  │ │                 │ │  │ │   [NO VISUAL    │ │
│ │   [plant img]   │ │  │ │   [plant img]   │ │  │ │     DATA ]      │ │
│ │                 │ │  │ │                 │ │  │ │                 │ │
│ └─────────────────┘ │  │ └─────────────────┘ │  │ └─────────────────┘ │
│                     │  │                     │  │                     │
│ CURSED MONSTERA     │  │ PHANTOM POTHOS      │  │ WAILING FIG         │
│ Monstera deliciosa  │  │ Epipremnum aureum   │  │ Ficus lyrata        │
│                     │  │                     │  │                     │
│ ┌──────────┐        │  │ ┌──────────┐        │  │ ┌──────────┐        │
│ │ HEALTHY  │        │  │ │ WARNING  │        │  │ │ CRITICAL │        │
│ └──────────┘        │  │ └──────────┘        │  │ └──────────┘        │
│ (ectoplasm/success) │  │ (gold/warning)      │  │ (vampire/error)     │
│                     │  │                     │  │                     │
│ "Plant exhibits     │  │ "Yellowing on       │  │ "Severe leaf drop   │
│  vigorous growth    │  │  lower leaves       │  │  detected; possible │
│  with deep green    │  │  suggests possible  │  │  root rot from      │
│  foliage."          │  │  overwatering."     │  │  overwatering."     │
│                     │  │                     │  │                     │
│ ┌────────┐┌───────┐ │  │ ┌────────┐┌───────┐ │  │ ┌────────┐┌───────┐ │
│ │WATER/7D││INDIRECT│ │  │ │WATER/5D││BRIGHT │ │  │ │WATER/3D││BRIGHT │ │
│ └────────┘└───────┘ │  │ └────────┘└───────┘ │  │ └────────┘└───────┘ │
│ ┌──────────┐        │  │ ┌──────────┐        │  │ ┌─────────┐         │
│ │ NON-TOXIC│        │  │ │ NON-TOXIC│        │  │ │  TOXIC  │         │
│ └──────────┘        │  │ └──────────┘        │  │ └─────────┘         │
│ (info badge)        │  │ (info badge)        │  │ (error badge)       │
│                     │  │                     │  │                     │
│ CHECKED: 3 DAYS AGO │  │ CHECKED: 12 DAYS AGO│  │ CHECKED: 1 DAY AGO  │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**Badge color mapping:**

```
HEALTHY  → Badge variant="success"  → bg-ectoplasm text-void
WARNING  → Badge variant="warning"  → bg-gold text-void
CRITICAL → Badge variant="error"    → bg-vampire text-void
UNKNOWN  → Badge variant="default"  → bg-surface text-text-body
NON-TOXIC → Badge variant="info"    → bg-witchcraft text-void
TOXIC     → Badge variant="error"   → bg-vampire text-void
WATER/7D  → Badge variant="info"    → bg-witchcraft text-void
INDIRECT  → Badge variant="info"    → bg-witchcraft text-void
```

---

## Component Implementation Notes

### Type Extension Required

`Dashboard.tsx` `Plant` interface must be extended before implementation:

```typescript
interface Plant {
  id: string;
  alias: string;
  species: string;
  historicalReports: Array<{
    date: string;
    healthStatus: string;
    imageUrl: string;
  }>;
  carePlan?: {
    waterFrequency: string; // e.g. "Water every 7 days"
    lightNeeds: string; // e.g. "Indirect bright light"
    toxicity: string; // e.g. "Non-toxic to pets"
    additionalNotes: string;
  };
  environment: {
    zip: string;
    lighting: string;
  };
}
```

### Health Badge Logic

```typescript
function deriveHealthBadge(healthStatus: string): {
  variant: BadgeProps["variant"];
  label: string;
} {
  const s = healthStatus.toLowerCase();
  if (/critical|dying|severe|rot|collapse/.test(s))
    return { variant: "error", label: "CRITICAL" };
  if (/warning|yellowing|wilting|droop|pale/.test(s))
    return { variant: "warning", label: "WARNING" };
  if (/healthy|thriving|vigorous|good|lush/.test(s))
    return { variant: "success", label: "HEALTHY" };
  return { variant: "default", label: "UNKNOWN" };
}
```

### First Sentence Extraction

```typescript
function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text.slice(0, 120);
}
```

### Care Chips

Each chip is a `<Badge variant="info">` except toxicity:

- Parse `waterFrequency`: extract number from "Water every 7 days" → `WATER/7D`
- Parse `lightNeeds`: extract first word cluster → `INDIRECT` / `BRIGHT` / `LOW`
- Parse `toxicity`: if contains "non-toxic" → `Badge variant="info"` / else → `Badge variant="error"`

### Days Ago

```typescript
function daysAgo(dateStr: string): string {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86_400_000,
  );
  if (days === 0) return "CHECKED: TODAY";
  if (days === 1) return "CHECKED: 1 DAY AGO";
  return `CHECKED: ${days} DAYS AGO`;
}
```

Rendered as `<Typography.Body variant="muted" size="xs">` at card bottom.

### Removed Elements

- `plant.id.toString().substring(0, 8)` — removed entirely.
- `VITALITY: ...` raw string — replaced by Badge + first sentence.

---

## Known Limitations

1. **Keyword matching is fragile**: AI-generated `healthStatus` text varies; regex patterns will miss edge cases. A structured health score field from the backend would be more reliable.
2. **No priority ordering**: cards remain in API-response order (likely creation order). A `CRITICAL` plant added early may be buried at the bottom.
3. **Care chip parsing is lossy**: `"Water every 7-10 days"` → ambiguous. The parser needs a fallback display format.
4. **`carePlan` is optional**: ~20% of plants (those not yet analyzed) will show no care chips. The empty state needs a `[ NO CARE PLAN ]` indicator.
5. **No indication of stale data**: `CHECKED: 47 DAYS AGO` and `CHECKED: 3 DAYS AGO` look the same — no urgency signal on the "last checked" date.

---

## When to Choose This Option

Choose Proposal A when:

- The goal is **minimum engineering effort** for **maximum immediate signal improvement**.
- The team wants a low-risk change that doesn't restructure the page.
- This is the first iteration — Proposal A is the foundation all other proposals build on.
- The user base is small (< 10 plants per user) and priority ordering isn't critical yet.
- A/B testing is not planned; this is a straightforward enhancement.

Do not choose if:

- Users have 15+ plants and need structural triage (→ Proposal C).
- A "what needs attention today" answer is the primary use case (→ Proposal E).
