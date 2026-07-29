# MEMORY.md — DevFlow Project Memory

_Last updated: 2026-07-30 (session 16 — README and main docs complete)_

---

## Current Goal

Build **DevFlow** — a local-first developer workspace that helps developers instantly resume work, focus on one task, and track real progress from a single screen.

Principle: **Resume → Focus → Execute → Log → Continue → Track**

Current session: Created comprehensive root `README.md` and updated system documentation. Rewrote `docs/Architecture.md` to reflect React 18, Zustand, and File System Access API stack. Created `backend/README.md` explaining dormant status. Archived obsolete task lists (`FrontendTasks-1.md`, `Frontendtasks-2.md`) to `docs/archive/`. Verified build clean.

---

## Current Architecture Understanding

### Stack

| Layer     | Tech                                         |
|-----------|----------------------------------------------|
| Frontend  | React 18 + Vite, TailwindCSS v3, Zustand v5, lucide-react |
| Backend   | Node.js/Express (exists but appears unused by frontend — frontend is fully local-first) |
| Persistence | Zustand `persist` middleware → `localStorage` (`devflow_projects` key) + optional File System Access API (OPFS/directory handles stored in IndexedDB) |

### Frontend Architecture

- **Entry**: `frontend/src/main.jsx` → `DashboardPage`
- **Single page**: No routing; one screen, no navigation
- **Layer model**:
  - `pages/dashboard/DashboardPage.jsx` — top-level orchestrator; connects store to UI
  - `features/workspace/Workspace.jsx` — pure layout shell; receives all props from DashboardPage
  - `app/layout/DashboardLayout.jsx` — structural layout (header, left, center, right, notes, footer)
  - `app/layout/WorkspaceHeader.jsx` — project switcher, create/link/unlink folder
  - Feature panels (each self-contained):
    - `features/tasks/` → TaskPanel, TaskItem, TaskQuickAdd
    - `features/tracking/` → FocusPanel, ActiveTaskPanel, TimerDisplay
    - `features/notes/` → NotesWorkspace, NotesSidebar, NoteEditor
    - `features/commands/` → CommandsPanel, CommandItem
    - `features/resources/` → ResourcesPanel, ResourceItem
    - `features/logs/` → LogsPanel, LogItem
  - `features/workspace/` → TaskSection, NotesSection, RightSidebar (compose feature panels)

### State Management

Single Zustand store: `frontend/src/store/useWorkspaceStore.js`

- All project data lives in `projects[]` array
- `activeProjectId` tracks current workspace
- Convenience selector: `useActiveProject()` exported from same file
- Store key actions: `createProject`, `switchProject`, `linkFolder`, `unlinkFolder`, `addTask`, `selectTask`, `markTaskDone`, `markTaskBlocked`, `editTask`, `deleteTask`, `startTimer`, `stopTimer`, `addNote`, `updateNote`, `renameNote`, `deleteNote`, `addCommand`, `deleteCommand`, `addResource`, `deleteResource`, `addLog`
- Internal helpers: `_patch(projectId, updater)`, `_log(projectId, msg, type)`
- `syncProject(projectId)` — fire-and-forget FS sync if folder is linked

### Persistence Model

- **Primary**: `localStorage` via Zustand `persist` (key: `devflow_projects`)
- **Optional FS sync**: File System Access API — `fileSystemService.js` manages `dirHandle` per project
  - `getDirHandle / setDirHandle` — in-memory map
  - `saveHandleToIDB / removeHandleFromIDB / restoreHandles` — IndexedDB persistence for handles across reloads
  - `writeProjectToDir` — writes `.devflow/project.json` + individual note files
  - `writeNoteToDir / deleteNoteFromDir` — granular note sync

### Backend (backend/)

Standalone Node.js / Express / Mongoose REST API (currently disconnected from frontend).
- **Structure**:
  - `src/server.js` — Loads dotenv, connects DB via `connectDB()`, starts server
  - `src/app.js` — Express configuration, CORS, JSON parser, `/api` router, 404, error handler
  - `src/config/db.js` — Mongoose connection wrapper
  - `src/models/` — `task.model.js`, `note.model.js`, `timeEntry.model.js`
  - `src/controllers/` — `TaskController.js`, `NotesController.js`, `TimeTrackerController.js` (ESM + try/catch/next)
  - `src/routes/` — `tasks.js`, `notes.js`, `timeEntries.js`, `api.js` (router composition under `/api`)
  - `src/middleware/` — `errorHandler.js` (CastError, ValidationError, 500)
  - `.env` / `.env.example` / `.gitignore`
