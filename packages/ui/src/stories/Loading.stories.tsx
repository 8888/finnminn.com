import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, Spinner } from '../components/Skeleton';
import { Typography } from '../components/Typography';

const meta = {
  title: 'Primitives/Loading',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;

export const Skeletons: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8 w-64">
      <div className="flex flex-col gap-2">
        <Typography.Body size="xs" variant="muted">RECT_VARIANT</Typography.Body>
        <Skeleton variant="rect" />
      </div>
      <div className="flex flex-col gap-2">
        <Typography.Body size="xs" variant="muted">CIRCLE_VARIANT</Typography.Body>
        <Skeleton variant="circle" className="w-12 h-12" />
      </div>
      <div className="flex flex-col gap-2">
        <Typography.Body size="xs" variant="muted">TEXT_VARIANT</Typography.Body>
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-3/4" />
      </div>
    </div>
  ),
};

export const SpinningOracle: StoryObj = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <Spinner className="h-8 w-8 text-witchcraft" />
      <Typography.Body className="animate-pulse">PROCESSING_DATA...</Typography.Body>
    </div>
  ),
};
