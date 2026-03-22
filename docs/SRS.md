---
modified: 2026-03-21T12:40:30+05:30
---

# 📄 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

# 1. Introduction

### 1.1 Purpose

This document defines the requirements for **DevFlow**, a local-first, project-centric workflow application designed to help developers:

- Resume work instantly
- Maintain focus on a single task
- Track meaningful progress

The goal is to minimize friction between **deciding and executing work**.

---

### 1.2 Scope

DevFlow is a **local web-based application** that provides:

- A single-screen project workspace
- Task management with enforced focus
- Lightweight execution support (commands & links)
- Context management (notes + links)
- Time tracking for productivity awareness

The system is intended for **individual developer use**.

---

### 1.3 Definitions

|Term|Description|
|---|---|
|Project|A workspace containing tasks, actions, notes, and tracking|
|Task|A unit of work within a project|
|Action|A predefined command or link related to a project|
|Context|Notes and links associated with a project|
|Tracking|Time and activity monitoring|
|Active Task|The task with status `doing` in the current project|

---

# 📌 2. Overall Description

---

## 2.1 Product Perspective

DevFlow is a **standalone local application**:

- Uses Laravel backend + React frontend
- Stores data in SQLite
- Runs in a browser environment
- No dependency on external services

---

## 2.2 Product Functions

The system provides:

- Project management
- Task tracking with focus control
- Execution assistance (commands & links)
- Context storage (notes + links)
- Time tracking
- Single-screen dashboard interaction

---

## 2.3 User Characteristics

- Target User: Individual developer
- Skill Level: Intermediate
- Usage: Daily, short to medium sessions

---

## 2.4 Constraints

- Cannot execute system-level commands in browser
- Cannot access local file system directly
- Must remain lightweight and fast
- Must operate primarily within a single-screen UI

---

## 2.5 Assumptions

- User works on one primary project at a time
- User prefers minimal interaction overhead
- User values speed over feature richness

---

# 📌 3. Functional Requirements

---

## 3.1 Project Management

### FR-1: Create Project

- User shall be able to create a new project
- Each project must have:
    - name
    - status

---

### FR-2: Project Status

System shall support:

- active
- paused
- completed

---

### FR-3: Last Active Project

System shall:

- store last accessed project
- auto-load it on startup

---

## 3.2 Task Management

---

### FR-4: Add Task

User shall be able to add tasks instantly (no form)

---

### FR-5: Task States

Each task shall support:

- todo
- doing
- blocked
- done

---

### FR-6: Single Active Task Constraint

Only one task can be in `doing` state at a time

---

### FR-7: Task State Transition

When a task is set to `doing`:

- previous active task shall reset

---

### FR-8: Task Sorting

Tasks shall be automatically ordered:

- doing → top
- todo → middle
- blocked → below todo
- done → bottom

---

### 🔥 FR-9: Blocked Task Behavior (NEW)

A task in `blocked` state:

- cannot be auto-selected as active
- must remain visually separated
- must not affect current active task

---

## 3.3 Execution System

---

### FR-10: Actions

User shall be able to define project-specific actions

---

### FR-11: Command Interaction

System shall:

- allow copying commands
- allow opening URLs

---

### Limitation

System shall NOT:

- execute commands
- access local system

---

## 3.4 Context Management

---

### FR-12: Notes

System shall support:

- creating notes
- editing notes
- Markdown formatting

---

### FR-13: Links

System shall allow:

- saving links
- quick access

---

## 3.5 Tracking System

---

### FR-14: Timer Control

User shall be able to:

- start timer
- stop timer

---

### 🔥 FR-15: Timer Scope (NEW)

Only one timer can run at a time across the entire system (global timer)

---

### FR-16: Time Storage

System shall store:

- `started_at` timestamp
- accumulated time

---

### FR-17: Time Calculation

System shall calculate time using:

- timestamps (not UI loops)

---

### 🔥 FR-18: Timer Persistence (NEW)

Timer state shall persist across page reloads using stored timestamps

---

### FR-19: Activity Summary

System shall display:

- time spent today
- total time per project
- tasks completed today

---

## 3.6 Dashboard

---

### FR-20: Single Screen Interface

System shall display all core features on one screen

---

### 🔥 FR-21: Dashboard as Primary Interface (NEW)

The dashboard shall act as the single primary interface for all core interactions without requiring navigation

---

### FR-22: Current Task Highlight

System shall highlight active task

---

### FR-23: Quick Actions Visibility

System shall show project actions

---

### 🔥 FR-24: Data Scope Rule (NEW)

System shall load only the currently active project’s data

---

## 3.7 Quick Add System

---

### FR-25: Instant Input

User shall be able to instantly add:

- tasks
- notes
- links

---

### FR-26: Keyboard Support

System shall support:

- Enter → add item

---

### Future Enhancement

- Command palette (`Ctrl + K`)

---

## 3.8 Feedback System

---

### FR-27: Progress Tracking

System shall display project completion percentage

---

### FR-28: Daily Activity

System shall display:

- tasks completed today
- time spent today

---

### 🔥 FR-29: Optimistic UI Updates (NEW)

System shall update UI optimistically for user actions, with backend synchronization ensuring final consistency

---

# 📌 4. Validation Constraints (NEW SECTION)

---

- Task title:
    - required
    - maximum length: 255 characters
- Project name:
    - required
- URL:
    - must be valid

---

# 📌 5. Auto-Recovery Rules (NEW SECTION)

---

System shall automatically recover from inconsistent states:

- If multiple `doing` tasks exist:  
    → system resets all but the most recent
- If timer is active on reload:  
    → system recalculates elapsed time using timestamps

---

# 📌 6. Non-Functional Requirements

---

## 6.1 Performance

- Load time ≤ 2 seconds
- UI interactions must be near-instant

---

## 6.2 Usability

- Minimal clicks
- No complex navigation
- Single-screen interaction

---

## 6.3 Reliability

- Data must persist locally
- Timer must remain accurate across reloads

---

## 6.4 Maintainability

- Modular architecture
- Reusable components

---

## 6.5 Scalability

- Must support future feature extensions

---

# 📌 7. Data Requirements

---

## Entities:

- Projects
- Tasks
- Actions
- Notes
- Links

---

## Relationships:

- One Project → Many Tasks
- One Project → Many Actions
- One Project → Many Notes
- One Project → Many Links

---

# 📌 8. System Rules

---

- Only one active task at a time
- Only one active timer at a time
- All data is project-scoped
- No heavy forms
- Single-screen priority
- Minimal UI

---

# 📌 9. Constraints & Trade-offs

---

## Constraints:

- No system execution
- No file system access
- Browser limitations

---

## Trade-offs:

- Manual time tracking
- No automation
- Limited execution features

---

# 📌 10. Non-Goals (NEW SECTION)

---

The following are explicitly out of scope:

- Command execution
- Multi-user system
- Cloud synchronization
- Automated tracking (e.g., Git integration)

---

# 📌 11. Future Enhancements

---

- Git-based tracking
- Command execution (via Tauri)
- Command palette
- Advanced analytics