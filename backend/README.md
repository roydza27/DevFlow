# DevFlow Backend Service

> **Architecture**: Local-First Node.js / Express 5 / SQLite (`better-sqlite3`) Modular-Monolith REST API Service  
> **Port**: 3001  
> **Database Path**: `~/.config/devflow/devflow.db`

---

## Overview

The `backend/` directory contains the dedicated local service for DevFlow. It manages project workspace state, task lifecycle archiving, Markdown notes indexing, file watching, and timer persistence using SQLite in WAL mode, structured as a clean modular monolith.

---

## Backend Structure

```text
backend/
├── .env.example
├── package.json
└── src/
    ├── app/                     # Express application composition & route mounting
    │   ├── app.js
    │   └── routes.js
    ├── config/                  # Configuration & environment variables
    │   └── env.js
    ├── infrastructure/          # Technical infrastructure
    │   ├── database/            # SQLite connection, WAL mode, schema & migrations
    │   │   └── sqlite.js
    │   ├── filesystem/          # Chokidar workspace watcher & folder validation
    │   │   └── watcher.service.js
    │   └── index.js
    ├── modules/                 # Feature-oriented domain modules
    │   ├── analytics/           # /api/stats (Storage stats & record counts)
    │   ├── commands/            # /api/projects/:id/commands
    │   ├── logs/                # /api/projects/:id/logs
    │   ├── notes/               # /api/projects/:id/notes, /api/notes/:noteId
    │   ├── projects/            # /api/projects (Composite workspace retrieval & lifecycle)
    │   ├── resources/           # /api/projects/:id/resources
    │   ├── tasks/               # /api/projects/:id/tasks, /api/tasks/:taskId
    │   └── timer/               # /api/projects/:id/timer
    ├── shared/                  # Cross-cutting utilities & middleware
    │   ├── middleware/
    │   │   └── errorHandler.js
    │   └── index.js
    └── server.js                # Server entry point & graceful shutdown
```

---

## Running the Backend Service

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The service will start listening at `http://localhost:3001/api`.

---

## Systemd User Service Setup

To run DevFlow API continuously in the background as a local service:

```bash
cp devflow-api.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now devflow-api
```
