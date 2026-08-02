# DevFlow Backend Service

> **Architecture**: Local-First Node.js / Express 5 / SQLite (`better-sqlite3`) REST API Service  
> **Port**: 3001  
> **Database Path**: `~/.config/devflow/devflow.db`

---

## Overview

The `backend/` directory contains the dedicated local service for DevFlow. It manages project workspace state, task lifecycle archiving, Markdown notes indexing, file watching, and timer persistence using SQLite in WAL mode.

---

## Backend Structure

```
backend/
├── .env.example
├── package.json
└── src/
    ├── app.js               # Express application, CORS, JSON parser & routes
    ├── server.js            # Server entry point, SQLite init & graceful shutdown handlers
    ├── config/
    │   ├── env.js           # Environment configuration (PORT, DB_PATH, WATCHER_CONFIG)
    │   └── sqlite.js        # SQLite connection & database schema definitions
    ├── controllers/         # sqliteController.js (Project, Task, Note, Log, Timer queries)
    ├── middleware/          # errorHandler.js
    ├── services/            # watcherService.js (Chokidar file watcher & folder path validation)
    └── routes/              # api.js & sqliteApi.js (REST API endpoints)
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
