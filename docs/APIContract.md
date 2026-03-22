# DEVFLOW API CONTRACT DOCUMENT (FINAL)

---

# 📌 1. Overview

---

## 🎯 Purpose

Define **clear communication** between:

* React (Frontend via Inertia)
* Laravel (Backend)

---

## 🧠 API Style

👉 **REST-like + Inertia hybrid**

* Laravel routes
* JSON responses for mutations
* Inertia responses for page loads

---

## 🔑 Design Principles

* Minimal endpoints
* Consistent response format
* Backend = source of truth
* Optimistic UI support
* Project-scoped data

---

# 📌 2. Base Configuration

---

## Base URL

`/` (local app)

---

## Standard Success Response

```json
{
  "success": true,
  "data": {},
  "message": "optional"
}
```

---

## Standard Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

---

# 📌 3. Workspace API (ENTRY POINT)

---

## 🔹 GET /dashboard

### Purpose:

Load full workspace for last active project

---

### Response:

```json
{
  "project": {},
  "tasks": [],
  "commands": [],
  "notes": [],
  "resources": [],
  "logs": [],
  "stats": {
    "time_today": 7200,
    "tasks_completed_today": 3,
    "progress": 0.6
  }
}
```

---

## 🔹 GET /dashboard/{project_id}

### Purpose:

Load specific project workspace

---

---

# 📌 4. Project APIs

---

## 🔹 POST /projects

Create project

```json
{
  "name": "DevFlow"
}
```

---

## 🔹 PATCH /projects/{id}

Update:

```json
{
  "status": "paused"
}
```

---

## 🔹 GET /projects

List all projects (for switcher)

---

---

# 📌 5. Task APIs (CORE SYSTEM)

---

## 🔹 POST /tasks

```json
{
  "project_id": 1,
  "title": "Fix middleware bug"
}
```

---

## 🔹 PATCH /tasks/{id}

```json
{
  "status": "doing"
}
```

---

### Backend Behavior:

* Enforce single `doing`
* Reset previous active task

---

## 🔹 DELETE /tasks/{id}

---

## 🔹 GET /tasks?project_id=1

---

---

# 📌 6. Timer APIs

---

## 🔹 POST /timer/start

```json
{
  "task_id": 10
}
```

---

## 🔹 POST /timer/stop

```json
{
  "task_id": 10
}
```

---

### Backend Behavior:

* Calculate duration
* Update `time_spent`

---

---

# 📌 7. Commands APIs (RENAMED)

---

## 🔹 POST /commands

```json
{
  "project_id": 1,
  "label": "Run Server",
  "command": "npm run dev"
}
```

---

## 🔹 GET /commands?project_id=1

---

## 🔹 DELETE /commands/{id}

---

---

# 📌 8. Logs APIs (NEW)

---

## 🔹 POST /logs

```json
{
  "project_id": 1,
  "content": "Fixed auth bug"
}
```

---

## 🔹 GET /logs?project_id=1

---

## 🔹 DELETE /logs/{id} (optional future)

---

---

# 📌 9. Notes APIs (UPGRADED)

---

## 🔹 POST /notes

```json
{
  "project_id": 1,
  "title": "api.md",
  "content": "# API Notes"
}
```

---

## 🔹 PATCH /notes/{id}

---

## 🔹 GET /notes?project_id=1

---

## 🔹 DELETE /notes/{id}

---

---

# 📌 10. Resources APIs (REPLACES LINKS)

---

## 🔹 POST /resources

```json
{
  "project_id": 1,
  "title": "Figma Design",
  "url": "https://figma.com",
  "type": "figma"
}
```

---

## 🔹 GET /resources?project_id=1

---

## 🔹 DELETE /resources/{id}

---

---

# 📌 11. Derived Data APIs

---

## 🔹 GET /stats?project_id=1

```json
{
  "time_today": 3600,
  "tasks_completed_today": 2,
  "progress": 0.5
}
```

---

---

# 📌 12. Validation Rules

---

## Tasks:

* title required
* status must be valid

---

## Projects:

* name required

---

## Notes:

* title required

---

## Resources:

* valid URL
* type must be valid

---

---

# 📌 13. Error Handling

---

## Example:

```json
{
  "success": false,
  "error": "Task not found"
}
```

---

## Common Errors:

* Invalid ID
* Invalid status
* Missing required fields

---

---

# 📌 14. State Synchronization Strategy

---

## Rule:

After every mutation:

* Return updated entity
  OR
* Refetch via `/dashboard`

---

## UI Strategy:

👉 Optimistic updates allowed
👉 Backend confirms state

---

---

# 📌 15. API Flow Example

---

## Scenario: Start Working

1. GET /dashboard
2. POST /tasks
3. PATCH /tasks/{id} → doing
4. POST /timer/start
5. POST /logs (optional)

---

---

# 📌 16. Data Scope Rule

---

👉 All APIs must be **project-scoped**

* No global data leakage
* Always filter by `project_id`

---

---

# 📌 17. Security (Basic)

---

* Validate inputs
* Sanitize markdown
* Restrict invalid states
* Prevent multiple active tasks

---

---

# 📌 18. Performance Strategy

---

* Load only active project
* Avoid over-fetching
* Batch via `/dashboard`

---

---

# 📌 19. Future Extensions

---

Prepared for:

* API versioning (`/v1`)
* Auth system
* Git integration
* Command execution layer (Tauri)
* Real-time updates

---
