import React, { useRef } from 'react';
import { Task } from '../../types';
import { USERS } from '../../data/seed';
import { formatDate, isOverdue, isDueToday } from '../../utils/date';
import { PriorityBadge } from '../ui/PriorityBadge';
import { Avatar } from '../ui/Avatar';
import { CardPresence } from '../collaboration/CardPresence';
import { CollabUser } from '../../types';

interface Props {
  task: Task;
  collabUsers: CollabUser[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

export const KanbanCard: React.FC<Props> = ({ task, collabUsers, onDragStart }) => {
  const assignee = USERS.find(u => u.id === task.assigneeId)!;
  const overdue = isOverdue(task.dueDate);
  const dueToday = isDueToday(task.dueDate);
  const dateLabel = formatDate(task.dueDate);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      draggable
      onDragStart={e => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id);
        onDragStart(e, task.id);
        // slight delay so browser capture shows the card
        setTimeout(() => {
          if (ref.current) ref.current.style.opacity = '0.4';
        }, 0);
      }}
      onDragEnd={() => {
        if (ref.current) ref.current.style.opacity = '1';
      }}
      className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md hover:border-slate-300 cursor-grab active:cursor-grabbing transition-all duration-150 group select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2">{task.title}</p>
        <CardPresence taskId={task.id} users={collabUsers} />
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between">
        <Avatar name={assignee.name} color={assignee.color} size="sm" />
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full
          ${dueToday ? 'bg-blue-100 text-blue-700' : overdue ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
          {dateLabel}
        </span>
      </div>
    </div>
  );
};
