import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Card, Badge } from '@finnminn/ui';
import { useAuth } from '@finnminn/auth';
import { AddPlantModal } from '../components/AddPlantModal';

interface HealthReport {
  date: string;
  healthStatus: string;
  imageUrl: string;
}

interface Plant {
  id: string;
  alias: string;
  species: string;
  historicalReports: Array<HealthReport>;
  carePlan?: {
    waterFrequency: string;
    lightNeeds: string;
    toxicity: string;
    additionalNotes: string;
  };
  environment: { zip: string; lighting: string };
}

// --- Proposal A utilities ---

function deriveHealthBadge(healthStatus: string): { variant: 'success' | 'warning' | 'error' | 'info'; label: string } {
  const s = healthStatus.toLowerCase();
  if (/\b(critical|dying|severe|dead|rot|pest|infest)\b/.test(s)) {
    return { variant: 'error', label: 'CRITICAL' };
  }
  if (/\b(warning|concern|yellow|wilt|droop|stress|overwater|underwater)\b/.test(s)) {
    return { variant: 'warning', label: 'WARNING' };
  }
  if (/\b(healthy|thriving|excellent|great|good|lush|vigorous)\b/.test(s)) {
    return { variant: 'success', label: 'HEALTHY' };
  }
  return { variant: 'info', label: 'UNKNOWN' };
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  if (match) return match[0];
  return text.length > 120 ? text.substring(0, 120) + '…' : text;
}

function daysAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'CHECKED: TODAY';
  if (diff === 1) return 'CHECKED: 1 DAY AGO';
  return `CHECKED: ${diff} DAYS AGO`;
}

function parseWaterChip(waterFrequency: string): string {
  const match = waterFrequency.match(/\d+/);
  return match ? `WATER/${match[0]}D` : 'WATER';
}

function parseLightChip(lightNeeds: string): string {
  const first = lightNeeds.trim().split(/\s+/)[0].toUpperCase();
  if (['INDIRECT', 'BRIGHT', 'LOW', 'FULL', 'PARTIAL'].includes(first)) return first;
  return first.length > 8 ? first.substring(0, 8) : first;
}

// --- Proposal B types and utilities ---

type HealthFilter = 'healthy' | 'warning' | 'critical' | null;

interface CollectionStats {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
  unknown: number;
  oldestCheck: { alias: string; species: string; id: string; daysAgo: number } | null;
}

function computeStats(plants: Plant[]): CollectionStats {
  let healthy = 0, warning = 0, critical = 0, unknown = 0;
  let oldestCheck: CollectionStats['oldestCheck'] = null;
  let oldestDays = -1;

  for (const plant of plants) {
    const lastReport = plant.historicalReports[0];
    if (lastReport) {
      const badge = deriveHealthBadge(lastReport.healthStatus);
      if (badge.label === 'HEALTHY') healthy++;
      else if (badge.label === 'WARNING') warning++;
      else if (badge.label === 'CRITICAL') critical++;
      else unknown++;

      const date = new Date(lastReport.date);
      const now = new Date();
      const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (days > oldestDays) {
        oldestDays = days;
        oldestCheck = { alias: plant.alias, species: plant.species, id: plant.id, daysAgo: days };
      }
    } else {
      unknown++;
    }
  }

  return { total: plants.length, healthy, warning, critical, unknown, oldestCheck };
}

const filterVariantMap: Record<NonNullable<HealthFilter>, 'success' | 'warning' | 'error'> = {
  healthy: 'success',
  warning: 'warning',
  critical: 'error',
};

// --- StatBlock ---

interface StatBlockProps {
  count: number;
  label: string;
  variant?: 'toxic' | 'ectoplasm' | 'gold' | 'vampire';
  onClick?: () => void;
  pulse?: boolean;
}

const StatBlock: React.FC<StatBlockProps> = ({ count, label, variant = 'toxic', onClick, pulse }) => (
  <div
    className={`flex flex-col items-center gap-1 p-3 border border-surface ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${pulse ? 'animate-pulse' : ''}`}
    onClick={onClick}
  >
    <Typography.H2 variant={variant} glow={true}>
      {count}
    </Typography.H2>
    <Typography.Body size="xs" variant="muted">
      {label}
    </Typography.Body>
  </div>
);

// --- Dashboard ---

