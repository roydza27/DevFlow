# DEVFLOW ARCHITECTURE DOCUMENT (FINAL)

---

# 📌 1. System Overview

---

## 🎯 Goal

DevFlow is a **local-first, single-user developer workspace system** designed to:

* Resume work instantly
* Maintain focus on a single task
* Track real development activity
* Keep all project-related context in one place

---

## 🧠 Core Architectural Concept

👉 **Project = Workspace**

A project is not a data entity alone — it is a **live working environment** that contains:

* Tasks (work)
* Timer (focus)
* Logs (activity history)
* Notes (knowledge)
* Resources (context)
* Commands (execution helpers)

---

## 🧩 Architectural Style

👉 **Monolithic Backend + SPA Frontend**

* Backend: Laravel (business logic + persistence)
* Frontend: React (via Inertia)
* Database: SQLite (local)

---

## 🏗️ High-Level Architecture

[ React UI (Inertia) ]
↓
[ Laravel Controllers ]
↓
[ Service Layer (Business Logic) ]
↓
[ SQLite Database ]

---

# 📌 2. System Components

---

## 🔹 2.1 Frontend Layer (React + Inertia)

---

### Responsibilities:

* Render workspace UI
* Manage UI state
* Handle user interaction
* Trigger backend operations

---

### Key Characteristics:

* Single-screen workspace (no navigation)
* Component-based architecture
* Minimal routing
* Context-driven UI (project-based)

---

### Core UI Structure:

Workspace
├── Project Header
├── Task Panel
├── Active Task Panel
├── Timer + Insights
├── Right Sidebar (collapsible)
│    ├── Quick Actions
│    ├── Resources
│    ├── Commands
│    ├── Logs
├── Notes Workspace (multi-file)
└── Footer Stats

---

### UI Principle:

👉 **Frontend reflects workspace state — not navigation state**

---

### Data Handling:

* Uses Inertia for server communication
* No separate REST API initially
* Receives hydrated data from Laravel

---

## 🔹 2.2 Backend Layer (Laravel)

---

### Responsibilities:

* Enforce business rules
* Handle data validation
* Manage state transitions
* Persist data
* Compute derived values

---

### Structure:

* Controllers → thin
* Services → core logic
* Models → data representation
* SQLite → storage

---

### Critical Design Rule:

👉 **All business logic lives in Service Layer**

---

## 🔹 2.3 Database Layer (SQLite)

---

### Responsibilities:

* Store all project-scoped data
* Maintain relationships
* Provide fast local access

---

### Characteristics:

* File-based
* Zero configuration
* Optimized for local usage

---

# 📌 3. Data Flow Architecture

---

## 🔁 Standard Flow

User Action
↓
React Component
↓
Inertia Request
↓
Laravel Controller
↓
Service Layer
↓
Database
↓
Response → UI Update

---

## ⚡ Key Principle

👉 Frontend = interaction + display
👉 Backend = truth + enforcement

---

# 📌 4. Module-Level Architecture

---

## 🧩 4.1 Project Module

---

### Backend:

* Create/update projects
* Track last accessed project

---

### Frontend:

* Load workspace
* Switch project context

---

---

## 📋 4.2 Task Module (CORE)

---

### Backend Responsibilities:

* Enforce:

  * single active task (`doing`)
  * state transitions
  * sorting rules

---

### Frontend Responsibilities:

* Render grouped tasks
* Handle quick add
* Trigger task updates

---

### Critical Rule:

IF task → set to `doing`
THEN reset previous active task

---

---

## ⏱️ 4.3 Tracking Module

---

### Backend:

Stores:

* started_at
* accumulated time

---

### Logic:

Start → store timestamp
Stop → calculate duration → add to total

---

### Frontend:

* Timer display
* Start/Stop controls
* Show insights:

  * time today
  * last session
  * total time

---

---

## 📜 4.4 Logs Module (NEW CORE)

---

### Backend:

* Store logs:

  * content
  * timestamp
  * project_id

---

### Characteristics:

* Append-only
* Lightweight
* Project-scoped

---

### Frontend:

* Quick log input
* Display recent logs
* Inline usage (sidebar)

---

---

## 🧠 4.5 Notes Module (UPGRADED)

---

### Backend:

* Store:

  * multiple notes per project
  * markdown content

---

### Frontend:

* Multi-file system
* Sidebar file navigation
* Markdown editor

---

### Design Principle:

👉 Inspired by Obsidian
👉 Simplified (no graph/backlinks)

---

---

## 🔗 4.6 Resources Module (REPLACES LINKS)

---

### Backend:

* Store:

  * title
  * url
  * type (docs / figma / api / etc)

---

### Frontend:

* Group by category
* Display in sidebar
* Quick access

---

---

## ⚡ 4.7 Commands Module

---

### Backend:

* Store project commands

---

### Frontend:

* Copy command
* Display list

---

---

## 🖥️ 4.8 Workspace Module (Dashboard)

---

### Role:

👉 Central aggregator of all modules

---

### Backend:

* Fetch:

  * project data
  * tasks
  * logs
  * notes
  * resources
  * stats

---

### Frontend:

* Render full workspace
* Maintain layout structure

---

### Critical Rule:

👉 **No navigation — only workspace rendering**

---

---

## ⚡ 4.9 Quick Add Module

---

### Backend:

* Create:

  * tasks
  * logs
  * resources
  * notes

---

### Frontend:

* Instant input
* Keyboard-based actions

---

---

## 📊 4.10 Feedback Module

---

### Backend:

Compute:

* tasks completed today
* time spent today
* total time

---

### Frontend:

* Display minimal insights (no dashboards)

---

# 📌 5. State Management Architecture

---

## 🔹 Types of State

---

### 1. Server State (Source of Truth)

* Projects
* Tasks
* Logs
* Notes
* Resources
* Commands

---

### 2. UI State (Temporary)

* input fields
* selected task
* timer visual state
* panel collapse state

---

## 🔹 Rule:

👉 Backend = truth
👉 Frontend = temporary state

---

# 📌 6. Routing Architecture

---

## Laravel Routes

GET    /dashboard
POST   /projects
POST   /tasks
PATCH  /tasks/{id}
POST   /logs
POST   /notes
POST   /resources
POST   /commands

---

## Frontend Routing

👉 Single route:

* /dashboard

---

# 📌 7. Business Logic Placement

---

## ❌ Avoid:

* Logic in React
* Logic in Controllers

---

## ✅ Use:

👉 Service Layer

---

### Example Services:

* TaskService
* TimerService
* LogService
* ResourceService
* NoteService

---

# 📌 8. Constraints Handling

---

## Limitations:

* Cannot execute commands
* Cannot access file system

---

## Solutions:

* Copy-to-clipboard
* URL opening

---

# 📌 9. Performance Considerations

---

## Backend:

* Efficient queries
* Minimal joins

---

## Frontend:

* Avoid re-renders
* Use memoization

---

## Data Strategy:

👉 Load only active project data

---

# 📌 10. Scalability Considerations

---

* Modular services
* Clean separation
* Extendable schema

---

# 📌 11. Security Considerations

---

* Validate inputs
* Sanitize markdown
* Prevent injection

---

# 📌 12. Future Architecture Extensions

---

* Tauri integration (system access)
* API layer expansion
* Git-based logging
* Advanced insights (in-context only)
