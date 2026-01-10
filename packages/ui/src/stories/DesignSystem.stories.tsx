import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Input, Badge, Card, Terminal, Typography, Image } from '../index';

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
    <div className="relative min-h-screen w-full overflow-hidden bg-magic-void p-8 text-text-body">
      
      {/* Fireflies Container */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
        <div className="firefly"></div>
      </div>

      <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
        <section className="space-y-4 text-center">
          <Typography.H1>PixelGrim UI</Typography.H1>
          <Typography.Body>
            The official design system for the <span className="text-witchcraft glow-witchcraft">Tech-Necromancer</span>.
            <br/>High contrast, 8-bit shadows, and diegetic interactions.
          </Typography.Body>
        </section>

        <section className="space-y-4">
          <Typography.H2>Typography</Typography.H2>
          <div className="border-2 border-text-muted/20 bg-surface/80 backdrop-blur-sm p-6 space-y-4">
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
          <Button variant="primary">Cast Spell (Primary)</Button>
          <Button variant="secondary">Confirm (Secondary)</Button>
          <Button variant="destructive">Destroy (Danger)</Button>
          <Button variant="ghost">Dismiss (Ghost)</Button>
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
        <Typography.H2>Artifacts & Evidence</Typography.H2>
        <div className="flex flex-wrap items-end gap-8">
          <Image src="/finn.jpg" alt="Finn Avatar" size="thumbnail" variant="raw" />
          <Image src="/finn.jpg" alt="Finn Evidence" size="thumbnail" variant="artifact" caption="ID: 001" />
          <div className="w-64">
             <Image src="/finn.jpg" alt="Specimen Finn" size="full" variant="artifact" caption="Fig 1. Specimen 'Finn'" />
          </div>
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

          <Card variant="magic">
            <Typography.H2 className="text-witchcraft">Magic Card</Typography.H2>
            <Typography.Body>
              Imbued with <span className="text-witchcraft">Witchcraft</span>. 
              Use for special items or legendary loot.
            </Typography.Body>
            <div className="mt-4 flex justify-end">
                <Button variant="primary" className="text-sm px-4 py-1">Cast Spell</Button>
            </div>
          </Card>

          <Terminal title="ROOT_ACCESS" className="md:col-span-2">
            <p className="mb-2">$ init_sequence --force</p>
            <p className="mb-2 text-text-muted">Loading modules...</p>
            <p className="mb-2 text-vampire">[ERROR] Soul not found.</p>
            <p className="animate-pulse">_</p>
          </Terminal>
        </div>
      </section>

      </div>
    </div>
  ),
};
