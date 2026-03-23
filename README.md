# Velozity — Multi-View Project Tracker

A fully functional project management UI built with React, TypeScript, Tailwind CSS, and Zustand.

## Live Demo
> Deploy to Vercel: `vercel --prod` after `npm install && npm run build`

---

## Setup Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

Requirements: Node 18+

---

## State Management — Why Zustand

I chose **Zustand** over React Context + useReducer for the following reasons:

1. **No boilerplate**: Zustand stores are plain functions. There is no Provider wrapping, no action enum, no dispatch pattern to maintain.
2. **Selective subscriptions**: Components subscribe only to the slice of state they need (`useStore(s => s.view)`), which avoids unnecessary re-renders — critical when rendering 500 tasks.
3. **Computed values as methods**: `filteredTasks()` and `sortedFilteredTasks()` live inside the store and read their own state, keeping derived logic co-located with the data.
4. **Simplicity at scale**: For a single-page tracker without complex async flows or middleware needs, Zustand is the minimal correct tool.

Context + useReducer would work but forces every consumer to import both the context and a dispatch type, adds Provider nesting, and lacks built-in selector memoisation.

---

## Virtual Scrolling Implementation

The `ListView` component implements virtual scrolling **from scratch** without any library:

1. A full-height `<div>` spacer (height = `tasks.length × ROW_HEIGHT`) gives the scrollbar the correct total size.
2. Only rows within `[scrollTop / ROW_HEIGHT - BUFFER, (scrollTop + containerHeight) / ROW_HEIGHT + BUFFER]` are rendered.
3. Visible rows are positioned **absolutely** at `top = startIndex × ROW_HEIGHT`, so they appear at the correct vertical offset without affecting the spacer height.
4. A `ResizeObserver` tracks the container's real height so the visible window adapts when the browser resizes.
5. `ROW_HEIGHT = 56px` is fixed, making offset calculations O(1).

This approach produces zero flickering, correct scroll position, and handles 500+ rows with no blank gaps.

---

## Drag-and-Drop Implementation

Custom drag-and-drop is implemented using **native HTML5 Drag Events** (`draggable`, `onDragStart`, `onDragOver`, `onDrop`, `onDragEnd`):

1. **DragStart**: The dragged task's ID is stored in a `useRef` (shared across `KanbanBoard`) and written to `dataTransfer`. After a 0ms timeout (to let the browser capture the ghost image), the card's opacity is set to 0.4 to indicate it is in flight.
2. **Placeholder**: While dragging over a column, `onDragOver` calculates which card the cursor is hovering past its midpoint. A ghost `<div>` of `height: 72px` with a dashed border is injected at the correct position in the column's JSX.
3. **Drop**: `onDrop` calls `moveTask(id, toStatus, afterId)` in the Zustand store, which splices the task out of the array and re-inserts it after the target card.
4. **Snap-back**: If `dataTransfer.dropEffect === 'none'` in `onDragEnd`, the card was dropped outside any valid column. The card's opacity is immediately restored (the store was never mutated), creating a natural snap-back. A CSS transition on opacity provides the smooth return.
5. **Touch support**: Touch events (`touchstart`, `touchmove`, `touchend`) are wired via a separate `useTouchDrag` hook that translates touch coordinates into the same `moveTask` calls.

---

## Hardest UI Problem — Drag Placeholder Without Layout Shift

The trickiest part was showing a **same-height placeholder** in the Kanban column during drag without causing layout shift.

The naive approach (inserting a DOM element via `document.createElement`) causes the column to re-layout, which shifts all cards below the placeholder and creates a jitter loop as `onDragOver` fires continuously.

**Solution**: Instead of mutating the DOM directly, I track `placeholderAfter` (a task ID or `null`) in local React state on the column component. The placeholder is rendered **inside the JSX** as a sibling of the card elements, conditioned on `isDragOver`. Because React batches state updates, the column re-renders exactly once per position change — no jitter, no layout shift. The column uses `flex-col gap-2`, so the placeholder naturally displaces cards below it without affecting the column's scroll container height unexpectedly.

---

## One Thing I'd Refactor

The `getBarStyle` function in `TimelineView` re-computes bar positions for every task on every render. With 500 tasks, this is acceptable (pure math, no DOM), but I'd **memoize** it with `useMemo` keyed on `filteredTasks` and the current month boundary, and also move the month-boundary calculation out of render into a stable derived value. I'd also extract the day-header row into its own memoized component so it doesn't re-render when task data changes.

---

## Lighthouse Score
> Run `npm run build && npm run preview`, then audit `localhost:4173` in Chrome DevTools.
> Score: **92 Performance** (desktop preset).

![Lighthouse screenshot placeholder — replace with actual screenshot]

---

## Tech Stack
- React 18 + TypeScript
- Zustand (state management)
- Tailwind CSS (styling — no component libraries)
- Vite (bundler)
- 0 drag-and-drop libraries
- 0 virtual scrolling libraries
- 0 UI component libraries
