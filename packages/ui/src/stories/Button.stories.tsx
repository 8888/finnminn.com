import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'ghost'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Cast Spell',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'System Ready',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete Soul',
    variant: 'destructive',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Dismiss',
    variant: 'ghost',
  },
};
