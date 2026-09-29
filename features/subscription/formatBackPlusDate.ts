/** Locale-friendly date for Settings subtitles and active plan copy. */
export function formatBackPlusDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
