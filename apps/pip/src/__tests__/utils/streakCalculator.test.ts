import { describe, it, expect } from 'vitest';
import { calculateStreakHistory } from '../../utils/streakCalculator';
import { HabitLog } from '../../hooks/useHabitLogManager';

function makeLog(date: string, ritualId = 'r1', completed = true): HabitLog {
  return {
    id: `log-${date}`,
    userId: 'user1',
    type: 'habitLog',
    ritualId,
    date,
    completed,
    timestamp: `${date}T08:00:00.000Z`,
  };
}

describe('calculateStreakHistory', () => {
  it('single day returns streak of 1', () => {
    const logs = [makeLog('2026-03-01')];
    const result = calculateStreakHistory(logs, 'r1');
    expect(result).toEqual([{ date: '2026-03-01', streak: 1 }]);
  });

  it('two consecutive days returns streak 1 then 2', () => {
    const logs = [makeLog('2026-03-01'), makeLog('2026-03-02')];
    const result = calculateStreakHistory(logs, 'r1');
    expect(result).toEqual([
      { date: '2026-03-01', streak: 1 },
      { date: '2026-03-02', streak: 2 },
    ]);
  });

  it('gap between days resets streak to 1', () => {
    const logs = [makeLog('2026-03-01'), makeLog('2026-03-03')];
    const result = calculateStreakHistory(logs, 'r1');
    expect(result).toEqual([
      { date: '2026-03-01', streak: 1 },
      { date: '2026-03-03', streak: 1 },
    ]);
  });

  it('same-day deduplication counts as one streak day', () => {
    const logs = [
      makeLog('2026-03-01'),
      { ...makeLog('2026-03-01'), id: 'log-2026-03-01-b' },
    ];
    const result = calculateStreakHistory(logs, 'r1');
    expect(result).toEqual([{ date: '2026-03-01', streak: 1 }]);
  });

  it('empty input returns empty array', () => {
    const result = calculateStreakHistory([], 'r1');
    expect(result).toEqual([]);
  });

  it('only includes logs matching ritualId', () => {
    const logs = [makeLog('2026-03-01', 'r1'), makeLog('2026-03-02', 'r2')];
    const result = calculateStreakHistory(logs, 'r1');
    expect(result).toEqual([{ date: '2026-03-01', streak: 1 }]);
  });

  it('ignores incomplete logs', () => {
    const logs = [makeLog('2026-03-01'), makeLog('2026-03-02', 'r1', false)];
    const result = calculateStreakHistory(logs, 'r1');
    expect(result).toEqual([{ date: '2026-03-01', streak: 1 }]);
  });
});
