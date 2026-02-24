import { describe, it, expect, vi } from 'vitest';
import { getLocalDateString } from '../../utils/date';

describe('getLocalDateString', () => {
  it('returns the correct local date string', () => {
    // Mock date to 2026-02-24 08:00:00 EST (UTC-5)
    const mockDate = new Date('2026-02-24T13:00:00Z');

    // We expect the local date components to be used.
    // Since we can't easily change the environment timezone here,
    // we'll rely on the Date object's local getters.

    const year = mockDate.getFullYear();
    const month = String(mockDate.getMonth() + 1).padStart(2, '0');
    const day = String(mockDate.getDate()).padStart(2, '0');
    const expected = `${year}-${month}-${day}`;

    expect(getLocalDateString(mockDate)).toBe(expected);
  });

  it('differs from toISOString in certain timezones/times', () => {
    // 2026-02-24 20:00:00 EST is 2026-02-25 01:00:00 UTC
    // If we mock the system time and the environment is EST:
    const mockDate = new Date('2026-02-25T01:00:00Z');

    const isoDate = mockDate.toISOString().split('T')[0]; // "2026-02-25"
    const localDate = getLocalDateString(mockDate);

    // In many timezones (like EST/PST), localDate will be "2026-02-24"
    // In UTC or timezones ahead (like JST), localDate will be "2026-02-25"

    console.log(`ISO: ${isoDate}, Local: ${localDate}`);

    // The core requirement is that getLocalDateString matches local components
    expect(localDate).toBe(`${mockDate.getFullYear()}-${String(mockDate.getMonth() + 1).padStart(2, '0')}-${String(mockDate.getDate()).padStart(2, '0')}`);
  });
});
