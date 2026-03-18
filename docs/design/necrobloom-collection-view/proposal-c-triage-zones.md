# Proposal C: Triage Zones

## Problem Solved

Addresses root causes **#1, #2, #3, and #5** with zero interactive complexity:

| Root Cause               | Current State          | After Proposal C                                                 |
| ------------------------ | ---------------------- | ---------------------------------------------------------------- |
| #1 Health truncated      | `"Plant appears h..."` | Full first sentence (Proposal A card)                            |
| #2 No priority signals   | Every card identical   | Layout itself is the priority signal: critical zone first        |
| #3 Data hidden           | Not shown              | Care chips and dates on every card (Proposal A)                  |
| #4 No collection summary | Nothing                | Zone headers implicitly summarize (e.g., "3 plants in CRITICAL") |
| #5 Useless ID fragment   | `ID: a3f9c2b1`         | Removed                                                          |

Root cause #4 (explicit collection summary panel) is partially addressed via zone headers showing count, but no stats panel. See Proposal B for that.

---

## User Workflow

1. User opens `/` dashboard.
2. Page is divided into **labeled structural zones** instead of a flat card grid:
   - `/// CRITICAL ///` — plants whose latest `healthStatus` contains critical keywords
   - `/// NEEDS CHECK ///` — plants with `WARNING` health OR last checked > 14 days ago
   - `/// THRIVING ///` — plants with `HEALTHY` status checked within 14 days
3. Each zone header shows the count: `/// CRITICAL /// (2 specimens)`
4. Zones with **zero plants are hidden** — the page only shows zones with content.
5. Plants within each zone render as **Enriched Cards** (Proposal A layout).
6. No filters, no interactions at the zone level — the layout is entirely static/declarative.
7. User clicks any card → navigates to `/plant/:id` (unchanged).

---

## User Value

- **Zero cognitive overhead**: the page layout answers "what needs attention?" without any user action.
- **No UI elements to learn**: no buttons, no filters, no toggles. Reading the page is the interaction.
- **Urgency is spatially encoded**: CRITICAL is always at the top of the page — no scrolling past healthy plants to find problems.
- **Empty zones disappear**: a user with all healthy plants sees only `/// THRIVING ///` — clean and reassuring.
- **Measurable**: reduces time-to-triage from O(n) scan to O(1) — the page structure is the answer.

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  COLLECTION FROM THE VOID                                          [+ RESURRECT]     │
│  12 specimens currently under observation.                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ▓▓▓ CRITICAL ▓▓▓  (2 specimens)                          (border-vampire, text-vampire)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────┐  ┌─────────────────────┐
│ ┌─────────────────┐ │  │ ┌─────────────────┐ │
│ │   [plant img]   │ │  │ │  [NO VISUAL     │ │
│ └─────────────────┘ │  │ │     DATA ]      │ │
│                     │  │ └─────────────────┘ │
│ WAILING FIG         │  │                     │
│ Ficus lyrata        │  │ DEATH ORCHID         │
│                     │  │ Orchidaceae          │
│ ┌──────────┐        │  │                     │
│ │ CRITICAL │        │  │ ┌──────────┐        │
│ └──────────┘        │  │ │ CRITICAL │        │
│                     │  │ └──────────┘        │
│ "Severe leaf drop   │  │                     │
│  detected; root rot │  │ "Root system fully  │
│  suspected."        │  │  desiccated."       │
│                     │  │                     │
│ ┌────────┐┌───────┐ │  │ ┌────────┐┌───────┐ │
│ │WATER/3D││BRIGHT │ │  │ │WATER/2D││BRIGHT │ │
│ └────────┘└───────┘ │  │ └────────┘└───────┘ │
│ ┌─────────┐         │  │ ┌──────────┐        │
│ │  TOXIC  │         │  │ │ NON-TOXIC│        │
│ └─────────┘         │  │ └──────────┘        │
│ CHECKED: 1 DAY AGO  │  │ CHECKED: 3 DAYS AGO │
└─────────────────────┘  └─────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ▒▒▒ NEEDS CHECK ▒▒▒  (5 specimens)                       (border-gold, text-witchcraft)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ ... enriched cards  │  │ ... enriched cards  │  │ ... enriched cards  │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│ ... enriched cards  │  │ ... enriched cards  │
└─────────────────────┘  └─────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ░░░ THRIVING ░░░  (5 specimens)                           (border-ectoplasm, text-ectoplasm)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ ... enriched cards  │  │ ... enriched cards  │  │ ... enriched cards  │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**Zone header color tokens:**

```
CRITICAL     → Typography.H2 variant="vampire" glow={true}
               horizontal rule: border-vampire/50
               zone background: bg-vampire/5

NEEDS CHECK  → Typography.H2 variant="witchcraft" glow={true}
               horizontal rule: border-witchcraft/30
               zone background: transparent

THRIVING     → Typography.H2 variant="ectoplasm" glow={true}
               horizontal rule: border-ectoplasm/30
               zone background: bg-ectoplasm/5
```

---

## Component Implementation Notes

