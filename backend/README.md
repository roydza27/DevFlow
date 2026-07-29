# DevFlow Backend — Dormant Status Notice

> **Status**: Dormant / Standalone REST API Scaffold  
> **Updated**: July 2026

---

## Overview

The `backend/` directory contains an optional Node.js / Express 5 / MongoDB (Mongoose) REST API for DevFlow.

### Current Application Architecture Notice:
The DevFlow frontend application operates as a **100% Local-First Single Page Application**. 

By default, the frontend does **NOT** require or connect to this backend server. All user workspaces, tasks, markdown notes, commands, resources, logs, and timer states are persisted locally in the user's browser using `localStorage`, `IndexedDB`, and the native **File System Access API**.

---

## Backend Design & Structure

If you wish to run or extend the backend server for cloud persistence or sync experiments:

```
backend/
├── .env.example
├── package.json
└── src/
    ├── app.js               # Express application, CORS, JSON parser & routes
    ├── server.js            # Server entry point & MongoDB connection listener
    ├── config/
    │   └── db.js            # Mongoose DB connection handler
    ├── controllers/         # Task, Note, and TimeEntry controllers
    ├── middleware/          # errorHandler.js (CastError & ValidationError)
    ├── models/              # task.model.js, note.model.js, timeEntry.model.js
    └── routes/              # RESTful API endpoints (/api/tasks, /api/notes, /api/time-entries)
```

---

## Running the Backend Server

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The server will start listening at `http://localhost:3000/api`.
