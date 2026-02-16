import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@finnminn/auth';

export interface CaptureItem {
  id: string;
  content: string;
  type: 'capture';
  source: 'text' | 'voice';
  timestamp: string;
  status: 'inbox' | 'processed' | 'deleted';
}

const STORAGE_KEY = 'pip_pending_captures';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function useCaptureManager() {
  const { getIdToken } = useAuth();
  const [captures, setCaptures] = useState<CaptureItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchCaptures = useCallback(async () => {
    try {
      const token = await getIdToken();
      const res = await fetch(`${API_BASE}/captures`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCaptures(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to fetch captures', e);
    }
  }, [getIdToken]);

  const saveCapture = useCallback(
    async (content: string, source: 'text' | 'voice') => {
      const newItem: Partial<CaptureItem> = {
        content,
        source,
        type: 'capture',
        timestamp: new Date().toISOString(),
      };

      // Optimistic update
      const tempId = Math.random().toString(36).substring(7);
      const optimisticItem = { ...newItem, id: tempId, status: 'inbox' } as CaptureItem;
      setCaptures((prev) => [optimisticItem, ...prev]);

      if (!navigator.onLine) {
        const pending = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...pending, newItem]));
        return;
      }

      try {
        const token = await getIdToken();
        const res = await fetch(`${API_BASE}/capture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newItem),
        });

        if (!res.ok) {
          throw new Error('Failed to save');
        }

        const savedItem = await res.json();
        setCaptures((prev) => prev.map((item) => (item.id === tempId ? savedItem : item)));
      } catch (e) {
        console.error('Failed to save capture, queuing for retry', e);
        const pending = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...pending, newItem]));
      }
    },
    [getIdToken]
  );

  const deleteCapture = useCallback(
    async (id: string) => {
      // Optimistic update
      setCaptures((prev) => prev.filter((item) => item.id !== id));

      try {
        const token = await getIdToken();
        const res = await fetch(`${API_BASE}/capture/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to delete');
        }
      } catch (e) {
        console.error('Failed to delete capture', e);
        // Revert optimistic update or show error
        fetchCaptures();
      }
    },
    [getIdToken, fetchCaptures]
  );

  const syncPending = useCallback(async () => {
    const pending = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (pending.length === 0 || !navigator.onLine) return;

    setIsSyncing(true);
    const token = await getIdToken();

    const results = await Promise.allSettled(
      pending.map((item: Partial<CaptureItem>) =>
        fetch(`${API_BASE}/capture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        })
      )
    );

    const remaining = pending.filter((_: Partial<CaptureItem>, index: number) => {
      const result = results[index];
      return result.status === 'rejected' || !result.value.ok;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    setIsSyncing(false);
    if (remaining.length < pending.length) {
      fetchCaptures();
    }
  }, [getIdToken, fetchCaptures]);

  useEffect(() => {
    fetchCaptures();
    window.addEventListener('online', syncPending);
    return () => window.removeEventListener('online', syncPending);
  }, [fetchCaptures, syncPending]);

  return {
    captures,
    saveCapture,
    deleteCapture,
    isSyncing,
    refresh: fetchCaptures,
  };
}
