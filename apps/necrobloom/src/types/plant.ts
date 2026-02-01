export type HealthStatus = 'thriving' | 'stable' | 'in-peril';

export interface HealthReport {
  date: string;
  healthStatus: string;
  imageUrl: string;
}

export interface CarePlan {
  waterFrequency: string;
  lightNeeds: string;
  toxicity: string;
  additionalNotes: string;
}

export interface Plant {
  id: string;
  alias: string;
  species: string;
  boundDate: string; // ISO string
  historicalReports: HealthReport[];
  carePlan?: CarePlan;
}
