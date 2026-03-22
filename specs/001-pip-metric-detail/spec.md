# Feature Specification: Pip Metric Detail View

**Feature Branch**: `001-pip-metric-detail`
**Created**: 2026-03-21
**Status**: Draft
**Input**: User description: "Add a detailed view for our pip tracker metrics. I want to be able to see a detailed log of when each metric was recorded, a much more detailed graph that shows the trend of metrics. You should also be able to view a line graph of a streak of specific metrics. a single day is a value of 1. the second day in a row is 2, the third is 3,"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Metric Activity Log (Priority: P1)

A user wants to see the full historical record of when a specific habit metric was recorded. They navigate to the detail view for a metric and see a chronological log of every entry — including the exact date and time each instance was recorded. This gives users transparency into their tracking history and helps them identify patterns (e.g. time of day they tend to complete habits).

**Why this priority**: The activity log is the foundational data for all other views. Without it, users cannot verify their history or trust the graphs. It delivers immediate value as a standalone feature.

**Independent Test**: Can be fully tested by navigating to a metric's detail view, verifying that all past recorded entries appear in a list ordered by date/time, and confirming each entry shows its timestamp.

**Acceptance Scenarios**:

1. **Given** a metric with recorded entries, **When** the user opens the detail view for that metric, **Then** they see a chronological list of all entries, each showing the date and time it was recorded.
2. **Given** a metric with no recorded entries, **When** the user opens the detail view, **Then** they see a clear empty state message indicating no history exists yet.
3. **Given** the activity log is displayed with many entries, **When** the user scrolls through them, **Then** all entries load without losing context or requiring a full page reload.

---

### User Story 2 - View Metric Trend Graph (Priority: P2)

A user wants to see a detailed visual representation of how a metric has been tracked over time. On the detail view, they view a graph showing metric recording activity plotted by date, allowing them to spot trends, gaps in tracking, and periods of high or low activity.

**Why this priority**: The trend graph transforms raw log data into insight. Users gain the ability to understand the _shape_ of their habits over time — not just the raw list. Builds on the activity log data (P1).

**Independent Test**: Can be fully tested by viewing a metric with at least two recorded entries and confirming a graph renders with each data point plotted at the correct date, with the ability to navigate across different time ranges.

**Acceptance Scenarios**:

1. **Given** a metric with multiple entries across different dates, **When** the user views the trend graph, **Then** each entry appears as a data point plotted on the correct date.
2. **Given** the trend graph is displayed, **When** the user selects a different time range (e.g. last 7 days, last 30 days, all time), **Then** the graph updates to show only data within that range.
3. **Given** a metric with only one recorded entry, **When** the user views the trend graph, **Then** a single data point is shown with a helpful message that more data is needed to show a trend.
4. **Given** a gap exists between recorded entries, **When** the user views the graph, **Then** the gap is visually represented — no values are assumed for untracked days.

---

### User Story 3 - View Metric Streak Graph (Priority: P3)

A user wants to see a visual representation of their consecutive-day streaks for a specific metric over time. The streak value for any given day equals the number of consecutive calendar days (including that day) on which the metric was recorded without a break. A single tracked day has a streak value of 1; two days in a row yields 2 on the second day; three in a row yields 3 on the third; and so on. The user views a line graph with date on the horizontal axis and streak count on the vertical axis.

**Why this priority**: Streak visualisation motivates users by surfacing momentum and highlighting when streaks were broken. It builds on both the log (P1) and trend concept (P2), adding a motivational insight layer.

**Independent Test**: Can be fully tested by recording a metric on consecutive days, viewing the streak graph, and verifying the plotted values increment correctly each day and reset to 1 after a missed day.

**Acceptance Scenarios**:

1. **Given** a metric recorded on three consecutive days, **When** the user views the streak graph, **Then** the three days show streak values of 1, 2, and 3 respectively.
2. **Given** a streak is broken by a missed day, **When** the user views the streak graph, **Then** the value resets to 1 on the next recorded day after the break.
3. **Given** a metric with no recorded entries, **When** the user views the streak graph, **Then** an empty state is displayed explaining that streaks will appear once tracking begins.
4. **Given** the streak graph is displayed, **When** the user hovers over or taps a data point, **Then** they see the exact streak value and the corresponding date.

---

### Edge Cases

