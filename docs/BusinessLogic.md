# DEVFLOW BUSINESS RULES DOCUMENT (FINAL)

---

# 📌 1. Purpose

This document defines the **core business logic rules** that govern DevFlow behavior.

These rules ensure:

* Consistency across modules
* Predictable system behavior
* Clear separation between UI and logic
* Proper enforcement of workspace-based design

---

# 📌 2. Core Principle

👉 **Project = Workspace**

All rules operate under:

* A project is a **live working environment**
* All data is strictly **project-scoped**
* The system is optimized for **continuous work, not navigation**

---

# 📌 3. Rule Classification

Rules are grouped into:

* Project Rules
* Task Rules
* Tracking Rules
* Logs Rules (NEW)
* Notes Rules (UPGRADED)
* Resources Rules (NEW)
* Execution Rules
* Workspace Rules
* Quick Add Rules
* Feedback Rules
* Data Integrity Rules
* Error Handling Rules
* Performance Rules

---

# 📌 4. Project Rules

---

## 🔹 BR-P1: Project Creation

A project must have:

* `name`
* `status`

---

## 🔹 BR-P2: Project Status Values

Allowed values:

active | paused | completed

---

## 🔹 BR-P3: Last Active Project

System must:

* Track `last_accessed`
* Automatically load the most recent project on app startup

---

## 🔹 BR-P4: Active Project Context

* Only one project is considered **active at a time**
* System operates within that context

👉 (Soft rule)

---

# 📌 5. Task Rules (CORE SYSTEM)

---

## 🔹 BR-T1: Task Creation

A task must:

* belong to a project
* have a title
* default to `todo`

---

## 🔹 BR-T2: Task Status Values

Allowed:

todo | doing | blocked | done

---

## 🔹 BR-T3: Single Active Task (CRITICAL)

👉 Only ONE task per project may have:

status = doing

---

## 🔹 BR-T4: Task Activation

When a task is set to `doing`:

1. Find existing active task
2. Reset it to `todo`
3. Set selected task to `doing`

---

## 🔹 BR-T5: Blocked Task Behavior

* A blocked task:

  * cannot become active automatically
  * is visually separated
  * is placed below `todo`

---

## 🔹 BR-T6: Task Completion

When marked `done`:

* Move to bottom
* Count toward daily completion metrics

---

## 🔹 BR-T7: Task Sorting Order

Tasks must be ordered:

1. doing
2. todo
3. blocked
4. done

---

## 🔹 BR-T8: Task Ownership

* Task must belong to exactly one project
* No cross-project sharing

---

## 🔹 BR-T9: Task Time Association

* Timer is associated with the **active task**
* Time spent contributes to that task

---

# 📌 6. Tracking Rules

---

## 🔹 BR-TR1: Timer Start

When started:

started_at = current timestamp

---

## 🔹 BR-TR2: Timer Stop

On stop:

1. duration = now - started_at
2. time_spent += duration
3. started_at = null

---

## 🔹 BR-TR3: Timer State

* started_at ≠ null → running
* started_at = null → stopped

---

## 🔹 BR-TR4: Global Timer

👉 Only ONE timer can run at any time across system

---

## 🔹 BR-TR5: Timer Persistence

* Timer must survive reload
* Duration must be recalculated dynamically

---

## 🔹 BR-TR6: Session Awareness

System must derive:

* last session duration
* total accumulated time

---

## 🔹 BR-TR7: Daily Metrics

System calculates:

* time worked today
* tasks completed today

---

# 📌 7. Logs Rules (NEW CORE)

---

## 🔹 BR-L1: Log Creation

* Logs are free-text entries
* Must be timestamped

---

## 🔹 BR-L2: Project Scope

* Logs belong to a single project
* No cross-project visibility

---

## 🔹 BR-L3: Append-Only Behavior

* Logs are append-only
* Editing not required (optional future)

---

## 🔹 BR-L4: Purpose of Logs

Logs represent:

👉 actual work done (not planned work)

---

## 🔹 BR-L5: Quick Logging

* Logs must support instant input
* No forms required

