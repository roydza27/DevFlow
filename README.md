# DevFlow ⚡

> **Local-first developer workspace** built to eliminate context switching, keep your active task visible, track real session time, and sync markdown notes seamlessly across workspaces.

---

## 🌟 Product Vision

DevFlow is designed around one core principle:
**Resume → Focus → Execute → Log → Continue → Track**

Modern developers constantly waste focus switching between issue trackers, timers, terminal commands, markdown documentation, and browser tabs. DevFlow brings your entire active developer environment into a single, high-efficiency, single-screen workspace.

- 🔒 **100% Local-First**: SQLite single source of truth database (`~/.config/devflow/devflow.db`) + real-time workspace disk sync.
- 📁 **Native Folder Sync**: Link local workspace folders via the backend file watcher (`.devflow/` project sync).
- 📝 **Markdown Notes Workspace**: Live preview markdown editing with automatic real-time disk sync.
- ⏱️ **Task-Bound Focus Timer**: Track active session duration tied to a single active focus task.
- 📊 **Global Cross-Workspace Stats**: Real-time cross-workspace tracking for total time worked today and completed tasks.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite |
| **Styling** | TailwindCSS v3 (Custom Material 3 Dark Palette) |
| **State Management** | Zustand v5 + REST API integration |
| **Backend Service** | Node.js + Express 5 + SQLite (`better-sqlite3` WAL mode) + `chokidar` |
| **Local Deployment** | `systemd` user service (`devflow-api.service`) + Express static & REST server (`http://localhost:3001`) |
| **Icons & UI** | `lucide-react` |

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

3. **Backend Service Setup**
   ```bash
   cd ../backend
   npm install
   cp .env.example .env
   npm run dev
   ```
   Backend service API runs at `http://localhost:3001/api`.

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
   - Status tracking: `Active` (`doing`), `Pending` (`todo`), `Blocked` (`blocked`), `Done` (`done`), `Archived` (`archived`)
   - Bulk "Archive completed" cleanup action button (preserves stats & logs in SQLite)

2. **Center Panel — Focus & Notes**:
   - Large monospace active session timer
   - Single active focus task enforcement
   - Dual-mode Notes Workspace: **Markdown Source** vs **Live Preview Mode**

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
│   │   ├── features/           # Feature modules (tasks, tracking, notes, commands, resources, logs)
│   │   ├── pages/dashboard/    # DashboardPage (Orchestrator & Onboarding)
│   │   ├── services/           # apiClient.js & fileSystemService.js
│   │   └── store/              # useWorkspaceStore.js (Zustand State)
│   └── package.json
│
├── backend/                    # Dedicated Node.js/Express REST Service
│   ├── src/
│   │   ├── config/             # env.js, sqlite.js (Schema & WAL mode)
│   │   ├── controllers/        # sqliteController.js
│   │   ├── middleware/         # errorHandler.js
│   │   ├── routes/             # api.js & sqliteApi.js
│   │   ├── services/           # watcherService.js (chokidar file watcher & path validation)
│   │   └── server.js           # Server startup & graceful shutdown handlers
│   └── package.json
│
├── deployment/                 # Service & Reverse Proxy setup
│   └── Caddyfile               # Caddy reverse proxy config (devflow.local → localhost:3001)
│
└── docs/                       # Technical documentation
    ├── Architecture.md         # Full service & persistence architecture specification
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
