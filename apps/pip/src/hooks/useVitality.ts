import { useMemo } from 'react';
import { Ritual } from './useRitualManager';
import { HabitLog } from './useHabitLogManager';

export function useVitality(rituals: Ritual[], logs: HabitLog[]) {
  const vitality = useMemo(() => {
    const baseScore = 50;
    
    // Calculate based on last 30 days of logs
    const completedLight = logs.filter(log => {
        const ritual = rituals.find(r => r.id === log.ritualId);
        return ritual?.nature === 'light' && log.completed;
    }).length;

    const completedVoid = logs.filter(log => {
        const ritual = rituals.find(r => r.id === log.ritualId);
        return ritual?.nature === 'void' && log.completed;
    }).length;

    // Standard impact weight is 1
    const rawVitality = baseScore + completedLight - completedVoid;
    
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, rawVitality));
  }, [rituals, logs]);

  const streak = useMemo(() => {
    if (logs.length === 0 || rituals.length === 0) return 0;

    // Get all light ritual ids
    const lightRitualIds = rituals.filter(r => r.nature === 'light').map(r => r.id);
    if (lightRitualIds.length === 0) return 0;

    // Aggregate logs by date
    const dateLogs = logs.reduce((acc, log) => {
        if (!acc[log.date]) acc[log.date] = [];
        acc[log.date].push(log);
        return acc;
    }, {} as Record<string, HabitLog[]>);

    // Get sorted unique dates
    const sortedDates = Object.keys(dateLogs).sort().reverse();
    
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if we have any completed light ritual today or yesterday to start the streak
    const hasToday = dateLogs[today]?.some(l => lightRitualIds.includes(l.ritualId) && l.completed);
    const hasYesterday = dateLogs[yesterday]?.some(l => lightRitualIds.includes(l.ritualId) && l.completed);

    if (!hasToday && !hasYesterday) return 0;

    // Start counting back from the most recent date
    let dateToCheck = hasToday ? today : yesterday;
    
    while (true) {
        const hasRitualOnDate = dateLogs[dateToCheck]?.some(l => lightRitualIds.includes(l.ritualId) && l.completed);
        if (hasRitualOnDate) {
            currentStreak++;
            const prevDate = new Date(new Date(dateToCheck).getTime() - 86400000).toISOString().split('T')[0];
            dateToCheck = prevDate;
        } else {
            break;
        }
    }

    return currentStreak;
  }, [rituals, logs]);

  return { vitality, streak };
}
