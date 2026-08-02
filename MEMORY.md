# MEMORY.md — DevFlow Project Memory

_Last updated: 2026-08-02 (session 45 — Port 80 Caddy Capability Analysis & Systemd Architecture complete)_

---

## Current Goal

Build **DevFlow** — a local-first developer workspace that helps developers instantly resume work, focus on one task, and track real progress from a single screen.

Principle: **Resume → Focus → Execute → Log → Continue → Track**

Current session: Audited Caddy's privileged port binding permission issue (`listen tcp :80: bind: permission denied`). Demonstrated root cause analysis of unprivileged user Linux capabilities (`ip_unprivileged_port_start=1024`). Compared Options A (`setcap`), B (`systemd` root service), and C (`sysctl`). Configured `deployment/Caddyfile` for `http://devflow.localhost` on HTTP port 80 and updated `scripts/doctor.sh` and `devflow open` CLI tool.

---

## Current Architecture Understanding

### Reverse-Proxied Production Service Architecture

```
Boot → systemd
        ├── devflow-api.service (Express 5 REST API on localhost:3001) → SQLite WAL DB
        └── devflow-caddy.service (Caddy Web Server & Reverse Proxy listening on HTTP Port 80)
                ├── Serves static UI (frontend/dist) + Gzip/Zstd + SPA routing
                ├── Forward /api/* requests to localhost:3001
                └── Public Production Domain: http://devflow.localhost
```

---

## Important Files

```
deployment/Caddyfile                          ← Production Caddy configuration on port 80 (http://devflow.localhost)
deployment/devflow-caddy.service              ← Systemd user service unit file for Caddy
backend/src/app.js                             ← Pure Express 5 REST API server
devflow                                        ← Main CLI binary installed at ~/.local/bin/devflow
scripts/doctor.sh                              ← Diagnostic suite
docs/Architecture.md                           ← Educational deployment & architecture documentation
```

---

## Progress

### Completed
- **Root Cause Analysis**: Identified Linux kernel privileged port protection (ports 1–1023 restricted to root/CAP_NET_BIND_SERVICE).
- **Architecture Analysis**: Compared `setcap` capability granting vs system-level systemd service configuration.
- **Port 80 Caddy Configuration**: Configured `deployment/Caddyfile` for `http://devflow.localhost` on default HTTP port 80.
- **Updated CLI Tools**: `devflow open` updated to open `http://devflow.localhost` without explicit port numbers.

---

## Next Recommended Task

1. Run `sudo setcap cap_net_bind_service=+ep $(which caddy)` to allow Caddy binary to bind to port 80.
