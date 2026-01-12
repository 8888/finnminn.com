import type { Meta, StoryObj } from '@storybook/react-vite';
import { Terminal } from '../components/Terminal';

const meta = {
  title: 'Containers/Terminal',
  component: Terminal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'ACCESS_LOGS',
    children: (
        <div className="space-y-1 text-sm">
            <p className="text-ectoplasm"> &gt; CONNECTING TO VOID...</p>
            <p className="text-ectoplasm"> &gt; SUCCESS.</p>
            <p className="text-text-muted"> &gt; DOWNLOADING SOULS [||||||    ] 60%</p>
            <p className="animate-pulse">_</p>
        </div>
    ),
    className: 'w-[500px]',
  },
};
