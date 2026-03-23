import React from 'react';
import { CollabUser } from '../../types';
import { Avatar } from '../ui/Avatar';

interface Props { taskId: string; users: CollabUser[] }

export const CardPresence: React.FC<Props> = ({ taskId, users }) => {
  const here = users.filter(u => u.taskId === taskId);
  if (!here.length) return null;

  const visible = here.slice(0, 2);
  const overflow = here.length - visible.length;

  return (
    <div className="flex items-center -space-x-1.5 animate-fade-in">
      {visible.map(cu => (
        <Avatar
          key={cu.user.id}
          name={cu.user.name}
          color={cu.user.color}
          size="sm"
          title={`${cu.user.name} is ${cu.action}`}
          className="ring-2 ring-white transition-all duration-500"
        />
      ))}
      {overflow > 0 && (
        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 ring-2 ring-white">
          +{overflow}
        </div>
      )}
    </div>
  );
};
