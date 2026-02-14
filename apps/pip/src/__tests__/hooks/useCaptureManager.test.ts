import { renderHook, act } from '@testing-library/react';
import { useCaptureManager } from '../../hooks/useCaptureManager';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the auth hook
vi.mock('@finnminn/auth', () => ({
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue('fake-token'),
    isAuthenticated: true
  })
}));

describe('useCaptureManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch = vi.fn();
  });

  it('should save a capture online', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: '1', content: 'test', type: 'capture' })
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

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: '2' })
    });

    renderHook(() => useCaptureManager());
    
    // Simulate online event
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    // Wait for async sync
    await vi.waitFor(() => {
        expect(localStorage.getItem('pip_pending_captures')).toBe('[]');
    });
  });
});
