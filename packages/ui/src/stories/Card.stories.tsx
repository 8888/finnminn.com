import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';

const meta = {
  title: 'Containers/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'magic'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const CardContent = () => (
    <div className="space-y-4">
        <Typography.H3>Container Header</Typography.H3>
        <Typography.Body>
            This is a standard containment unit. It holds data safely within the void.
        </Typography.Body>
        <div className="flex justify-end">
            <Button variant="ghost" className="text-sm">Action</Button>
        </div>
    </div>
);

export const Default: Story = {
  args: {
    children: <CardContent />,
    variant: 'default',
    className: 'w-[400px]',
  },
};

export const Magic: Story = {
  args: {
    children: <CardContent />,
    variant: 'magic',
    className: 'w-[400px]',
  },
};
