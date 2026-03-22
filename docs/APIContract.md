---
modified: 2026-03-21T12:34:32+05:30
---
# DEVFLOW API CONTRACT DOCUMENT

---

# 📌 1. Overview

## 🎯 Purpose

Define **clear communication** between:

- React (Frontend)
- Laravel (Backend)

---

## 🧠 API Style

👉 **REST-like + Inertia hybrid**

- Uses Laravel routes
- Returns JSON OR Inertia responses
- Simple, predictable endpoints

---

## 🔑 Design Principles

- Consistent structure
- Minimal endpoints
- No overengineering
- Backend = source of truth

---

# 📌 2. Base Configuration

---

## Base URL

/ (local app)

---

## Response Format (STANDARD)

{  
  "success": true,  
  "data": {},  
  "message": "optional"  
}

---

## Error Format

{  
  "success": false,  
  "error": "Error message"  
}

---

# 📌 3. Project APIs

---

## 🔹 GET /dashboard

### Purpose:

Load full dashboard data

---

### Response:

{  
  "project": {},  
  "tasks": [],  
  "actions": [],  
  "notes": [],  
  "links": [],  
  "stats": {  
    "time_today": 7200,  
    "tasks_completed_today": 3,  
    "progress": 0.6  
  }  
}

---

---

## 🔹 POST /projects

### Purpose:

Create project

---

### Request:

{  
  "name": "DevFlow"  
}

---

### Response:

{  
  "success": true,  
  "data": {  
    "id": 1,  
    "name": "DevFlow",  
    "status": "active"  
  }  
}

---

---

## 🔹 PATCH /projects/{id}

### Purpose:

Update project status

---

### Request:

{  
  "status": "paused"  
}

---

---

# 📌 4. Task APIs (CORE)

---

## 🔹 POST /tasks

### Purpose:

Create task

---

### Request:

{  
  "project_id": 1,  
  "title": "Fix middleware bug"  
}

---

### Response:

{  
  "success": true,  
  "data": {  
    "id": 10,  
    "title": "Fix middleware bug",  
    "status": "todo"  
  }  
}

---

---

## 🔹 PATCH /tasks/{id}

### Purpose:

Update task status

---

### Request:

{  
  "status": "doing"  
}

---

### Backend Behavior (IMPORTANT):

- If status = `doing`
    - reset previous `doing`

---

---

## 🔹 DELETE /tasks/{id}

### Purpose:

Delete task

---

---

## 🔹 GET /tasks?project_id=1

### Purpose:

Fetch tasks

---

---

# 📌 5. Tracking APIs

---

## 🔹 POST /timer/start

### Purpose:

Start timer

---

### Request:

{  
  "task_id": 10  
}

---

### Backend:

- Set `started_at`

---

---

## 🔹 POST /timer/stop

### Purpose:

Stop timer

---

### Request:

{  
  "task_id": 10  
}

---

### Backend:

- Calculate duration
- Update `time_spent`

---

---

# 📌 6. Actions APIs

---

## 🔹 POST /actions

### Request:

{  
  "project_id": 1,  
  "label": "Run server",  
  "command": "npm run dev"  
}

---

---

## 🔹 GET /actions?project_id=1

---

## 🔹 DELETE /actions/{id}

---

# 📌 7. Notes APIs

---

## 🔹 POST /notes

{  
  "project_id": 1,  
  "content": "# Notes here"  
}

---

---

## 🔹 PATCH /notes/{id}

---

## 🔹 GET /notes?project_id=1

---

# 📌 8. Links APIs

---

## 🔹 POST /links

{  
  "project_id": 1,  
  "title": "Docs",  
  "url": "https://example.com"  
}

---

---

## 🔹 GET /links?project_id=1

---

## 🔹 DELETE /links/{id}

---

# 📌 9. Derived Data APIs

---

## 🔹 GET /stats?project_id=1

### Response:

{  
  "time_today": 3600,  
  "tasks_completed_today": 2,  
  "progress": 0.5  
}

---

# 📌 10. Validation Rules

---

## Tasks:

- title required
- status must be valid

---

## Projects:

- name required

---

## Links:

- valid URL

---

# 📌 11. Error Cases

---

## Example:

{  
  "success": false,  
  "error": "Task not found"  
}

---

## Common Errors:

- Invalid ID
- Invalid status
- Missing fields

---

# 📌 12. State Synchronization Strategy

---

## Rule:

👉 After every mutation:

- Return updated data
- Or refetch via dashboard

---

---

# 📌 13. API Flow Example

---

## Scenario: Start Working

1. GET /dashboard  
2. POST /tasks  
3. PATCH /tasks/{id} → doing  
4. POST /timer/start

---

# 📌 14. Security (Basic)

---

- Validate all inputs
- Sanitize markdown
- Prevent invalid status

---

# 📌 15. Future Extensions

---

- API versioning
- Auth system
- External integrations