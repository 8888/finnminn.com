import { renderHook, act } from '@testing-library/react';
import { useCaptureManager } from '../../hooks/useCaptureManager';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockGetIdToken = vi.fn().mockResolvedValue('fake-token');

// Mock the auth hook
vi.mock('@finnminn/auth', () => ({
  useAuth: () => ({
    getIdToken: mockGetIdToken,
    isAuthenticated: true
  })
}));

describe('useCaptureManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    }));
  });

  it('should save a capture online', async () => {
    (global.fetch as vi.Mock).mockImplementation((url: string) => {
        if (url === '/api/capture') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: '1', content: 'test', type: 'capture' })
            });
        }
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([])
        });
    });

    const { result } = renderHook(() => useCaptureManager());
    
    await act(async () => {
      await result.current.saveCapture('test', 'text');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/capture', expect.any(Object));
  });

  it('should queue a capture when offline', async () => {
    // Mock offline state
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    
    const { result } = renderHook(() => useCaptureManager());
    
    await act(async () => {
      await result.current.saveCapture('offline test', 'text');
    });

    const queue = JSON.parse(localStorage.getItem('pip_pending_captures') || '[]');
    expect(queue).toHaveLength(1);
    expect(queue[0].content).toBe('offline test');
  });

  it('should sync pending captures when coming online', async () => {
    // Start with one item in queue
    localStorage.setItem('pip_pending_captures', JSON.stringify([
      { content: 'pending', source: 'text', timestamp: new Date().toISOString() }
    ]));

    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '2' })
    });

    renderHook(() => useCaptureManager());
    
    // Simulate online event
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    await act(async () => {
      window.dispatchEvent(new Event('online'));
    });

    // Wait for async sync to complete
    await vi.waitFor(() => {
        expect(localStorage.getItem('pip_pending_captures')).toBe('[]');
    }, { timeout: 2000 });
  });

  describe('purgeCapture', () => {
    it('should remove capture optimistically and call API when online', async () => {
      const initialCaptures = [{ id: 'delete-me', content: 'to be deleted', type: 'capture', status: 'inbox', timestamp: new Date().toISOString(), source: 'text' }];
      (global.fetch as vi.Mock).mockImplementation((url: string) => {
          if (url.includes('/api/captures')) {
              return Promise.resolve({ ok: true, json: () => Promise.resolve(initialCaptures) });
          }
          if (url.includes('/api/capture/delete-me')) {
              return Promise.resolve({ ok: true });
          }
          return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      const { result } = renderHook(() => useCaptureManager());
      
      // Wait for initial fetch
      await vi.waitFor(() => {
        expect(result.current.captures).toHaveLength(1);
      });

      await act(async () => {
        await result.current.purgeCapture('delete-me');
      });

      expect(result.current.captures).toHaveLength(0);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/capture/delete-me'), expect.objectContaining({ method: 'DELETE' }));
    });

    it('should queue delete when offline', async () => {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      
      const { result } = renderHook(() => useCaptureManager());
      
      await act(async () => {
        await result.current.purgeCapture('offline-delete-id');
      });

      const queue = JSON.parse(localStorage.getItem('pip_pending_deletes') || '[]');
      expect(queue).toContain('offline-delete-id');
    });

    it('should sync pending deletes when coming online', async () => {
      localStorage.setItem('pip_pending_deletes', JSON.stringify(['sync-delete-id']));
      (global.fetch as vi.Mock).mockResolvedValue({ ok: true });

      renderHook(() => useCaptureManager());
      
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      await act(async () => {
        window.dispatchEvent(new Event('online'));
      });

      await vi.waitFor(() => {
          expect(localStorage.getItem('pip_pending_deletes')).toBe('[]');
      }, { timeout: 2000 });
      
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/capture/sync-delete-id'), expect.objectContaining({ method: 'DELETE' }));
    });
  });
});
