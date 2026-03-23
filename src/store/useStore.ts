import { create } from 'zustand';
import { Task, FilterState, Status, SortField, SortDir, PRIORITY_ORDER } from '../types';
import { generateTasks } from '../data/seed';
import { parseDate } from '../utils/date';
import { paramsToFilters, filtersToParams } from '../utils/filters';

export type ViewMode = 'kanban' | 'list' | 'timeline';

interface AppState {
  tasks: Task[];
  view: ViewMode;
  filters: FilterState;
  sortField: SortField;
  sortDir: SortDir;

  setView: (v: ViewMode) => void;
  setFilters: (f: FilterState) => void;
  clearFilters: () => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  moveTask: (taskId: string, toStatus: Status, afterId?: string) => void;
  setSortField: (field: SortField) => void;

  filteredTasks: () => Task[];
  sortedFilteredTasks: () => Task[];
}

const EMPTY_FILTERS: FilterState = {
  statuses: [], priorities: [], assignees: [], dateFrom: '', dateTo: '',
};

const initialFilters = paramsToFilters(window.location.search);

export const useStore = create<AppState>((set, get) => ({
  tasks: generateTasks(500),
  view: 'kanban',
  filters: initialFilters,
  sortField: 'dueDate',
  sortDir: 'asc',

  setView: (view) => set({ view }),

  setFilters: (filters) => {
    set({ filters });
    const params = filtersToParams(filters);
    const newUrl = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  },

  clearFilters: () => {
    set({ filters: { ...EMPTY_FILTERS } });
    window.history.replaceState({}, '', window.location.pathname);
  },

  updateTaskStatus: (taskId, status) => {
    set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, status } : t) }));
  },

  moveTask: (taskId, toStatus, afterId) => {
    set(s => {
      const tasks = [...s.tasks];
      const idx   = tasks.findIndex(t => t.id === taskId);
      if (idx === -1) return {};
      const [task] = tasks.splice(idx, 1);
      task.status = toStatus;
      if (afterId) {
        const afterIdx = tasks.findIndex(t => t.id === afterId);
        tasks.splice(afterIdx + 1, 0, task);
      } else {
        // put at end of column
        const lastInCol = tasks.map((t, i) => ({ t, i })).filter(({ t }) => t.status === toStatus).pop();
        if (lastInCol) tasks.splice(lastInCol.i + 1, 0, task);
        else tasks.push(task);
      }
      return { tasks };
    });
  },

  setSortField: (field) => {
    set(s => ({
      sortField: field,
      sortDir: s.sortField === field ? (s.sortDir === 'asc' ? 'desc' : 'asc') : 'asc',
    }));
  },

  filteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter(t => {
      if (filters.statuses.length && !filters.statuses.includes(t.status)) return false;
      if (filters.priorities.length && !filters.priorities.includes(t.priority)) return false;
      if (filters.assignees.length && !filters.assignees.includes(t.assigneeId)) return false;
      if (filters.dateFrom && t.dueDate < filters.dateFrom) return false;
      if (filters.dateTo   && t.dueDate > filters.dateTo)   return false;
      return true;
    });
  },

  sortedFilteredTasks: () => {
    const { sortField, sortDir } = get();
    const tasks = get().filteredTasks();
    return [...tasks].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title')    cmp = a.title.localeCompare(b.title);
      if (sortField === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortField === 'dueDate')  cmp = a.dueDate.localeCompare(b.dueDate);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  },
}));
