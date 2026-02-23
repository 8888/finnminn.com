import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@finnminn/auth';

export interface Ritual {
  id: string;
  userId: string;
  type: 'ritual';
  name: string;
  nature: 'light' | 'void';
  timestamp: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function useRitualManager() {
  const { getIdToken, isAuthenticated } = useAuth();
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRituals = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/rituals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRituals(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to fetch rituals', e);
    } finally {
      setIsLoading(false);
    }
  }, [getIdToken, isAuthenticated]);

  const saveRitual = useCallback(async (name: string, nature: 'light' | 'void', id?: string) => {
    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/rituals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, name, nature }),
      });

      if (res.ok) {
        const saved = await res.json();
        setRituals(prev => {
          const index = prev.findIndex(r => r.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        return saved;
      }
    } catch (e) {
      console.error('Failed to save ritual', e);
    }
  }, [getIdToken]);

  const deleteRitual = useCallback(async (id: string) => {
    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/rituals/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setRituals(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete ritual', e);
    }
  }, [getIdToken]);

  useEffect(() => {
    fetchRituals();
  }, [fetchRituals]);

  return {
    rituals,
    isLoading,
    saveRitual,
    deleteRitual,
    refresh: fetchRituals,
  };
}
