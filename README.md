# 🚀 Velozity — Multi-View Project Tracker

A high-performance **project management UI** built with **React, TypeScript, Tailwind CSS, and Zustand**.
Designed to handle large datasets smoothly with custom implementations for virtual scrolling and drag-and-drop.

---

## 🌐 Live Demo

Deploy easily using Vercel:

```bash
npm install
npm run build
vercel --prod
```

---

## ⚙️ Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Requirements:** Node.js 18+

---

## 🧠 State Management — Why Zustand?

I chose **Zustand** over React Context + useReducer for simplicity and performance:

* ✅ **Minimal boilerplate** — no providers, reducers, or action types
* 🎯 **Selective subscriptions** — components only re-render when needed
* 🧮 **Built-in derived state** — logic like filtering & sorting lives inside the store
* ⚡ **Scales cleanly** — perfect for medium-complex apps without Redux overhead

Compared to Context + useReducer:

* ❌ Requires Provider wrapping
* ❌ Adds dispatch complexity
* ❌ Lacks efficient selector-based updates

---

## 📜 Virtual Scrolling (Custom Implementation)

The `ListView` handles **500+ tasks efficiently** without external libraries:

* Uses a full-height spacer (`tasks.length × ROW_HEIGHT`)
* Renders only visible rows based on scroll position
* Positions items using absolute positioning (`top = index × ROW_HEIGHT`)
* Tracks container size using `ResizeObserver`
* Fixed row height (`56px`) ensures **O(1) calculations**

✅ Result: Smooth scrolling, no flickering, no blank gaps

---

## 🧲 Drag-and-Drop (From Scratch)

Implemented using **native HTML5 Drag Events**:

### Flow:

1. **Drag Start**

   * Store task ID using `useRef`
   * Apply opacity for visual feedback

2. **Drag Over**

   * Detect cursor position
   * Dynamically calculate insertion point

3. **Placeholder**

   * Rendered via React state (NOT direct DOM manipulation)
   * Prevents layout jitter

4. **Drop**

   * Calls Zustand `moveTask()` to update state

5. **Snap-back**

   * If dropped outside → no state change
   * Smooth return via CSS transition

6. **Touch Support**

   * Custom `useTouchDrag` hook
   * Converts touch gestures into drag actions

---

## 🧩 Hardest Problem Solved

### Drag Placeholder Without Layout Shift

**Problem:**
Direct DOM insertion caused layout jitter during drag.

**Solution:**

* Controlled placeholder using React state (`placeholderAfter`)
* Rendered inside JSX instead of DOM mutation
* React batching ensures smooth updates

✅ Result:

* No jitter
* No layout shift
* Smooth UX

---

## 🔧 Future Refactor

The `TimelineView` currently recalculates bar positions on every render.

### Planned improvements:

* Memoize calculations using `useMemo`
* Cache month boundaries
* Extract header into a memoized component

---

## 📊 Performance

**Lighthouse Score:**
🔥 **92 Performance (Desktop)**

To test:

```bash
npm run build
npm run preview
```

Then open Chrome DevTools → Lighthouse → Audit

---

## 🛠 Tech Stack

* ⚛️ React 18 + TypeScript
* 🐻 Zustand (state management)
* 🎨 Tailwind CSS (no UI libraries)
* ⚡ Vite (build tool)

### Zero Dependencies Philosophy:

* ❌ No drag-and-drop libraries
* ❌ No virtual scrolling libraries
* ❌ No UI component libraries

---

## 💡 Key Highlights

* Handles **500+ tasks efficiently**
* Fully custom **virtual scrolling**
* Smooth **drag-and-drop UX**
* Clean and scalable architecture
* Optimized rendering with Zustand

---

## 📌 Author Notes

This project focuses on **performance, simplicity, and control** —
building core UI systems from scratch instead of relying on heavy libraries.

---

⭐ If you like this project, consider giving it a star!
