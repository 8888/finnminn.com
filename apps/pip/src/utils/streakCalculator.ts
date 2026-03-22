import { HabitLog } from '../hooks/useHabitLogManager';

export interface StreakDataPoint {
  date: string;
  streak: number;
}

export function calculateStreakHistory(logs: HabitLog[], ritualId: string): StreakDataPoint[] {
  const uniqueDates = [
    ...new Set(
      logs
        .filter(l => l.ritualId === ritualId && l.completed)
        .map(l => l.date)
    ),
  ].sort();

  const result: StreakDataPoint[] = [];
  let prevDate: string | null = null;
  let streak = 0;

  for (const date of uniqueDates) {
    if (prevDate !== null) {
      const diff = dayDiff(prevDate, date);
      streak = diff === 1 ? streak + 1 : 1;
    } else {
      streak = 1;
    }
    result.push({ date, streak });
    prevDate = date;
  }

  return result;
}

function dayDiff(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}
