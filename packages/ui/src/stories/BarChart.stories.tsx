import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "../components/BarChart";
import type { ChartDataSeries, TimeRange } from "../components/BarChart";
import { useState } from "react";

const meta = {
  title: "Primitives/BarChart",
  component: BarChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const singleSeries: ChartDataSeries[] = [
  {
    name: "Check-ins",
    data: [
      { label: "Mar 18", value: 3 },
      { label: "Mar 19", value: 1 },
      { label: "Mar 20", value: 5 },
      { label: "Mar 21", value: 2 },
      { label: "Mar 22", value: 4 },
      { label: "Mar 23", value: 0 },
      { label: "Mar 24", value: 6 },
    ],
  },
];

export const SingleSeries: Story = {
  args: {
    series: singleSeries,
  },
};

export const EmptyState: Story = {
  args: {
    series: [{ name: "Check-ins", data: [] }],
    emptyMessage: "No check-ins recorded yet.",
  },
};

export const SingleDataPoint: Story = {
  args: {
    series: [
      {
        name: "Check-ins",
        data: [{ label: "Mar 24", value: 3 }],
      },
    ],
  },
};

const largeSeries: ChartDataSeries[] = [
  {
    name: "Check-ins",
    data: Array.from({ length: 30 }, (_, i) => ({
      label: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 10),
    })),
  },
];

export const LargeDataset: Story = {
  args: {
    series: largeSeries,
  },
};

const multiSeries: ChartDataSeries[] = [
  {
    name: "Morning Ritual",
    color: "ectoplasm",
    data: [
      { label: "Mar 18", value: 1 },
      { label: "Mar 19", value: 0 },
      { label: "Mar 20", value: 1 },
      { label: "Mar 21", value: 1 },
      { label: "Mar 22", value: 0 },
    ],
  },
  {
    name: "Evening Ritual",
    color: "vampire",
    data: [
      { label: "Mar 18", value: 1 },
      { label: "Mar 19", value: 1 },
      { label: "Mar 20", value: 0 },
      { label: "Mar 21", value: 1 },
      { label: "Mar 22", value: 1 },
    ],
  },
];

export const MultiSeries: Story = {
  args: {
    series: multiSeries,
  },
};

export const WithTimeRangeSelector: Story = {
  args: {
    series: singleSeries,
    timeRange: "30d",
  },
  render: (args) => {
    const [range, setRange] = useState<TimeRange>(args.timeRange ?? "30d");
    return (
      <BarChart
        {...args}
        timeRange={range}
        onTimeRangeChange={setRange}
      />
    );
  },
};

export const NarrowContainer: Story = {
  args: {
    series: largeSeries,
  },
  render: (args) => (
    <div style={{ width: 375 }}>
      <BarChart {...args} />
    </div>
  ),
};
