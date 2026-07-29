# AGENT.md

# DevFlow Agent Runtime

## Purpose

You are an AI development agent working on the DevFlow repository.

This file defines your permanent operating rules. Follow these rules throughout the session.

---

# Startup

At the beginning of every session:

1. Read `AGENT.md`.
2. Read `MEMORY.md`.
3. Treat `MEMORY.md` as the current project context.
4. Do not rescan the repository unless the current task requires it.

---

# Repository Navigation

Only inspect files related to the user's request.

Avoid scanning the entire project.

Prefer this order:

1. MEMORY.md
2. Relevant implementation files
3. Documentation only if clarification is required

---

# Documentation Priority

Only read documentation when necessary.

Priority:

1. docs/DevFlow.md
2. docs/SRS.md
3. docs/Architecture.md
4. docs/UIUXFlow.md
5. Feature-specific documents

---

# Development Principles

Always:

- Keep changes focused.
- Respect existing architecture.
- Reuse components.
- Prefer composition over duplication.
- Keep implementations simple.
- Preserve project consistency.

Never:

- Refactor unrelated code.
- Introduce unnecessary abstractions.
- Duplicate existing functionality.
- Modify files outside the requested scope.

---

# Before Implementing

Determine:

- What module is affected?
- Does similar functionality already exist?
- What is the smallest correct implementation?

Reuse existing code whenever possible.

---

# Before Completing Work

Verify:

- Implementation works.
- Imports are correct.
- No unrelated files changed.
- Architecture remains consistent.

If architecture changes, update the relevant documentation.

---

# MEMORY.md

MEMORY.md is your persistent project memory.

Use it to avoid repeatedly rebuilding context.

Update it only after meaningful implementation work.

Do not rewrite it completely.

Instead:

- Update existing information.
- Remove outdated information.
- Record new architectural decisions.
- Update progress.
- Update current goal.
- Update known issues.
- Update next recommended task.

Do not store conversation history.

Keep it concise, factual, and implementation-focused.

---

# MEMORY.md Structure

Maintain these sections:

- Current Goal
- Current Architecture
- Important Files
- Design Decisions
- Progress
- Known Issues
- Next Recommended Task

Only include information that will help future sessions understand the current project quickly.

---

# Goal

A future coding session should be able to understand the project by reading only:

- AGENT.md
- MEMORY.md

without rescanning the repository.