import React, { useState, useRef } from 'react';
import { Task, Status, STATUS_LABELS, CollabUser } from '../../types';
import { KanbanCard } from './KanbanCard';

interface Props {
  status: Status;
  tasks: Task[];
  collabUsers: CollabUser[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (toStatus: Status, afterId?: string) => void;
}

const COLUMN_STYLES: Record<Status, { header: string; dot: string; countBg: string }> = {
  todo:       { header: 'text-slate-600', dot: 'bg-slate-400',  countBg: 'bg-slate-100 text-slate-600' },
  inprogress: { header: 'text-blue-600',  dot: 'bg-blue-400',   countBg: 'bg-blue-100 text-blue-700' },
  inreview:   { header: 'text-amber-600', dot: 'bg-amber-400',  countBg: 'bg-amber-100 text-amber-700' },
  done:       { header: 'text-green-600', dot: 'bg-green-400',  countBg: 'bg-green-100 text-green-700' },
};

export const KanbanColumn: React.FC<Props> = ({ status, tasks, collabUsers, onDragStart, onDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [placeholderAfter, setPlaceholderAfter] = useState<string | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const styles = COLUMN_STYLES[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);

    // Determine placeholder position
    const cardEls = columnRef.current?.querySelectorAll('[data-card-id]');
    if (!cardEls || cardEls.length === 0) {
      setPlaceholderAfter(null);
      return;
    }

    let after: string | null = null;
    for (const el of Array.from(cardEls)) {
      const rect = el.getBoundingClientRect();
      if (e.clientY > rect.top + rect.height / 2) {
        after = el.getAttribute('data-card-id');
      }
    }
    setPlaceholderAfter(after);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!columnRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setPlaceholderAfter(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setPlaceholderAfter(null);
    onDrop(status, placeholderAfter ?? undefined);
  };

  return (
    <>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
          <h3 className={`text-sm font-bold uppercase tracking-wider ${styles.header}`}>
            {STATUS_LABELS[status]}
          </h3>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles.countBg}`}>
          {tasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={columnRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 rounded-2xl p-2.5 flex flex-col gap-2 min-h-[200px] overflow-y-auto max-h-[calc(100vh-260px)] transition-colors duration-150 
          ${isDragOver ? 'bg-brand-50 border-2 border-dashed border-brand-300' : 'bg-slate-50 border-2 border-transparent'}`}
      >
        {tasks.length === 0 && !isDragOver && (
          <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-400">No tasks here</p>
            <p className="text-xs text-slate-300 mt-1">Drag cards to fill this column</p>
          </div>
        )}

        {tasks.map((task, i) => (
          <React.Fragment key={task.id}>
            {isDragOver && placeholderAfter === null && i === 0 && (
              <div className="h-[72px] rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 flex items-center justify-center">
                <span className="text-xs text-brand-400 font-medium">Drop here</span>
              </div>
            )}
            <div data-card-id={task.id}>
              <KanbanCard task={task} collabUsers={collabUsers} onDragStart={onDragStart} />
            </div>
            {isDragOver && placeholderAfter === task.id && (
              <div className="h-[72px] rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 flex items-center justify-center">
                <span className="text-xs text-brand-400 font-medium">Drop here</span>
              </div>
            )}
          </React.Fragment>
        ))}

        {isDragOver && tasks.length === 0 && (
          <div className="h-[72px] rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 flex items-center justify-center">
            <span className="text-xs text-brand-400 font-medium">Drop here</span>
          </div>
        )}
      </div>
    </>
  );
};
