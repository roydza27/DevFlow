# DEVFLOW REUSABLE COMPONENT MAPPING DOCUMENT (FINAL)

---

# 📌 1. Purpose

Define:

* Which components are **reused (not built)**
* Which are **custom-built**
* How libraries map to **workspace features**

---

## 🎯 Goal

👉 Maximize:

* development speed
* UI consistency
* maintainability

👉 Minimize:

* redundant code
* UI bugs
* unnecessary complexity

---

# 📌 2. Core Strategy

---

## 🧠 Rule 1: Reuse by Default

If something is:

* UI-heavy
* generic
* already solved

❌ Do NOT build
✅ Use a library

---

## 🧠 Rule 2: Build Only What Matters

You only build:

* business logic
* workspace-specific UI
* interaction behavior

---

## 🧠 Rule 3: Composition Over Creation

👉 Build complex UI by composing:

* shadcn components
* small reusable wrappers

---

# 📌 3. Stack Mapping (FINAL)

---

## 🎨 UI System

👉 **shadcn/ui**

---

### Why:

* Tailwind-based
* Copy-paste flexibility
* Fully customizable
* No runtime overhead

---

## 🧱 Use For:

* Button
* Input
* Card
* Badge
* Dropdown
* Dialog
* Separator
* Progress

---

---

## 🎯 Drag & Drop

👉 **dnd-kit**

---

### Use For:

* Task reordering
* Drag interactions

---

---

## ⚡ Command Palette (Future)

👉 **cmdk**

---

### Use For:

* global quick actions
* keyboard-driven interaction

---

---

## 🧠 Markdown Editor

👉 **MDXEditor**

---

### Alternative:

👉 Novel

---

### Use For:

* notes workspace
* markdown editing

---

---

# 📌 4. Component Mapping (FEATURE → LIBRARY)

---

# 🧩 4.1 Workspace Layout

---

## Needed:

* Panel layout
* Split sections
* Containers

---

## Use:

👉 shadcn + Tailwind

---

## Components:

* Card
* Separator
* ScrollArea
* Resizable (optional)

---

---

# 📋 4.2 Task System

---

## Needed:

* Task list
* Task grouping
* Status indicators
* Actions (done, block, edit, delete)

---

## Use:

* UI → shadcn
* Drag → dnd-kit

---

## Mapping:

| Feature        | Tool    |
| -------------- | ------- |
| Task container | Card    |
| Status badge   | Badge   |
| Quick input    | Input   |
| Action buttons | Button  |
| Drag system    | dnd-kit |

---

---

# 🎯 4.3 Focus Panel (CENTER CORE)

---

## Needed:

* Active task display
* Timer UI
* Controls
* Mini insights

---

## Use:

👉 shadcn + custom logic

---

## Mapping:

| Feature        | Tool          |
| -------------- | ------------- |
| Timer display  | Custom        |
| Buttons        | shadcn Button |
| Insights cards | Card          |

---

---

# ⚡ 4.4 Commands / Quick Actions

---

## Needed:

* Command list
* Copy interaction

---

## Use:

* UI → Card / List
* Copy → Browser Clipboard API

---

---

# 📜 4.5 Logs System (NEW)

---

## Needed:

* Log list
* Quick add input
* Timestamp display

---

## Use:

👉 shadcn Input + Card

---

## Mapping:

| Feature   | Tool  |
| --------- | ----- |
| Log item  | Card  |
| Input     | Input |
| Timestamp | Text  |

---

---

# 🔗 4.6 Resources System

---

## Needed:

* Categorized resources
* Grouped display
* External links

---

## Use:

👉 shadcn Card + Badge

---

## Mapping:

| Feature        | Tool   |
| -------------- | ------ |
| Resource card  | Card   |
| Category label | Badge  |
| Link           | Anchor |

---

---

# 🧠 4.7 Notes Workspace (UPGRADED)

---

## Needed:

* File list (sidebar)
* Editor
* File switching

---

## Use:

👉 MDXEditor

---

## Additional:

* Sidebar → custom + shadcn
* Tabs (optional minimal use)

---

---

# 📊 4.8 Feedback & Insights

---

## Needed:

* Progress display
* Stats

---

## Use:

👉 shadcn Progress + Card

---

---

# 📌 5. Component Layers (IMPORTANT)

---

## 🔹 Layer 1: Library Components

From shadcn:

* Button
* Input
* Card
* Badge
* Dialog
* Dropdown
* Progress

---

---

## 🔹 Layer 2: Shared Components (YOU BUILD)

Reusable across features:

* TaskItem
* CommandItem
* ResourceItem
* LogItem
* TimerDisplay
* EmptyState
* SectionHeader

---

---

## 🔹 Layer 3: Feature Components

Workspace-specific:

* TaskPanel
* FocusPanel
* LogsPanel
* ResourcesPanel
* NotesWorkspace

---

---

## 🔹 Layer 4: Layout Components

* DashboardLayout
* WorkspaceGrid
* RightSidebar

---

---

## 🔹 Layer 5: Page Components

* DashboardPage

---

---

# 📌 6. Reuse Strategy

---

## Rule 1:

👉 Build once → reuse everywhere

---

## Rule 2:

👉 Extract repeated patterns early

---

## Rule 3:

👉 Keep components small and focused

---

## Rule 4:

👉 Prefer composition over inheritance

---

---

# 📌 7. Styling Strategy

---

## Use:

👉 Tailwind (via shadcn)

---

## Rules:

* No inline styles
* No large CSS files
* Use utility-first approach

---

---

# 📌 8. Interaction Patterns

---

## Standard Patterns:

* Click → state change
* Enter → submit
* Hover → subtle feedback

---

## Feedback:

* Copy → toast
* Action → immediate UI update

---

---

# 📌 9. Avoid Rebuilding These

---

❌ Buttons
❌ Inputs
❌ Modals
❌ Dropdowns
❌ Editor
❌ Drag system

---

👉 Already solved problems

---

---

# 📌 10. Custom Components (YOU MUST BUILD)

---

Core logic components:

* Task logic
* Timer system
* Logs system
* Notes workspace
* Resource grouping
* Workspace layout

---

---

# 📌 11. Integration Strategy

---

## Step-by-step:

1. Setup shadcn
2. Install dnd-kit
3. Add MDXEditor
4. Create shared components
5. Build feature modules
6. Compose workspace

---

---

# 📌 12. Performance Considerations

---

Libraries chosen are:

* Lightweight
* Tree-shakeable
* Fast

---

## Strategy:

* Avoid heavy libraries
* Lazy load editor if needed

---

---

# 📌 13. Future Expansion

---

Supports:

* Command palette (cmdk)
* Animations (Framer Motion)
* Desktop wrapper (Tauri)
* Advanced keyboard shortcuts

---
