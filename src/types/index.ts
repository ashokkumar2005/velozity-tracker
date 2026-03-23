export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'inprogress' | 'inreview' | 'done';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  startDate: string | null; // ISO date string
  dueDate: string;          // ISO date string
  description?: string;
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assignees: string[];
  dateFrom: string;
  dateTo: string;
}

export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDir = 'asc' | 'desc';

export interface CollabUser {
  user: User;
  taskId: string | null;
  action: 'viewing' | 'editing';
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  inreview: 'In Review',
  done: 'Done',
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  high:     { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  medium:   { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  low:      { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
};

export const PRIORITY_TIMELINE_COLORS: Record<Priority, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};
