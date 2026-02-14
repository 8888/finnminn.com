import { renderHook, act } from '@testing-library/react';
import { useCaptureManager } from '../../hooks/useCaptureManager';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockGetToken = vi.fn().mockResolvedValue('fake-token');

// Mock the auth hook
vi.mock('@finnminn/auth', () => ({
  useAuth: () => ({
    getToken: mockGetToken,
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
});
