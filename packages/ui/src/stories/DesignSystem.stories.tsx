import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Input, Badge, Card, Terminal, Typography } from '../index';

const meta = {
  title: 'System/Overview',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllComponents: Story = {
  render: () => (
    <div className="space-y-12 max-w-4xl mx-auto bg-void p-8 min-h-screen">
      
      <section className="space-y-4">
        <Typography.H1>PixelGrim UI</Typography.H1>
        <Typography.Body>
          The official design system for the Tech-Necromancer.
          High contrast, 8-bit shadows, and diegetic interactions.
        </Typography.Body>
      </section>

      <section className="space-y-4">
        <Typography.H2>Typography</Typography.H2>
        <div className="border-2 border-text-muted/20 p-6 space-y-4">
            <Typography.H1>Header 1 (VT323)</Typography.H1>
            <Typography.H2>Header 2 (VT323)</Typography.H2>
            <Typography.Body>
              Body Text (Space Mono). The quick brown fox jumps over the lazy dog.
              0123456789. !@#$%^&*()_+.
            </Typography.Body>
        </div>
      </section>

      <section className="space-y-4">
        <Typography.H2>Buttons & Actions</Typography.H2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Vampire Kiss</Button>
          <Button variant="secondary">Ectoplasm</Button>
          <Button variant="accent">Witchcraft</Button>
          <Button variant="ghost">Ghost Mode</Button>
        </div>
      </section>

      <section className="space-y-4">
        <Typography.H2>Data Entry</Typography.H2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Enter secret code..." />
          <Input placeholder="Disabled input..." disabled className="opacity-50 cursor-not-allowed" />
        </div>
      </section>

      <section className="space-y-4">
        <Typography.H2>Badges & Status</Typography.H2>
        <div className="flex gap-4">
          <Badge variant="success">Online</Badge>
          <Badge variant="error">Critical</Badge>
          <Badge variant="info">Scanning</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <Typography.H2>Containers</Typography.H2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <Typography.H2 className="text-vampire">Standard Card</Typography.H2>
            <Typography.Body>
              A basic container for content. It lifts off the page with a hard shadow.
            </Typography.Body>
            <div className="mt-4 flex justify-end">
                <Button variant="ghost" className="text-sm px-4 py-1">Dismiss</Button>
            </div>
          </Card>

          <Terminal title="ROOT_ACCESS">
            <p className="mb-2">$ init_sequence --force</p>
            <p className="mb-2 text-text-muted">Loading modules...</p>
            <p className="mb-2 text-vampire">[ERROR] Soul not found.</p>
            <p className="animate-pulse">_</p>
          </Terminal>
        </div>
      </section>

    </div>
  ),
};
