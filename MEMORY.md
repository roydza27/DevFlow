# DevFlow Memory

## Current Architecture

### Modular-Monolith Backend Service Architecture
- **Directory Structure**:
  ```text
  backend/
  ├── src/
  │   ├── app/                     # Express application composition & routes mounting
  │   ├── config/                  # Environment & watcher config
  │   ├── infrastructure/          # SQLite database connection & Chokidar filesystem watcher
  │   ├── modules/                 # Feature modules (analytics, commands, logs, notes, projects, resources, tasks, timer)
  │   ├── shared/                  # Central errorHandler middleware & shared helpers
  │   └── server.js                # Server bootstrap & graceful shutdown
  └── tests/
      ├── helpers/testDb.js        # Isolated temporary SQLite database sandbox
      ├── unit/                    # App composition, error handling, repository unit tests
      └── integration/             # End-to-end HTTP API integration test suites
  ```
- **Web Server & Reverse Proxy**: Caddy (`deployment/Caddyfile`) on port 80 (`http://devflow.localhost`).
  - Serves static frontend assets (`frontend/dist`) with Gzip/Zstd compression & SPA routing.
  - Reverse proxies `/api/*` requests to Express API on `localhost:3001`.
- **Database**: SQLite WAL database at `~/.config/devflow/devflow.db`.

---

## Current Phase

- Automated testing suite established and integrated into `package.json`.
- Backend modular monolith protected against regressions.

---

## Completed

- **Backend Automated Testing Foundation**:
  - Implemented testing using Node.js built-in `node:test` and `node:assert/strict` with `supertest`.
  - Added isolated test database fixture (`tests/helpers/testDb.js`) using temporary directories and custom `DEVFLOW_DATA_DIR` so tests never touch production/dev databases.
  - Created 27 automated tests across 11 test suites (Unit tests for App, ErrorHandler, TaskRepository; Integration tests for Stats, Projects, Tasks, Notes, Commands, Resources, Logs, Timer).
  - Added `"test": "node --test tests/**/*.test.js"` script to `backend/package.json`.
- **Backend Modular-Monolith Restructuring**:
  - Encapsulated modules in `backend/src/modules/` with thin controllers, services, and isolated repositories.
  - Separated infrastructure (`infrastructure/database/sqlite.js`, `infrastructure/filesystem/watcher.service.js`).
- **Operating Documentation**: Established `AGENTS.md` and updated `backend/README.md`.

---

## In Progress

- Ready for subsequent product features built on top of the modular architecture.

---

## Next Steps

1. Add mock/unit tests for filesystem watcher note parsing events.
2. Build new feature modules (recommendations, notifications, settings) adhering to test-driven and modular-monolith standards.

---

## Important Decisions

- **Testing Stack**: Native Node.js test runner (`node:test`) + `supertest` for fast, lightweight ESM-compatible testing without third-party test runners.
- **Database Isolation**: Tests execute in temporary sandbox directories (`/tmp/devflow-test-*`) to prevent accidental data corruption or pollution.
- **Modular Monolith**: Organized backend by domain features with thin controllers and dedicated repository boundaries.

---

## Known Issues

- No dedicated `/api/health` endpoint exists (endpoint is `/api/stats` for system metrics).

---

## Current Files / Areas Being Modified

- `backend/package.json`
- `backend/tests/`
- `AGENTS.md`
- `MEMORY.md`

---

## Tests / Verification

- **Command**: `npm test` inside `backend/`
- **Result**: 27 passing tests across 11 test suites (0 failures).
- **Diagnostics**: `scripts/doctor.sh` 10/10 checks PASS.

---

## Notes for Next Session

- Run `npm test` before and after modifying backend modules.
