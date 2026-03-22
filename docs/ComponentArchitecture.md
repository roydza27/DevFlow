# DEVFLOW COMPONENT ARCHITECTURE DOCUMENT (FINAL)

---

# 📌 1. Goals of Component Design

Your component system must:

* Be **modular**
* Be **feature-driven (workspace-based)**
* Be **reusable across panels**
* Keep logic **separated from UI**
* Prevent **deep nesting**
* Support **single-screen workflow**
* Reflect **Project = Workspace architecture**

---

# 📌 2. Architectural Principles

---

## 🧠 Principle 1: Feature-Based Structure (Workspace-Oriented)

❌ Avoid type-based grouping

✅ Use:

features/
workspace/
tasks/
tracking/
logs/
notes/
resources/
commands/

---

## 🧠 Principle 2: Smart vs Dumb Components

* **Smart (Container)** → state + logic
* **Dumb (Presentational)** → UI only

---

## 🧠 Principle 3: Workspace-Driven Composition

👉 UI is built around:

* one project
* one workspace
* one screen

---

## 🧠 Principle 4: Reusability First

* Components must be composable
* Avoid duplication

---

# 📌 3. Folder Structure (UPDATED)

resources/js/

├── app/
│   ├── layout/
│   ├── providers/
│   └── hooks/

├── features/
│   ├── workspace/        (core container)
│   ├── tasks/
│   ├── tracking/
│   ├── logs/
│   ├── notes/
│   ├── resources/
│   └── commands/

├── components/
│   ├── ui/              (shadcn)
│   ├── shared/
│   └── layout/

├── pages/
│   └── dashboard/

├── lib/
│   ├── utils/
│   └── constants/

---

# 📌 4. High-Level Component Tree (UPDATED)

DashboardPage
├── DashboardLayout
│
├── WorkspaceHeader
│
├── WorkspaceGrid
│
│   ├── TaskPanel
│   │   ├── TaskQuickAdd
│   │   ├── TaskGroup
│   │   │   ├── TaskItem
│   │
│   ├── FocusPanel
│   │   ├── ActiveTask
│   │   ├── TimerDisplay
│   │   ├── TimerControls
│   │   └── MiniInsights
│
│   ├── RightSidebar
│   │   ├── CollapsibleSection
│   │   │   ├── QuickActionsPanel
│   │   │   ├── ResourcesPanel
│   │   │   ├── CommandsPanel
│   │   │   └── LogsPanel
│
│   ├── NotesWorkspace
│   │   ├── NotesSidebar
│   │   └── NoteEditor
│
└── FooterStats

---

# 📌 5. Component Breakdown (DETAILED)

---

# 🖥️ 5.1 Dashboard Layer

---

## 👉 `DashboardPage`

### Type:

Smart Component

### Responsibilities:

* Load workspace data via Inertia
* Initialize project context
* Pass data to workspace

---

---

## 👉 `DashboardLayout`

### Responsibilities:

* Define full-screen layout
* Handle responsive behavior

---

---

# 🧠 5.2 Workspace Components

---

## 👉 `WorkspaceHeader`

### Responsibilities:

* Display project name
* Provide project switch (minimal)

---

---

## 👉 `WorkspaceGrid`

### Responsibilities:

* Arrange layout:

  * Left (tasks)
  * Center (focus)
  * Right (sidebar)
  * Bottom (notes)

---

---

# 📋 5.3 Task System Components

---

## 👉 `TaskPanel` (Smart)

### Responsibilities:

* Manage tasks
* Group tasks by status
* Handle sorting

---

---

## 👉 `TaskGroup` (Dumb)

### Responsibilities:

* Render grouped tasks (doing / todo / blocked / done)

---

---

## 👉 `TaskItem` (Dumb)

### Responsibilities:

* Show task title
* Show status
* Handle actions:

  * done
  * block
  * edit
  * delete

---

---

## 👉 `TaskQuickAdd` (Smart)

### Responsibilities:

* Instant input
* Submit on Enter

---

---

# 🎯 5.4 Focus Components (CENTER CORE)

---

## 👉 `FocusPanel`

### Responsibilities:

* Combine active task + timer + insights

---

---

## 👉 `ActiveTask`

### Responsibilities:

* Display current task prominently

---

---

## 👉 `TimerDisplay`

### Responsibilities:

* Format and show time

---

---

## 👉 `TimerControls`

### Responsibilities:

* Start / Stop timer

---

---

## 👉 `MiniInsights`

### Responsibilities:

Display:

* time today
* last session
* tasks completed

---

---

# ⚡ 5.5 Right Sidebar (MODULAR)

---

## 👉 `RightSidebar`

### Responsibilities:

* Render collapsible sections

---

---

## 👉 `CollapsibleSection`

### Responsibilities:

* Expand / collapse behavior
* Title + content wrapper

---

---

## 👉 `QuickActionsPanel`

### Responsibilities:

* Show quick actions

---

---

## 👉 `CommandsPanel`

### Responsibilities:

* Show commands
* Copy command

---

---

## 👉 `ResourcesPanel`

### Responsibilities:

* Group resources:

  * docs
  * figma
  * api
  * reference

---

---

## 👉 `LogsPanel`

### Responsibilities:

* Show recent logs
* Quick add log

---

---

# 🧠 5.6 Notes Workspace (BOTTOM)

---

## 👉 `NotesWorkspace`

### Responsibilities:

* Manage multi-file notes system

---

---

## 👉 `NotesSidebar`

### Responsibilities:

* Display list of note files

---

---

## 👉 `NoteEditor`

### Responsibilities:

* Markdown editor
* Live editing

---

---

# 📊 5.7 Footer

---

## 👉 `FooterStats`

### Responsibilities:

* Show:

  * time today
  * tasks completed

---

---

# 📌 6. Shared Components

---

## UI Components (shadcn)

* Button
* Input
* Card
* Badge
* Dropdown
* Tabs (limited use)

---

## Common Components

* EmptyState
* LoadingState
* ErrorToast

---

# 📌 7. Hooks (IMPORTANT)

---

## 👉 `useWorkspace`

* Load project data
* Manage workspace state

---

## 👉 `useTasks`

* Manage tasks
* Handle transitions

---

## 👉 `useTimer`

* Timer logic
* Calculate elapsed time

---

## 👉 `useLogs`

* Add logs
* Fetch logs

---

## 👉 `useNotes`

* Manage notes
* Switch files

---

## 👉 `useResources`

* Manage categorized resources

---

## 👉 `useCommands`

* Manage command list

---

# 📌 8. State Distribution

---

## 🔹 Server State

* projects
* tasks
* logs
* notes
* resources
* commands

---

## 🔹 UI State

* active task
* input values
* sidebar collapse state
* selected note

---

## Rule:

👉 Keep global state minimal

---

# 📌 9. Data Flow (Frontend)

User Action
↓
Component
↓
Hook
↓
Inertia Request
↓
Backend
↓
Response → UI Update

---

# 📌 10. Reusable Libraries Mapping

---

Use:

* UI → shadcn/ui
* Drag & Drop → dnd-kit
* Markdown → MDXEditor
* Command palette → cmdk (future)

---

# 📌 11. Anti-Patterns (DO NOT DO)

---

❌ Deep nesting
❌ Business logic in UI
❌ Huge components
❌ Mixing workspace + feature logic
❌ Creating multiple pages

---

# 📌 12. Scalability Plan

---

Supports:

* Adding new sidebar panels
* Expanding notes system
* Adding advanced insights (in-context)
* Converting to desktop app (Tauri)

---