- **Module system**: Fully ES Modules (`"type": "module"`)
- **Status**: Clean, production-ready Express API structure.

---

## Data Model (per project)

```
Project:
  id, name, lastAccessed, linkedFolderName
  tasks[]      → { id, title, status: 'todo'|'doing'|'blocked'|'done' }
  notes[]      → { id, title, content (markdown) }
  commands[]   → { id, label, command }
  resources[]  → { id, title, url, type: 'Figma'|'API'|'Docs'|'reference' }
  logs[]       → { id, message, type: 'info'|'success'|'warning', timestamp }
  timer        → { startedAt, accumulated, activeTaskId }
```

---

## Important Files

```
frontend/src/store/useWorkspaceStore.js         ← single source of truth (state + actions)
frontend/src/services/fileSystemService.js      ← FS Access API + IndexedDB handle persistence
frontend/src/pages/dashboard/DashboardPage.jsx  ← top-level orchestrator
frontend/src/app/layout/DashboardLayout.jsx     ← structural layout
frontend/src/app/layout/WorkspaceHeader.jsx     ← project switcher / folder link
frontend/src/features/workspace/Workspace.jsx   ← layout shell
frontend/src/features/workspace/TaskSection.jsx
frontend/src/features/workspace/RightSidebar.jsx
frontend/src/features/workspace/NotesSection.jsx
frontend/src/features/tasks/TaskItem.jsx
frontend/src/features/tasks/TaskPanel.jsx
frontend/src/features/tracking/FocusPanel.jsx
frontend/src/features/tracking/ActiveTaskPanel.jsx
frontend/src/features/notes/NotesWorkspace.jsx
frontend/src/features/notes/NotesSidebar.jsx
frontend/src/features/notes/NoteEditor.jsx
frontend/src/features/commands/CommandsPanel.jsx
frontend/src/features/resources/ResourcesPanel.jsx
frontend/src/features/logs/LogsPanel.jsx
docs/DevFlow.md                                 ← product definition
docs/SRS.md                                     ← requirements spec
docs/Architecture.md                            ← architecture doc
docs/UIUXFlow.md                                ← UI/UX spec
docs/FrontendTasks-1.md                         ← task list (phase 1)
docs/Frontendtasks-2.md                         ← task list (phase 2)
```

---

## Design Decisions

- **Project = Workspace**: A project is a full working environment, not just a list
- **Local-first**: All data in localStorage; optional folder sync via File System Access API
- **Single active task rule**: Only ONE task can be `doing` at a time; selecting a new one resets the previous
- **Single active timer**: Timer is tied to the active task; one timer per project
- **Single screen**: No routing/navigation — everything visible on one page
- **Append-only logs**: Logs are timestamped and capped at 200 entries (newest first)
- **Notes = Markdown docs**: Multi-file, each note is a separate document with title + content
- **Folder link is optional**: Project works without FS link; syncs to `.devflow/` when linked
- **No command execution**: Commands are copy-to-clipboard only (browser limitation)
- **shadcn NOT used yet**: package.json shows only React + Zustand + lucide-react + Tailwind; no shadcn installed despite docs mentioning it
- **Seed data included**: Three sample projects pre-loaded for demo purposes

---

## Progress

### Completed
- Core Zustand store with all CRUD actions
- Project create/switch/link-folder/unlink-folder
- Task system (add, select, done, blocked, edit, delete)
- Timer system (start/stop, accumulated time)
- Notes system (multi-file, markdown content)
- Commands system (add/delete/copy)
- Resources system (add/delete, typed)
- Logs system (auto-logged + manual add)
- File System Access API integration (optional folder sync)
- IndexedDB handle persistence for reloads
- DashboardPage orchestrator
- Workspace layout shell
- Feature panels for all modules
- **Workspace lifecycle (session 3)**:
  - Seed data removed — new users see OnboardingScreen
  - `renameProject(id, name)` store action added
  - `deleteProject(id)` store action added (cleans FS handles, picks next active)
  - `WorkspaceHeader` updated: inline rename, delete with inline confirmation, cancel buttons
  - `DashboardPage` updated: `OnboardingScreen` component (name input + optional folder picker)
  - `NotesSidebar` empty state added
  - `DashboardLayout` and `Workspace.jsx` updated to thread new props
  - Zustand merge fixed: validates `activeProjectId` against remaining projects
  - Build verified clean (exit 0)
