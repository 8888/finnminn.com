import type { Meta, StoryObj } from '@storybook/react';
import { Image } from '../components/Image';

const meta: Meta<typeof Image> = {
  title: 'Design System/Image',
  component: Image,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A diegetic image component that treats visual media as captured artifacts or raw data streams. Features a "glitch" hover effect that splits RGB channels (simulated).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['raw', 'artifact'],
      description: 'The visual wrapper style.',
    },
    size: {
      control: 'radio',
      options: ['thumbnail', 'full'],
      description: 'The size preset.',
    },
    caption: {
      control: 'text',
      description: 'Caption text (only visible in "artifact" variant).',
    },
    disableGlitch: {
      control: 'boolean',
      description: 'Disables the RGB shift effect on hover.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

const FINN_IMAGE = "/finn.jpg";

export const Raw: Story = {
  args: {
    src: FINN_IMAGE,
    alt: 'Finn the Cat',
    variant: 'raw',
    size: 'full',
  },
};

export const Artifact: Story = {
  args: {
    src: FINN_IMAGE,
    alt: 'Finn the Cat',
    variant: 'artifact',
    caption: 'Fig 1. Specimen "Finn"',
    size: 'full',
  },
};

export const Thumbnail: Story = {
  args: {
    src: FINN_IMAGE,
    alt: 'Finn Avatar',
    variant: 'raw',
    size: 'thumbnail',
  },
};

export const ThumbnailArtifact: Story = {
  args: {
    src: FINN_IMAGE,
    alt: 'Finn Evidence',
    variant: 'artifact',
    size: 'thumbnail',
    caption: 'ID: 001',
  },
};
