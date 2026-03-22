# DEVFLOW DATABASE DESIGN DOCUMENT (FINAL)

---

# 📌 1. Design Goals

The database is designed to:

* Support **Project = Workspace architecture**
* Enforce **task focus rules (single active task)**
* Enable **fast local operations (SQLite)**
* Keep schema **simple, modular, and extensible**
* Support **logs, notes, resources, and commands as core systems**

---

# 📌 2. Database Choice

## 🗄️ SQLite

### Reasons:

* Local-first (no setup required)
* Lightweight and fast
* File-based storage
* Ideal for single-user environment
* Minimal operational overhead

---

# 📌 3. Entity Overview

---

## Core Entities:

Projects
Tasks
Commands (renamed from Actions)
Notes (multi-file system)
Resources (replaces Links)
Logs (NEW core entity)

---

## Relationships:

Project → Tasks (1:N)
Project → Commands (1:N)
Project → Notes (1:N)
Project → Resources (1:N)
Project → Logs (1:N)

---

# 📌 4. Table Definitions

---

# 🗂️ 4.1 Projects Table

projects

| Field         | Type       | Description                 |
| ------------- | ---------- | --------------------------- |
| id            | INTEGER PK | Unique ID                   |
| name          | TEXT       | Project name                |
| status        | TEXT       | active / paused / completed |
| last_accessed | DATETIME   | Last opened timestamp       |
| created_at    | DATETIME   | Created time                |
| updated_at    | DATETIME   | Updated time                |

---

### Constraints:

* `status` must be one of allowed values

---

# 📋 4.2 Tasks Table

tasks

| Field       | Type       | Description                   |
| ----------- | ---------- | ----------------------------- |
| id          | INTEGER PK | Unique ID                     |
| project_id  | INTEGER FK | Linked project                |
| title       | TEXT       | Task title                    |
| status      | TEXT       | todo / doing / blocked / done |
| started_at  | DATETIME   | Timer start timestamp         |
| time_spent  | INTEGER    | Total time in seconds         |
| order_index | INTEGER    | Sorting control               |
| created_at  | DATETIME   | Created time                  |
| updated_at  | DATETIME   | Updated time                  |

---

### Constraints:

* FK: `project_id → projects.id`
* `status` must be valid enum

---

### Important Rule (Service Layer):

👉 Only ONE task per project can be `doing`

---

# ⚡ 4.3 Commands Table (RENAMED)

commands

| Field      | Type       | Description    |
| ---------- | ---------- | -------------- |
| id         | INTEGER PK | Unique ID      |
| project_id | INTEGER FK | Linked project |
| label      | TEXT       | Command name   |
| command    | TEXT       | Command string |
| created_at | DATETIME   | Created time   |

---

### Example:

* "Run Server"
* "npm run dev"

---

# 🧠 4.4 Notes Table (UPGRADED)

notes

| Field      | Type       | Description      |
| ---------- | ---------- | ---------------- |
| id         | INTEGER PK | Unique ID        |
| project_id | INTEGER FK | Linked project   |
| title      | TEXT       | Note file name   |
| content    | TEXT       | Markdown content |
| created_at | DATETIME   | Created time     |
| updated_at | DATETIME   | Updated time     |

---

### Notes:

* Supports **multi-file system per project**
* Markdown stored as raw text
* Title acts as file identifier (e.g. "api.md")

---

# 🔗 4.5 Resources Table (REPLACES LINKS)

resources

| Field      | Type       | Description                    |
| ---------- | ---------- | ------------------------------ |
| id         | INTEGER PK | Unique ID                      |
| project_id | INTEGER FK | Linked project                 |
| title      | TEXT       | Resource name                  |
| url        | TEXT       | Resource URL                   |
| type       | TEXT       | docs / figma / api / reference |
| created_at | DATETIME   | Created time                   |

---

### Notes:

* Replaces generic "links"
* Categorized for better usability
* Type is used for grouping in UI

---

# 📜 4.6 Logs Table (NEW CORE SYSTEM)

logs

| Field      | Type       | Description    |
| ---------- | ---------- | -------------- |
| id         | INTEGER PK | Unique ID      |
| project_id | INTEGER FK | Linked project |
| content    | TEXT       | Log entry text |
| created_at | DATETIME   | Timestamp      |

---

### Characteristics:

* Append-only system
* Represents actual work done
* Lightweight and fast

---

# 📌 5. Relationships Diagram (Logical)

Projects
│
├── Tasks
├── Commands
├── Notes
├── Resources
└── Logs

---

# 📌 6. Indexing Strategy

---

## Recommended Indexes:

---

### Tasks Table

INDEX tasks_project_id
INDEX tasks_status

---

### Projects Table

INDEX projects_last_accessed

---

### Logs Table

INDEX logs_project_id
INDEX logs_created_at

---

### Resources Table

INDEX resources_project_id
INDEX resources_type

---

## Why:

* Fast workspace loading
* Efficient filtering
* Smooth UI performance

---

# 📌 7. Derived Data (Important Concept)

---

These values are NOT stored:

* Project progress %
* Tasks completed today
* Time spent today
* Log summaries

---

## 👉 Instead:

Computed dynamically

---

### Examples:

* Progress = completed_tasks / total_tasks
* Time today = sum of today's sessions

---

# 📌 8. Data Integrity Rules

---

## Rule 1: Single Active Task

* Only one `doing` task per project
* Enforced in Service Layer

---

## Rule 2: Project-Scoped Data

* All entities must belong to a project
* Enforced via FK constraints

---

## Rule 3: Timer Logic

* `started_at = NULL` → timer stopped
* `started_at ≠ NULL` → timer running

---

## Rule 4: Logs Immutability

* Logs are append-only
* No editing required (optional future)

---

# 📌 9. Data Lifecycle

---

## Project Deletion:

👉 When a project is deleted:

* Delete all related:

  * tasks
  * notes
  * resources
  * commands
  * logs

---

## Strategy:

👉 Use **cascade delete**

---

# 📌 10. Migration Strategy (Laravel)

---

Tables should be created in this order:

1. projects
2. tasks
3. commands
4. notes
5. resources
6. logs

---

# 📌 11. Future-Proofing

---

Prepared for:

* Git integration (activity logs)
* Session-based tracking (separate table)
* Search indexing (full-text search)
* Multi-user support (if extended)

---

# 📌 12. Known Limitations

---

* No DB-level enforcement for:

  * single active task
* No full-text search (can be added later)
* Logs are simple (no structure beyond text)
* Notes do not support hierarchical folders (yet)