- **Backend Architecture Refactoring (session 5)**:
  - Installed `mongoose` dependency
  - Created `.gitignore`, `.env`, `.env.example`
  - Created `src/config/db.js` for isolated DB connection
  - Created `src/models/` (`task.model.js`, `note.model.js`, `timeEntry.model.js`)
  - Created `src/middleware/errorHandler.js` (centralized error handling with CastError & ValidationError handling)
  - Rewrote controllers to ESM with proper null checks, 201/204 status codes, and `next(err)`
  - Split routes into resource files (`tasks.js`, `notes.js`, `timeEntries.js`) composed under `api.js` (`/api`)
  - Created `src/app.js` with proper middleware ordering and 404 handler
  - Rewrote `src/server.js` to handle async startup and DB connection errors
  - Removed obsolete root `app.js` and `server.js`
  - Cleaned `package.json` (removed unused `main` and `eslint`)
- **Timer, Notes & UI UX Refinements (sessions 6 - 11)**:
  - Added Un-block/Restore action button (↩ icon) to `TaskItem.jsx` for blocked tasks.
  - Mapped human-readable status labels (`Active`, `Pending`, `Blocked`, `Done`) to item badges.
  - Protected `done` tasks from accidental activation on click.
  - Added `Clear done (N)` bulk cleanup action button to `TaskSection.jsx` header.
  - Refactored `RightSidebar.jsx` dividers (`h-px bg-outline-variant/40`) for clear visual section separation.
  - Fixed Center Column Layout (`DashboardLayout.jsx`): resolved void space layout bug where collapsing the timer focus panel left notes at a fixed bottom height; notes now dynamically expand to full height (`flex-1`) whenever the focus panel is collapsed.
- **Documentation & Project Cleanup (session 16)**:
  - Created root [`README.md`](../README.md) with vision, tech stack, layout diagram, quick start guide, and directory structure.
  - Rewrote [`docs/Architecture.md`](../docs/Architecture.md) to accurately document the React 18, Zustand, Local-First, and File System Access API stack.
  - Created [`backend/README.md`](../backend/README.md) documenting dormant REST API status.
  - Moved completed task docs `FrontendTasks-1.md` and `Frontendtasks-2.md` to `docs/archive/`.
  - Upgraded `LogsPanel.jsx`: removed 160px max-height cap, doubled scroll container viewport up to 320px with flex-1 expansion, and added instant category filter tabs (`ALL`, `USER`, `SYSTEM`).
  - Visual hierarchy added to `LogItem.jsx` distinguishing automated system logs from user activity.
  - Global `timeToday` & `tasksCompleted` calculated across all workspaces combined.
  - Fixed timer display recalculation effect in `DashboardPage.jsx` when switching active workspace.
  - Added Markdown Preview & Custom Parser (`NoteEditor.jsx`):
    - Replaced basic string replacer with `parseMarkdown()` supporting H1-H4 headers, fenced code blocks with dark styling, inline code snippets, bold/italic formatting, links, blockquotes, horizontal rules, and unordered/ordered lists.
    - Default mode set to **Live Preview** with toggle button (`Live Preview` / `Edit Markdown`) and file path badge header.
  - Added **Obsidian & Local Markdown Vault Sync & Local Path Selector**:
    - `scanMarkdownFilesFromDir()` in `fileSystemService.js`: recursively scans directory handles for `.md` files, preserving nested relative paths while filtering out hidden directories (`.git`, `.obsidian`, etc.).
    - `scanMarkdownFromFiles()` in `fileSystemService.js`: parses `FileList` objects from HTML5 path pickers (`webkitdirectory`), strictly filtering `.md` files and preserving relative paths.
    - `importMarkdownFileList()` in `useWorkspaceStore.js`: imports or syncs `.md` files directly into workspace notes without requiring File System API handles.
    - Updated `NotesSidebar.jsx` with a **Local Path Quick Import Bar** (`Select path / files...`), an upload button (`Upload`), and a hidden file input supporting directory selection while strictly ignoring non-markdown files.

