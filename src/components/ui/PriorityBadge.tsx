import React from 'react';
import { Priority, PRIORITY_COLORS } from '../../types';

interface Props { priority: Priority }

const LABELS: Record<Priority, string> = {
  critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low',
};

export const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const c = PRIORITY_COLORS[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {LABELS[priority]}
    </span>
  );
};
