# 🚀 DevFlow Frontend Tasks (Execution Spec)

---

## 📌 AGENT EXECUTION RULES

* Execute tasks strictly in order
* Only work within the given task range
* Do NOT implement future tasks
* Do NOT modify backend
* Do NOT introduce new features
* Stop immediately after completing the last task in range

---

## 📌 PROJECT STRUCTURE (REFERENCE)

All components must follow this structure:

resources/js/

* app/layout/
* features/

  * tasks/
  * tracking/
  * actions/
  * context/
* components/

  * ui/
  * shared/
* pages/

  * dashboard/

---

# 🧩 PHASE 1 — STRUCTURE (NO LOGIC)

---

## ✅ TASK 1: Dashboard Layout Structure

### GOAL:

Create the main layout skeleton.

### FILES TO CREATE:

* pages/dashboard/DashboardPage.jsx
* app/layout/DashboardLayout.jsx

### REQUIREMENTS:

* Divide layout into:

  * Left panel (tasks)
  * Center panel (active task)
  * Right panel (actions)
  * Bottom section (notes + links)
  * Footer

### RULES:

* Use simple div/grid/flex
* No styling complexity
* No data
* No child components yet

### OUTPUT:

* Clean layout structure only

---

## ✅ TASK 2: Base UI Components

### GOAL:

Setup reusable UI primitives.

### FILES:

* components/ui/Button.jsx
* components/ui/Input.jsx
* components/ui/Card.jsx
* components/ui/Badge.jsx

### REQUIREMENTS:

* Minimal props
* Clean reusable structure
* Tailwind-based styling

### RULES:

* No business logic
* Keep components generic

### OUTPUT:

* Basic UI component library

---

# 🧩 PHASE 2 — CORE PANELS

---

## ✅ TASK 3: Task Panel

### GOAL:

Implement task list UI.

### FILES:

* features/tasks/TaskPanel.jsx
* features/tasks/TaskItem.jsx
* features/tasks/TaskQuickAdd.jsx

### REQUIREMENTS:

* Sections:

  * doing
  * todo
  * blocked
  * done
* Quick add input at top

### DATA:

Use mock data array

### RULES:

* No backend
* No state management yet
* Focus on layout + grouping

### OUTPUT:

* Functional UI rendering grouped tasks

---

## ✅ TASK 4: Active Task Panel

### GOAL:

Create main focus area.

### FILES:

* features/tracking/ActiveTaskPanel.jsx
* features/tracking/TimerDisplay.jsx

### REQUIREMENTS:

* Show:

  * Task title
  * Timer (static)
  * Start / Stop buttons

### RULES:

* No timer logic
* Must be visually dominant

### OUTPUT:

* Clean center panel UI

---

## ✅ TASK 5: Quick Actions Panel

### GOAL:

Implement actions UI.

### FILES:

* features/actions/ActionsPanel.jsx
* features/actions/ActionItem.jsx

### REQUIREMENTS:

* List of commands
* Copy button per item

### RULES:

* Use navigator.clipboard for copy
* No execution logic

### OUTPUT:

* Action list UI

---

## ✅ TASK 6: Notes Panel

### GOAL:

Create notes section.

### FILES:

* features/context/NotesPanel.jsx

### REQUIREMENTS:

* Markdown editor (basic or placeholder)

### RULES:

* No persistence
* Keep UI minimal

### OUTPUT:

* Editable notes UI

---

## ✅ TASK 7: Links Panel

### GOAL:

Implement links section.

### FILES:

* features/context/LinksPanel.jsx
* features/context/LinkItem.jsx

### REQUIREMENTS:

* List of links
* Add link input

### RULES:

* No backend
* Use local state

### OUTPUT:

* Links UI

---

## ✅ TASK 8: Footer Stats

### GOAL:

Create footer info bar.

### FILES:

* components/shared/Footer.jsx

### REQUIREMENTS:

* Show:

  * Time today
  * Tasks completed

### RULES:

* Static values

### OUTPUT:

* Footer UI

---

# 🧩 PHASE 3 — INTERACTION (LIGHT LOGIC)

---

## ✅ TASK 9: Task Switching Logic

### GOAL:

Enable active task selection.

### FILES TO MODIFY:

* TaskPanel.jsx

### REQUIREMENTS:

* Clicking a task:
  → sets it as "doing"
* Only one active task allowed

### RULES:

* Use local state
* No backend

### OUTPUT:

* Interactive task selection

---

## ✅ TASK 10: Basic Timer Logic

### GOAL:

Implement timer functionality.

### FILES TO MODIFY:

* ActiveTaskPanel.jsx

### REQUIREMENTS:

* Start / Stop timer
* Show elapsed time

### RULES:

* Use setInterval
* Store state locally
* No persistence

### OUTPUT:

* Working timer UI

---

# 📌 COMPLETION CRITERIA

Frontend is considered complete when:

* All panels render correctly
* Layout matches single-screen structure
* Task switching works
* Timer works locally
* UI is clean and minimal

---

# 🧨 FINAL RULE

DO NOT:

* Add new features
* Add navigation
* Add analytics
* Over-design UI

Focus ONLY on:
👉 clean, functional workflow UI
