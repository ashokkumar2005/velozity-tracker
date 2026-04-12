# 🚀 Velozity — Multi-View Project Tracker

A high-performance **project management UI** built with **React, TypeScript, Tailwind CSS, and Zustand**.

Designed to handle **large-scale datasets efficiently**, featuring custom-built solutions for **virtual scrolling** and **drag-and-drop interactions** — without relying on heavy external libraries.

---

# 🌐 Live Demo

Deploy instantly using Vercel:

```bash
npm install
npm run build
vercel --prod
```

---

# ⚙️ Setup Instructions

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

# 🧠 State Management — Why Zustand?

Zustand was chosen for its **performance, simplicity, and scalability**.

### ✅ Advantages

* Minimal boilerplate (no reducers or action types)
* No provider wrapping required
* Selective subscriptions (optimized re-renders)
* Built-in support for derived state
* Clean scaling for mid-to-large applications

### ⚖️ Compared to Context + useReducer

| Context + useReducer       | Zustand                    |
| -------------------------- | -------------------------- |
| Requires Providers         | No Providers               |
| Dispatch-based logic       | Direct state updates       |
| Re-renders more components | Fine-grained subscriptions |
| More boilerplate           | Lightweight                |

---

# 📜 Virtual Scrolling (Custom Implementation)

Efficiently handles **500+ tasks** without external libraries.

### 🔧 How It Works

* Full-height spacer → `tasks.length × ROW_HEIGHT`
* Renders only visible rows
* Absolute positioning → `top = index × ROW_HEIGHT`
* Uses `ResizeObserver` for container tracking
* Fixed row height (`56px`) enables **O(1) calculations**

### ✅ Result

* Smooth scrolling
* No flickering
* No empty gaps
* High performance even with large datasets

---

# 🧲 Drag-and-Drop (From Scratch)

Built using **native HTML5 Drag Events** — no external libraries.

### 🔄 Flow

1. **Drag Start**

   * Store task ID via `useRef`
   * Apply opacity for feedback

2. **Drag Over**

   * Track cursor position
   * Calculate insertion index dynamically

3. **Placeholder Rendering**

   * Controlled via React state (`placeholderAfter`)
   * Avoids direct DOM manipulation

4. **Drop**

   * Calls Zustand `moveTask()` to update state

5. **Snap-back Behavior**

   * No drop target → no state change
   * Smooth return animation

6. **Touch Support**

   * Custom `useTouchDrag` hook
   * Converts gestures into drag interactions

---

# 🧩 Hardest Problem Solved

## Drag Placeholder Without Layout Shift

### ❌ Problem

Direct DOM insertion caused layout jitter and unstable UI.

### ✅ Solution

* Placeholder managed via React state
* Rendered declaratively inside JSX
* Leveraged React batching for smooth updates

### 🎯 Result

* No layout shift
* No jitter
* Seamless drag experience

---

# 🔧 Future Improvements

* Memoize `TimelineView` calculations (`useMemo`)
* Cache month boundaries
* Extract header into memoized components
* Add keyboard accessibility for drag-and-drop
* Introduce unit and performance tests

---

# 📊 Performance

🔥 **Lighthouse Score: 92 (Desktop)**

### Run Performance Test

```bash
npm run build
npm run preview
```

Then:

* Open Chrome DevTools
* Go to **Lighthouse**
* Run Performance Audit

---

# 🛠 Tech Stack

* ⚛️ React 18 + TypeScript
* 🐻 Zustand (State Management)
* 🎨 Tailwind CSS
* ⚡ Vite

---

# 🚫 Zero-Dependency Philosophy

This project intentionally avoids heavy libraries:

* ❌ No drag-and-drop libraries
* ❌ No virtual scrolling libraries
* ❌ No UI component libraries

### ✅ Why?

* Full control over behavior
* Better performance tuning
* Deeper understanding of core concepts

---

# 💡 Key Highlights

* Handles **500+ tasks efficiently**
* Custom-built **virtual scrolling engine**
* Smooth and responsive **drag-and-drop UX**
* Clean, scalable architecture
* Optimized rendering with Zustand
* Real-world performance-focused design

---

# 📌 Author Notes

This project emphasizes:

* Performance-first thinking
* Building from first principles
* Clean and maintainable architecture

It reflects how real-world systems are designed when **performance and control matter**.

---

# 👨‍💻 Author

**AshokKumar T**

---

# ⭐ Support

If you found this project useful:

⭐ Star the repo
🍴 Fork it
📢 Share it

---

> 💡 *Built with performance in mind. Engineered for real-world scalability.*
