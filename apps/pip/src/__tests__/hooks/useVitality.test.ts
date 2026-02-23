import { renderHook } from '@testing-library/react';
import { useVitality } from '../../hooks/useVitality';
import { describe, it, expect } from 'vitest';
import { Ritual } from '../../hooks/useRitualManager';
import { HabitLog } from '../../hooks/useHabitLogManager';

describe('useVitality', () => {
  const rituals: Ritual[] = [
    { id: 'r1', name: 'Exercise', nature: 'light', type: 'ritual', userId: 'u1', timestamp: '' },
    { id: 'r2', name: 'Junk Food', nature: 'void', type: 'ritual', userId: 'u1', timestamp: '' }
  ];

  it('should calculate vitality correctly', () => {
    const logs: HabitLog[] = [
      { id: 'l1', ritualId: 'r1', date: '2026-02-23', completed: true, type: 'habitLog', userId: 'u1', timestamp: '' },
      { id: 'l2', ritualId: 'r2', date: '2026-02-23', completed: true, type: 'habitLog', userId: 'u1', timestamp: '' }
    ];

    const { result } = renderHook(() => useVitality(rituals, logs));
    
    // Base 50 + 1 (light) - 1 (void) = 50
    expect(result.current.vitality).toBe(50);
  });

  it('should calculate streak correctly', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const logs: HabitLog[] = [
      { id: 'l1', ritualId: 'r1', date: today, completed: true, type: 'habitLog', userId: 'u1', timestamp: '' },
      { id: 'l2', ritualId: 'r1', date: yesterday, completed: true, type: 'habitLog', userId: 'u1', timestamp: '' }
    ];

    const { result } = renderHook(() => useVitality(rituals, logs));
    
    expect(result.current.streak).toBe(2);
  });
});
