import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "../components/ProgressBar";

const meta = {
  title: "Primitives/ProgressBar",
  component: ProgressBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    color: {
      control: "select",
      options: ["witchcraft", "ectoplasm", "vampire", "gold", "pip", "toxic"],
    },
    showValue: { control: "boolean" },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { value: 0 },
};

export const Quarter: Story = {
  args: { value: 25 },
};

export const Half: Story = {
  args: { value: 50 },
};

export const ThreeQuarters: Story = {
  args: { value: 75 },
};

export const Full: Story = {
  args: { value: 100 },
};

export const WithLabel: Story = {
  args: { value: 75, label: "VITALITY" },
};

export const WithValue: Story = {
  args: { value: 68, showValue: true, label: "PROGRESS" },
};

export const ColorEctoplasm: Story = {
  args: { value: 60, color: "ectoplasm", label: "HEALTH" },
};

export const ColorVampire: Story = {
  args: { value: 45, color: "vampire", label: "DANGER" },
};
