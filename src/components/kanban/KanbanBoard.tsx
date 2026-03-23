import React, { useRef, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { Status, CollabUser } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { useTouchDrag } from '../../hooks/useTouchDrag';

const COLUMNS: Status[] = ['todo', 'inprogress', 'inreview', 'done'];

interface Props { collabUsers: CollabUser[] }

export const KanbanBoard: React.FC<Props> = ({ collabUsers }) => {
  const { filteredTasks, moveTask } = useStore();
  const tasks = filteredTasks();
  const draggingId = useRef<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (_e: React.DragEvent, taskId: string) => {
    draggingId.current = taskId;
  };

  const handleDrop = (toStatus: Status, afterId?: string) => {
    if (!draggingId.current) return;
    moveTask(draggingId.current, toStatus, afterId);
    draggingId.current = null;
  };

  const handleDragEnd = (_e: React.DragEvent) => {
    draggingId.current = null;
  };

  const handleTouchMove = useCallback((taskId: string, toStatus: Status) => {
    moveTask(taskId, toStatus);
  }, [moveTask]);

  useTouchDrag(boardRef as React.RefObject<HTMLElement>, { onMove: handleTouchMove });

  return (
    <div
      ref={boardRef}
      className="flex gap-4 overflow-x-auto pb-4 flex-1"
      onDragEnd={handleDragEnd}
    >
      {COLUMNS.map(status => (
        <div key={status} data-column-status={status} className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
          <KanbanColumn
            status={status}
            tasks={tasks.filter(t => t.status === status)}
            collabUsers={collabUsers}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        </div>
      ))}
    </div>
  );
};
