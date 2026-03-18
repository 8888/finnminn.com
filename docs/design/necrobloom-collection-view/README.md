# Necrobloom Collection Dashboard — Design Proposals

Design proposals for improving `apps/necrobloom/src/pages/Dashboard.tsx`.

---

## Root Cause Analysis

The current `Dashboard.tsx` fails users in five specific ways:

| #   | Root Cause                              | Code Evidence                                                                                 |
| --- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | **Health status truncated to 15 chars** | `healthStatus?.substring(0, 15) + "..."` — produces `"Plant appears h..."`                    |
| 2   | **No priority signals**                 | Every card renders identically regardless of health state; no ordering                        |
| 3   | **Data hidden**                         | `carePlan`, `environment`, `historicalReports[last].date` all in the API response, none shown |
| 4   | **No collection summary**               | `"12 specimens under observation"` is a count, not a status                                   |
| 5   | **Useless ID fragment**                 | `plant.id.toString().substring(0, 8)` occupies prime card real estate                         |

**Before any proposal is implemented**, the `Plant` interface in `Dashboard.tsx` must be extended to match `PlantDetail.tsx`:

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
    waterFrequency: string;
    lightNeeds: string;
    toxicity: string;
    additionalNotes: string;
  };
  environment: {
    zip: string;
    lighting: string;
  };
}
```

---

## The 5 Proposals

| Proposal                             | Name                      | Primary Goal                    | Root Causes Addressed | Complexity  |
| ------------------------------------ | ------------------------- | ------------------------------- | --------------------- | ----------- |
| [A](./proposal-a-enriched-cards.md)  | Enriched Cards            | Better card information         | #1, #3, #5            | Low         |
| [B](./proposal-b-command-center.md)  | Collection Command Center | Collection overview + filtering | All 5                 | Medium      |
| [C](./proposal-c-triage-zones.md)    | Triage Zones              | Structural priority             | #1, #2, #3, #4, #5    | Low–Medium  |
| [D](./proposal-d-dense-list-view.md) | Dense List View           | Power user density              | #1, #2, #3, #4, #5    | Medium–High |
| [E](./proposal-e-care-countdown.md)  | Care Countdown            | Care scheduling                 | #1, #2, #3, #4, #5    | Medium      |

---

## Comparative Analysis

### Root Cause Coverage

| Root Cause               |  A  |  B  |  C  |  D  |  E  |
| ------------------------ | :-: | :-: | :-: | :-: | :-: |
| #1 Health truncated      |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |
| #2 No priority signals   |  —  |  ✓  |  ✓  |  ~  |  ✓  |
| #3 Data hidden           |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |
| #4 No collection summary |  —  |  ✓  |  ~  |  ~  |  ✓  |
| #5 Useless ID            |  ✓  |  ✓  |  ✓  |  ✓  |  ✓  |

`~` = partially addressed | `—` = not addressed

### User Profile Match

| Scenario                                     | Best Proposal  |
| -------------------------------------------- | -------------- |
| "I just want the cards to be less useless"   | **A**          |
| "I want to see what's wrong immediately"     | **B** or **C** |
| "I have 20+ plants and the grid is unusable" | **D**          |
| "I want to know what needs watering today"   | **E**          |
| "First iteration, lowest risk"               | **A**          |
| "Most complete single option"                | **B**          |

### Interaction Model

| Proposal | New Interactions             | New State                    | localStorage |
| -------- | ---------------------------- | ---------------------------- | ------------ |
| A        | None                         | None                         | No           |
| B        | 4 filter clicks              | `activeFilter`               | No           |
| C        | None                         | None                         | No           |
| D        | View toggle + 4 sort columns | `view`, `sortKey`, `sortDir` | Yes          |
| E        | 1 banner filter click        | `showOnlyUrgent`             | No           |

### Mobile Suitability

| Proposal | Mobile    | Notes                                                 |
| -------- | --------- | ----------------------------------------------------- |
| A        | Excellent | Same layout as today                                  |
| B        | Good      | Stats panel stacks to 2×2 grid on mobile              |
| C        | Good      | Zone sections stack naturally                         |
| D        | Poor      | List requires ~1100px; needs separate mobile handling |
| E        | Good      | Banner and chips stack naturally                      |

### Combinability

The proposals are not mutually exclusive. Recommended stacks:

- **Minimum viable**: A alone (enriched cards, no structural changes)
- **Recommended**: A + B (enriched cards + command center)
- **Care-focused**: A + E (enriched cards + countdown)
- **Comprehensive**: A + B + E (all three, no layout conflicts)
- **Power user**: A + B + D (adds list view toggle to command center)

Proposal C conflicts with B and E structurally — zone layout replaces the flat grid, making the stats panel and banner redundant. Choose C or (B and/or E), not both.

---

## Decision Guide

### Choose A if:

- Shipping the smallest meaningful change now
- The current card layout is not a problem — only the data density is

### Choose B if:

- One proposal needs to address all root causes
- Users primarily ask "what's wrong in my collection?"
- This is the **recommended default** for a first full redesign

### Choose C if:

- Zero new interactive elements is a hard constraint
- Layout-as-triage is preferred over explicit filtering
- Accessibility is a primary concern

### Choose D if:

- A specific user segment has 20+ plants
- Sorting and comparison are explicit user requests
- Desktop-first is acceptable

### Choose E if:

- Users are asking "when do I need to water?"
- `carePlan.waterFrequency` is reliably populated for most plants
- The goal is to move Necrobloom from diagnostic to scheduling

---

## Implementation Prerequisites

All proposals share the same implementation prerequisite:

1. **Extend the `Plant` interface** in `Dashboard.tsx` to match `PlantDetail.tsx` (see type above)
2. **Import `Badge`** from `@finnminn/ui` — it exists (`packages/ui/src/components/Badge.tsx`) but is not currently imported in `Dashboard.tsx`
3. **Shared utility functions** — `deriveHealthBadge`, `firstSentence`, `daysAgo` are shared across proposals; extract them above the component if implementing multiple proposals

### Shared Utility Reference

These functions are specified in detail in Proposal A and referenced by all other proposals:

| Function                          | Defined In                                                             | Used By       |
| --------------------------------- | ---------------------------------------------------------------------- | ------------- |
| `deriveHealthBadge(healthStatus)` | [Proposal A](./proposal-a-enriched-cards.md#health-badge-logic)        | A, B, C, D    |
| `firstSentence(text)`             | [Proposal A](./proposal-a-enriched-cards.md#first-sentence-extraction) | A, B, C, D, E |
| `daysAgo(dateStr)`                | [Proposal A](./proposal-a-enriched-cards.md#days-ago)                  | A, B, C, D, E |
| `computeStats(plants)`            | [Proposal B](./proposal-b-command-center.md#stats-computation)         | B only        |
| `classifyPlant(plant)`            | [Proposal C](./proposal-c-triage-zones.md#zone-classification-logic)   | C only        |
| `computeCountdown(plant)`         | [Proposal E](./proposal-e-care-countdown.md#countdown-computation)     | E only        |

---

## Files

```
docs/design/necrobloom-collection-view/
├── README.md                          ← This file
├── proposal-a-enriched-cards.md       ← Low complexity; foundation for all others
├── proposal-b-command-center.md       ← Most complete; recommended default
├── proposal-c-triage-zones.md         ← Zero interactions; spatial triage
├── proposal-d-dense-list-view.md      ← Power users; requires most engineering
└── proposal-e-care-countdown.md       ← Care scheduling; highest user impact if carePlan data exists
```
