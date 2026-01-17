import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppTile } from "../components/AppTile";

const meta: Meta<typeof AppTile> = {
  title: "Design System/AppTile",
  component: AppTile,
  parameters: {
    layout: "centered",
    backgrounds: { default: "void" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AppTile>;

const MockIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

export const Default: Story = {
  args: {
    title: "Habit Tracker",
    description: "Daily routine optimization protocol.",
    href: "#",
    icon: <MockIcon />,
  },
};

export const WithStatus: Story = {
  args: {
    title: "System Admin",
    description: "Core configuration and logs.",
    href: "#",
    status: "online",
    variant: "default",
  },
};

export const Featured: Story = {
  args: {
    title: "Grimoire (Beta)",
    description: "Spellbook management and experimentation.",
    href: "#",
    variant: "featured",
    status: "beta",
    icon: <MockIcon />,
  },
};

export const Maintenance: Story = {
  args: {
    title: "Legacy Vault",
    description: "Archived data storage.",
    href: "#",
    status: "maintenance",
  },
};
