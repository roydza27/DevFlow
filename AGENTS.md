# AGENTS.md — DevFlow Permanent Agent Instructions

This document is the permanent operating contract for AI coding agents working on the DevFlow repository. Follow these rules throughout every session.

---

## 1. Project Identity

**DevFlow** is a modular developer productivity application designed as a local-first workspace that helps developers instantly resume work, focus on one task, and track real progress from a single screen.

Core Flow: **Resume → Focus → Execute → Log → Continue → Track**

The backend follows a **modular-monolith architecture**.

---

## 2. Architecture & Directory Structure

The target backend architecture is:

```text
server/ (or backend/)
└── src/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── projects/
    │   ├── tasks/
    │   ├── focus/
    │   ├── recommendations/
    │   ├── notifications/
    │   ├── analytics/
    │   └── settings/
    │
    ├── shared/
    ├── infrastructure/
    ├── app/
    └── main.*
```

### Feature-Oriented Organization Rule
- Prefer feature-oriented module organization (`modules/<feature>/`).
- **Do NOT create new global business folders** such as `controllers/`, `services/`, or `routes/` for future features.
- Keep module implementations encapsulated with clear public interfaces (`index.js` / module exports).

---

## 3. Refactoring & Code Principles

- **Inspect before modifying**: Understand existing flows, inputs, and outputs prior to making edits.
- **Preserve working behavior**: Ensure backwards compatibility and avoid unintended regressions.
- **Avoid unnecessary rewrites**: Make incremental improvements over complete re-writes.
- **Avoid premature abstractions**: Write clear, direct code before extracting generic layers.
- **Avoid microservices**: DevFlow is a modular monolith; do not introduce microservice topologies unless explicitly requested.
- **Keep modules loosely coupled**: Modules should communicate through public module APIs or domain events, avoiding direct coupling to other modules' internals.
- **Keep controllers thin**: Delegate validation, domain rules, and coordination to services or use-case handlers.
- **Keep persistence behind repositories / data-access boundaries**: Abstract database queries (e.g. SQLite / knex / db helpers) behind repository interfaces.
- **Keep infrastructure separate from business logic**: External integrations, database clients, file system access, and system tools belong in infrastructure layers.
- **Keep shared utilities genuinely shared**: Only place cross-cutting, domain-agnostic helpers in `shared/`.
- **Prefer public module interfaces over direct internal imports**: Never do cross-module imports reaching deep into private module internals.
- **Avoid circular dependencies**: Structure imports in a single directional flow.

---

## 4. Change Discipline

Before making large architectural changes:

1. **Inspect relevant code**: Examine existing callers and implementations.
2. **Identify dependencies**: Map out modules, libraries, and runtime resources impacted.
3. **Identify affected API contracts**: Verify REST routes, query shapes, and payload schemas.
4. **Make the smallest safe change**: Break down work into verifiable increments.
5. **Test**: Validate changes with automated and manual verification.
6. **Update documentation & context**: Update `MEMORY.md` and relevant docs immediately.

> [!WARNING]
> Do not silently change unrelated parts of the project outside the requested scope.

---

## 5. Documentation Discipline

- Relevant architectural changes must be reflected in documentation (`docs/`).
- Update existing documents rather than creating redundant, duplicate documentation files.
- Keep documentation concise, accurate, and aligned with the codebase.

---

## 6. Required Session Workflow

Every agent session must strictly follow this lifecycle:

### Before Working
1. Read `AGENTS.md`.
2. Read `MEMORY.md`.
3. Inspect the current repository state (git status, recent commits, relevant files).
4. Determine what was completed previously.
5. Continue from the recorded state instead of assuming the project is fresh.

### During Work
Keep current tasks aligned with:
$$\text{AGENTS.md} + \text{MEMORY.md} + \text{Actual Repository State}$$

- **Repository state is authoritative**: If `MEMORY.md` conflicts with actual files, the repository wins. Correct `MEMORY.md` immediately.
- Record important architectural decisions when they materially affect future work.

### After Each Session
Before concluding a session:
1. Review what actually changed.
2. Verify repository state.
3. Update `MEMORY.md`:
   - Completed work
   - Current state
   - Unfinished work / in progress
   - Important decisions
   - Tests run / verification results
   - Next logical step
   - Current files / areas affected
4. Remove stale or obsolete information from `MEMORY.md`.

---

## 7. AGENTS.md vs MEMORY.md Relationship

```text
AGENTS.md    →   HOW THE AGENT SHOULD WORK (Permanent Rules & Standards)
MEMORY.md    →   WHAT THE AGENT CURRENTLY KNOWS (Evolving Working Context)
```

- `AGENTS.md` changes rarely.
- `MEMORY.md` changes frequently (after meaningful work in each session).
- Never use `MEMORY.md` as a rulebook.
- Never use `AGENTS.md` as a progress log.
