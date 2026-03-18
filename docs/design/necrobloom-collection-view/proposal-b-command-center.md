# Proposal B: Collection Command Center

## Problem Solved

Addresses all 5 root causes, with primary focus on **#2** and **#4**:

| Root Cause               | Current State          | After Proposal B                                           |
| ------------------------ | ---------------------- | ---------------------------------------------------------- |
| #1 Health truncated      | `"Plant appears h..."` | Full first sentence (inherits Proposal A cards)            |
| #2 No priority signals   | Every card identical   | Stats panel filters to critical/warning instantly          |
| #3 Data hidden           | Not shown              | Care chips and dates on every card (Proposal A)            |
| #4 No collection summary | Nothing                | Stats panel: total / healthy / warning / critical / oldest |
| #5 Useless ID fragment   | `ID: a3f9c2b1`         | Removed                                                    |

---

## User Workflow

1. User opens `/` dashboard.
2. **Summary Stats Panel** renders above the card grid — a single horizontal `Card` showing 5 stat blocks:
   - `12 SPECIMENS` (total count)
   - `7 HEALTHY` (clickable — filters grid to `success` cards only)
   - `3 WARNING` (clickable — filters grid to `warning` cards only)
   - `2 CRITICAL` (clickable — filters grid to `error` cards only, pulsing border)
   - `LAST CHECKED: PHANTOM POTHOS — 47 DAYS AGO` (clickable — jumps to that plant's detail page)
3. Active filter is shown as a `Badge` above the grid: `[ FILTER: CRITICAL × ]`. Clicking `×` clears filter.
4. Cards below use the **Enriched Cards layout** from Proposal A.
5. When a filter is active, non-matching cards are removed from the DOM (not hidden with opacity) to keep the grid tight.
6. Clicking a stat block a second time deactivates the filter (toggle behavior).

---

## User Value

- **Collection health at a glance**: replaces "12 specimens under observation" (useless count) with an actionable breakdown.
- **One-click triage**: `2 CRITICAL` click → immediately see only the plants that need attention.
- **Outlier detection**: `LAST CHECKED: PHANTOM POTHOS — 47 DAYS AGO` surfaces a neglected plant without requiring the user to scan all cards.
- **Measurable**: reduces time-to-identify-critical-plants from O(n) card scan to O(1) click.

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  COLLECTION FROM THE VOID                                          [+ RESURRECT]     │
│  12 specimens currently under observation.                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│  COLLECTION STATUS                                                                   │
│                                                                                      │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐        │
│  │  12           │  │   7           │  │   3           │  │   2           │        │
│  │  SPECIMENS    │  │   HEALTHY     │  │   WARNING     │  │   CRITICAL    │        │
│  │               │  │  (ectoplasm)  │  │   (gold)      │  │  (vampire)    │        │
│  │  [not filter] │  │  [clickable]  │  │  [clickable]  │  │  [clickable]  │        │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘        │
│                                                                                      │
│  OLDEST CHECK: PHANTOM POTHOS (Epipremnum aureum) — 47 DAYS AGO  [ VIEW → ]         │
└─────────────────────────────────────────────────────────────────────────────────────┘

  FILTER: CRITICAL ×                                    (shown when filter active)

┌─────────────────────┐  ┌─────────────────────┐
│ ┌─────────────────┐ │  │ ┌─────────────────┐ │
│ │   [plant img]   │ │  │ │   [NO VISUAL    │ │
│ │                 │ │  │ │     DATA ]      │ │
│ └─────────────────┘ │  │ └─────────────────┘ │
│                     │  │                     │
│ WAILING FIG         │  │ DEATH ORCHID         │
│ Ficus lyrata        │  │ Orchidaceae          │
│                     │  │                     │
│ ┌──────────┐        │  │ ┌──────────┐        │
│ │ CRITICAL │        │  │ │ CRITICAL │        │
│ └──────────┘        │  │ └──────────┘        │
│ (vampire/error)     │  │ (vampire/error)     │
│                     │  │                     │
│ "Severe leaf drop   │  │ "Root system        │
│  detected; possible │  │  appears completely │
│  root rot."         │  │  desiccated."       │
│                     │  │                     │
│ ┌────────┐┌───────┐ │  │ ┌────────┐┌───────┐ │
│ │WATER/3D││BRIGHT │ │  │ │WATER/2D││BRIGHT │ │
│ └────────┘└───────┘ │  │ └────────┘└───────┘ │
│ ┌─────────┐         │  │ ┌──────────┐        │
│ │  TOXIC  │         │  │ │ NON-TOXIC│        │
│ └─────────┘         │  │ └──────────┘        │
│ CHECKED: 1 DAY AGO  │  │ CHECKED: 3 DAYS AGO │
└─────────────────────┘  └─────────────────────┘

  (only CRITICAL cards shown when filter active; grid collapses to 2 cols if < 3 results)
```

**Stats panel color states:**

```
SPECIMENS  → Typography.H2 variant="toxic"   (no filter; informational only)
HEALTHY    → Typography.H2 variant="ectoplasm" + cursor-pointer hover:glow-ectoplasm
WARNING    → Typography.H2 variant="witchcraft" + cursor-pointer (gold not in Typography)
CRITICAL   → Typography.H2 variant="vampire" + cursor-pointer + animate-pulse when > 0
```

**Active filter Badge above grid:**

```
<Badge variant="error">FILTER: CRITICAL ×</Badge>   (error for critical)
<Badge variant="warning">FILTER: WARNING ×</Badge>  (warning for warning)
<Badge variant="success">FILTER: HEALTHY ×</Badge>  (success for healthy)
```

---

## Component Implementation Notes

### Stats Computation

Computed client-side from the `plants` array after fetch — no additional API calls:

```typescript
interface CollectionStats {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
  unknown: number;
  oldestCheck: {
    alias: string;
    species: string;
    id: string;
    daysAgo: number;
  } | null;
}

function computeStats(plants: Plant[]): CollectionStats {
  let healthy = 0,
    warning = 0,
    critical = 0,
    unknown = 0;
  let oldestMs = Date.now();
  let oldestPlant: CollectionStats["oldestCheck"] = null;

  for (const plant of plants) {
    const lastReport = plant.historicalReports.at(-1);
    if (!lastReport) {
      unknown++;
      continue;
    }

    const { variant } = deriveHealthBadge(lastReport.healthStatus);
    if (variant === "success") healthy++;
    else if (variant === "warning") warning++;
    else if (variant === "error") critical++;
    else unknown++;

    const reportMs = new Date(lastReport.date).getTime();
    if (reportMs < oldestMs) {
      oldestMs = reportMs;
      oldestPlant = {
        alias: plant.alias,
        species: plant.species,
        id: plant.id,
        daysAgo: Math.floor((Date.now() - reportMs) / 86_400_000),
      };
    }
  }

  return {
    total: plants.length,
    healthy,
    warning,
    critical,
    unknown,
    oldestCheck: oldestPlant,
  };
}
```

### Filter State

```typescript
type HealthFilter = "healthy" | "warning" | "critical" | null;
const [activeFilter, setActiveFilter] = useState<HealthFilter>(null);

const filteredPlants = activeFilter
  ? plants.filter((p) => {
      const lastReport = p.historicalReports.at(-1);
      if (!lastReport) return false;
      const { variant } = deriveHealthBadge(lastReport.healthStatus);
      const map = {
        healthy: "success",
        warning: "warning",
        critical: "error",
      } as const;
      return variant === map[activeFilter];
    })
  : plants;
```

### Stats Panel Layout

```tsx
<Card className="p-6 border-toxic/20 mb-8">
  <Typography.H3 variant="muted" size="xs" className="mb-4 uppercase font-mono">
    Collection Status
  </Typography.H3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <StatBlock count={stats.total} label="SPECIMENS" />
    <StatBlock
      count={stats.healthy}
      label="HEALTHY"
      variant="ectoplasm"
      onClick={() =>
        setActiveFilter((f) => (f === "healthy" ? null : "healthy"))
      }
    />
    <StatBlock
      count={stats.warning}
      label="WARNING"
      variant="witchcraft"
      onClick={() =>
        setActiveFilter((f) => (f === "warning" ? null : "warning"))
      }
    />
    <StatBlock
      count={stats.critical}
      label="CRITICAL"
      variant="vampire"
      onClick={() =>
        setActiveFilter((f) => (f === "critical" ? null : "critical"))
      }
      pulse={stats.critical > 0}
    />
  </div>
  {stats.oldestCheck && (
    <div className="mt-4 pt-4 border-t border-toxic/10 flex justify-between items-center">
      <Typography.Body variant="muted" size="xs">
        OLDEST CHECK:{" "}
        <span className="text-witchcraft">
          {stats.oldestCheck.alias.toUpperCase()}
        </span>{" "}
        ({stats.oldestCheck.species}) — {stats.oldestCheck.daysAgo} DAYS AGO
      </Typography.Body>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/plant/${stats.oldestCheck!.id}`)}
      >
        VIEW →
      </Button>
    </div>
  )}
</Card>
```

`StatBlock` is a local component within `Dashboard.tsx` — not a shared UI component. Uses `Typography.H2` for the count and `Typography.Body size="xs"` for the label.

### Card Grid

Uses Enriched Cards (Proposal A) layout identically. The only difference is `filteredPlants` is mapped instead of `plants`.

---

## Known Limitations

1. **Stats are derived from client-side keyword matching** — same fragility as Proposal A's Badge logic. Stats will be wrong if `healthStatus` text doesn't match the regex patterns.
2. **"Oldest check" outlier only shows one plant** — a user with 3 plants all unchecked for 60 days will only see one highlighted.
3. **Filter is stateless** — refreshing the page clears the active filter. Could persist to `sessionStorage` but adds complexity.
4. **WARNING color token gap**: PixelGrim's `Typography` has no `gold` variant. `WARNING` stat in the panel would use `witchcraft` (purple) instead of gold, creating a mismatch with the `Badge variant="warning"` (which uses `bg-gold`). Either add a `gold` Typography variant or accept the inconsistency.
5. **Stats re-compute on every render** — `computeStats` should be wrapped in `useMemo` to avoid redundant work on re-renders.

---

## When to Choose This Option

Choose Proposal B when:

- The collection has grown to **5+ plants** where card scanning becomes slow.
- The primary user need is **"what's wrong in my collection right now?"**
- The team wants to preserve the card grid UI while adding collection-level intelligence.
- This is the **most complete single proposal**: it addresses all 5 root causes and is the recommended default if only one proposal is implemented.
- Power users will be a minority — the command center serves both casual and power users without requiring them to switch modes.

Do not choose if:

- Users primarily want to act on care schedules (→ Proposal E is more actionable).
- The collection is very large (50+ plants) and a list view is needed for scanning (→ Proposal D).
