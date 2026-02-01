import { describe, it, expect } from 'vitest';
import { 
  getPlantHealth, 
  mapWateringFrequency, 
  sortPlantsByNeglect, 
  calculateHarmonyIndex, 
  getOracleText 
} from '../plantLogic';
import { Plant } from '../../types/plant';

const createMockPlant = (id: string, reports: any[] = [], boundDate = '2026-01-01T00:00:00Z'): Plant => ({
  id,
  alias: `Plant ${id}`,
  species: 'Species X',
  boundDate,
  historicalReports: reports,
});

describe('plantLogic', () => {
  describe('getPlantHealth', () => {
    it('returns thriving for healthy keywords', () => {
      const plant = createMockPlant('1', [{ healthStatus: 'The plant is thriving and healthy', date: '2026-01-01' }]);
      expect(getPlantHealth(plant)).toBe('thriving');
    });

    it('returns in-peril for unhealthy keywords', () => {
      const plant = createMockPlant('1', [{ healthStatus: 'It looks thirsty and dying', date: '2026-01-01' }]);
      expect(getPlantHealth(plant)).toBe('in-peril');
    });

    it('returns stable for neutral or no reports', () => {
      const plantNoReports = createMockPlant('1', []);
      const plantNeutral = createMockPlant('2', [{ healthStatus: 'Just a regular plant', date: '2026-01-01' }]);
      expect(getPlantHealth(plantNoReports)).toBe('stable');
      expect(getPlantHealth(plantNeutral)).toBe('stable');
    });
  });

  describe('mapWateringFrequency', () => {
    it('maps daily frequencies', () => {
      expect(mapWateringFrequency('Daily rituals')).toBe('Daily Rituals');
      expect(mapWateringFrequency('every day')).toBe('Daily Rituals');
    });

    it('maps weekly frequencies', () => {
      expect(mapWateringFrequency('Weekly cycle')).toBe('Weekly Cycles');
      expect(mapWateringFrequency('every few days')).toBe('Weekly Cycles');
    });

    it('fallbacks to Strange Rhythms', () => {
      expect(mapWateringFrequency('when the spirits call')).toBe('Strange Rhythms');
    });

    it('handles missing frequency', () => {
      expect(mapWateringFrequency(undefined)).toBe('UNBOUND FREQUENCIES');
    });
  });

  describe('sortPlantsByNeglect', () => {
    it('sorts by oldest report first', () => {
      const plantOld = createMockPlant('old', [{ date: '2026-01-01' }]);
      const plantNew = createMockPlant('new', [{ date: '2026-02-01' }]);
      expect(sortPlantsByNeglect(plantOld, plantNew)).toBeLessThan(0);
    });

    it('prioritizes plants with no reports', () => {
      const plantNoReport = createMockPlant('none', []);
      const plantWithReport = createMockPlant('some', [{ date: '2026-01-01' }]);
      expect(sortPlantsByNeglect(plantNoReport, plantWithReport)).toBe(-1);
    });

    it('sorts plants with no reports by boundDate', () => {
      const plantEarly = createMockPlant('early', [], '2025-01-01');
      const plantLate = createMockPlant('late', [], '2025-02-01');
      expect(sortPlantsByNeglect(plantEarly, plantLate)).toBeLessThan(0);
    });
  });

  describe('calculateHarmonyIndex', () => {
    it('calculates percentage of non-perilous plants', () => {
      const plants = [
        createMockPlant('1', [{ healthStatus: 'thriving' }]),
        createMockPlant('2', []), // stable
        createMockPlant('3', [{ healthStatus: 'dying' }]), // in-peril
        createMockPlant('4', [{ healthStatus: 'dying' }]), // in-peril
      ];
      expect(calculateHarmonyIndex(plants)).toBe(50);
    });

    it('handles empty collection', () => {
      expect(calculateHarmonyIndex([])).toBe(0);
    });
  });

  describe('getOracleText', () => {
    it('returns appropriate text for thresholds', () => {
      expect(getOracleText(100)).toBe("THE GARDEN THRIVES IN RADIANT DARKNESS");
      expect(getOracleText(75)).toBe("A STEADY CALM PERMEATES THE VOID");
      expect(getOracleText(25)).toBe("SHADOWS GATHER; THE SPIRITS ARE RESTLESS");
      expect(getOracleText(0)).toBe("THE VOID IS SILENT AND BARREN");
    });
  });
});
