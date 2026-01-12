import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    children: 'System Normal',
    variant: 'info',
  },
};

export const Success: Story = {
  args: {
    children: 'Connected',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Unstable',
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    children: 'Breach Detected',
    variant: 'error',
  },
};
