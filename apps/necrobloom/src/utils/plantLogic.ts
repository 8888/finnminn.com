import { Plant, HealthStatus, HealthReport } from '../types/plant';

export const getPlantHealth = (plant: Plant): HealthStatus => {
  if (!plant.historicalReports || plant.historicalReports.length === 0) {
    return 'stable';
  }

  const lastReport = plant.historicalReports[plant.historicalReports.length - 1];
  const status = lastReport.healthStatus.toLowerCase();

  const perilKeywords = ['thirsty', 'dying', 'troubled', 'unhealthy', 'peril', 'dying', 'poor'];
  const thrivingKeywords = ['thriving', 'healthy', 'excellent', 'vibrant', 'great'];

  if (perilKeywords.some(keyword => status.includes(keyword))) {
    return 'in-peril';
  }

  if (thrivingKeywords.some(keyword => status.includes(keyword))) {
    return 'thriving';
  }

  return 'stable';
};

export const mapWateringFrequency = (frequency?: string): string => {
  if (!frequency) return 'UNBOUND FREQUENCIES';

  const freq = frequency.toLowerCase();

  if (freq.includes('daily') || freq.includes('every day') || freq.includes('constantly')) {
    return 'Daily Rituals';
  }

  if (freq.includes('weekly') || freq.includes('every week') || freq.includes('every few days') || freq.includes('once a week')) {
    return 'Weekly Cycles';
  }

  if (freq.includes('bi-weekly') || freq.includes('every 2 weeks') || freq.includes('fortnightly')) {
    return 'Bi-Weekly Rhythms';
  }

  if (freq.includes('monthly') || freq.includes('every month') || freq.includes('once a month')) {
    return 'Monthly Communions';
  }

  return 'Strange Rhythms';
};

export const sortPlantsByNeglect = (a: Plant, b: Plant): number => {
  const lastReportA = a.historicalReports[a.historicalReports.length - 1];
  const lastReportB = b.historicalReports[b.historicalReports.length - 1];

  // Primary Sort: Last Health Check date, oldest first
  if (lastReportA && lastReportB) {
    return new Date(lastReportA.date).getTime() - new Date(lastReportB.date).getTime();
  }

  // If one has no reports, it goes to the top
  if (!lastReportA && lastReportB) return -1;
  if (lastReportA && !lastReportB) return 1;

  // Secondary Sort (No Reports): Bound Date (creation date), oldest first
  return new Date(a.boundDate).getTime() - new Date(b.boundDate).getTime();
};

export const calculateHarmonyIndex = (plants: Plant[]): number => {
  if (plants.length === 0) return 0;

  const nonPerilousCount = plants.filter(p => {
    const health = getPlantHealth(p);
    return health === 'thriving' || health === 'stable';
  }).length;

  return Math.round((nonPerilousCount / plants.length) * 100);
};

export const getOracleText = (harmonyIndex: number): string => {
  if (harmonyIndex >= 90) return "THE GARDEN THRIVES IN RADIANT DARKNESS";
  if (harmonyIndex >= 50) return "A STEADY CALM PERMEATES THE VOID";
  if (harmonyIndex >= 1) return "SHADOWS GATHER; THE SPIRITS ARE RESTLESS";
  return "THE VOID IS SILENT AND BARREN";
};
