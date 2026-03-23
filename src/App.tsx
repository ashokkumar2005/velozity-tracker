import React from 'react';
import { useStore } from './store/useStore';
import { ViewSwitcher } from './components/ui/ViewSwitcher';
import { FilterBar } from './components/filters/FilterBar';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/list/ListView';
import { TimelineView } from './components/timeline/TimelineView';
import { PresenceBar } from './components/collaboration/PresenceBar';
import { useCollaboration } from './hooks/useCollaboration';

export const App: React.FC = () => {
  const view = useStore(s => s.view);
  const collabUsers = useCollaboration();

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-display overflow-hidden">
      {/* Top nav */}
      <header className="shrink-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">Velozity</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-sm text-slate-500 font-medium">Project Tracker</span>
        </div>

        <PresenceBar users={collabUsers} />

        <ViewSwitcher />
      </header>

      {/* Filter bar */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-3">
        <FilterBar />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-0 px-6 py-4 flex flex-col overflow-hidden">
        {view === 'kanban'   && <KanbanBoard collabUsers={collabUsers} />}
        {view === 'list'     && <ListView collabUsers={collabUsers} />}
        {view === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
};
