# DevFlow ⚡

> **Local-first developer workspace** built to eliminate context switching, keep your active task visible, track real session time, and sync markdown notes seamlessly across workspaces.

---

## 🌟 Product Vision

DevFlow is designed around one core principle:
**Resume → Focus → Execute → Log → Continue → Track**

Modern developers constantly waste focus switching between issue trackers, timers, terminal commands, markdown documentation, and browser tabs. DevFlow brings your entire active developer environment into a single, high-efficiency, single-screen workspace.

- 🔒 **100% Local-First**: All workspace data is persisted locally in your browser (`localStorage` & `IndexedDB`).
- 📁 **Native Folder Sync**: Link local workspace folders via the File System Access API (`.devflow/` project sync).
- 📝 **Obsidian Vault & Markdown Import**: Import local markdown folders or Obsidian vaults preserving nested directory paths.
- ⏱️ **Task-Bound Focus Timer**: Track active session duration tied to a single active focus task.
- 📊 **Global Cross-Workspace Stats**: Real-time cross-workspace tracking for total time worked today and completed tasks.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite |
| **Styling** | TailwindCSS v3 (Custom Material 3 Dark Palette) |
| **State Management** | Zustand v5 (`persist` middleware to `localStorage`) |
| **Local File System** | File System Access API + IndexedDB Handle Persistence |
| **Icons & UI** | `lucide-react` |
| **Backend API (Optional)** | Node.js + Express 5 + Mongoose / MongoDB |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation & Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/roydza27/DevFlow.git
   cd DevFlow
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

3. **Backend Setup (Optional REST API)**
   ```bash
   cd ../backend
   npm install
   cp .env.example .env
   npm run dev
   ```
   Backend API runs at `http://localhost:3000/api`.

---

## 🏗️ Architecture & Core Workspace Layout

DevFlow operates on a single screen without complex page routing. The workspace is divided into three functional columns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Workspace Header                                 │
├───────────────┬─────────────────────────────────────────────┬───────────────┤
│               │             Focus & Timer Panel             │               │
│               ├─────────────────────────────────────────────┤    Sidebar    │
│  Task Panel   │                                             │               │
│ (Todo/Active/ │               Notes Workspace               │  (Commands /  │
│ Blocked/Done) │       (Markdown Editor & Live Preview)      │ Resources /   │
│               │                                             │    Logs)      │
│               │                                             │               │
├───────────────┴─────────────────────────────────────────────┴───────────────┤
│                             Footer (Global Stats)                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Left Panel — Task Panel**:
   - Quick task creation (`Enter` key)
   - Status tracking: `Active` (doing), `Pending` (todo), `Blocked` (blocked), `Done` (completed)
   - Restore blocked tasks to Active with one click
   - Bulk "Clear Done" cleanup action button

2. **Center Panel — Focus & Notes**:
   - Large monospace active session timer
   - Single active focus task enforcement
   - Dual-mode Notes Workspace: **Markdown Source** vs **Live Preview Mode**
   - Import Obsidian vaults / Markdown folders with full relative path retention

3. **Right Sidebar**:
   - **Commands**: Store and copy frequent terminal commands
   - **Resources**: Typed links for Docs, Figma, APIs, and References
   - **Logs**: Activity audit trail with filter tabs (`ALL`, `USER`, `SYSTEM`)

---

## 📂 Project Structure

```
DevFlow/
├── frontend/                   # Main React SPA
│   ├── src/
│   │   ├── app/layout/         # DashboardLayout, WorkspaceHeader
│   │   ├── components/         # Shared UI (Button, Badge, Input, Card)
│   │   ├── features/           # Feature modules
│   │   │   ├── tasks/          # TaskPanel, TaskItem, TaskQuickAdd
│   │   │   ├── tracking/       # FocusPanel, TimerDisplay
│   │   │   ├── notes/          # NotesWorkspace, NotesSidebar, NoteEditor
│   │   │   ├── commands/       # CommandsPanel, CommandItem
│   │   │   ├── resources/      # ResourcesPanel, ResourceItem
│   │   │   └── logs/           # LogsPanel, LogItem
│   │   ├── pages/dashboard/    # DashboardPage (Orchestrator & Onboarding)
│   │   ├── services/           # fileSystemService (FS Access API & IndexedDB)
│   │   └── store/              # useWorkspaceStore.js (Zustand Single Source of Truth)
│   └── package.json
│
├── backend/                    # Optional Node.js/Express REST API
│   ├── src/
│   │   ├── config/             # db.js (Mongoose connection)
│   │   ├── controllers/        # task, note, and timeEntry controllers
│   │   ├── middleware/         # errorHandler.js
│   │   ├── models/             # task.model.js, note.model.js, timeEntry.model.js
│   │   ├── routes/             # RESTful API route definitions
│   │   └── server.js           # Server startup script
│   └── package.json
│
└── docs/                       # Technical documentation
    ├── Architecture.md         # Full frontend & persistence architecture specification
    └── APIContract.md          # REST API endpoints documentation
```

---

## 📖 Documentation

Detailed documentation is available in the [`docs/`](./docs) directory:
- [Architecture & State Design](./docs/Architecture.md)
- [API Specification](./docs/APIContract.md)

---

## 📄 License

MIT License © [DevFlow](https://github.com/roydza27/DevFlow)
