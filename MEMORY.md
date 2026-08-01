# MEMORY.md — DevFlow Project Memory

_Last updated: 2026-08-01 (session 28 — Task Lifecycle Archiving Architecture complete)_

---

## Current Goal

Build **DevFlow** — a local-first developer workspace that helps developers instantly resume work, focus on one task, and track real progress from a single screen.

Principle: **Resume → Focus → Execute → Log → Continue → Track**

Current session: Transformed task cleanup from destructive deletion into a Git-like Task Lifecycle Archiving Architecture. Replaced "Clear Done" with "Archive completed". When executed, completed tasks transition to `status = 'archived'` in SQLite (`UPDATE tasks SET status = 'archived' WHERE status = 'done'`). Archived tasks are hidden from active workspace task lists while preserving total accumulated time, completion logs, and engineering history intact forever.

---

## Current Architecture Understanding

### Stack

| Layer     | Tech                                         |
|-----------|----------------------------------------------|
| Frontend  | React 18 + Vite, Static Build (`dist/`), TailwindCSS v3, Zustand v5, REST API Client |
| Backend / Service Layer | Node.js/Express 5, SQLite (`better-sqlite3`), `chokidar` file watcher, systemd user services, Caddy reverse-proxy |
| Persistence | Single Source of Truth: SQLite DB (`~/.config/devflow/devflow.db`) + `.devflow/` workspace folder sync |

### Task Lifecycle Architecture

```
todo ──► doing ──► blocked (optional) ──► done ──► archived (hidden from workspace, kept in SQLite)
```

---

## Important Files

```
frontend/src/features/workspace/TaskSection.jsx ← UI with "Archive completed" button and active vs archived stats
frontend/src/store/useWorkspaceStore.js        ← Zustand store updating status to 'archived'
backend/src/controllers/sqliteController.js   ← SQLite controller executing UPDATE tasks SET status = 'archived'
backend/src/config/sqlite.js                   ← Schema definition supporting ('todo', 'doing', 'blocked', 'done', 'archived')
```

---

## Design Decisions

- **Git-Like Archiving Model**: Never delete completed work data. Cleaning up the workspace updates tasks to `archived` status, preserving time metrics, audit logs, and historical engineering data in SQLite.
- **Active Workspace Filtering**: Main task list views only show `todo`, `doing`, `blocked`, and active `done` tasks.
- **Accurate Historical Time Tracking**: Workspace total time continues to include archived task times (`sum(all workspace task.totalTime)`).

---

## Progress

### Completed
- **SQLite Schema Updated**: Added `'archived'` to `tasks.status` CHECK constraint in [`sqlite.js`](file:///home/cy3pher/Documents/WorkSpace-Tools/DevFlow/backend/src/config/sqlite.js).
- **Controller Updated**: Modified `clearDoneTasksData` in [`sqliteController.js`](file:///home/cy3pher/Documents/WorkSpace-Tools/DevFlow/backend/src/controllers/sqliteController.js) to issue `UPDATE tasks SET status = 'archived' WHERE status = 'done'`.
- **UI & Button Updated**: Renamed button to **"Archive completed ({N})"** with an `Archive` icon in [`TaskSection.jsx`](file:///home/cy3pher/Documents/WorkSpace-Tools/DevFlow/frontend/src/features/workspace/TaskSection.jsx).
- **Workspace Stats Updated**: Left sidebar bottom card displays **Active**, **Done**, and **Archived** count breakdowns.

---

## Next Recommended Task

1. Verify systemd background services (`systemctl --user status devflow-api devflow-ui`).
