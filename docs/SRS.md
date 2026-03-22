# 📄 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

# 1. Introduction

---

## 1.1 Purpose

This document defines the requirements for **DevFlow**, a local-first, project-centric developer workspace application designed to:

* Resume work instantly
* Maintain focus on a single task
* Track actual development activity
* Keep all project-related context in one place

The system minimizes friction between **starting work and continuing work**.

---

## 1.2 Scope

DevFlow is a **local web-based application** that provides:

* A single-screen project workspace
* Task management with enforced focus
* Time tracking for work sessions
* Activity logs (what was actually done)
* Structured resource management (docs, figma, APIs)
* Multi-file note system (Obsidian-inspired)
* Command and execution helpers

The system is intended for **individual developer use only**.

---

## 1.3 Definitions

| Term        | Description                                        |
| ----------- | -------------------------------------------------- |
| Project     | A workspace containing all development context     |
| Workspace   | Active working environment of a project            |
| Task        | A unit of work                                     |
| Active Task | Task with status `doing`                           |
| Log         | Record of actual work done                         |
| Resource    | Categorized external reference (docs, figma, etc.) |
| Command     | Copyable development command                       |
| Note        | Markdown-based project file                        |
| Timer       | Work session tracker                               |

---

# 📌 2. Overall Description

---

## 2.1 Product Perspective

DevFlow is a **standalone local application**:

* Laravel backend + React frontend (Inertia)
* SQLite database
* Runs entirely locally
* No external dependencies

---

## 2.2 Product Functions

The system provides:

* Project workspace management
* Task-based focus system
* Time tracking and session awareness
* Activity logging
* Knowledge storage (notes)
* Resource organization
* Command management

---

## 2.3 User Characteristics

* Target: Individual developer
* Skill level: Intermediate+
* Usage: Daily, continuous workflow

---

## 2.4 Constraints

* No system-level command execution
* No direct file system access
* Must remain single-screen
* Must be fast and lightweight

---

## 2.5 Assumptions

* User works on one project at a time
* User values speed over features
* User prefers minimal UI

---

# 📌 3. System Model

---

## 🔥 Core Concept

👉 **Project = Workspace**

A project is not a list — it is a **live working environment**.

---

## Workspace Composition

Each project contains:

* Tasks (work)
* Timer (focus)
* Logs (actual activity)
* Notes (knowledge)
* Resources (context)
* Commands (execution helpers)

---

## Entry Behavior

* System shall open directly into the **last active project workspace**
* No dashboard or landing page
* No navigation required to begin work

---

# 📌 4. Functional Requirements

---

## 4.1 Project Management

---

### FR-1: Create Project

User shall create projects with:

* name
* status

---

### FR-2: Project Status

* active
* paused
* completed

---

### FR-3: Auto Resume

System shall:

* store last accessed project
* auto-load on startup

---

## 4.2 Task Management

---

### FR-4: Add Task

* instant input
* no forms

---

### FR-5: Task States

* todo
* doing
* blocked
* done

---

### FR-6: Single Active Task

Only one `doing` task allowed

---

### FR-7: State Transition

Switching `doing` resets previous

---

### FR-8: Task Actions

Each task supports:

* edit
* delete
* mark done
* block

---

### FR-9: Sorting

* doing → top
* todo → middle
* blocked → below
* done → bottom

---

## 4.3 Time Tracking

---

### FR-10: Timer Control

* start / stop

---

### FR-11: Global Timer

Only one timer at a time

---

### FR-12: Time Storage

* started_at
* accumulated time

---

### FR-13: Persistence

Timer survives reload

---

### FR-14: Insights

Display:

* time today
* last session
* total time

---

## 4.4 Logs System (NEW CORE)

---

### FR-15: Add Log

User shall record activity:

* free text
* timestamped

---

### FR-16: Log Scope

* project-specific
* append-only

---

### FR-17: Log Display

* recent logs visible
* quick add input

---

## 4.5 Notes System (UPGRADED)

---

### FR-18: Multi-file Notes

System shall support:

* multiple notes per project
* file-like structure

---

### FR-19: Note Editing

* Markdown support
* fast switching

---

### FR-20: Note Navigation

* sidebar-style file list inside notes section

---

## 4.6 Resources System (REPLACES LINKS)

---

### FR-21: Resource Management

User shall store categorized resources:

* Docs
* Figma
* APIs
* References

---

### FR-22: Resource Display

* grouped by type
* quick access

---

## 4.7 Commands System

---

### FR-23: Command Storage

Store project commands

---

### FR-24: Interaction

* copy command
* simple UI

---

## 4.8 Dashboard (Workspace UI)

---

### FR-25: Single Screen Interface

All features on one screen

---

### FR-26: Layout Structure

* Left → Tasks
* Center → Active Task + Timer
* Right → Collapsible Panels
* Bottom → Notes
* Footer → Stats

---

### FR-27: Collapsible Panels

Right side panels include:

* Actions
* Resources
* Commands
* Logs

---

## 4.9 Quick Add System

---

### FR-28: Instant Input

* tasks
* logs
* notes
* resources

---

# 📌 5. Validation Constraints

* Task title required (≤255)
* Project name required
* URL must be valid

---

# 📌 6. Auto-Recovery Rules

* Multiple `doing` → fix automatically
* Timer recalculates on reload

---

# 📌 7. Non-Functional Requirements

---

## Performance

* Load < 2s
* Instant UI feedback

---

## Usability

* No navigation required
* Minimal clicks
* fast input

---

## Reliability

* Local persistence
* accurate timer

---

## Maintainability

* modular system
* reusable components

---

# 📌 8. Data Requirements

---

## Entities

* Projects
* Tasks
* Logs
* Notes
* Resources
* Commands

---

## Relationships

* Project → Tasks
* Project → Logs
* Project → Notes
* Project → Resources
* Project → Commands

---

# 📌 9. System Rules

---

* One active task
* One active timer
* Project-scoped data
* Single-screen only
* Minimal UI

---

# 📌 10. Constraints & Trade-offs

---

## Constraints

* No command execution
* No file system access

---

## Trade-offs

* manual logs
* manual tracking
* no automation

---

# 📌 11. Non-Goals

---

* Multi-page system
* Analytics dashboard
* Multi-user support
* Cloud sync

---

# 📌 12. Future Enhancements

---

* Git integration
* Command execution (Tauri)
* Advanced insights (in-context only)
* Command palette
