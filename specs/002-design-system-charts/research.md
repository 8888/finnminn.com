# Research: Design System Charts & Graphs

**Feature**: 002-design-system-charts
**Date**: 2026-03-24

## R1: Charting Library Selection

### Decision: Recharts (v3.x)

### Rationale

Recharts is the best fit for the PixelGrim design system's requirements:

1. **Grouped bar charts are native** — multiple `<Bar>` components inside `<BarChart>` auto-group by category, directly satisfying FR-001 and the OracleTrends multi-series use case.
2. **Custom tooltips are trivial** — `<Tooltip content={<PixelGrimTooltip />} />` accepts any React component. PixelGrim styling (bg-void, border-2, shadow-pixel, VT323 font) applies directly.
3. **Sharp corners by default** — bars render with `radius={0}`. No fighting the library's aesthetic.
4. **SVG-based** — every element is a real DOM node, targetable with CSS classes or inline styles. `drop-shadow(4px 4px 0px black)` on bars is straightforward.
5. **TypeScript-native since v3** — best type quality among the high-level options.
6. **Actively maintained** — v3.8.0 released March 2026, consistent monthly releases.
7. **14M+ weekly npm downloads** — largest community, most answers to problems.
8. **Implementation velocity** — a PixelGrim bar chart requires ~30-50 lines with Recharts vs ~100-200 with visx.

### Alternatives Considered

| Library           | Bundle Size (gzip) | Grouped Bars         | Custom Tooltips      | PixelGrim Fit                | Verdict                      |
| ----------------- | ------------------ | -------------------- | -------------------- | ---------------------------- | ---------------------------- |
| **Recharts**      | ~170-200 KB        | Native               | Full React component | Excellent                    | **Selected**                 |
| **visx** (Airbnb) | ~30-50 KB          | Via BarGroup         | Full React component | Perfect (but 2-3x more code) | Best bundle, too much effort |
| **Victory**       | ~150 KB            | Via VictoryGroup     | Via labelComponent   | Viable but verbose           | Declining maintenance        |
| **Nivo**          | ~160-200 KB        | Native (`groupMode`) | Full React component | Fights default aesthetic     | Heavier, weaker TypeScript   |
| **uPlot**         | ~25 KB             | No                   | Manual DOM           | Poor (Canvas-based, no CSS)  | Wrong tool                   |

### Tradeoff Acknowledged

Recharts (~170-200 KB gzipped) is larger than visx (~30-50 KB). For these SPAs where charting code loads once, this is acceptable. If bundle size becomes a hard constraint in the future, a migration to visx primitives is possible since the component API we're designing is library-agnostic to consumers.

---

## R2: PixelGrim Styling Strategy for Recharts

### Decision: Wrapper components with CSS custom properties + custom shape/tooltip components

### Approach

1. **Colors**: Pass PixelGrim color values directly via `fill` and `stroke` props. Reference Tailwind CSS custom properties (`var(--color-witchcraft)`) for runtime theming.
2. **Shadows**: Apply `filter: drop-shadow(4px 4px 0px #000000)` to SVG bar groups via a custom `<Bar shape={<PixelBar />} />` component.
3. **Borders**: Recharts bars are SVG `<rect>` elements. Apply `stroke` and `strokeWidth` for the border-2 effect.
4. **Tooltips**: Custom `<ChartTooltip>` component using PixelGrim Card-like styling (bg-void, border-2 border-overlay, shadow-pixel, Typography components for text).
5. **Legend**: Custom `<ChartLegend>` component using Typography.Body + Badge-style color swatches.
6. **Responsive**: Recharts' `<ResponsiveContainer>` handles container resizing natively.
7. **Empty state**: Conditional render — if data is empty, show a PixelGrim-styled empty state message instead of the chart.

---

## R3: Multi-Series Color Palette

### Decision: Ordered PixelGrim color cycle

When multiple series are rendered and the consumer does not specify colors, assign from this default cycle:

1. `ectoplasm` (#05FFA1) — primary series
2. `vampire` (#FF5A8D) — secondary series (matches current OracleTrends)
3. `witchcraft` (#A890FF) — tertiary
4. `gold` (#FFB800) — quaternary
5. `pip` (#58a6ff) — quinary
6. `toxic` (#00FF41) — sixth

This order preserves backward compatibility with OracleTrends (ectoplasm + vampire) and provides enough distinct colors for reasonable multi-series use cases.

---

## R4: Time Range Filter Pattern

### Decision: Controlled component with callback prop

The BarChart and LineChart components accept `timeRange` and `onTimeRangeChange` props. The chart renders a built-in range selector (7d | 30d | all) above the chart area. Data filtering is the consumer's responsibility — the chart fires `onTimeRangeChange` and the consumer provides filtered data on the next render.

This keeps the chart components pure (they render what they receive) while providing the time-range UI consistently across all chart instances.

---

## R5: Component Organization

### Decision: Flat component files with internal helpers

All chart components live as top-level files in `packages/ui/src/components/`:

- `BarChart.tsx` — exported
- `LineChart.tsx` — exported
- `ProgressBar.tsx` — exported
- `ChartTooltip.tsx` — internal (not exported from index.tsx)
- `ChartLegend.tsx` — internal (not exported from index.tsx)
- `chartColors.ts` — internal (color palette utility)

This follows the existing pattern where each component is a single file in `src/components/`.
