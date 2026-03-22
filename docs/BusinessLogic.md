---
modified: 2026-03-21T12:33:37+05:30
---
# DEVFLOW BUSINESS RULES DOCUMENT

---

# 📌 1. Purpose

This document defines the **core business logic rules** that govern how DevFlow behaves.

These rules ensure:

- Consistency
- Predictable behavior
- Clean enforcement across system

---

# 📌 2. Rule Classification

All rules are grouped into:

- Project Rules
- Task Rules
- Tracking Rules
- Context Rules
- Execution Rules
- System Rules

---

# 📌 3. Project Rules

---

## 🔹 BR-P1: Project Creation

- A project must have:
    - `name`
    - `status`

---

## 🔹 BR-P2: Project Status Values

Allowed values:

active | paused | completed

---

## 🔹 BR-P3: Last Active Project

- System must track:
    - `last_accessed`
- On app load:
    - Automatically load most recently accessed project

---

## 🔹 BR-P4: Active Project Focus

- System assumes:
    - One project is actively worked on at a time

👉 (Soft rule — not strictly enforced)

---

# 📌 4. Task Rules (CORE SYSTEM)

---

## 🔹 BR-T1: Task Creation

- Task must:
    - belong to a project
    - have a title
    - default to `todo`

---

## 🔹 BR-T2: Task Status Values

Allowed:

todo | doing | blocked | done

---

## 🔹 BR-T3: Single Active Task (CRITICAL)

👉 At any time:

- Only ONE task per project can have:

status = doing

---

## 🔹 BR-T4: Task State Transition (Doing)

When a task is set to `doing`:

1. Find existing `doing` task
2. Reset it to:

todo

3. Set new task to:

doing

---

## 🔹 BR-T5: Blocked Task Behavior

- A task can be marked as `blocked`
- Blocked tasks:
    - should not be auto-promoted
    - remain below `todo` in order

---

## 🔹 BR-T6: Task Completion

When task is marked `done`:

- It should:
    - move to bottom
    - count toward daily completion

---

## 🔹 BR-T7: Task Sorting Order

Tasks must always be displayed in:

1. doing  
2. todo  
3. blocked  
4. done

---

## 🔹 BR-T8: Task Ownership

- A task MUST belong to exactly one project
- No shared tasks

---

# 📌 5. Tracking Rules

---

## 🔹 BR-TR1: Timer Start

When user starts timer:

- Set:

started_at = current_timestamp

---

## 🔹 BR-TR2: Timer Stop

When timer stops:

1. Calculate:

duration = now - started_at

2. Add to:

time_spent += duration

3. Reset:

started_at = null

---

## 🔹 BR-TR3: Timer State

- If `started_at != null` → timer is running
- If `started_at == null` → timer stopped

---

## 🔹 BR-TR4: One Active Timer (IMPORTANT)

👉 Only ONE timer can run at a time:

- Either:
    - per project
    - OR globally (recommended: global)

---

## 🔹 BR-TR5: Timer Persistence

- Timer must:
    - survive page reload
    - calculate correctly after reopen

---

## 🔹 BR-TR6: Daily Calculation

"Today’s work" includes:

- tasks completed today
- time tracked today

---

# 📌 6. Context Rules

---

## 🔹 BR-C1: Notes

- Notes belong to a project
- Notes stored as Markdown

---

## 🔹 BR-C2: Links

- Links must have:
    - title
    - url

---

## 🔹 BR-C3: Context Isolation

- Notes and links are **not shared across projects**

---

# 📌 7. Execution Rules

---

## 🔹 BR-E1: Actions

- Actions belong to a project

---

## 🔹 BR-E2: Command Handling

System must:

- Allow copying command
- Allow opening URL

---

## 🔹 BR-E3: Execution Restriction

System must NOT:

- Execute system commands
- Access local filesystem

---

# 📌 8. Dashboard Rules

---

## 🔹 BR-D1: Default View

On app open:

- Load last active project

---

## 🔹 BR-D2: Focus Display

System must show:

- active task
- task list
- timer
- actions
- context

---

## 🔹 BR-D3: No Navigation Dependency

- All core interactions must be possible:
    - without changing pages

---

# 📌 9. Quick Add Rules

---

## 🔹 BR-Q1: Instant Input

- Input should:
    - submit on Enter
    - require no form

---

## 🔹 BR-Q2: Minimal Fields

- Only essential data required

---

# 📌 10. Feedback Rules

---

## 🔹 BR-F1: Progress Calculation

progress = completed_tasks / total_tasks

---

## 🔹 BR-F2: Daily Metrics

System must show:

- tasks completed today
- time spent today

---

# 📌 11. Data Integrity Rules

---

## 🔹 BR-DI1: Foreign Keys

- Tasks must reference valid project

---

## 🔹 BR-DI2: Cascade Delete

Deleting a project must delete:

- tasks
- notes
- links
- actions

---

# 📌 12. Error Handling Rules

---

## 🔹 BR-ER1: Invalid States

- Prevent:
    - multiple `doing` tasks
    - invalid status values

---

## 🔹 BR-ER2: Empty States

If no data:

- show guidance UI

---

# 📌 13. Performance Rules

---

## 🔹 BR-PF1: Data Scope

- Load only:
    - active project data

---

## 🔹 BR-PF2: UI Responsiveness

- Updates must be instant

---

# 📌 14. Future Rule Extensions

---

Reserved for:

- Git tracking
- Command execution
- Multi-user support