import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Task, PRIORITY_TIMELINE_COLORS } from '../../types';
import { parseDate, today, diffDays } from '../../utils/date';
import { USERS } from '../../data/seed';
import { Avatar } from '../ui/Avatar';

const DAY_WIDTH = 36; // px per day

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthDays(): Date[] {
  const t = today();
  const year = t.getFullYear();
  const month = t.getMonth();
  const count = getDaysInMonth(year, month);
  return Array.from({ length: count }, (_, i) => new Date(year, month, i + 1));
}

const WEEKDAY = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const TimelineView: React.FC = () => {
  const tasks = useStore(s => s.filteredTasks());
  const days = getMonthDays();
  const t = today();
  const monthStart = days[0];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [todayLeft, setTodayLeft] = useState(0);

  useEffect(() => {
    const offset = diffDays(monthStart, t);
    const left = offset * DAY_WIDTH + DAY_WIDTH / 2;
    setTodayLeft(left);
    // scroll to today
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(0, left - 200);
    }
  }, []);

  const getBarStyle = (task: Task): { left: number; width: number } | null => {
    const due = parseDate(task.dueDate);
    const start = task.startDate ? parseDate(task.startDate) : due;
    const monthEnd = days[days.length - 1];

    // both outside month
    if (due < monthStart && start < monthStart) return null;

    const clampedStart = start < monthStart ? monthStart : start;
    const clampedEnd   = due > monthEnd ? monthEnd : due;

    const left  = diffDays(monthStart, clampedStart) * DAY_WIDTH;
    const width = Math.max(DAY_WIDTH, diffDays(clampedStart, clampedEnd) * DAY_WIDTH + DAY_WIDTH);
    return { left, width };
  };

  const totalWidth = days.length * DAY_WIDTH;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Month label */}
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700">
          {t.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <span className="text-xs text-slate-400 font-medium">{tasks.length} tasks</span>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left label pane */}
        <div className="w-48 shrink-0 border-r border-slate-100 overflow-y-auto flex flex-col">
          <div className="h-10 border-b border-slate-100 shrink-0" />
          {tasks.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-slate-400">No tasks</p>
            </div>
          )}
          {tasks.map(task => {
            const assignee = USERS.find(u => u.id === task.assigneeId)!;
            return (
              <div key={task.id} className="flex items-center gap-2 px-3 border-b border-slate-50 shrink-0" style={{ height: 44 }}>
                <Avatar name={assignee.name} color={assignee.color} size="sm" />
                <p className="text-xs font-medium text-slate-700 truncate">{task.title}</p>
              </div>
            );
          })}
        </div>

        {/* Scrollable timeline pane */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto">
          <div style={{ width: totalWidth, minWidth: totalWidth }} className="relative">
            {/* Day headers */}
            <div className="flex sticky top-0 bg-white z-10 border-b border-slate-100" style={{ height: 40 }}>
              {days.map((day, i) => {
                const isToday = diffDays(t, day) === 0;
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                return (
                  <div
                    key={i}
                    style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                    className={`flex flex-col items-center justify-center border-r border-slate-50 text-[10px] shrink-0
                      ${isToday ? 'bg-brand-500 text-white font-bold' : isWeekend ? 'bg-slate-50 text-slate-400' : 'text-slate-500'}`}
                  >
                    <span>{WEEKDAY[day.getDay()]}</span>
                    <span className="font-semibold">{day.getDate()}</span>
                  </div>
                );
              })}
            </div>

            {/* Grid rows + bars */}
            <div className="relative">
              {/* Today line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-brand-500 z-20 pointer-events-none"
                style={{ left: todayLeft }}
              />

              {/* Weekend shading */}
              {days.map((day, i) => {
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                if (!isWeekend) return null;
                return (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 bg-slate-50"
                    style={{ left: i * DAY_WIDTH, width: DAY_WIDTH }}
                  />
                );
              })}

              {tasks.length === 0 && (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-slate-400">No tasks to display</p>
                </div>
              )}

              {tasks.map((task, rowIdx) => {
                const bar = getBarStyle(task);
                const color = PRIORITY_TIMELINE_COLORS[task.priority];
                return (
                  <div
                    key={task.id}
                    className="relative border-b border-slate-50"
                    style={{ height: 44 }}
                  >
                    {/* Row background grid lines */}
                    {days.map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-r border-slate-50"
                        style={{ left: i * DAY_WIDTH, width: DAY_WIDTH }}
                      />
                    ))}

                    {bar && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 rounded-full flex items-center px-2 text-white text-[10px] font-semibold shadow-sm overflow-hidden whitespace-nowrap"
                        style={{
                          left: bar.left,
                          width: bar.width,
                          height: 24,
                          backgroundColor: color,
                          opacity: 0.9,
                        }}
                        title={task.title}
                      >
                        <span className="truncate">{bar.width > 60 ? task.title : ''}</span>
                      </div>
                    )}

                    {/* No start date — single day marker */}
                    {!task.startDate && !bar && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow"
                        style={{
                          left: diffDays(monthStart, parseDate(task.dueDate)) * DAY_WIDTH + DAY_WIDTH / 2 - 6,
                          backgroundColor: color,
                        }}
                        title={`${task.title} (due)`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
