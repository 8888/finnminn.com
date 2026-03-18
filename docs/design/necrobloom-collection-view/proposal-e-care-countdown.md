# Proposal E: Care Countdown

## Problem Solved

Addresses root causes **#1, #2, #3, and #4** with a focus on **actionability over information density**:

| Root Cause                  | Current State          | After Proposal E                                          |
| --------------------------- | ---------------------- | --------------------------------------------------------- |
| #1 Health truncated         | `"Plant appears h..."` | First sentence on card (Proposal A base)                  |
| #2 No priority signals      | Every card identical   | Countdown chips encode urgency: `WATER NOW`, `OVERDUE 3D` |
| #3 Data hidden (`carePlan`) | Not shown              | `carePlan.waterFrequency` parsed and actively computed    |
| #4 No collection summary    | Nothing                | `NEEDS CARE TODAY: N SPECIMENS [ FILTER ]` banner         |
| #5 Useless ID fragment      | `ID: a3f9c2b1`         | Removed                                                   |

This is the only proposal that actively **computes what action is needed** rather than reporting past state.

---

## User Workflow

1. User opens `/` dashboard.
2. If any plants have overdue or due-today watering, a **banner** appears at the top (below the header, above the card grid):
   ```
   ░░ NEEDS CARE TODAY: 3 SPECIMENS  [ SHOW ONLY ] ░░
   ```
   Clicking `[ SHOW ONLY ]` filters the grid to only those plants.
3. Each card (Proposal A base layout) gains a **countdown chip** below the care chips row:
   - `WATER IN 5 DAYS` — safe, no color emphasis (Badge variant="default")
   - `WATER IN 2 DAYS` — approaching, show as warning (Badge variant="warning")
   - `WATER IN 1 DAY` — imminent (Badge variant="warning")
   - `WATER TODAY` — due now (Badge variant="error", pulsing border on card)
   - `OVERDUE 3 DAYS` — past due (Badge variant="error" + `glow-vampire` shadow on card)
   - `NO SCHEDULE` — `carePlan` absent or `waterFrequency` unparseable (Badge variant="default")
4. The `[ SHOW ONLY ]` banner filter is cleared by clicking `×` on the filter badge (same pattern as Proposal B).
5. No new pages or modals — all UI is on the collection dashboard.

---

## User Value

- **Replaces passive data with active guidance**: instead of "last checked 7 days ago", the user sees "OVERDUE 3 DAYS" — the computation is done for them.
- **Banner eliminates daily scanning**: users don't need to review every card to know whether anything needs attention. The banner is either present (action needed) or absent (all clear).
- **Care plan data is finally visible**: `carePlan.waterFrequency` is in the API response but never surfaced until now. This proposal makes it the primary signal.
- **Measurable**: eliminates the mental calculation "last watered... 7 days ago... water frequency is 7 days... so water today?" — replaced by `WATER TODAY` chip.

---

## ASCII Wireframe

