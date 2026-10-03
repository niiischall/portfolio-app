/**
 * Formats a Sanity `date` value (YYYY-MM-DD) as e.g. "Jun 14, 2026".
 *
 * timeZone: 'UTC' is load-bearing: a bare YYYY-MM-DD parses as UTC midnight,
 * so formatting it in the viewer's zone shows the previous day anywhere west
 * of UTC.
 */
export const formatDate = (value?: string): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
};
