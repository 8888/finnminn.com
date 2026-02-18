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
const DELETE_STORAGE_KEY = 'pip_pending_deletes';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function useCaptureManager() {
  const { getIdToken } = useAuth();
  const [captures, setCaptures] = useState<CaptureItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchCaptures = useCallback(async () => {
    try {
      const token = await getIdToken();
      if (!token) return;
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

  const purgeCapture = useCallback(
    async (id: string) => {
      // Optimistic update
      setCaptures((prev) => prev.filter((item) => item.id !== id));

      if (!navigator.onLine) {
        const pending = JSON.parse(localStorage.getItem(DELETE_STORAGE_KEY) || '[]');
        if (!pending.includes(id)) {
           localStorage.setItem(DELETE_STORAGE_KEY, JSON.stringify([...pending, id]));
        }
        return;
      }

      try {
        const token = await getIdToken();
        if (!token) return;
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
        console.error('Failed to delete capture, queuing for retry', e);
        const pending = JSON.parse(localStorage.getItem(DELETE_STORAGE_KEY) || '[]');
        if (!pending.includes(id)) {
            localStorage.setItem(DELETE_STORAGE_KEY, JSON.stringify([...pending, id]));
        }
      }
    },
    [getIdToken]
  );

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
        if (!token) return;
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

  const syncPending = useCallback(async () => {
    const pendingCaptures = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const pendingDeletes = JSON.parse(localStorage.getItem(DELETE_STORAGE_KEY) || '[]');
    
    if ((pendingCaptures.length === 0 && pendingDeletes.length === 0) || !navigator.onLine) return;

    setIsSyncing(true);
    const token = await getIdToken();
    if (!token) {
      setIsSyncing(false);
      return;
    }

    // Sync Captures
    const captureResults = await Promise.allSettled(
      pendingCaptures.map((item: Partial<CaptureItem>) =>
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

    const remainingCaptures = pendingCaptures.filter((_: Partial<CaptureItem>, index: number) => {
      const result = captureResults[index];
      return result.status === 'rejected' || !result.value.ok;
    });

    // Sync Deletes
    const deleteResults = await Promise.allSettled(
      pendingDeletes.map((id: string) =>
        fetch(`${API_BASE}/capture/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    );

    const remainingDeletes = pendingDeletes.filter((_: string, index: number) => {
      const result = deleteResults[index];
      return result.status === 'rejected' || !result.value.ok;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingCaptures));
    localStorage.setItem(DELETE_STORAGE_KEY, JSON.stringify(remainingDeletes));
    
    setIsSyncing(false);
    if (remainingCaptures.length < pendingCaptures.length || remainingDeletes.length < pendingDeletes.length) {
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
    purgeCapture,
    isSyncing,
    refresh: fetchCaptures,
  };
}
