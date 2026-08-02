# DevFlow Production Architecture & Deployment Guide

Welcome! This document provides an educational guide to DevFlow's production architecture using **Caddy** as a high-performance web server and reverse proxy alongside an **Express 5 + SQLite** REST backend.

---

## 1. System Architecture Overview

```
                      Browser
                         │
                         ▼
        http://devflow.localhost:8080
                         │
                         ▼
             ┌──────────────────────┐
             │    Caddy Web Server  │
             │ (devflow-caddy.service)
             └───────────┬──────────┘
                         │
      ┌──────────────────┴──────────────────┐
      │                                     │
      ▼ (Static Assets)                     ▼ (API Proxy /api/*)
┌───────────┐                         ┌───────────┐
│ frontend/ │                         │ Express 5 │
│   dist/   │                         │ (Port 3001)
└───────────┘                         └─────┬─────┘
                                            │
                                            ▼
                                  ┌───────────────────┐
                                  │   SQLite DB &     │
                                  │ Chokidar Watcher  │
                                  └───────────────────┘
```

---

## 2. Why Introduce a Reverse Proxy (Caddy)?

In modern web development, separating concerns between **Static Web Serving** and **Application API Logic** is an industry standard:

| Responsibility | Express Backend | Caddy Web Server |
|---|---|---|
| **Role** | Application REST API & Business Logic | Static Web Server & Reverse Proxy |
| **Static Assets** | ❌ None (Keeps backend clean & fast) | ✅ High-performance static file serving (`frontend/dist`) |
| **Compression** | ❌ None | ✅ Automatic Gzip and Zstd compression |
| **API Forwarding**| ❌ Listens on `localhost:3001` | ✅ Reverse proxies `/api/*` requests to port 3001 |
| **SPA Routing** | ❌ None | ✅ `try_files {path} /index.html` fallback for React Router |

---

## 3. How Requests Flow Through the System

1. **User Request**: User opens `http://devflow.localhost:8080` in their browser.
2. **Local Domain Resolution**: Operating systems automatically resolve `*.localhost` to loopback `127.0.0.1`.
3. **Caddy Static Handling**: Caddy receives the request on port `8080`. It matches static files in `frontend/dist/` (HTML, JS, CSS, images).
4. **API Traffic Forwarding**: When React makes an API request (`GET /api/projects`), Caddy matches the `/api/*` route handler and forwards the request over HTTP to Express on `localhost:3001`.
5. **Express Processing**: Express processes the JSON API call, queries SQLite, and returns JSON back to Caddy, which sends it to the browser.
6. **SPA Client Routing**: If the user reloads a deep route like `http://devflow.localhost:8080/insights`, Caddy checks if `/insights` exists as a physical file. When it doesn't, Caddy's `try_files {path} /index.html` directive falls back to `index.html`, allowing React Router to handle client-side navigation smoothly.

---

## 4. Systemd Service Orchestration

DevFlow manages two user-space systemd services:
- `devflow-api.service`: Manages the Node.js Express API server (`localhost:3001`).
- `devflow-caddy.service`: Manages the Caddy reverse proxy (`devflow.localhost:8080`).

To inspect status or tail logs:
```bash
devflow status
devflow logs
devflow doctor
```