### Banner state (3 plants overdue/due today):

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  COLLECTION FROM THE VOID                                          [+ RESURRECT]     │
│  12 specimens currently under observation.                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░░  NEEDS CARE TODAY: 3 SPECIMENS                               [ SHOW ONLY ]  ×  ░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
(bg-vampire/20, border-2 border-vampire/60, text-vampire)
```

### Banner absent (all plants up to date):

```
(no banner rendered)
```

### Card with countdown chips — overdue state:

```
┌────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────┐ │
│ │              [plant img]                   │ │
│ └────────────────────────────────────────────┘ │  ← card has glow-vampire border
│                                                │
│ WAILING FIG                                    │
│ Ficus lyrata                                   │
│                                                │
│ ┌──────────┐                                   │
│ │ CRITICAL │  (Badge variant="error")          │
│ └──────────┘                                   │
│                                                │
│ "Severe leaf drop detected; root rot           │
│  suspected."                                   │
│                                                │
│ ┌────────┐  ┌───────┐  ┌─────────┐            │
│ │WATER/3D│  │BRIGHT │  │  TOXIC  │            │
│ └────────┘  └───────┘  └─────────┘            │
│                                                │
│ ┌──────────────────┐                           │
│ │  OVERDUE 5 DAYS  │  (Badge variant="error")  │
│ └──────────────────┘                           │
│                                                │
│ CHECKED: 8 DAYS AGO                            │
└────────────────────────────────────────────────┘
```

### Card with countdown chips — approaching state:

```
┌────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────┐ │
│ │              [plant img]                   │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ PHANTOM POTHOS                                 │
│ Epipremnum aureum                              │
│                                                │
│ ┌──────────┐                                   │
│ │ HEALTHY  │  (Badge variant="success")        │
│ └──────────┘                                   │
│                                                │
│ "Plant exhibits vigorous growth with           │
│  deep green foliage."                          │
│                                                │
│ ┌────────┐  ┌──────────┐  ┌──────────┐        │
│ │WATER/7D│  │ INDIRECT │  │ NON-TOXIC│        │
│ └────────┘  └──────────┘  └──────────┘        │
│                                                │
│ ┌────────────────────┐                         │
│ │  WATER IN 2 DAYS   │  (Badge variant="warning")
│ └────────────────────┘                         │
│                                                │
│ CHECKED: 5 DAYS AGO                            │
└────────────────────────────────────────────────┘
```

### Card without care plan:

```
│ ┌───────────┐                                  │
│ │ NO SCHEDULE│  (Badge variant="default")      │
│ └───────────┘                                  │
```

---

## Component Implementation Notes

### Type Extension Required

Same as Proposal A — `carePlan` must be added to the `Plant` interface in `Dashboard.tsx`.

### Countdown Computation

```typescript
interface CountdownResult {
  daysUntilWater: number | null; // negative = overdue, 0 = due today
  label: string;
  variant: BadgeProps["variant"];
  urgent: boolean; // true if due today or overdue
}

function parseWaterInterval(waterFrequency: string): number | null {
  // Handles: "Water every 7 days", "Every 7 days", "7 days", "weekly"
  if (/weekly/i.test(waterFrequency)) return 7;
  if (/biweekly|fortnightly/i.test(waterFrequency)) return 14;
  if (/monthly/i.test(waterFrequency)) return 30;
  const match = waterFrequency.match(/(\d+)\s*days?/i);
  return match ? parseInt(match[1]) : null;
}

function computeCountdown(plant: Plant): CountdownResult {
  if (!plant.carePlan) {
    return {
      daysUntilWater: null,
      label: "NO SCHEDULE",
      variant: "default",
      urgent: false,
    };
  }

  const interval = parseWaterInterval(plant.carePlan.waterFrequency);
  if (interval === null) {
    return {
      daysUntilWater: null,
      label: "NO SCHEDULE",
      variant: "default",
      urgent: false,
    };
  }

  const lastReport = plant.historicalReports.at(-1);
  if (!lastReport) {
    return {
      daysUntilWater: null,
      label: "NO DATA",
      variant: "default",
      urgent: false,
    };
  }

  const daysSinceCheck = Math.floor(
    (Date.now() - new Date(lastReport.date).getTime()) / 86_400_000,
  );
  const daysUntilWater = interval - daysSinceCheck;

  if (daysUntilWater < 0) {
    const overdue = Math.abs(daysUntilWater);
    return {
      daysUntilWater,
      label: `OVERDUE ${overdue} DAY${overdue !== 1 ? "S" : ""}`,
      variant: "error",
      urgent: true,
    };
  }
  if (daysUntilWater === 0) {
    return {
      daysUntilWater: 0,
      label: "WATER TODAY",
      variant: "error",
      urgent: true,
    };
  }
  if (daysUntilWater <= 2) {
    return {
      daysUntilWater,
      label: `WATER IN ${daysUntilWater} DAY${daysUntilWater !== 1 ? "S" : ""}`,
      variant: "warning",
      urgent: false,
    };
  }
  return {
    daysUntilWater,
    label: `WATER IN ${daysUntilWater} DAYS`,
    variant: "default",
    urgent: false,
  };
}
```

### Banner

```typescript
const urgentPlants = useMemo(
  () => plants.filter((p) => computeCountdown(p).urgent),
  [plants],
);
const [showOnlyUrgent, setShowOnlyUrgent] = useState(false);
```

```tsx
{
  urgentPlants.length > 0 && (
    <div
      className="
    flex items-center justify-between
    px-4 py-3 mb-6
    border-2 border-vampire/60
    bg-vampire/10
  "
    >
      <Typography.Body
        variant="vampire"
        size="sm"
        className="font-mono uppercase tracking-wider"
      >
        NEEDS CARE TODAY: {urgentPlants.length} SPECIMEN
        {urgentPlants.length !== 1 ? "S" : ""}
      </Typography.Body>
      <div className="flex items-center gap-3">
        {!showOnlyUrgent && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowOnlyUrgent(true)}
          >
            [ SHOW ONLY ]
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowOnlyUrgent(false)}
        >
          ×
        </Button>
      </div>
    </div>
  );
}
```

### Card Countdown Chip

Added inside the `Card` JSX, below the existing care chips row:

```tsx
const countdown = computeCountdown(plant);

