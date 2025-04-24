export function formatDate(date: Date | undefined | null): string {
  if (!date) return 'N/A';

  if (typeof date === 'string') {
    date = new Date(date);
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