### In Progress
- Architecture cleanup (validated but not yet executed):
  - Delete `Workspace.jsx` (pure prop relay)
  - Delete `NotesSection.jsx` (15-line alias)
  - Rename `ActiveTaskPanel.jsx` → `FocusPanel.jsx`, delete shim
  - Merge `TaskSection.jsx` logic into `TaskPanel.jsx`
  - Rewrite `docs/Architecture.md`

### Pending
- Run architecture cleanup (from validation report)
- Rewrite `docs/Architecture.md` (currently describes Laravel/SQLite, not actual system)
- Archive `docs/FrontendTasks-1.md` and `docs/Frontendtasks-2.md`
- Add `backend/README.md` documenting dormant status

---

## Known Issues

- **[CRITICAL] Cannot un-block a task** — no UI action exists; only recovery is delete and re-create. Fix: add restore/un-block action to `TaskItem.jsx` + `useWorkspaceStore.js`
- **[CRITICAL] Clicking a `done` task activates it as current focus** — `onSelect` fires for done tasks; should be a no-op. Fix: guard in `TaskItem.jsx`
- **[IMPORTANT] No "Clear done" bulk action** — done tasks accumulate with no way to clean up. Fix: button in task panel
- **[IMPORTANT] Timer accumulated time resets to 0 on task switch** — losing tracked time. Fix: preserve accumulated in `selectTask()`
- **[IMPORTANT] Badge shows raw status strings** — "doing", "todo" instead of "Active", "Pending". Fix: label map in `TaskItem.jsx`
- **[IMPORTANT] No markdown preview in notes** — raw symbols visible. Fix: basic preview toggle in `NoteEditor.jsx`
- **[IMPORTANT] "Time Today" is misleading** — shows current task session time, not real today total. Fix: rename to "Session" in `Footer.jsx` and `ActiveTaskPanel.jsx`
- **[IMPORTANT] Log timestamps have no date** — ambiguous after midnight. Fix: update `ts()` in store
- **[IMPORTANT] Auto-logs flood user logs** — system entries drown out user notes. Fix: visual differentiation in `LogItem.jsx`
- **[NICE TO HAVE] Sidebar dividers nearly invisible** — `border-t` renders as hairline. Fix: `h-px bg-outline-variant/40` in `RightSidebar.jsx`
- **`Workspace.jsx` is a pure prop relay** — validated, approved for removal (architecture cleanup)
- **`TaskSection.jsx` and `NotesSection.jsx`** — validated: TaskSection has real logic (merge into TaskPanel); NotesSection is alias (remove)
- **`docs/Architecture.md` is completely wrong** — describes Laravel system; must be rewritten
- **`docs/FrontendTasks-1.md` and `Frontendtasks-2.md`** — complete, should be archived

---

## Next Recommended Task

**Wave 1 — Trivial fixes (< 1 hour total):**
1. Un-block action on blocked tasks (`TaskItem.jsx` + store `restoreTask` action)
2. Badge label map: "doing"→"Active", "todo"→"Pending" (`TaskItem.jsx`)
3. Log timestamps with date context (`useWorkspaceStore.js` `ts()` function)
4. Sidebar section dividers: `h-px bg-outline-variant/40` (`RightSidebar.jsx`)

**Wave 2 — Low effort, high friction reduction:**
5. Prevent clicking done tasks from activating them (`TaskItem.jsx`)
6. "Clear done" bulk action (`TaskSection.jsx`)
7. Preserve timer accumulated on task switch (`useWorkspaceStore.js` `selectTask()`)
8. Auto-log visual differentiation (`LogItem.jsx`)

**Wave 3 — Medium effort:**
9. Rename "Time Today" → "Session" (`Footer.jsx`, `ActiveTaskPanel.jsx`)
10. Basic markdown preview toggle (`NoteEditor.jsx`)