// Card border class addition:
className={`
  p-4 border-toxic/30 hover:border-toxic transition-colors group cursor-pointer
  ${countdown.urgent ? 'border-vampire/70 shadow-[4px_4px_0px_0px_rgba(180,0,60,0.3)]' : ''}
`}

// Chip:
<div className="mt-2">
  <Badge variant={countdown.variant}>{countdown.label}</Badge>
</div>
```

### Filtered Plants

```typescript
const displayedPlants = showOnlyUrgent ? urgentPlants : plants;
```

---

## Known Limitations

1. **`lastReport.date` ≠ last watered date**: the last health check date is used as a proxy for last watering. If a user watered their plant but didn't submit a new health check, the countdown will be inaccurate. A separate "last watered" field on the backend would fix this.
2. **Water frequency parsing is ambiguous**: `"Water every 7-10 days"` — use 7, 10, or average? The parser above uses the first number found. This will overestimate frequency for range-based schedules.
3. **Banner visibility**: the vampire-colored banner is attention-grabbing by design, but if every plant in a neglected collection is overdue, the banner becomes permanent noise. Consider a "dismiss for today" behavior with `sessionStorage`.
4. **Urgency threshold is fixed at ≤ 2 days for WARNING**: some plants (e.g., watered every 3 days) have a very tight window — a `WATER IN 2 DAYS` warning on a 3-day-interval plant may not be useful. The threshold should be relative (e.g., warn when > 70% of interval elapsed).
5. **Health check date used as water proxy**: see limitation #1 — this is the core data quality risk for the entire proposal. Document this assumption prominently in the UI tooltip or help text.
6. **No history**: the countdown resets each time a new health check is submitted. There's no "watering history" tracking separate from health checks.

---

## When to Choose This Option

Choose Proposal E when:

- The primary user need is **"what do I need to do today?"** rather than diagnostic information.
- Users already understand their plants' health status and are coming to the dashboard to manage care tasks.
- The `carePlan` data is reliably populated for most plants (otherwise the countdown chips are mostly `NO SCHEDULE`).
- The team wants to move Necrobloom from a **health monitoring tool** toward a **plant care scheduling tool**.

Do not choose if:

- `carePlan` data is sparse — the proposal's value collapses if most plants show `NO SCHEDULE`.
- Users primarily want health diagnostics (→ Proposal A or C is a better starting point).
- The "last health check = last watered" assumption is known to be wrong for the user base.

**Best combined with**: Proposal B (Command Center) — add a `NEEDS CARE TODAY: N` stat block to the stats panel, making the countdown a first-class collection metric. The two proposals have no layout conflicts.
