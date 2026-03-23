export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function formatDate(iso: string): string {
  const d = parseDate(iso);
  const t = today();
  const diff = diffDays(t, d); // positive = future, negative = past

  if (diff === 0) return 'Due Today';
  if (diff > 0) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  const daysOverdue = Math.abs(diff);
  if (daysOverdue > 7) return `${daysOverdue}d overdue`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function isOverdue(iso: string): boolean {
  return diffDays(today(), parseDate(iso)) < 0;
}

export function isDueToday(iso: string): boolean {
  return diffDays(today(), parseDate(iso)) === 0;
}

export function getInitials(name: string): string {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}