---

# 📌 8. Notes Rules (UPGRADED)

---

## 🔹 BR-N1: Multi-file Notes

* Multiple notes per project allowed
* Each note acts like a file

---

## 🔹 BR-N2: Note Identity

* Each note must have a title
* Title acts as file name

---

## 🔹 BR-N3: Markdown Storage

* Notes stored as raw markdown

---

## 🔹 BR-N4: Project Isolation

* Notes are not shared across projects

---

## 🔹 BR-N5: Navigation

* Notes must be switchable quickly
* Sidebar-style navigation within notes section

---

# 📌 9. Resources Rules (REPLACES LINKS)

---

## 🔹 BR-R1: Resource Structure

Each resource must have:

* title
* url
* type

---

## 🔹 BR-R2: Resource Types

Allowed:

docs | figma | api | reference

---

## 🔹 BR-R3: Categorization

* Resources must be grouped by type
* UI displays grouped resources

---

## 🔹 BR-R4: Project Scope

* Resources are project-specific
* No sharing across projects

---

# 📌 10. Execution Rules

---

## 🔹 BR-E1: Commands

* Commands belong to a project

---

## 🔹 BR-E2: Interaction

System must allow:

* copy command
* open resource URL

---

## 🔹 BR-E3: Execution Restriction

System must NOT:

* execute system commands
* access local filesystem

---

# 📌 11. Workspace Rules (UI BEHAVIOR)

---

## 🔹 BR-W1: Entry Behavior

* On app open:

  * load last active project
  * show workspace immediately

---

## 🔹 BR-W2: Single-Screen Constraint

* All interactions must occur on one screen
* No page navigation required

---

## 🔹 BR-W3: Focus Priority

System must prioritize:

* active task
* timer

---

## 🔹 BR-W4: Panel Structure

Workspace includes:

* Tasks (left)
* Focus area (center)
* Collapsible panels (right)
* Notes (bottom)

---

## 🔹 BR-W5: Context Visibility

All relevant project data must be:

* visible
* accessible without navigation

---

# 📌 12. Quick Add Rules

---

## 🔹 BR-Q1: Instant Input

* Submit on Enter
* No form UI required

---

## 🔹 BR-Q2: Minimal Data

* Only essential fields required

---

## 🔹 BR-Q3: Supported Inputs

Quick add supports:

* tasks
* logs
* notes
* resources

---

# 📌 13. Feedback Rules

---

## 🔹 BR-F1: Progress Calculation

progress = completed_tasks / total_tasks

---

## 🔹 BR-F2: Daily Metrics

System must show:

* tasks completed today
* time worked today

---

## 🔹 BR-F3: Lightweight Insights

Insights must be:

* minimal
* contextual (not dashboard)

---

# 📌 14. Data Integrity Rules

---

## 🔹 BR-DI1: Foreign Keys

* All entities must reference valid project

---

## 🔹 BR-DI2: Cascade Delete

Deleting project must delete:

* tasks
* notes
* resources
* commands
* logs

---

## 🔹 BR-DI3: Timer Consistency

* Only one running timer allowed
* Invalid states must be corrected

---

# 📌 15. Auto-Recovery Rules

---

## 🔹 BR-AR1: Multiple Active Tasks

* If multiple `doing` tasks exist:
  → keep latest, reset others

---

## 🔹 BR-AR2: Timer Recovery

* If timer running on reload:
  → recalculate using timestamp

---

# 📌 16. Error Handling Rules

---

## 🔹 BR-ER1: Invalid States

Prevent:

* multiple active tasks
* invalid status values

---

## 🔹 BR-ER2: Empty States

System must guide user when:

* no project exists
* no tasks exist

---

# 📌 17. Performance Rules

---

## 🔹 BR-PF1: Data Scope

* Load only active project data

---

## 🔹 BR-PF2: UI Responsiveness

* UI updates must be immediate

---

# 📌 18. Future Rule Extensions

---

Reserved for:

* Git-based logging
* Session tracking system
* Command execution layer (Tauri)
* Multi-user support
