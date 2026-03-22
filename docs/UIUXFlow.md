# DEVFLOW UI FLOW DOCUMENT (FINAL)

---

# 📌 1. Purpose

Define **how the user interacts with DevFlow step-by-step**.

Focus:

* Zero friction
* No unnecessary decisions
* Continuous workflow
* Single-screen interaction

---

# 📌 2. Core UX Philosophy

---

## 🧠 Guiding Flow

Open → Resume → Focus → Act → Log → Continue → Finish

---

## 🎯 UX Goals

* Zero navigation
* Instant resume
* Minimal cognitive load
* Everything visible in context
* No decision paralysis

---

# 📌 3. Entry Flow (App Launch)

---

## 🔹 FLOW: Open Application

### Steps:

1. User opens app
2. System loads last active project
3. System fetches:

* tasks
* logs
* notes
* resources
* commands
* stats

---

## 🖥️ UI STATE (FIRST VIEW)

User immediately sees:

* Project name (top)
* Active task (center)
* Timer
* Task list (left)
* Quick actions + resources + logs (right)
* Notes workspace (bottom)
* Footer stats

---

## 🧠 Decision State:

👉 System answers:

> “Continue this work”

👉 No user decision required

---

# 📌 4. Workspace Layout Flow (UPDATED)

---

## 🧩 Layout Zones

---

### 🔹 Top Bar

* Project name
* Project switch (minimal dropdown)
* No navigation menus

---

### 🔹 Left Panel — Tasks

* Task groups:

  * doing
  * todo
  * blocked
  * done
* Quick add input
* Task actions

---

### 🔹 Center Panel — Focus Area (PRIMARY)

* Active task (large)
* Timer (central)
* Controls (start/stop)
* Lightweight insights:

  * time today
  * last session
  * tasks completed

---

### 🔹 Right Panel — Collapsible Workspace Panels

Contains:

* Quick Actions (commands)
* Resources (categorized)
* Logs (recent + quick add)

👉 Each section is collapsible

---

### 🔹 Bottom Panel — Notes Workspace

* Multi-file notes system
* Sidebar file list
* Markdown editor

---

### 🔹 Footer

* Time today
* Tasks completed

---

## 🎯 UX Principle

👉 Everything is visible
👉 Nothing requires navigation
👉 Context is always preserved

---

# 📌 5. Task Flow (CORE WORKFLOW)

---

## 🔹 FLOW: Add Task

---

### Steps:

1. User types in quick input
2. Press Enter

---

### System Behavior:

* Create task
* Status = `todo`

---

### UI Behavior:

* Task appears instantly in `todo`

---

---

## 🔹 FLOW: Activate Task (Start Work)

---

### Steps:

1. User clicks task

---

### System Behavior:

* Previous `doing` → reset to `todo`
* Selected task → `doing`

---

### UI Behavior:

* Task moves to top
* Active Task panel updates

---

---

## 🔹 FLOW: Complete Task

---

### Steps:

1. User clicks “done”

---

### System Behavior:

* Status → `done`

---

### UI Behavior:

* Task moves to bottom
* Update stats

---

---

## 🔹 FLOW: Block Task

---

### Steps:

1. User clicks “block”

---

### UI Behavior:

* Moves below todo
* Marked visually

---

---

## 🔹 FLOW: Task Actions

---

User can:

* edit
* delete
* mark done
* block

---

# 📌 6. Timer Flow

---

## 🔹 FLOW: Start Timer

---

### Steps:

1. User clicks Start

---

### System Behavior:

* Save `started_at`

---

### UI Behavior:

* Timer begins
* Button switches to Stop

---

---

## 🔹 FLOW: Stop Timer

---

### Steps:

1. User clicks Stop

---

### System Behavior:

* Calculate duration
* Update total time
* Reset `started_at`

---

### UI Behavior:

* Timer stops
* Stats update

---

---

## 🔹 FLOW: Reload Recovery

---

### Behavior:

* Timer resumes using timestamp
* UI recalculates elapsed time

---

---

## 🔹 FLOW: Timer Context

---

* Timer is linked to active task
* Switching task may stop/reset timer (implementation-defined)

---

# 📌 7. Logs Flow (NEW CORE)

---

## 🔹 FLOW: Add Log

---

### Steps:

1. User types log in quick input
2. Press Enter

---

### System Behavior:

* Save log with timestamp

---

### UI Behavior:

* Log appears instantly in recent logs

---

---

## 🔹 FLOW: View Logs

---

### Behavior:

* Show recent logs in sidebar
* Display chronologically (latest first)

---

---

## 🔹 UX Role

👉 Logs answer:

> “What did I actually do?”

---

# 📌 8. Resources Flow (REPLACES LINKS)

---

## 🔹 FLOW: Add Resource

---

### Steps:

1. User inputs:

* title
* url
* type

---

### Behavior:

* Resource saved instantly

---

---

## 🔹 FLOW: View Resources

---

### UI Behavior:

* Grouped by type:

  * Docs
  * Figma
  * APIs
  * Reference

---

---

## 🔹 FLOW: Open Resource

---

### Steps:

1. Click resource

---

### Behavior:

* Opens in new tab

---

# 📌 9. Commands Flow

---

## 🔹 FLOW: Copy Command

---

### Steps:

1. User clicks command

---

### Behavior:

* Copy to clipboard

---

### Feedback:

* Show “Copied” indicator

---

# 📌 10. Notes Flow (UPGRADED)

---

## 🔹 FLOW: Create Note

---

### Steps:

1. User creates note file
2. Assigns title

---

---

## 🔹 FLOW: Switch Note

---

### Steps:

1. User clicks file from sidebar

---

### Behavior:

* Load selected note

---

---

## 🔹 FLOW: Edit Note

---

### Behavior:

* Markdown editor
* Live editing

---

---

## 🔹 UX Role

👉 Notes answer:

> “What do I know about this project?”

---

# 📌 11. Quick Add Flow (Unified)

---

## 🔹 FLOW: Instant Input

---

### Steps:

1. User types
2. Press Enter

---

### Behavior:

* Creates:

  * task
  * log
  * resource (depending on context)

---

### UX Goal:

👉 No forms
👉 No delays

---

# 📌 12. Feedback Flow

---

## 🔹 Display:

* Tasks completed today
* Time worked today
* Progress %

---

## 🔹 Update Behavior:

* Updates instantly after:

  * task completion
  * timer stop
  * log addition

---

## 🔹 UX Principle:

👉 Lightweight insights
👉 NOT dashboard

---

# 📌 13. Empty State Flow

---

## 🔹 Case: No Project

UI shows:

* “Create your first project”

---

## 🔹 Case: No Tasks

UI shows:

* “Add your first task”

---

## 🔹 Case: No Logs

* Encourage logging activity

---

---

# 📌 14. Error Flow

---

## 🔹 Invalid Input

* Inline validation

---

## 🔹 Failure

* Toast message:

  * “Something went wrong”

---

# 📌 15. Keyboard Flow

---

## 🔹 Basic:

* Enter → submit input

---

## 🔹 Future:

* Ctrl + K → command palette

---

# 📌 16. State Flow Summary

---

User Action
↓
UI Update (optimistic)
↓
Backend Sync
↓
Final UI State

---

# 📌 17. Critical UX Rules

---

## Rule 1:

👉 Always show active task prominently

---

## Rule 2:

👉 Never require navigation

---

## Rule 3:

👉 Minimize decisions

---

## Rule 4:

👉 Keep everything in context

---

## Rule 5:

👉 Avoid visual clutter

---

## Rule 6:

👉 Focus over features

---
