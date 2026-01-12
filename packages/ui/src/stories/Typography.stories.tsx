import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../components/Typography';

// Create a wrapper component for the story since Typography is an object
const TypographyWrapper = () => (
    <div className="space-y-6">
        <div>
            <Typography.Body className="text-text-muted text-xs mb-1">Header 1 (VT323)</Typography.Body>
            <Typography.H1>The Quick Brown Fox</Typography.H1>
        </div>
        <div>
            <Typography.Body className="text-text-muted text-xs mb-1">Header 2 (VT323)</Typography.Body>
            <Typography.H2>Jumps Over The Lazy Dog</Typography.H2>
        </div>
        <div>
            <Typography.Body className="text-text-muted text-xs mb-1">Header 3 (VT323)</Typography.Body>
            <Typography.H3>0123456789</Typography.H3>
        </div>
        <div>
            <Typography.Body className="text-text-muted text-xs mb-1">Body (Space Mono)</Typography.Body>
            <Typography.Body>
                PixelGrim text bodies are legible, monospaced, and slightly tinted to reduce eye strain in the void.
            </Typography.Body>
        </div>
    </div>
);

const meta = {
  title: 'Primitives/Typography',
  component: TypographyWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TypographyWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
