import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@finnminn/auth';

export interface HabitLog {
  id: string;
  userId: string;
  type: 'habitLog';
  ritualId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  timestamp: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function useHabitLogManager(startDate: string, endDate: string) {
  const { getIdToken, isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/habitlogs?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to fetch habit logs', e);
    } finally {
      setIsLoading(false);
    }
  }, [getIdToken, isAuthenticated, startDate, endDate]);

  const toggleLog = useCallback(async (ritualId: string, date: string) => {
    // Optimistic toggle
    setLogs(prev => {
        const index = prev.findIndex(l => l.ritualId === ritualId && l.date === date);
        if (index >= 0) {
            const next = [...prev];
            next[index] = { ...next[index], completed: !next[index].completed };
            return next;
        }
        // If not found, add a placeholder
        return [...prev, { ritualId, date, completed: true } as HabitLog];
    });

    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/habitlogs/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ritualId, date }),
      });

      if (res.ok) {
        const saved = await res.json();
        setLogs(prev => {
          const index = prev.findIndex(l => l.id === saved.id || (l.ritualId === saved.ritualId && l.date === saved.date));
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [...prev, saved];
        });
        return saved;
      }
    } catch (e) {
      console.error('Failed to toggle habit log', e);
      // Revert if error
      fetchLogs();
    }
  }, [getIdToken, fetchLogs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    toggleLog,
    refresh: fetchLogs,
  };
}
