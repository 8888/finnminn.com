import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppLauncher } from "../components/AppLauncher";
import { AppTile } from "../components/AppTile";

const meta: Meta<typeof AppLauncher> = {
  title: "Pages/AppLauncher",
  component: AppLauncher,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AppLauncher>;

const tiles = [
    <AppTile 
        key="1"
        title="Pip Tracker" 
        description="Habit formation protocols." 
        href="#" 
        status="beta"
        variant="featured"
        icon={
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        }
    />,
    <AppTile 
        key="2"
        title="Grimoire" 
        description="Knowledge base and docs." 
        href="#" 
        status="beta"
        icon={
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
             </svg>
        }
    />,
    <AppTile 
        key="3"
        title="Admin Console" 
        description="User management & logs." 
        href="#" 
        status="online"
    />,
    <AppTile 
        key="4"
        title="N-Dimension" 
        description="Spatial visualization tools." 
        href="#" 
        status="online"
    />,
     <AppTile 
        key="5"
        title="System Settings" 
        description="Configure your void instance." 
        href="#" 
    />,
];

export const Default: Story = {
  args: {
    title: "LAUNCH_PAD",
    subtitle: (
        <pre className="text-xs leading-none text-ectoplasm font-mono whitespace-pre text-left inline-block">
{`      /\\"""/\\
     (= ^.^ =)
     / >   < \\
    (___)_(___)`}
        </pre>
    ),
    children: tiles,
    navigation: {
        user: { name: "Lee Costello", email: "lee@finnminn.com" },
        links: [
            { label: "Dashboard", href: "/dashboard", active: true },
            { label: "Settings", href: "/settings" },
        ]
    }
  },
};

export const EmptyState: Story = {
    args: {
      children: (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-text-muted/20 rounded-none">
              <span className="text-4xl mb-4">🦇</span>
              <span className="font-header text-xl text-text-muted">NO MODULES DETECTED</span>
          </div>
      ),
      navigation: {
          user: null, // Logged out state
      }
    },
  };
