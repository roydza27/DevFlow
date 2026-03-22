---
modified: 2026-03-21T12:30:46+05:30
---
# DEVFLOW ARCHITECTURE DOCUMENT

---

# 📌 1. System Overview

## 🎯 Goal

DevFlow is a **local-first, single-user workflow system** designed to:

- Resume work instantly
- Maintain focus on a single task
- Track real progress

---

## 🧠 Architectural Style

👉 **Monolithic Backend + SPA Frontend**

- Backend: Laravel (API + logic)
- Frontend: React (via Inertia)
- Database: SQLite (local)

---

## 🧩 High-Level Architecture

[ React UI (Inertia) ]  
          ↓  
[ Laravel Controllers ]  
          ↓  
[ Services / Business Logic ]  
          ↓  
[ SQLite Database ]

---

# 📌 2. System Components

---

## 🔹 2.1 Frontend Layer (React + Inertia)

### Responsibilities:

- UI rendering
- State management
- User interaction
- Calling backend routes

---

### Key Characteristics:

- Component-based
- Single-page dashboard
- Minimal routing

---

### Core UI Sections:

Dashboard  
 ├── Project Header  
 ├── Task List  
 ├── Active Task Panel  
 ├── Timer  
 ├── Quick Actions  
 ├── Notes & Links

---

### Data Handling:

- Uses Inertia to fetch data from Laravel
- No direct API layer initially

---

## 🔹 2.2 Backend Layer (Laravel)

### Responsibilities:

- Business logic
- Data validation
- State enforcement (rules)
- Data persistence

---

### Structure:

Controllers  
Services (important)  
Models  
Database (SQLite)

---

### Important Design Decision:

👉 **Controllers should be thin**

All logic goes into:  
👉 **Service Layer**

---

## 🔹 2.3 Database Layer (SQLite)

### Responsibilities:

- Store all project data locally
- Provide fast read/write

---

### Characteristics:

- Local file-based DB
- No external dependencies
- Simple relational schema

---

# 📌 3. Data Flow Architecture

---

## 🔁 Standard Flow

### Example: Add Task

User Action (UI)  
   ↓  
React Component  
   ↓  
Inertia Request  
   ↓  
Laravel Controller  
   ↓  
Service Layer  
   ↓  
Database (SQLite)  
   ↓  
Response → UI Update

---

## ⚡ Key Principle

👉 **Frontend = display + interaction**  
👉 **Backend = truth + rules**

---

# 📌 4. Module-Level Architecture

---

## 🧩 4.1 Project Module

### Backend:

- Handles project CRUD
- Tracks last accessed

### Frontend:

- Displays current project
- Switches context

---

---

## 📋 4.2 Task Module (CORE)

### Backend Responsibilities:

- Enforce:
    - single `doing` task
    - status transitions
    - sorting logic

### Frontend Responsibilities:

- Display tasks
- Handle quick add
- Trigger updates

---

### Critical Rule Enforcement (Backend Only):

IF new_task.status == "doing"  
THEN reset previous "doing" task

---

## ⚡ 4.3 Execution Module

### Backend:

- Store actions

### Frontend:

- Display commands
- Copy to clipboard
- Open links

---

## 🧠 4.4 Context Module

### Backend:

- Store notes + links

### Frontend:

- Render markdown
- Handle quick input

---

## ⏱️ 4.5 Tracking Module

### Backend:

- Store:
    - started_at
    - time_spent

---

### Logic Flow:

Start Timer:  
→ store started_at  
  
Stop Timer:  
→ calculate (now - started_at)  
→ add to time_spent  
→ clear started_at

---

### Frontend:

- Display timer
- Trigger start/stop

---

## 🖥️ 4.6 Dashboard Module

### Role:

- Aggregates all modules

### Backend:

- Fetch:
    - last project
    - tasks
    - stats

### Frontend:

- Render everything in one screen

---

## ⚡ 4.7 Quick Add Module

### Backend:

- Create entries (task, note, link)

### Frontend:

- Instant input UI
- Keyboard-based submission

---

## 📊 4.8 Feedback Module

### Backend:

- Compute:
    - tasks completed today
    - time spent today
    - progress %

### Frontend:

- Display metrics

---

# 📌 5. State Management Architecture

---

## 🔹 Types of State

### 1. Server State (Laravel)

- Projects
- Tasks
- Notes
- Links

---

### 2. UI State (React)

- Current input
- Selected task
- Timer running (visual)

---

## 🔹 Rule:

👉 **Backend = source of truth**  
👉 **Frontend = temporary state**

---

# 📌 6. Routing Architecture

---

## Laravel Routes (Inertia)

GET    /dashboard  
POST   /projects  
POST   /tasks  
PATCH  /tasks/{id}  
POST   /notes  
POST   /links

---

## Frontend Navigation

👉 Minimal:

- Only dashboard view
- No multi-page routing

---

# 📌 7. Business Logic Placement

---

## ❌ DO NOT:

- Put logic in React
- Put logic in Controllers

---

## ✅ DO:

Put logic in:

👉 **Service Layer**

---

### Example:

TaskService:  
- setTaskToDoing()  
- resetActiveTask()  
- sortTasks()

---

# 📌 8. Constraints Handling

---

## 🚫 System Limitations

- No command execution
- No file system access

---

## 🧠 Solution:

- Use:
    - copy-to-clipboard
    - open URL

---

# 📌 9. Performance Considerations

---

## Backend:

- Use efficient queries
- Avoid unnecessary joins

---

## Frontend:

- Avoid unnecessary re-renders
- Use memoization where needed

---

## Data Strategy:

- Load only current project data
- Avoid loading all projects

---

# 📌 10. Scalability Considerations

---

Even though local:

Prepare for future:

- Separate service layer
- Modular components
- Clean DB schema

---

# 📌 11. Security Considerations

---

Even for local:

- Validate all inputs
- Sanitize markdown content
- Prevent injection

---

# 📌 12. Future Architecture Extensions

---

## Possible upgrades:

- Replace SQLite → cloud DB
- Add API layer
- Add Tauri for system control
- Add real-time features