# DevFlow Architecture Specification

> **Version**: 1.0.0  
> **Updated**: July 2026  
> **Status**: Current Production Architecture

---

## 1. Executive Overview

DevFlow is a local-first single-page developer workspace application. It provides real-time task focus, Markdown note editing, command bookmarking, resource management, activity logging, and time tracking without requiring internet connectivity or external cloud databases.

---

## 2. Technology Stack

### Frontend Architecture
- **Framework**: React 18 + Vite
- **State Management**: Zustand v5 with `persist` middleware
- **Styling**: TailwindCSS v3 (Material Design 3 Dark Theme Palette)
- **Icons**: `lucide-react`
- **Persistence**: `localStorage` (Key: `devflow_projects`) + File System Access API (`dirHandle` stored in IndexedDB)

### Optional Backend API Architecture
- **Runtime**: Node.js + Express 5
- **Module System**: ES Modules (`"type": "module"`)
- **Database**: MongoDB via Mongoose 8+
- **Security**: CORS, Environment Variable Isolation (`dotenv`)

---

## 3. State & Data Flow Architecture

DevFlow follows a single-source-of-truth state architecture implemented in [`useWorkspaceStore.js`](../frontend/src/store/useWorkspaceStore.js).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Zustand Workspace Store                         │
│                    (useWorkspaceStore.js)                              │
└───────┬────────────────────────────────────────────────────────┬───────┘
        │                                                        │
        ▼                                                        ▼
┌───────────────────────────────┐        ┌───────────────────────────────┐
│     Browser LocalStorage      │        │   File System Access API      │
│  (Zustand Persist Middleware) │        │ (Optional Directory Sync &    │
│    Key: devflow_projects      │        │    IndexedDB Handle Store)    │
└───────────────────────────────┘        └───────────────────────────────┘
```

### Core Project Schema
```typescript
interface Project {
  id: number;
  name: string;
  lastAccessed: number;
  linkedFolderName: string | null;
  tasks: Task[];
  notes: Note[];
  commands: Command[];
  resources: Resource[];
  logs: LogEntry[];
  timer: TimerState;
}

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'doing' | 'blocked' | 'done';
}

interface Note {
  id: number;
  title: string;
  content: string;
  path?: string; // Relative file path for Obsidian & imported markdown files
}

interface TimerState {
  startedAt: number | null;
  accumulated: number; // Elapsed seconds
  activeTaskId: number | null;
}
```

---

## 4. Key Architectural Patterns

1. **Single Active Task Rule**:
   Only one task per workspace can hold `doing` status at a time. Selecting a new task to work on automatically transitions the previous active task back to `todo`.

2. **Cross-Workspace Timer Persistence & Global Stats**:
   When switching workspaces via `switchProject(id)`, running timer deltas are automatically flushed into the outgoing project's `accumulated` time, ensuring tracked session seconds are preserved across workspace context switches. Global `timeToday` and `tasksCompleted` are computed across all active projects combined.

3. **Markdown Import & Obsidian Vault Sync**:
   `scanMarkdownFilesFromDir()` and `scanMarkdownFromFiles()` recursively traverse selected local directories or Obsidian vaults, preserving nested relative paths (`docs/api.md`), filtering out hidden folders (`.git`, `.obsidian`), and importing Markdown documents into the project workspace.

4. **Dual-Mode Markdown Renderer**:
   `NoteEditor.jsx` features a built-in custom Markdown parser supporting headers (H1-H4), fenced code blocks, inline code, bold/italic formatting, links, lists, blockquotes, horizontal rules, and paragraph formatting, with an instant `Edit Markdown` ↔ `Live Preview` mode toggle.

---

## 5. File System Access API & Local Sync

When a workspace is linked to a local folder:
- **Project Snapshot**: Saved to `.devflow/project.json` inside the selected folder.
- **Granular Notes**: Written as individual `.md` files in `.devflow/notes/`.
- **Handle Persistence**: Folder handles (`FileSystemDirectoryHandle`) are stored in browser `IndexedDB` (`devflow-fs` database) to maintain directory access permission across tab reloads.

---

## 6. Directory Structure Overview

```
frontend/src/
├── app/layout/             # DashboardLayout, WorkspaceHeader
├── components/ui/          # Badge, Button, Input, Card
├── features/               # Self-contained feature components
│   ├── tasks/
│   ├── tracking/
│   ├── notes/
│   ├── commands/
│   ├── resources/
│   └── logs/
├── pages/dashboard/        # DashboardPage orchestrator
├── services/               # fileSystemService.js
└── store/                  # useWorkspaceStore.js
```
