import type { Meta, StoryObj } from "@storybook/react-vite";
import { LineChart } from "../components/LineChart";
import type { ChartDataSeries, TimeRange } from "../components/BarChart";
import { useState } from "react";

const meta = {
  title: "Primitives/LineChart",
  component: LineChart,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const typicalSeries: ChartDataSeries = {
  name: "Streak",
  data: [
    { label: "Mar 18", value: 3 },
    { label: "Mar 19", value: 4 },
    { label: "Mar 20", value: 5 },
    { label: "Mar 21", value: 0 },
    { label: "Mar 22", value: 1 },
    { label: "Mar 23", value: 2 },
    { label: "Mar 24", value: 3 },
  ],
};

export const Typical: Story = {
  args: {
    series: typicalSeries,
  },
};

export const EmptyState: Story = {
  args: {
    series: { name: "Streak", data: [] },
    emptyMessage: "No streak data available.",
  },
};

export const SingleDataPoint: Story = {
  args: {
    series: {
      name: "Streak",
      data: [{ label: "Mar 24", value: 5 }],
    },
  },
};

export const WithZeroValues: Story = {
  args: {
    series: {
      name: "Streak",
      data: [
        { label: "Mar 18", value: 3 },
        { label: "Mar 19", value: 0 },
        { label: "Mar 20", value: 0 },
        { label: "Mar 21", value: 1 },
        { label: "Mar 22", value: 2 },
      ],
    },
  },
};

const largeSeries: ChartDataSeries = {
  name: "Streak",
  data: Array.from({ length: 60 }, (_, i) => ({
    label: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 15),
  })),
};

export const LargeDataset: Story = {
  args: {
    series: largeSeries,
  },
};

export const WithTimeRangeSelector: Story = {
  args: {
    series: typicalSeries,
    timeRange: "30d",
  },
  render: (args) => {
    const [range, setRange] = useState<TimeRange>(args.timeRange ?? "30d");
    return (
      <LineChart
        {...args}
        timeRange={range}
        onTimeRangeChange={setRange}
      />
    );
  },
};
