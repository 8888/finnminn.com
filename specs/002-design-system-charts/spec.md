# Feature Specification: Design System Charts & Graphs

**Feature Branch**: `002-design-system-charts`
**Created**: 2026-03-24
**Status**: Draft
**Input**: User description: "The pip app uses some custom ascii charts to display data, but it is very hard to read and doesn't provide information in a useful and intuitive way. We need to add chart and graph capabilities to our design system so we can implement these in our apps. They should be general to allow reuse across all of finnminn but then applied in pip for our first usage"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Habit Trend as a Clear Bar Chart (Priority: P1)

A pip user wants to understand how frequently they've completed a habit over time. Today the bar chart is barely readable — bars are so small and unlabeled that users can't extract meaning. With this feature, the user views a well-proportioned bar chart with clear scale and hover tooltips that show the exact count and date for each bar.

**Why this priority**: This is the most-used data view in pip. Improving it directly addresses the stated problem of data being hard to read and provides immediate user value without requiring any other component.

**Independent Test**: Can be tested by navigating to a ritual's detail page in pip and verifying the trend tab shows a readable bar chart with hover tooltips. Delivers standalone value as "I can now understand my habit frequency at a glance."

**Acceptance Scenarios**:

1. **Given** a user views a ritual's trend tab, **When** the chart loads with data, **Then** bars are proportionally scaled so the highest-value day fills the chart height and shorter days are clearly visible in comparison
2. **Given** a bar chart is displayed, **When** the user hovers over a bar, **Then** a tooltip appears showing the exact date and check-in count for that day
3. **Given** a bar chart with a day that has zero check-ins, **When** the chart renders, **Then** zero-value days are visually distinguishable from days with data (not invisible)
4. **Given** the chart is displayed on a narrow screen, **When** there are more bars than fit horizontally, **Then** the chart scrolls horizontally without breaking layout
5. **Given** no data exists for the selected time range, **When** the chart renders, **Then** an empty state message is shown rather than a blank area

---

### User Story 2 - View Streak Progression as a Clear Line Chart (Priority: P2)

A pip user wants to see how their consecutive-day streak has grown or declined over time. The line chart should clearly show momentum — whether the streak is climbing, plateauing, or recently broke. Data points should be individually inspectable via hover.

**Why this priority**: Streak progression is a key motivational signal for habit tracking. Without a clear trend line, users can't identify momentum or breaking points in their habits. Builds on the bar chart foundation.

**Independent Test**: Can be tested by navigating to a ritual's streak tab in pip and verifying the line chart shows connected data points with tooltips. Delivers standalone value as "I can now see whether my habit streak is growing."

**Acceptance Scenarios**:

1. **Given** a user views a ritual's streak tab, **When** the chart loads with data, **Then** a line connects data points in chronological order showing streak values over time
2. **Given** a line chart is displayed, **When** the user hovers over a data point, **Then** a tooltip shows the exact date and streak count
3. **Given** a streak of zero followed by a new streak, **When** the chart renders, **Then** the zero value is shown correctly and the line visibly resets, not hidden or skipped
4. **Given** only one data point exists, **When** the chart renders, **Then** a single point is shown without attempting to draw a line

---

### User Story 3 - Developers Reuse Chart Components Across All Apps (Priority: P3)

A developer working on any finnminn app (pip, necrobloom, web) can import and use chart components from the shared `@finnminn/ui` package without copying or reimplementing chart logic. The components accept generic data (arrays of label/value pairs) and handle rendering consistently with the PixelGrim aesthetic.

**Why this priority**: Without abstraction into the shared design system, each new app or feature that needs charts will duplicate code and diverge in appearance. This is a quality-of-life improvement for developers, important for long-term maintainability.

**Independent Test**: Can be tested by importing a chart component into necrobloom or the web app with arbitrary data and verifying it renders correctly. Delivers standalone value as "Any finnminn app can show charts without writing custom visualization code."

**Acceptance Scenarios**:

1. **Given** a developer imports a chart component from `@finnminn/ui`, **When** they pass an array of labeled numeric values, **Then** the chart renders correctly without requiring app-specific styling
2. **Given** a chart component from `@finnminn/ui`, **When** it is viewed in Storybook, **Then** interactive examples show all supported variants and configurations
3. **Given** pip's existing ritual trend and streak charts, **When** they are migrated to use shared components, **Then** their visual output is equivalent or improved with no regression in pip's functionality
4. **Given** a chart component, **When** its color or size props are omitted, **Then** it renders with sensible PixelGrim defaults without requiring explicit configuration

---

### User Story 4 - Progress Bar Component Available in Design System (Priority: P4)

The pip app has a custom "vitality bar" (horizontal progress bar) that shows a habit's overall completion rate. This pattern — showing a percentage or ratio as a filled bar — is broadly useful across finnminn apps. A reusable progress bar component should be available in the shared design system.

**Why this priority**: Lower priority than the primary chart types since progress bars are simpler and already functional in pip. Included to ensure the design system is comprehensive for data display.

**Independent Test**: Can be tested in Storybook by rendering a progress bar at various fill percentages (0%, 50%, 100%) and verifying the bar fills proportionally. Delivers standalone value as "Any app can show a completion percentage or ratio with a styled progress bar."

**Acceptance Scenarios**:

1. **Given** a progress bar component with a value of 75%, **When** it renders, **Then** the filled portion covers exactly 75% of the bar's width
2. **Given** a progress bar at 0%, **When** it renders, **Then** the empty state is visually clear (not an invisible bar)
3. **Given** a progress bar at 100%, **When** it renders, **Then** the bar is fully filled with no overflow

