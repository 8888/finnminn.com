# Proposal D: Dense List View

## Problem Solved

Addresses root causes **#1, #3, #4, and #5** with a focus on power users:

| Root Cause               | Current State          | After Proposal D                                    |
| ------------------------ | ---------------------- | --------------------------------------------------- |
| #1 Health truncated      | `"Plant appears h..."` | First 80 chars of diagnosis visible inline          |
| #2 No priority signals   | Every card identical   | Sortable `Health` column; sort by status descending |
| #3 Data hidden           | Not shown              | Care columns: water interval, light, toxicity       |
| #4 No collection summary | Nothing                | Row count and sort state visible at all times       |
| #5 Useless ID fragment   | `ID: a3f9c2b1`         | Removed; row shows name, species, all data          |

Root cause #2 is partially addressed (sortable column), but triage zones (Proposal C) or a stats panel (Proposal B) communicate priority more strongly without user action.

---

## User Workflow

1. User opens `/` dashboard. Default view is the existing card grid (Proposal A cards).
2. A **view toggle** appears in the dashboard header: `[ CARDS ] / [ LIST ]`. Default is `CARDS`.
3. User clicks `[ LIST ]` → grid is replaced by a compact table view.
4. Each row is **40px tall** and contains:
   - Thumbnail (40×40px square, object-cover)
   - Plant alias (bold)
   - Species (italic, muted)
   - Health `Badge` (HEALTHY / WARNING / CRITICAL / UNKNOWN)
   - First 80 chars of latest `healthStatus` (truncated with ellipsis; no expand)
   - Water interval chip (e.g., `WATER/7D`)
   - Light chip (e.g., `INDIRECT`)
   - Toxicity chip
   - Last-check date (e.g., `MAR 5` or `47D AGO` if > 30 days)
5. Column headers are **clickable to sort**: Name (A–Z), Health (critical first), Last Check (oldest first), Water (most frequent first).
6. Active sort column shows `▲` or `▼` indicator.
7. Clicking a row navigates to `/plant/:id`.
8. View preference is persisted to `localStorage` key `necrobloom:dashboard:view`.

---

## User Value

- **Density**: 20 plants visible simultaneously without scrolling (vs. ~3 in card view, ~6 in enriched card view).
- **Sorting**: sort by health to instantly see all CRITICAL plants at the top; sort by last-check to find most neglected plants.
- **Power user workflow**: users managing 20+ plants find scanning cards cognitively expensive — a list is the standard information architecture for this scale.
- **Persistent preference**: the view toggle survives page refreshes; users who prefer list never see the card grid again.
- **Measurable**: reduces scroll distance to see all plants by ~75% for collections of 20+.

---

## ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  COLLECTION FROM THE VOID                                          [+ RESURRECT]     │
│  12 specimens currently under observation.                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘

                                              ┌─────────────────────────────────────┐
                                              │  [ CARDS ]  [ LIST ◀ ACTIVE ]       │
                                              └─────────────────────────────────────┘

┌────┬──────────────────────────┬────────────┬───────────┬──────────────────────────────────┬─────────┬──────────┬──────────┬────────────┐
│    │ NAME ▲                   │ SPECIES    │ HEALTH    │ DIAGNOSIS                        │ WATER   │ LIGHT    │ TOXICITY │ LAST CHECK │
├────┼──────────────────────────┼────────────┼───────────┼──────────────────────────────────┼─────────┼──────────┼──────────┼────────────┤
│[▪] │ WAILING FIG              │ Ficus ly.  │[CRITICAL] │ Severe leaf drop detected; poss… │ WATER/3D│ BRIGHT   │ TOXIC    │ 1D AGO     │
│[▪] │ DEATH ORCHID             │ Orchidace. │[CRITICAL] │ Root system appears completely d… │ WATER/2D│ BRIGHT   │ NON-TOXIC│ 3D AGO     │
│[▪] │ PHANTOM POTHOS           │ Epipremnu. │[WARNING]  │ Yellowing on lower leaves sugges… │ WATER/5D│ INDIRECT │ NON-TOXIC│ 47D AGO    │
│[▪] │ SHADOW SNAKE PLANT       │ Sansevier. │[WARNING]  │ Pale coloration at leaf tips ind… │ WATER/14D│LOW      │ TOXIC    │ MAR 10     │
│[▪] │ CURSED MONSTERA          │ Monstera d.│[HEALTHY]  │ Plant exhibits vigorous growth w… │ WATER/7D│ INDIRECT │ NON-TOXIC│ MAR 15     │
│[▪] │ NECRO PEACE LILY         │ Spathiphyl.│[HEALTHY]  │ Lush, dark foliage with no signs… │ WATER/7D│ LOW      │ TOXIC    │ MAR 14     │
│[▪] │ VOID SPIDER PLANT        │ Chlorophyt.│[HEALTHY]  │ Vigorous runners with healthy wh… │ WATER/7D│ INDIRECT │ NON-TOXIC│ MAR 12     │
│[▪] │ GRIM JADE                │ Crassula o.│[HEALTHY]  │ Thick, waxy leaves in excellent c… │WATER/21D│ BRIGHT  │ TOXIC    │ MAR 8      │
│[▪] │ BANSHEE BROMELIAD        │ Bromeliace.│[HEALTHY]  │ Central cup full; vibrant foliage… │WATER/5D │ INDIRECT │ NON-TOXIC│ MAR 3      │
│[▪] │ SPECTER SUCCULENT        │ Echeveria  │[HEALTHY]  │ Compact rosette with no stretchi… │ WATER/14D│ BRIGHT  │ NON-TOXIC│ FEB 28     │
│[▪] │ ELDRITCH DRACAENA        │ Dracaena m.│[UNKNOWN]  │ —                                │ —       │ —        │ —        │ NEVER      │
│[▪] │ WRAITH RUBBER PLANT      │ Ficus elas.│[UNKNOWN]  │ —                                │ —       │ —        │ —        │ NEVER      │
└────┴──────────────────────────┴────────────┴───────────┴──────────────────────────────────┴─────────┴──────────┴──────────┴────────────┘

  (rows are 40px; thumbnail [▪] is 40×40px; hover state: row border-toxic/60)
  (CRITICAL rows: left border bar bg-vampire/50; WARNING rows: left border bar bg-gold/50)
