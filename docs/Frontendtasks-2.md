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

Good — this is exactly where most projects go wrong.

Right now your task file is:
👉 **too rigid + slightly outdated vs your new system (workspace, logs, resources, notes files)**

If you follow it as-is:
❌ you’ll build a “todo UI”
❌ then refactor everything later
❌ waste time

---

# 🎯 What we’ll do

We won’t rewrite everything.

👉 We’ll **refine how the agent works**, not just what it builds.

Goal:
👉 Keep it **simple**
👉 Keep it **aligned with current features**
👉 Avoid overengineering

---

# 🚀 NEW EXECUTION PHILOSOPHY

Instead of:

> “Build all features step-by-step blindly”

We switch to:

> “Build one usable workspace → then expand it”

---

# 🔥 UPDATED EXECUTION MODEL

## 🧠 Rule Shift

OLD:
❌ build all panels separately

NEW:
✅ build **one working workspace first**

---

# 🧩 NEW TASK FLOW (SIMPLIFIED + CORRECT)

---

# 🧩 PHASE 1 — WORKSPACE SHELL (MINIMAL)

## ✅ TASK 1 (UPDATED): Workspace Layout

### GOAL:

Create **one screen with correct structure**, not empty boxes.

---

### BUILD:

* DashboardPage
* DashboardLayout
* WorkspaceGrid

---

### INCLUDE:

* Left → TaskPanel (empty placeholder)
* Center → FocusPanel (empty)
* Right → Sidebar (empty)
* Bottom → Notes area (empty)
* Footer

---

### RULES:

* Don’t over-split components yet
* Just create **correct structure**

---

### WHY:

👉 You SEE the product immediately
👉 Not abstract boxes

---

# 🧩 PHASE 2 — CORE EXPERIENCE (IMPORTANT)

👉 Build what user actually uses FIRST

---

## ✅ TASK 2: Task System (BASIC + WORKING)

### GOAL:

Make tasks usable

---

### BUILD:

* TaskPanel
* TaskItem
* QuickAdd

---

### INCLUDE:

* grouped tasks
* quick add input
* click → set active

---

### RULES:

* local state only
* no drag & drop
* no fancy UI

---

### OUTPUT:

👉 You can:

* add task
* click task
* see active task

---

---

## ✅ TASK 3: Focus Panel (REAL CENTER)

### GOAL:

Make center panel meaningful

---

### BUILD:

* ActiveTask display
* Timer (basic)

---

### INCLUDE:

* task title
* start/stop
* elapsed time

---

### RULES:

* simple timer (no perfection)
* no analytics yet

---

---

## 🧩 PHASE 3 — SUPPORT SYSTEMS

---

## ✅ TASK 4: Right Sidebar (MODULAR)

### GOAL:

Introduce workspace context

---

### BUILD:

* Sidebar container
* Collapsible sections

---

### INCLUDE:

* Commands (copy)
* Resources (links)
* Logs (basic list + add)

---

### RULES:

* simple lists
* no grouping complexity
* no categories yet

---

---

## ✅ TASK 5: Notes Workspace (IMPORTANT UPGRADE)

### GOAL:

Replace simple notes panel

---

### BUILD:

* NotesSidebar (file list)
* NoteEditor (basic textarea or editor)

---

### INCLUDE:

* multiple notes
* switch notes

---

### RULES:

* no markdown complexity yet
* no persistence

---

---

# 🧩 PHASE 4 — FEEDBACK (LIGHT)

---

## ✅ TASK 6: Footer + Basic Stats

### INCLUDE:

* time today
* tasks done

👉 static or derived from state

---

---

# 🧩 PHASE 5 — POLISH (ONLY IF STABLE)

---

## ✅ TASK 7: Small Improvements

* highlight active task
* improve spacing
* basic UX cleanup

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
