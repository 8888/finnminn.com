import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../components/Input';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter Command...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'System Locked',
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    value: 'sudo rm -rf /',
    readOnly: true,
  },
};
