import React from 'react';
import { getInitials } from '../../utils/date';

interface AvatarProps {
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
}

const SIZES = { sm: 'w-6 h-6 text-[10px]', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' };

export const Avatar: React.FC<AvatarProps> = ({ name, color, size = 'md', className = '', title }) => (
  <div
    className={`${SIZES[size]} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white select-none shrink-0 ${className}`}
    style={{ backgroundColor: color }}
    title={title ?? name}
  >
    {getInitials(name)}
  </div>
);