```

**Column sort state indicator:**

```
NAME ▲   (sorted A–Z; click again → Z–A)
HEALTH ▼ (sorted critical first; click again → healthy first)
LAST CHECK ▲ (sorted oldest first → most neglected at top)
```

---

## Component Implementation Notes

### View Toggle State

```typescript
type DashboardView = "cards" | "list";

const [view, setView] = useState<DashboardView>(() => {
  return (
    (localStorage.getItem("necrobloom:dashboard:view") as DashboardView) ||
    "cards"
  );
});

const handleViewChange = (v: DashboardView) => {
  setView(v);
  localStorage.setItem("necrobloom:dashboard:view", v);
};
```

Rendered as two `Button` components side by side:

```tsx
<div className="flex gap-0 border-2 border-void">
  <Button
    variant={view === "cards" ? "primary" : "ghost"}
    size="sm"
    onClick={() => handleViewChange("cards")}
  >
    [ CARDS ]
  </Button>
  <Button
    variant={view === "list" ? "primary" : "ghost"}
    size="sm"
    onClick={() => handleViewChange("list")}
  >
    [ LIST ]
  </Button>
</div>
```

### Sort State

```typescript
type SortKey = "name" | "health" | "lastCheck" | "water";
type SortDir = "asc" | "desc";

const [sortKey, setSortKey] = useState<SortKey>("health");
const [sortDir, setSortDir] = useState<SortDir>("desc");

const handleSort = (key: SortKey) => {
  if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  else {
    setSortKey(key);
    setSortDir("desc");
  }
};

// Health severity for sort comparison
const healthOrder = { error: 0, warning: 1, default: 2, success: 3, info: 4 };

const sortedPlants = useMemo(() => {
  return [...plants].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") {
      cmp = a.alias.localeCompare(b.alias);
    } else if (sortKey === "health") {
      const av =
        deriveHealthBadge(a.historicalReports.at(-1)?.healthStatus || "")
          .variant || "default";
      const bv =
        deriveHealthBadge(b.historicalReports.at(-1)?.healthStatus || "")
          .variant || "default";
      cmp = (healthOrder[av] ?? 4) - (healthOrder[bv] ?? 4);
    } else if (sortKey === "lastCheck") {
      const ad = a.historicalReports.at(-1)?.date
        ? new Date(a.historicalReports.at(-1)!.date).getTime()
        : 0;
      const bd = b.historicalReports.at(-1)?.date
        ? new Date(b.historicalReports.at(-1)!.date).getTime()
        : 0;
      cmp = ad - bd;
    } else if (sortKey === "water") {
      const parseWater = (p: Plant) => {
        const match = p.carePlan?.waterFrequency?.match(/\d+/);
        return match ? parseInt(match[0]) : 999;
      };
      cmp = parseWater(a) - parseWater(b);
    }
    return sortDir === "asc" ? cmp : -cmp;
  });
}, [plants, sortKey, sortDir]);
```

### List Row Layout

The list uses a CSS table layout (`display: table` or Tailwind `table` classes) rather than `<table>` to avoid border-collapse conflicts with PixelGrim's `border-2` requirement.

```tsx
// Row structure (simplified)
<div
  className={`
    flex items-center gap-3 px-3 py-0 h-10 cursor-pointer
    border-b-2 border-toxic/10 hover:border-toxic/60
    transition-colors group
    ${healthVariant === "error" ? "border-l-4 border-l-vampire/50" : ""}
    ${healthVariant === "warning" ? "border-l-4 border-l-witchcraft/30" : ""}
  `}
  onClick={() => navigate(`/plant/${plant.id}`)}
