# DevFlow Memory

## Current Architecture

### Modular-Monolith Backend Service Architecture
- **Directory Structure**:
  ```text
  backend/src/
  ├── app/                     # Express application composition & routes mounting
  ├── config/                  # Environment & watcher config
  ├── infrastructure/          # SQLite database connection & Chokidar filesystem watcher
  ├── modules/                 # Feature modules (analytics, commands, logs, notes, projects, resources, tasks, timer)
  ├── shared/                  # Central errorHandler middleware & shared helpers
  └── server.js                # Server bootstrap & graceful shutdown
  ```
- **Web Server & Reverse Proxy**: Caddy (`deployment/Caddyfile`) on port 80 (`http://devflow.localhost`).
  - Serves static frontend assets (`frontend/dist`) with Gzip/Zstd compression & SPA routing.
  - Reverse proxies `/api/*` requests to Express API on `localhost:3001`.
- **Database**: SQLite WAL database at `~/.config/devflow/devflow.db`.

---

## Current Phase

- Backend modular-monolith restructuring completed and fully verified.
- Infrastructure and reverse-proxy setup operational.

---

## Completed

- **Backend Modular-Monolith Restructuring**:
  - Eliminated legacy global folders (`controllers/`, `services/`, `routes/`, `config/sqlite.js`, `middleware/errorHandler.js`).
  - Created isolated infrastructure layer (`infrastructure/database/sqlite.js`, `infrastructure/filesystem/watcher.service.js`).
  - Created domain feature modules (`modules/analytics`, `modules/commands`, `modules/logs`, `modules/notes`, `modules/projects`, `modules/resources`, `modules/tasks`, `modules/timer`).
  - Implemented clean application composition in `src/app/` (`app.js`, `routes.js`) separating Express bootstrap from `server.js`.
  - Re-mounted user systemd service (`devflow-api.service`) and verified with 100% pass on all API endpoints.
- **Port 80 Caddy Capability Analysis**: Audited Caddy privileged port binding permission and capabilities.
- **Reverse Proxy & Diagnostics**: Configured `deployment/Caddyfile` for `http://devflow.localhost` and verified via `scripts/doctor.sh`.
- **Operating Documentation**: Established `AGENTS.md` and updated `backend/README.md`.

---

## In Progress

- Ready for subsequent product features built on top of the modular architecture.

---

## Next Steps

1. Implement future domain modules or feature capabilities (e.g. recommendations, notifications, settings) within `backend/src/modules/`.
2. Continue frontend enhancements and component optimizations.

---

## Important Decisions

- **Modular Monolith**: Organized backend by domain features (`modules/<feature>/`) with strict encapsulation and thin controllers.
- **Physical Directory**: Kept `backend/` as root directory name to preserve seamless integration with systemd user services, scripts, and local tooling.
- **Local-First Routing**: Production domain set to `http://devflow.localhost` running on HTTP port 80 via Caddy reverse proxy.

---

## Known Issues

- None currently identified. All 10 diagnostic checks in `scripts/doctor.sh` and end-to-end API tests are passing.

---

## Current Files / Areas Being Modified

- `backend/src/infrastructure/`
- `backend/src/modules/`
- `backend/src/app/`
- `backend/src/shared/`
- `backend/src/server.js`
- `backend/README.md`
- `MEMORY.md`

---

## Tests / Verification

- **Automated API Test Suite**: Verified 100% pass across stats, projects, tasks, notes, commands, resources, logs, and timer endpoints.
- **Diagnostics**: `scripts/doctor.sh` all 10 checks PASS.
- **Service Verification**: `devflow-api.service` active and operational.

---

## Notes for Next Session

- New features should follow `AGENTS.md` rules: add modules under `backend/src/modules/<name>/` with repository, service, controller, and routes.