---

### Edge Cases

- What happens when all data values are zero? (Chart should render an empty state or flat zero line, not divide-by-zero or show nothing)
- What happens when the dataset contains only one data point? (Line chart should show a single point; bar chart should show a single bar)
- What happens when a chart receives an extremely large dataset (500+ points)? (Chart should remain responsive — scroll or aggregate, not freeze)
- What happens when a data label is very long? (Labels should truncate, not break the chart layout)
- What happens when a value is negative? (Chart should handle gracefully — document whether negative values are supported; assumed out of scope for this release)

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The design system MUST provide a bar chart component that accepts one or more named data series and renders proportionally-scaled vertical bars, supporting both single-series and multi-series grouped layouts; when multiple series are provided, a legend MUST be rendered identifying each series by name and color
- **FR-002**: The design system MUST provide a line chart component that accepts an ordered series of labeled numeric values and renders a connected line through the data points
- **FR-003**: The design system MUST provide a progress bar component that accepts a numeric value between 0 and 100 (or a ratio) and renders a filled horizontal bar
- **FR-004**: All chart components MUST display a tooltip when a user hovers over (or taps) a data point or bar; for single-series charts the tooltip shows the label and value for that point; for multi-series grouped bar charts the tooltip shows the label and all series values for the hovered cluster
- **FR-005**: All chart components MUST render an empty state when given no data or an empty data array
- **FR-006**: All chart components MUST render consistently with the PixelGrim design system (color tokens, border style, shadow style) without requiring custom styling from the consuming app
- **FR-007**: All chart components MUST be exported from `@finnminn/ui` and importable in any finnminn app
- **FR-008**: All chart components MUST have Storybook stories demonstrating their variants and interactive states
- **FR-009**: The pip app's existing ritual trend graph MUST be migrated to use the shared bar chart component with no regression in functionality
- **FR-010**: The pip app's existing ritual streak graph MUST be migrated to use the shared line chart component with no regression in functionality
- **FR-013**: The pip app's existing OracleTrends dual-ritual comparison view MUST be migrated to use the shared multi-series bar chart component with no regression in functionality; any pip-specific supplementary text (e.g., the "magic insight" summary) remains outside the shared component and is rendered by pip
- **FR-014**: The pip app's existing VitalityBar MUST be migrated to use the shared ProgressBar component with no regression in functionality
- **FR-011**: Bar and line chart components MUST support a time-range filter (7 days, 30 days, 90 days, all time) when used with time-series data
- **FR-012**: The bar chart component MUST support horizontal scrolling when the dataset exceeds the available display width

### Key Entities

- **ChartDataPoint**: A single item in a chart dataset — a human-readable label (typically a date or category name) and a numeric value
- **ChartDataSeries**: An ordered collection of ChartDataPoints representing one data series to be visualized
- **TimeRange**: A filter that scopes a time-series chart to the last 7 days, last 30 days, or all available data
- **BarChart**: A component that renders one or more named ChartDataSeries as proportionally-scaled vertical bars; when multiple series are provided, bars for each series are grouped per category
- **LineChart**: A component that renders a ChartDataSeries as a connected line through sequentially ordered data points
- **ProgressBar**: A component that represents a single percentage or ratio value as a filled horizontal bar

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can identify the highest and lowest activity days on the ritual trend chart without counting or estimating — the visual difference between bars is immediately perceptible
- **SC-002**: Users can read the exact value of any data point by hovering or tapping it within one interaction (no drilling down or secondary navigation required)
- **SC-003**: Developers can add a chart to any finnminn app by importing from `@finnminn/ui` and passing a data array — no additional chart-specific dependencies or custom CSS required
- **SC-004**: All chart components have Storybook coverage for at least: empty state, single data point, typical dataset, and large dataset
- **SC-005**: Pip's ritual detail page shows identical data in the new shared chart components as it did in the previous custom implementation — zero data regressions
- **SC-006**: Charts remain readable and interactive on screens as narrow as 375px wide

## Assumptions

- Open source charting libraries are permitted and may be adopted if they improve quality or reduce implementation burden while preserving the PixelGrim aesthetic
- Negative values in datasets are out of scope for this feature — all current pip data (check-in counts, streak lengths, completion rates) is non-negative
- Accessibility enhancements (keyboard navigation, screen reader support for chart data) are desirable but not blocking for this release
- All visualization use cases currently live in pip are in scope for migration: RitualTrendGraph (bar chart), RitualStreakGraph (line chart), OracleTrends (multi-series bar chart comparing two rituals), and VitalityBar (progress bar)

## Clarifications

### Session 2026-03-24

- Q: Are open source third-party charting libraries permitted? → A: Yes, open source packages are welcome
- Q: Is multi-series chart support in scope? → A: Yes — the BarChart component must support multiple series; single-series only is not an acceptable constraint
- Q: Is the OracleTrends dual-ritual comparison view in scope for this feature? → A: Yes — all use cases currently live in pip must be supported, including OracleTrends
- Q: For multi-series charts, how should series be identified to the user? → A: Color + legend — each series gets a distinct PixelGrim color and a named label rendered statically near the chart
- Q: Should the OracleTrends "magic insight" summary text be part of the shared BarChart component? → A: No — BarChart renders the chart only; pip-specific insight text is the consuming app's responsibility
- Q: In a multi-series grouped bar chart, what should hovering show in the tooltip? → A: Combined tooltip per cluster — hovering anywhere in a day's group shows all series values for that date
