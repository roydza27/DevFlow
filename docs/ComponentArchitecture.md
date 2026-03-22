---
modified: 2026-03-21T12:32:48+05:30
---
# DEVFLOW COMPONENT ARCHITECTURE DOCUMENT

---

# 📌 1. Goals of Component Design

Your component system must:

- Be **modular**
- Be **reusable**
- Keep logic **separated from UI**
- Prevent **deep nesting chaos**
- Support **single-screen workflow**

---

# 📌 2. Architectural Principles

---

## 🧠 Principle 1: Feature-Based Structure (NOT type-based)

❌ Don’t do:

components/  
  buttons/  
  cards/  
  inputs/

✅ Do:

features/  
  projects/  
  tasks/  
  tracking/  
  context/

---

## 🧠 Principle 2: Smart vs Dumb Components

- **Smart (Container)** → handles data + logic
- **Dumb (UI)** → only renders UI

---

## 🧠 Principle 3: Reusability First

Every component should:

- Work independently
- Be reusable across features

---

# 📌 3. Folder Structure (FINAL)

resources/js/  
  
├── app/  
│   ├── layout/  
│   ├── providers/  
│   └── hooks/  
  
├── features/  
│   ├── projects/  
│   ├── tasks/  
│   ├── tracking/  
│   ├── context/  
│   └── actions/  
  
├── components/  
│   ├── ui/        (shadcn)  
│   ├── common/  
│   └── shared/  
  
├── pages/  
│   └── dashboard/  
  
├── lib/  
│   ├── utils/  
│   └── constants/

---

# 📌 4. High-Level Component Tree

DashboardPage  
 ├── DashboardLayout  
 │  
 ├── ProjectHeader  
 │  
 ├── MainGrid  
 │   ├── TaskPanel  
 │   │   ├── TaskList  
 │   │   │   ├── TaskItem  
 │   │   │   └── TaskQuickAdd  
 │   │  
 │   ├── ActiveTaskPanel  
 │   │  
 │   ├── TimerPanel  
 │   │  
 │   ├── ActionsPanel  
 │   │  
 │   ├── NotesPanel  
 │   │  
 │   └── LinksPanel  
 │  
 └── FeedbackBar

---

# 📌 5. Component Breakdown (DETAILED)

---

# 🖥️ 5.1 Dashboard Page

## 👉 `DashboardPage`

### Type:

Smart Component

### Responsibilities:

- Fetch initial data (via Inertia)
- Manage global UI state
- Pass data to child components

---

---

# 🧱 5.2 Layout Components

---

## 👉 `DashboardLayout`

### Responsibilities:

- Define main layout
- Handle responsive structure
- Manage grid / split panels

---

## 👉 `MainGrid`

### Responsibilities:

- Arrange:
    - Task panel
    - Context panel
    - Actions
    - Timer

---

---

# 🧩 5.3 Project Components

---

## 👉 `ProjectHeader`

### Responsibilities:

- Show project name
- Show status
- Handle project switching (future)

---

---

# 📋 5.4 Task System Components

---

## 👉 `TaskPanel`

### Type:

Smart

### Responsibilities:

- Manage task list
- Handle sorting
- Pass data to TaskList

---

---

## 👉 `TaskList`

### Type:

Dumb

### Responsibilities:

- Render list of tasks
- Handle drag & drop (dnd-kit)

---

---

## 👉 `TaskItem`

### Type:

Dumb

### Responsibilities:

- Display:
    - title
    - status
- Handle:
    - click → change status

---

---

## 👉 `TaskQuickAdd`

### Type:

Smart

### Responsibilities:

- Instant input
- Submit on Enter

---

---

## 👉 `ActiveTaskPanel`

### Responsibilities:

- Highlight current task
- Show details

---

---

# ⏱️ 5.5 Tracking Components

---

## 👉 `TimerPanel`

### Type:

Smart

### Responsibilities:

- Show timer
- Start / stop actions
- Display running state

---

---

## 👉 `TimerDisplay`

### Type:

Dumb

### Responsibilities:

- Format time
- Display elapsed time

---

---

# ⚡ 5.6 Execution Components

---

## 👉 `ActionsPanel`

### Responsibilities:

- List commands
- Copy command
- Open links

---

---

## 👉 `ActionItem`

### Responsibilities:

- Render single command
- Handle copy action

---

---

# 🧠 5.7 Context Components

---

## 👉 `NotesPanel`

### Responsibilities:

- Display markdown editor
- Handle note updates

---

---

## 👉 `LinksPanel`

### Responsibilities:

- Display links
- Add new links

---

---

## 👉 `LinkItem`

### Responsibilities:

- Render link
- Open link

---

---

# 📊 5.8 Feedback Components

---

## 👉 `FeedbackBar`

### Responsibilities:

- Show:
    - time today
    - tasks done
    - progress %

---

---

# 📌 6. Shared Components

---

## 👉 `Input`

- Used for quick add

## 👉 `Button`

- Reusable actions

## 👉 `Card`

- UI container

## 👉 `Modal` (future)

---

---

# 📌 7. Hooks (IMPORTANT)

---

## 👉 `useTasks`

- Fetch tasks
- Update tasks
- Manage sorting

---

## 👉 `useTimer`

- Handle timer state
- Calculate elapsed time

---

## 👉 `useProject`

- Current project
- Last accessed logic

---

---

# 📌 8. State Distribution

---

## 🔹 Global State (minimal)

- current project
- active task

---

## 🔹 Local State

- input fields
- UI toggles

---

## Rule:

👉 Avoid global state explosion

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

## Use these directly:

- UI → shadcn/ui
- Drag & Drop → dnd-kit
- Command palette → cmdk
- Markdown editor → MDXEditor

---

# 📌 11. Anti-Patterns (DO NOT DO)

---

## ❌ Deep nesting

## ❌ Business logic inside UI

## ❌ Giant components

## ❌ Repeating UI elements

## ❌ Mixing concerns

---

# 📌 12. Scalability Plan

---

This structure supports:

- Adding new panels
- Adding new features
- Converting to SaaS