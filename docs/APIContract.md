# DEVFLOW API CONTRACT DOCUMENT

---

# 📌 1. Overview

## 🎯 Purpose
Defines the REST API communication contract between the DevFlow React Frontend and the Node.js Express 5 + SQLite Backend Service.

## 🔑 Base URL
`/api` (relative endpoint when running behind Caddy reverse proxy on `devflow.local` or direct to `http://localhost:3001/api`).

---

# 📌 2. System & Workspace APIs

## 🔹 GET /api/stats
Returns SQLite storage metrics and record counts.

**Response:**
```json
{
  "dbSizeBytes": 45056,
  "dbSizeFormatted": "44.0 KB",
  "counts": {
    "projects": 2,
    "tasks": 8,
    "notes": 3,
    "logs": 14
  }
}
```

---

## 🔹 GET /api/projects
Lists all projects along with nested tasks, notes, commands, resources, logs, and timer state.

---

## 🔹 POST /api/projects
Creates a new workspace project.

**Request:**
```json
{
  "id": "project-uuid-or-timestamp",
  "name": "DevFlow",
  "folderPath": "/home/user/code/DevFlow"
}
```

---

## 🔹 PATCH /api/projects/:id
Updates workspace project metadata.

---

## 🔹 DELETE /api/projects/:id
Deletes a workspace project and cascades delete to associated tasks, notes, commands, resources, logs, and timers.

---

## 🔹 POST /api/projects/:id/link-folder
Links a local folder to a workspace project. Performs folder path validation using `path.resolve()` and directory verification.

---

# 📌 3. Task APIs

## 🔹 POST /api/projects/:id/tasks
Creates a new task.

---

## 🔹 PATCH /api/tasks/:taskId
Updates task state (`status`, `title`, `totalTime`, `startedAt`, `isRunning`).
Status values supported: `'todo' | 'doing' | 'blocked' | 'done' | 'archived'`.

---

## 🔹 DELETE /api/tasks/:taskId
Deletes a specific task.

---

## 🔹 DELETE /api/projects/:id/tasks/completed
Archives all completed tasks for a workspace project (`UPDATE tasks SET status = 'archived' WHERE status = 'done'`).

---

# 📌 4. Notes, Commands, Resources, Logs & Timers

- **POST /api/projects/:id/notes** & **PATCH /api/notes/:noteId** & **DELETE /api/notes/:noteId**
- **POST /api/projects/:id/logs** & **DELETE /api/projects/:id/logs**
- **PUT /api/projects/:id/timer**