### Zone Classification Logic

A plant is assigned to exactly one zone using priority-order evaluation:

```typescript
type Zone = "critical" | "needs_check" | "thriving";

const STALE_DAYS = 14;

function classifyPlant(plant: Plant): Zone {
  const lastReport = plant.historicalReports.at(-1);

  // No reports at all → needs check
  if (!lastReport) return "needs_check";

  const { variant } = deriveHealthBadge(lastReport.healthStatus);

  // Critical health → critical zone (regardless of recency)
  if (variant === "error") return "critical";

  // Warning health → needs check zone
  if (variant === "warning") return "needs_check";

  // Stale check (> 14 days) → needs check, even if last report was healthy
  const daysElapsed = Math.floor(
    (Date.now() - new Date(lastReport.date).getTime()) / 86_400_000,
  );
  if (daysElapsed > STALE_DAYS) return "needs_check";

  // Healthy + recent → thriving
  return "thriving";
}
```

### Zone Grouping

```typescript
const zones = useMemo(() => {
  const critical: Plant[] = [];
  const needs_check: Plant[] = [];
  const thriving: Plant[] = [];
  for (const plant of plants) {
    const zone = classifyPlant(plant);
    if (zone === "critical") critical.push(plant);
    else if (zone === "needs_check") needs_check.push(plant);
    else thriving.push(plant);
  }
  return { critical, needs_check, thriving };
}, [plants]);
```

### Zone Header Component

Local to `Dashboard.tsx`:

```tsx
interface ZoneHeaderProps {
  label: string;
  count: number;
  variant: TypographyVariant;
  borderColor: string;
  bgColor?: string;
}

// Rendered structure:
// <section className={`mb-12 ${bgColor} p-4 border-l-4 ${borderColor}`}>
//   <div className={`border-b-2 ${borderColor} mb-6 pb-2`}>
//     <Typography.H2 variant={variant} glow>
//       /// {label} /// ({count} specimen{count !== 1 ? 's' : ''})
//     </Typography.H2>
//   </div>
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//     {plants.map(plant => <EnrichedCard key={plant.id} plant={plant} />)}
//   </div>
// </section>
```

The `///` decoration on zone headers uses the PixelGrim "terminal comment" aesthetic (matches the existing `[ NO VISUAL DATA ]` text style in Dashboard.tsx).

### Conditional Zone Rendering

```tsx
{
  zones.critical.length > 0 && (
    <ZoneSection
      label="CRITICAL"
      plants={zones.critical}
      variant="vampire"
      borderColor="border-vampire/50"
      bgColor="bg-vampire/5"
    />
  );
}
{
  zones.needs_check.length > 0 && (
    <ZoneSection
      label="NEEDS CHECK"
      plants={zones.needs_check}
      variant="witchcraft"
      borderColor="border-witchcraft/30"
    />
  );
}
{
  zones.thriving.length > 0 && (
    <ZoneSection
      label="THRIVING"
      plants={zones.thriving}
      variant="ectoplasm"
      borderColor="border-ectoplasm/30"
      bgColor="bg-ectoplasm/5"
    />
  );
}
```

Note: `glow` is `true` by default on `H2` — no need to specify it explicitly.

---

## Known Limitations

1. **"Needs Check" zone can dominate**: with 10 plants all unchecked > 14 days, the entire page becomes one zone. The staleness threshold (14 days) may need tuning per user habits.
2. **No sorting within zones**: plants within a zone appear in API-response order. A `CRITICAL` zone with 5 plants has no secondary sort (e.g., most recently checked first).
3. **Classification is binary per zone**: a plant cannot be in two zones. A `WARNING` plant that's also stale (47 days) is only in `NEEDS CHECK` — this is correct but may surprise users who expect it in a "really needs attention" sub-zone.
4. **No total count visible**: users can add counts per zone but cannot instantly see "12 total" without mentally summing zones. This is the tradeoff vs. Proposal B's stats panel.
5. **Zone structure doesn't communicate urgency magnitude**: `/// CRITICAL /// (1 specimen)` and `/// CRITICAL /// (8 specimens)` use identical visual weight. Consider `Typography.H1` for critical zone header if count > 3.
6. **14-day staleness constant is hardcoded**: ideally derived from `carePlan.waterFrequency` per plant (Proposal E does this). A plant watered every 3 days has a very different "stale" threshold than one watered every 30 days.

---

## When to Choose This Option

Choose Proposal C when:

- The primary design principle is **"layout communicates priority, not UI elements"**.
- The team wants **zero new interactive patterns** — no filters, no toggles, no state.
- Users are visual/spatial thinkers who benefit from the page structure encoding urgency.
- The collection is mixed (some critical, some thriving) and users need to know immediately upon opening the page.
- Accessibility is a concern — no interactive filtering means no keyboard trap risks.

Do not choose if:

- Users primarily want countdown-style care reminders (→ Proposal E).
- The collection is almost entirely healthy — `/// THRIVING ///` covering 95% of the page is redundant.
- Users want to filter or sort within zones interactively (→ Proposal B).
