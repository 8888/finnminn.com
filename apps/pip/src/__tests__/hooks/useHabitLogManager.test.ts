import { renderHook, act } from '@testing-library/react';
import { useHabitLogManager } from '../../hooks/useHabitLogManager';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockGetIdToken = vi.fn().mockResolvedValue('fake-token');

vi.mock('@finnminn/auth', () => ({
  useAuth: () => ({
    getIdToken: mockGetIdToken,
    isAuthenticated: true
  })
}));

describe('useHabitLogManager', () => {
  const startDate = '2026-02-01';
  const endDate = '2026-02-28';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    }));
  });

  it('should fetch logs on mount', async () => {
    const mockLogs = [{ id: '1', ritualId: 'r1', date: '2026-02-23', completed: true }];
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockLogs)
    });

    const { result } = renderHook(() => useHabitLogManager(startDate, endDate));
    
    await vi.waitFor(() => {
        expect(result.current.logs).toEqual(mockLogs);
    });
  });

  it('should toggle a log', async () => {
    const toggledLog = { id: '1', ritualId: 'r1', date: '2026-02-23', completed: true };
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(toggledLog)
    });

    const { result } = renderHook(() => useHabitLogManager(startDate, endDate));
    
    await act(async () => {
      await result.current.toggleLog('r1', '2026-02-23');
    });

    expect(result.current.logs).toContainEqual(toggledLog);
  });
});
