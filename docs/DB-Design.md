---
modified: 2026-03-21T12:31:49+05:30
---
# DEVFLOW DATABASE DESIGN DOCUMENT

---

# 📌 1. Design Goals

The database is designed to:

- Support **project-centric architecture**
- Enforce **task focus rules**
- Enable **fast local operations (SQLite)**
- Keep schema **simple and extensible**

---

# 📌 2. Database Choice

## 🗄️ SQLite

### Reasons:

- Local-first (no setup)
- Lightweight
- Fast for small datasets
- Perfect for single-user system

---

# 📌 3. Entity Overview

---

## Core Entities:

Projects  
Tasks  
Actions  
Notes  
Links

---

## Relationships:

Project → Tasks (1:N)  
Project → Actions (1:N)  
Project → Notes (1:N)  
Project → Links (1:N)

---

# 📌 4. Table Definitions

---

# 🗂️ 4.1 Projects Table

projects

|Field|Type|Description|
|---|---|---|
|id|INTEGER PK|Unique ID|
|name|TEXT|Project name|
|status|TEXT|active / paused / completed|
|last_accessed|DATETIME|Last opened timestamp|
|created_at|DATETIME|Created time|
|updated_at|DATETIME|Updated time|

---

### Constraints:

- `status` must be one of allowed values

---

# 📋 4.2 Tasks Table

tasks

|Field|Type|Description|
|---|---|---|
|id|INTEGER PK|Unique ID|
|project_id|INTEGER FK|Linked project|
|title|TEXT|Task title|
|status|TEXT|todo / doing / blocked / done|
|started_at|DATETIME|Timer start|
|time_spent|INTEGER|Seconds spent|
|order_index|INTEGER|Sorting control|
|created_at|DATETIME|Created time|
|updated_at|DATETIME|Updated time|

---

### Constraints:

- FK: `project_id → projects.id`
- `status` must be valid enum

---

### Important Rule (NOT DB constraint):

👉 Only ONE task per project can be `doing`  
→ enforced in **Service Layer**

---

# ⚡ 4.3 Actions Table

actions

|Field|Type|Description|
|---|---|---|
|id|INTEGER PK|Unique ID|
|project_id|INTEGER FK|Linked project|
|label|TEXT|Action name|
|command|TEXT|Command string|
|created_at|DATETIME|Created time|

---

### Example:

- "Run server"
- "npm run dev"

---

# 🧠 4.4 Notes Table

notes

|Field|Type|Description|
|---|---|---|
|id|INTEGER PK|Unique ID|
|project_id|INTEGER FK|Linked project|
|content|TEXT|Markdown content|
|created_at|DATETIME|Created time|
|updated_at|DATETIME|Updated time|

---

### Notes:

- Markdown stored as raw text

---

# 🔗 4.5 Links Table

links

|Field|Type|Description|
|---|---|---|
|id|INTEGER PK|Unique ID|
|project_id|INTEGER FK|Linked project|
|title|TEXT|Link title|
|url|TEXT|URL|
|created_at|DATETIME|Created time|

---

---

# 📌 5. Relationships Diagram (Logical)

Projects  
   │  
   ├── Tasks  
   ├── Actions  
   ├── Notes  
   └── Links

---

# 📌 6. Indexing Strategy

---

## Recommended Indexes:

### Tasks Table

INDEX tasks_project_id  
INDEX tasks_status

---

### Projects Table

INDEX projects_last_accessed

---

### Why:

- Fast project loading
- Fast task filtering
- Smooth dashboard performance

---

# 📌 7. Derived Data (Important Concept)

These values are NOT stored:

- Project progress %
- Tasks completed today
- Time spent today

---

## 👉 Instead:

They are **computed dynamically**

### Example:

completed_tasks / total_tasks

---

# 📌 8. Data Integrity Rules

---

## Rule 1: Single Active Task

- Only one `doing` per project
- Enforced in service layer

---

## Rule 2: Task belongs to Project

- FK constraint ensures integrity

---

## Rule 3: Time Tracking

- `started_at` NULL = timer stopped
- `started_at` NOT NULL = timer running

---

# 📌 9. Data Lifecycle

---

## Project Deletion:

👉 When project is deleted:

- Delete all related:
    - tasks
    - notes
    - links
    - actions

---

## Strategy:

👉 Use **cascade delete**

---

# 📌 10. Migration Strategy (Laravel)

---

Tables should be created in this order:

1. projects
2. tasks
3. actions
4. notes
5. links

---

# 📌 11. Future-Proofing

---

Prepared for:

- Git tracking (add table later)
- Sessions tracking
- User system (if needed)

---

# 📌 12. Known Limitations

---

- No strict DB-level enforcement for:
    - single active task
- No full-text search (can add later)