- Multiple check-ins on the same day: the trend graph shows the count (e.g., 2 if checked in twice). For streak purposes, any number of check-ins on a day still counts as one consecutive day (FR-013). Currently the input only allows one check-in per day, so this is a forward-compatibility concern.
- How does the system handle a user with hundreds or thousands of entries in their activity log — does it paginate, lazy-load, or truncate?
- What happens if the user's device timezone differs from where entries were originally recorded?
- How are entries displayed if two were recorded at the exact same timestamp?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a dedicated detail view accessible from a metric's existing summary or list view. The detail view MUST present the activity log, trend graph, and streak graph as three distinct tabs within a single screen.
- **FR-002**: System MUST display a complete, time-ordered activity log of all recorded entries for a given metric, showing date and time for each entry. The activity log is read-only — entry deletion and editing are out of scope for this feature.
- **FR-003**: Activity log MUST default to most-recent-first ordering.
- **FR-004**: System MUST display a trend graph showing the count of check-ins per calendar day plotted over time. The graph must support counts greater than 1 per day to remain compatible with future multi-check-in input methods.
- **FR-005**: Trend graph MUST support at least three selectable time ranges: last 7 days, last 30 days, and all time. The streak graph MUST have its own independent time range selector with the same options. Selections on one graph do not affect the other.
- **FR-006**: Trend graph MUST visually represent gaps where the metric was not recorded — no values may be interpolated for untracked days.
- **FR-007**: System MUST display a streak graph for each metric, where a streak value equals the number of consecutive calendar days the metric has been recorded including that day.
- **FR-008**: Streak values MUST reset to 1 on the first recorded day following any gap (missed day).
- **FR-009**: Streak graph MUST use a line graph format with date on the horizontal axis and streak count on the vertical axis.
- **FR-010**: Graphs MUST support interaction (tap or hover) to reveal the exact value and date for any data point.
- **FR-011**: Activity log MUST handle large datasets without degrading usability (pagination or progressive loading).
- **FR-012**: All views within the detail screen MUST display a clear empty state when no data exists for the selected metric.
- **FR-013**: Recording a metric multiple times on the same calendar day counts as one day for streak calculation purposes.

### Key Entities

- **Metric**: A trackable habit or behaviour in the pip app. Has a name and is associated with many recorded entries.
- **Metric Entry**: A single binary check-in recording that a habit was completed. Has a timestamp (date and time) and belongs to one metric. Stores no numeric value.
- **Streak**: A derived value calculated from consecutive daily entries for a metric. A streak of N means the metric was recorded on N consecutive calendar days up to and including the reference day.
- **Time Range**: A user-selected window (last 7 days, last 30 days, all time) used to filter graph displays.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can navigate to a metric's detail view and see their full entry history within 2 seconds of opening the view.
- **SC-002**: Streak values displayed in the streak graph are 100% accurate relative to the recorded entry history — zero calculation errors.
- **SC-003**: Users can switch between time range filters on the trend graph and see the graph update without a full page reload.
- **SC-004**: The activity log correctly displays all recorded entries with no missing or duplicated records.
- **SC-005**: 90% of users who view a metric detail page can correctly identify their current streak without additional instruction.
- **SC-006**: Users can visually identify periods of consistent tracking versus gaps from the trend graph without needing to read the activity log.

## Assumptions

- A "day" for streak purposes is defined as a calendar day in the user's local timezone.
- Recording a metric multiple times on the same calendar day counts as one day for streak calculation — the streak does not increment multiple times within a single day.
- The detail view is per-metric — users navigate to it from an existing metric list or summary view.
- Metric entries are binary check-ins — they record presence (the habit was done) with a timestamp. No numeric value is stored.
- The current input method only allows one check-in per metric per day (checkbox). Trend graph values will therefore be 0 or 1 today. A future feature will extend the input to support multiple check-ins per day; this detail view's trend graph must be designed to accommodate counts > 1 without rework.
- The pip app already has a working metrics list or summary view from which this detail view will be accessed.

## Clarifications

### Session 2026-03-21

- Q: Do pip metrics record a numeric value (e.g., count, duration) or are they binary check-ins? → A: Binary — metrics are check-ins (did it or didn't). Trend graph shows frequency/presence per day.
- Q: When multiple check-ins exist on the same day, how does the trend graph represent that day? → A: Count — the trend graph plots number of check-ins per day. Currently the input method only allows one check-in per day (checkbox), so values will be 0 or 1 for now. The trend graph design must support counts > 1 to remain compatible when multi-check-in input is added in a future feature.
- Q: How are the activity log, trend graph, and streak graph presented on the detail screen? → A: Tabs — each view (activity log, trend graph, streak graph) is on its own tab within the metric detail view.
- Q: Does the time range filter on the trend graph also apply to the streak graph? → A: Independent — each graph tab has its own time range selector.
- Q: Can users delete individual entries from the activity log? → A: No — the activity log is read-only in this feature. Entry deletion is out of scope.
