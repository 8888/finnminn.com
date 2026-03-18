# Decision Record: Necrobloom Collection Dashboard Redesign

**Date:** 2026-03-18
**Status:** Approved
**Decision maker:** Executive review
**Outcome:** Implement Proposal A + Proposal B

---

## Decision

Following executive review of the five design proposals, the team will implement **Proposal A (Enriched Cards)** followed by **Proposal B (Collection Command Center)** as a combined first iteration.

Proposals C, D, and E are deferred. They are not rejected — they remain valid options for future iterations once A + B ship and usage data is available.

---

## Rationale

### Why A + B

- **A** is the prerequisite for everything else. It fixes the three most visible failures (truncated health text, hidden care data, useless ID) with zero structural change to the page. No new interactions, no new state, no layout risk.
- **B** builds directly on A's card layout and adds the one thing A cannot provide: a collection-level health summary with one-click filtering. This addresses all five root causes in a single combined release.
- The A + B combination has no layout conflicts and shares the same `Plant` interface extension, making them safe to implement in a single PR or two sequential PRs.

### Why not C, D, or E (now)

| Proposal            | Reason deferred                                                                                                                                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C (Triage Zones)    | Conflicts structurally with B — zone layout replaces the flat grid, making the B stats panel redundant. Choose C _or_ B, not both. Since B addresses all 5 root causes, C is not needed.                                                            |
| D (Dense List View) | Desktop-only; mobile suitability is poor. Requires the most engineering effort. Suitable for a future power-user feature gate once the user base grows past 15+ plants per account.                                                                 |
| E (Care Countdown)  | Value depends on `carePlan.waterFrequency` being reliably populated. Until data quality of care plans is confirmed across the user base, the countdown chips would render `NO SCHEDULE` for too many plants to be useful. Revisit after A + B ship. |

---

## Implementation Plan

### Phase 1 — Proposal A: Enriched Cards

**Target:** Single PR. No new state, no new interactions.

**Prerequisites (must land first):**

1. Extend the `Plant` interface in `Dashboard.tsx` to match `PlantDetail.tsx`:
   - Add `carePlan?: { waterFrequency, lightNeeds, toxicity, additionalNotes }`
   - Add `environment: { zip, lighting }`
2. Import `Badge` from `@finnminn/ui` in `Dashboard.tsx`

**Changes to `Dashboard.tsx`:**

- Add utility functions above the component: `deriveHealthBadge`, `firstSentence`, `daysAgo`
- Remove `plant.id.toString().substring(0, 8)` from the card
- Remove the raw `healthStatus?.substring(0, 15) + "..."` display
- Add health `Badge` (derived from `deriveHealthBadge(lastReport.healthStatus)`)
- Add first sentence of `healthStatus` as body text (via `firstSentence`)
- Add care chips row: water interval, light needs, toxicity (all `Badge variant="info"`, toxicity uses `"error"` if toxic)
- Add last-check date footer via `daysAgo(lastReport.date)` as `Typography.Body variant="muted" size="xs"`
- Add `[ NO CARE PLAN ]` empty state when `carePlan` is absent

**Reference:** [Proposal A spec](./proposal-a-enriched-cards.md)

---

### Phase 2 — Proposal B: Collection Command Center

**Target:** Single PR. Builds on Phase 1 card layout; must follow Phase 1.

**Prerequisites:**

- Phase 1 must be merged (shares `Plant` interface and utility functions)

**Changes to `Dashboard.tsx`:**

- Add `computeStats(plants)` function (see [Proposal B spec](./proposal-b-command-center.md#stats-computation)); wrap in `useMemo`
- Add `activeFilter` state: `useState<HealthFilter>(null)`
- Add `filteredPlants` derived value: filter `plants` by `activeFilter` when set
- Add `StatBlock` local component (count + label, uses `Typography.H2` for count)
- Add the stats `Card` panel above the grid — 4 stat blocks: SPECIMENS / HEALTHY / WARNING / CRITICAL, plus oldest-check outlier row
- CRITICAL stat block: `animate-pulse` when `stats.critical > 0`
- Add active filter `Badge` above grid: `FILTER: CRITICAL ×`; clicking `×` calls `setActiveFilter(null)`
- Map `filteredPlants` instead of `plants` in the card grid

**Reference:** [Proposal B spec](./proposal-b-command-center.md)

---

## Shared Utility Reference

These functions are defined once and used by both phases:

| Function                          | Phase introduced | Used by |
| --------------------------------- | ---------------- | ------- |
| `deriveHealthBadge(healthStatus)` | A                | A, B    |
| `firstSentence(text)`             | A                | A, B    |
| `daysAgo(dateStr)`                | A                | A, B    |
| `computeStats(plants)`            | B                | B only  |

Full implementations are in the respective proposal files. Do not duplicate them — define above the component, reference from both the card JSX and the stats panel.

---

## Known Risks

1. **Keyword matching fragility** — `deriveHealthBadge` uses regex against AI-generated text. Edge cases will produce `UNKNOWN` badges. A structured health score field from the backend would eliminate this, but is out of scope for this iteration.
2. **`carePlan` data sparsity** — some plants lack a care plan (not yet analyzed). The `[ NO CARE PLAN ]` empty state in Phase 1 handles this gracefully.
3. **WARNING color token** — PixelGrim's `Typography` has no `gold` variant. The WARNING stat block in Phase 2 uses `variant="witchcraft"` (purple), creating a minor visual mismatch with `Badge variant="warning"` (gold background). Accept the inconsistency for now; adding a `gold` Typography variant is a separate design system task.
4. **Stats `computeStats` re-computation** — must be wrapped in `useMemo([plants])` to avoid redundant work on every render.

---

## Future Consideration

Once A + B are live:

- **Proposal E** becomes viable if telemetry shows `carePlan` coverage is high (> 70% of plants). Re-evaluate after 30 days of production data.
- **Proposal D** (list view) is appropriate when any user account exceeds 15 plants. Build it as an additive toggle on top of A + B — the two have no conflicts.
- **Proposal C** is effectively superseded by B for this user base. Only revisit if explicit accessibility requirements make interactive filtering undesirable.

---

## Files

| File                                                           | Purpose                          |
| -------------------------------------------------------------- | -------------------------------- |
| `apps/necrobloom/src/pages/Dashboard.tsx`                      | Only file changed in both phases |
| `packages/ui/src/components/Badge.tsx`                         | Used but not modified            |
| [proposal-a-enriched-cards.md](./proposal-a-enriched-cards.md) | Full Phase 1 spec                |
| [proposal-b-command-center.md](./proposal-b-command-center.md) | Full Phase 2 spec                |
