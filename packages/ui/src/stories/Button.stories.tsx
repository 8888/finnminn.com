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
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'ghost'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Vampire Kiss',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Ectoplasm',
    variant: 'secondary',
  },
};

export const Accent: Story = {
  args: {
    children: 'Witchcraft',
    variant: 'accent',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghostly',
    variant: 'ghost',
  },
};
