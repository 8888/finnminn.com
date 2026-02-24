/**
 * Returns the current date in YYYY-MM-DD format using the user's local time.
 * This avoids mismatch issues caused by UTC date calculations (toISOString()).
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a date string YYYY-MM-DD for a relative offset from today.
 */
export function getRelativeDateString(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return getLocalDateString(date);
}
