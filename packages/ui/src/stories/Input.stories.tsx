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
    name: 'command',
    id: 'command-input',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'System Locked',
    disabled: true,
    name: 'locked',
    id: 'locked-input',
  },
};

export const WithValue: Story = {
  args: {
    value: 'sudo rm -rf /',
    readOnly: true,
    name: 'readonly',
    id: 'readonly-input',
  },
};
