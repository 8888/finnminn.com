import { renderHook } from '@testing-library/react';
import { useRitualDetail } from '../../hooks/useRitualDetail';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockGetIdToken = vi.fn().mockResolvedValue('fake-token');

vi.mock('@finnminn/auth', () => ({
  useAuth: () => ({
    getIdToken: mockGetIdToken,
    isAuthenticated: true,
  }),
}));

describe('useRitualDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('successful fetch populates logs', async () => {
    const mockLogs = [{ id: '1', ritualId: 'r1', date: '2026-03-01', completed: true, timestamp: '2026-03-01T08:00:00Z' }];
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLogs),
    });

    const { result } = renderHook(() => useRitualDetail('r1'));

    await vi.waitFor(() => {
      expect(result.current.logs).toEqual(mockLogs);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('sets loading state during fetch', async () => {
    let resolveFetch!: (v: unknown) => void;
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(resolve => { resolveFetch = resolve; })
    );

    const { result } = renderHook(() => useRitualDetail('r1'));
    expect(result.current.isLoading).toBe(true);

    resolveFetch({ ok: true, json: () => Promise.resolve([]) });
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('sets error state on failed fetch', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useRitualDetail('r1'));

    await vi.waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.logs).toEqual([]);
    });
  });

  it('re-fetches when ritualId changes', async () => {
    const { rerender } = renderHook(({ id }) => useRitualDetail(id), {
      initialProps: { id: 'r1' },
    });

    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain('ritualId=r1');

    rerender({ id: 'r2' });

    await vi.waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls[1][0]).toContain('ritualId=r2');
  });
});
