import { renderHook, act } from '@testing-library/react';
import { useRitualManager } from '../../hooks/useRitualManager';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockGetIdToken = vi.fn().mockResolvedValue('fake-token');

vi.mock('@finnminn/auth', () => ({
  useAuth: () => ({
    getIdToken: mockGetIdToken,
    isAuthenticated: true
  })
}));

describe('useRitualManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    }));
  });

  it('should fetch rituals on mount', async () => {
    const mockRituals = [{ id: '1', name: 'Exercise', nature: 'light' }];
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRituals)
    });

    const { result } = renderHook(() => useRitualManager());
    
    await vi.waitFor(() => {
        expect(result.current.rituals).toEqual(mockRituals);
    });
  });

  it('should save a ritual', async () => {
    const newRitual = { id: '2', name: 'Read', nature: 'light' };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(newRitual)
    });

    const { result } = renderHook(() => useRitualManager());
    
    await act(async () => {
      await result.current.saveRitual('Read', 'light');
    });

    expect(result.current.rituals).toContainEqual(newRitual);
  });
});