export const Dashboard: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<HealthFilter>(null);
  const { getIdToken } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const fetchPlants = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) return;
      const response = await fetch(`${API_BASE}/api/plants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPlants(data);
      }
    } catch (error) {
      console.error("Failed to fetch plants from the Void:", error);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, API_BASE]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const stats = useMemo(() => computeStats(plants), [plants]);

  const filteredPlants = activeFilter
    ? plants.filter((plant) => {
        const lastReport = plant.historicalReports[0];
        if (!lastReport) return activeFilter === null;
        const badge = deriveHealthBadge(lastReport.healthStatus);
        return badge.label === activeFilter.toUpperCase();
      })
    : plants;

  const toggleFilter = (filter: NonNullable<HealthFilter>) => {
    setActiveFilter(f => f === filter ? null : filter);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Typography.H1 variant="toxic">
            COLLECTION FROM THE VOID
          </Typography.H1>
          <Typography.Body variant="muted" size="sm">
            {plants.length} specimens currently under observation.
          </Typography.Body>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className="border-toxic text-toxic hover:bg-toxic/10"
        >
          + RESURRECT NEW SPECIMEN
        </Button>
      </div>

      {isModalOpen && (
        <AddPlantModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchPlants}
        />
      )}

      {!loading && plants.length > 0 && (
        <Card className="p-4 border-surface">
          <Typography.H3 variant="muted" glow={false} className="mb-4">
            COLLECTION STATUS
          </Typography.H3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatBlock count={stats.total} label="SPECIMENS" variant="toxic" />
            <StatBlock
              count={stats.healthy}
              label="HEALTHY"
              variant="ectoplasm"
              onClick={() => toggleFilter('healthy')}
            />
            <StatBlock
              count={stats.warning}
              label="WARNING"
              variant="gold"
              onClick={() => toggleFilter('warning')}
            />
            <StatBlock
              count={stats.critical}
              label="CRITICAL"
              variant="vampire"
              onClick={() => toggleFilter('critical')}
              pulse={stats.critical > 0}
            />
          </div>
          {stats.oldestCheck && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-surface pt-3">
              <div>
                <Typography.Body size="xs" variant="muted">
                  LONGEST SINCE CHECK:
                </Typography.Body>
                <Typography.Body size="sm">
                  {stats.oldestCheck.alias.toUpperCase()} —{' '}
                  <span className="italic text-text-muted">{stats.oldestCheck.species}</span>
                  {' '}({stats.oldestCheck.daysAgo === 0 ? 'TODAY' : `${stats.oldestCheck.daysAgo}D AGO`})
                </Typography.Body>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/plant/${stats.oldestCheck!.id}`)}
              >
                [ VIEW → ]
              </Button>
            </div>
          )}
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse border-toxic/10 bg-toxic/5" />
          ))}
        </div>
      ) : plants.length === 0 ? (
        <Card className="p-12 border-dashed border-toxic/20 text-center space-y-4">
          <Typography.H3 variant="muted">
            THE VOID IS EMPTY
          </Typography.H3>
          <Typography.Body variant="muted">
            No floral spirits have been bound yet.
          </Typography.Body>
          <Button variant="primary" className="opacity-50">
            [ INITIAITE FIRST RITUAL ]
          </Button>
        </Card>
      ) : (
        <>
          {activeFilter && (
            <Badge
              variant={filterVariantMap[activeFilter]}
              className="cursor-pointer mb-4"
              onClick={() => setActiveFilter(null)}
            >
              FILTER: {activeFilter.toUpperCase()} ×
            </Badge>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => {
              const lastReport = plant.historicalReports[0];
              const badge = lastReport ? deriveHealthBadge(lastReport.healthStatus) : null;

              return (
                <Card
                  key={plant.id.toString()}
                  className="p-4 border-toxic/30 hover:border-toxic transition-colors group cursor-pointer"
                  onClick={() => navigate(`/plant/${plant.id}`)}
                >
                  <div className="aspect-video bg-void border border-toxic/10 mb-4 overflow-hidden relative group">
                    {lastReport?.imageUrl ? (
                      <img
                        src={lastReport.imageUrl}
                        alt={plant.alias}
                        className="w-full h-full object-cover transition-all"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-toxic/10 text-xs">
                        [ NO VISUAL DATA ]
                      </div>
                    )}
                  </div>
                  <Typography.H3 variant="toxic" className="truncate">
                    {plant.alias.toUpperCase()}
                  </Typography.H3>
                  <Typography.Body variant="witchcraft" size="xs" className="italic mb-3">
                    {plant.species}
                  </Typography.Body>

                  {badge && lastReport && (
                    <>
                      <div className="mb-2">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <Typography.Body size="sm" className="mb-3">
                        {firstSentence(lastReport.healthStatus)}
                      </Typography.Body>
                    </>
                  )}

                  {plant.carePlan ? (
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="info">{parseWaterChip(plant.carePlan.waterFrequency)}</Badge>
                      <Badge variant="info">{parseLightChip(plant.carePlan.lightNeeds)}</Badge>
                      <Badge variant={plant.carePlan.toxicity.toLowerCase().includes('toxic') ? 'error' : 'info'}>
                        {plant.carePlan.toxicity.toLowerCase().includes('toxic') ? 'TOXIC' : 'NON-TOXIC'}
                      </Badge>
                    </div>
                  ) : (
                    <Typography.Body variant="muted" size="xs" className="mb-3">
                      [ NO CARE PLAN ]
                    </Typography.Body>
                  )}

                  {lastReport && (
                    <Typography.Body variant="muted" size="xs">
                      {daysAgo(lastReport.date)}
                    </Typography.Body>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
