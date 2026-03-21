import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@finnminn/auth';
import { HabitLog } from './useHabitLogManager';

export interface UseRitualDetailResult {
  logs: HabitLog[];
  isLoading: boolean;
  error: string | null;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function useRitualDetail(ritualId: string): UseRitualDetailResult {
  const { getIdToken, isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/habitlogs?ritualId=${ritualId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } else {
        setError(`Failed to load logs (${res.status})`);
      }
    } catch {
      setError('Failed to load ritual logs');
    } finally {
      setIsLoading(false);
    }
  }, [getIdToken, isAuthenticated, ritualId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, isLoading, error };
}
