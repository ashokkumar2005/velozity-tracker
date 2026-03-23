import React from 'react';
import { CollabUser } from '../../types';
import { Avatar } from '../ui/Avatar';

interface Props { users: CollabUser[] }

export const PresenceBar: React.FC<Props> = ({ users }) => {
  const active = users.filter(u => u.taskId);
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center -space-x-2">
        {active.map(cu => (
          <Avatar
            key={cu.user.id}
            name={cu.user.name}
            color={cu.user.color}
            size="sm"
            className="ring-2 ring-white transition-all duration-500"
          />
        ))}
      </div>
      <span className="text-xs text-slate-500 font-medium">
        {active.length} {active.length === 1 ? 'person' : 'people'} viewing this board
      </span>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
    </div>
  );
};
