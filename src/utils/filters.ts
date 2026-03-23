import { FilterState, Status, Priority } from '../types';

export function filtersToParams(filters: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.statuses.length)   p.set('status',   filters.statuses.join(','));
  if (filters.priorities.length) p.set('priority', filters.priorities.join(','));
  if (filters.assignees.length)  p.set('assignee', filters.assignees.join(','));
  if (filters.dateFrom)          p.set('from',     filters.dateFrom);
  if (filters.dateTo)            p.set('to',       filters.dateTo);
  return p;
}

export function paramsToFilters(search: string): FilterState {
  const p = new URLSearchParams(search);
  return {
    statuses:   (p.get('status')   || '').split(',').filter(Boolean) as Status[],
    priorities: (p.get('priority') || '').split(',').filter(Boolean) as Priority[],
    assignees:  (p.get('assignee') || '').split(',').filter(Boolean),
    dateFrom:   p.get('from') || '',
    dateTo:     p.get('to')   || '',
  };
}

export function hasActiveFilters(f: FilterState): boolean {
  return f.statuses.length > 0 || f.priorities.length > 0 || f.assignees.length > 0 || !!f.dateFrom || !!f.dateTo;
}