>
  {/* 40×40 thumbnail */}
  <div className="w-10 h-10 flex-shrink-0 bg-void border-2 border-toxic/10 overflow-hidden">
    {lastReport?.imageUrl ? (
      <img
        src={lastReport.imageUrl}
        alt={plant.alias}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-toxic/10 text-[8px]">
        ▪
      </div>
    )}
  </div>

  {/* Name + species */}
  <div className="w-40 flex-shrink-0">
    <Typography.Body variant="toxic" size="xs" className="truncate font-header">
      {plant.alias.toUpperCase()}
    </Typography.Body>
    <Typography.Body variant="muted" size="xs" className="truncate italic">
      {plant.species}
    </Typography.Body>
  </div>

  {/* Health Badge */}
  <div className="w-20 flex-shrink-0">
    <Badge variant={healthBadge.variant}>{healthBadge.label}</Badge>
  </div>

  {/* Diagnosis snippet */}
  <div className="flex-1 min-w-0">
    <Typography.Body variant="muted" size="xs" className="truncate">
      {lastReport ? firstSentence(lastReport.healthStatus).slice(0, 80) : "—"}
    </Typography.Body>
  </div>

  {/* Care chips (right-aligned) */}
  <div className="flex gap-1 flex-shrink-0">
    {plant.carePlan && (
      <>
        <Badge variant="info">
          {parseWaterChip(plant.carePlan.waterFrequency)}
        </Badge>
        <Badge variant="info">
          {parseLightChip(plant.carePlan.lightNeeds)}
        </Badge>
        <Badge
          variant={
            plant.carePlan.toxicity.toLowerCase().includes("non")
              ? "info"
              : "error"
          }
        >
          {plant.carePlan.toxicity.toLowerCase().includes("non")
            ? "NON-TOXIC"
            : "TOXIC"}
        </Badge>
      </>
    )}
  </div>

  {/* Last check */}
  <div className="w-20 flex-shrink-0 text-right">
    <Typography.Body variant="muted" size="xs">
      {lastReport ? formatLastCheck(lastReport.date) : "NEVER"}
    </Typography.Body>
  </div>
</div>
```

### Column Headers

```tsx
// SortHeader local component
const SortHeader = ({ label, sortK }: { label: string; sortK: SortKey }) => (
  <button
    className="text-[10px] font-mono text-toxic/60 hover:text-toxic uppercase tracking-wider flex items-center gap-1"
    onClick={() => handleSort(sortK)}
  >
    {label}
    {sortKey === sortK && <span>{sortDir === "asc" ? "▲" : "▼"}</span>}
  </button>
);
```

Column headers use raw `<button>` elements, not `Button` component — they are too small for PixelGrim's minimum button sizing.

---

## Known Limitations

1. **Responsive breakpoint**: the full 9-column list requires ~1100px minimum width. On tablet/mobile it will overflow. Proposed fallback: hide the Diagnosis column on `md:` and hide care chips on `sm:`, falling back to card view on `xs:`.
2. **No pagination**: all plants render in one list. With 100+ plants, this will be slow. Consider virtualizing with a library if the list exceeds 50 rows.
3. **Column widths are fixed**: the truncation approach (flex + `truncate`) is functional but crude — mismatched lengths in plant names will create visual noise.
4. **No multi-sort**: only one sort key active at a time. A user who wants "critical first, then oldest last-check within critical" cannot do this.
5. **`localStorage` preference**: if the user clears browser storage, they revert to card view. This is acceptable for a preference store.
6. **Typography.Body `size="xs"` in list rows**: per PixelGrim rules, `glow={true}` must never be used on `xs` or `sm` sizes. List rows must explicitly pass `glow={false}` or rely on Body's default (`glow={false}`).

---

## When to Choose This Option

Choose Proposal D when:

- Users have **15+ plants** and report the card grid is too expensive to scan.
- There are power users who want to sort and compare across the collection.
- A **mobile-first UX is not the priority** — this layout is primarily desktop.
- The team wants to add both card and list views as equal first-class options (not just a fallback).

Do not choose if:

- The primary use case is mobile — list view doesn't adapt well to narrow screens without significant additional work.
- Users want to know "which plants need care today" without sorting (→ Proposal E).
- The collection is small (< 10 plants) — list view has no advantage over enriched cards at this scale.
