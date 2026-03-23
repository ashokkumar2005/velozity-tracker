import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Task, Status, STATUS_LABELS, SortField } from '../../types';
import { useStore } from '../../store/useStore';
import { USERS } from '../../data/seed';
import { formatDate, isOverdue, isDueToday } from '../../utils/date';
import { PriorityBadge } from '../ui/PriorityBadge';
import { Avatar } from '../ui/Avatar';
import { CollabUser } from '../../types';
import { CardPresence } from '../collaboration/CardPresence';

const ROW_HEIGHT = 56; // px
const BUFFER = 5;

interface Props { collabUsers: CollabUser[] }

const SortIcon: React.FC<{ field: SortField; active: boolean; dir: 'asc' | 'desc' }> = ({ field: _f, active, dir }) => (
  <span className={`inline-block ml-1 transition-colors ${active ? 'text-brand-500' : 'text-slate-300'}`}>
    {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
  </span>
);

const StatusDropdown: React.FC<{ task: Task; onChange: (s: Status) => void }> = ({ task, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const COLORS: Record<Status, string> = {
    todo: 'bg-slate-100 text-slate-600',
    inprogress: 'bg-blue-100 text-blue-700',
    inreview: 'bg-amber-100 text-amber-700',
    done: 'bg-green-100 text-green-700',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${COLORS[task.status]} hover:opacity-80 transition-opacity`}
      >
        {STATUS_LABELS[task.status]}
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-36 animate-slide-in">
          {(Object.keys(STATUS_LABELS) as Status[]).map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-50 ${task.status === s ? 'text-brand-600 font-bold' : 'text-slate-700'}`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ListView: React.FC<Props> = ({ collabUsers }) => {
  const { sortedFilteredTasks, sortField, sortDir, setSortField, updateTaskStatus, clearFilters } = useStore();
  const tasks = sortedFilteredTasks();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerHeight(el.clientHeight));
    ro.observe(el);
    setContainerHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    setScrollTop(containerRef.current?.scrollTop ?? 0);
  }, []);

  const totalHeight = tasks.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex   = Math.min(tasks.length - 1, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER);
  const visibleTasks = tasks.slice(startIndex, endIndex + 1);

  const COLS: { key: SortField; label: string; width: string }[] = [
    { key: 'title',    label: 'Title',    width: 'flex-1' },
    { key: 'priority', label: 'Priority', width: 'w-28' },
    { key: 'dueDate',  label: 'Due Date', width: 'w-32' },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
        <div className="w-10 shrink-0" />
        {COLS.map(col => (
          <button
            key={col.key}
            onClick={() => setSortField(col.key)}
            className={`${col.width} text-left text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 transition-colors`}
          >
            {col.label}
            <SortIcon field={col.key} active={sortField === col.key} dir={sortDir} />
          </button>
        ))}
        <div className="w-36 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500">Status</div>
        <div className="w-28 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500">Assignee</div>
        <div className="w-16 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500">Live</div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-400">No tasks match your filters</p>
          <p className="text-sm text-slate-300 mt-1 mb-4">Try adjusting the filters above</p>
          <button
            onClick={() => clearFilters()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* Virtual scroll container */
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative"
          style={{ overflowAnchor: 'none' }}
        >
          {/* Total height spacer */}
          <div style={{ height: totalHeight, position: 'relative' }}>
            {/* Visible rows positioned absolutely */}
            <div style={{ position: 'absolute', top: startIndex * ROW_HEIGHT, left: 0, right: 0 }}>
              {visibleTasks.map((task, idx) => {
                const assignee = USERS.find(u => u.id === task.assigneeId)!;
                const overdue  = isOverdue(task.dueDate);
                const dueToday = isDueToday(task.dueDate);
                const dateLabel = formatDate(task.dueDate);
                const rowIdx = startIndex + idx;

                return (
                  <div
                    key={task.id}
                    style={{ height: ROW_HEIGHT }}
                    className={`flex items-center gap-4 px-5 border-b border-slate-50 hover:bg-slate-50 transition-colors ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                  >
                    <div className="w-10 shrink-0 text-xs text-slate-300 font-mono">{rowIdx + 1}</div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                    </div>

                    {/* Priority */}
                    <div className="w-28 shrink-0">
                      <PriorityBadge priority={task.priority} />
                    </div>

                    {/* Due Date */}
                    <div className="w-32 shrink-0">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full
                        ${dueToday ? 'bg-blue-100 text-blue-700' : overdue ? 'bg-red-100 text-red-600' : 'text-slate-500'}`}>
                        {dateLabel}
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="w-36 shrink-0">
                      <StatusDropdown task={task} onChange={s => updateTaskStatus(task.id, s)} />
                    </div>

                    {/* Assignee */}
                    <div className="w-28 shrink-0 flex items-center gap-2">
                      <Avatar name={assignee.name} color={assignee.color} size="sm" />
                      <span className="text-xs text-slate-500 truncate">{assignee.name.split(' ')[0]}</span>
                    </div>

                    {/* Live Presence */}
                    <div className="w-16 shrink-0">
                      <CardPresence taskId={task.id} users={collabUsers} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer row count */}
      <div className="px-5 py-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 font-medium shrink-0">
        {tasks.length} tasks · rendering rows {startIndex + 1}–{Math.min(endIndex + 1, tasks.length)} of {tasks.length}
      </div>
    </div>
  );
};
