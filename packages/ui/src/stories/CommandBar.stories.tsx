import type { Meta, StoryObj } from "@storybook/react";
import { CommandBar } from "../components/CommandBar";

const meta: Meta<typeof CommandBar> = {
  title: "Navigation/CommandBar",
  component: CommandBar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CommandBar>;

const defaultLinks = [
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Grimoire", href: "/grimoire" },
  { label: "Artifacts", href: "/artifacts" },
  { label: "System", href: "/system" },
];

const mockUser = {
  name: "Necromancer 001",
  email: "lich.king@void.net",
  avatarUrl: "https://github.com/shadcn.png"
};

export const Guest: Story = {
  args: {
    logo: "PIXELGRIM",
    links: defaultLinks.map(l => ({ ...l, active: false })),
    user: null,
  },
};

export const LoggedIn: Story = {
  args: {
    logo: "PIXELGRIM",
    links: defaultLinks,
    user: mockUser,
  },
};

export const MobileView: Story = {
    args: {
        logo: "PIXELGRIM",
        links: defaultLinks,
        user: mockUser,
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    }
};

export const CustomLogo: Story = {
    args: {
        logo: (
            <span className="flex items-center gap-2">
                <span className="text-vampire text-3xl">☠</span>
                <span>CRYPTID</span>
            </span>
        ),
        links: defaultLinks,
        user: mockUser,
    }
}
