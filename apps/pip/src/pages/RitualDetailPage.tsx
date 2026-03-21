import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Skeleton, Tabs, Tab } from '@finnminn/ui';
import { useRitualManager } from '../hooks/useRitualManager';
import { useRitualDetail } from '../hooks/useRitualDetail';
import { RitualActivityLog } from '../components/habits/RitualActivityLog';
import { RitualTrendGraph } from '../components/habits/RitualTrendGraph';
import { RitualStreakGraph } from '../components/habits/RitualStreakGraph';

export const RitualDetailPage: React.FC = () => {
  const { ritualId } = useParams<{ ritualId: string }>();
  const navigate = useNavigate();

  const { rituals } = useRitualManager();
  const { logs, isLoading, error } = useRitualDetail(ritualId ?? '');

  const ritual = rituals.find(r => r.id === ritualId);

  if (rituals.length > 0 && !ritual) {
    navigate('/tracker');
    return null;
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <Typography.H1>{ritual?.name ?? '...'}</Typography.H1>

      {error && (
        <Card className="border-2 border-vampire p-6 flex flex-col gap-2">
          <Typography.Body className="text-vampire">Failed to load ritual data.</Typography.Body>
          <Typography.Body variant="muted" size="sm">{error}</Typography.Body>
        </Card>
      )}

      <Tabs>
        <Tab label="Activity Log">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
            </div>
          ) : (
            <RitualActivityLog logs={logs} />
          )}
        </Tab>
        <Tab label="Trend">
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <RitualTrendGraph logs={logs} />
          )}
        </Tab>
        <Tab label="Streak">
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <RitualStreakGraph logs={logs} ritualId={ritualId ?? ''} />
          )}
        </Tab>
      </Tabs>
    </div>
  );
};
