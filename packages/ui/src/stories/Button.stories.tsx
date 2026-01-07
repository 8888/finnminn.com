import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../index';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    className: { control: 'text' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Click Me',
  },
};

export const CustomClass: Story = {
  args: {
    children: 'Custom Style',
    className: 'bg-toxic text-void hover:text-toxic',
  },
};
