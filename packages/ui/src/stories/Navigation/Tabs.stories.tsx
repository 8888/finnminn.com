import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, Tab } from '../../components/Tabs';
import { Typography } from '../../components/Typography';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs>
      <Tab label="Activity Log">
        <Typography.Body>All check-in entries appear here, most recent first.</Typography.Body>
      </Tab>
      <Tab label="Trend">
        <Typography.Body>Trend graph content appears here.</Typography.Body>
      </Tab>
    </Tabs>
  ),
};

export const SecondTabActive: Story = {
  render: () => (
    <Tabs defaultIndex={1}>
      <Tab label="Activity Log">
        <Typography.Body>Activity log content.</Typography.Body>
      </Tab>
      <Tab label="Trend">
        <Typography.Body>This tab is active by default.</Typography.Body>
      </Tab>
    </Tabs>
  ),
};

export const ThreeTabs: Story = {
  render: () => (
    <Tabs>
      <Tab label="Activity Log">
        <Typography.Body>Activity log tab content.</Typography.Body>
      </Tab>
      <Tab label="Trend">
        <Typography.Body>Trend graph tab content.</Typography.Body>
      </Tab>
      <Tab label="Streak">
        <Typography.Body>Streak graph tab content.</Typography.Body>
      </Tab>
    </Tabs>
  ),
};
