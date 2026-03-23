import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { FilterState, Status, Priority, STATUS_LABELS } from '../../types';
import { USERS } from '../../data/seed';
import { hasActiveFilters } from '../../utils/filters';

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (vals: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all
          ${selected.length ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
      >
        {label}
        {selected.length > 0 && (
          <span className="bg-brand-500 text-white rounded-full px-1.5 text-[10px] font-bold">{selected.length}</span>
        )}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-lg min-w-[160px] py-1 animate-slide-in">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                ${selected.includes(opt.value) ? 'bg-brand-500 border-brand-500' : 'border-slate-300'}`}>
                {selected.includes(opt.value) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const FilterBar: React.FC = () => {
  const { filters, setFilters, clearFilters } = useStore();
  const active = hasActiveFilters(filters);

  const update = <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
    setFilters({ ...filters, [key]: val });

  const statusOpts = (Object.keys(STATUS_LABELS) as Status[]).map(s => ({ value: s, label: STATUS_LABELS[s] }));
  const priorityOpts: { value: string; label: string }[] = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];
  const assigneeOpts = USERS.map(u => ({ value: u.id, label: u.name }));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MultiSelect label="Status" options={statusOpts} selected={filters.statuses} onChange={v => update('statuses', v as Status[])} />
      <MultiSelect label="Priority" options={priorityOpts} selected={filters.priorities} onChange={v => update('priorities', v as Priority[])} />
      <MultiSelect label="Assignee" options={assigneeOpts} selected={filters.assignees} onChange={v => update('assignees', v)} />

      <div className="flex items-center gap-1.5">
        <label className="text-xs text-slate-500 font-medium">From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => update('dateFrom', e.target.value)}
          className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <label className="text-xs text-slate-500 font-medium">To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => update('dateTo', e.target.value)}
          className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {active && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors animate-fade-in"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  );
};
