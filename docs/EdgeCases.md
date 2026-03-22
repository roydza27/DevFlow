---
modified: 2026-03-21T12:36:20+05:30
---
# DEVFLOW EDGE CASES & ERROR HANDLING DOCUMENT

---

# 📌 1. Purpose

This document defines:

- Edge cases (unexpected scenarios)
- Error conditions
- System behavior for each case

---

## 🎯 Goal

👉 Ensure system is:

- Stable
- Predictable
- Resilient

---

# 📌 2. Categories

We’ll break this into:

1. Project Edge Cases
2. Task Edge Cases
3. Timer Edge Cases
4. Context Edge Cases
5. Execution Edge Cases
6. UI / UX Edge Cases
7. Data Integrity Cases
8. System Failures

---

# 📌 3. Project Edge Cases

---

## 🔹 EC-P1: No Projects Exist

### Scenario:

User opens app for first time

### Expected Behavior:

- Show empty state:
    - “Create your first project”

### UI:

- Centered CTA button

---

## 🔹 EC-P2: Last Active Project Missing

### Scenario:

Stored `last_accessed` project deleted

### Behavior:

- Load:
    - most recent project  
        OR
    - empty state

---

## 🔹 EC-P3: Project Deleted While Active

### Scenario:

User deletes current project

### Behavior:

- Clear UI
- Load next available project
- Or show empty state

---

# 📌 4. Task Edge Cases

---

## 🔹 EC-T1: Multiple “doing” Tasks (Critical)

### Scenario:

Data inconsistency (bug)

### Expected Behavior:

- Backend must:
    - detect multiple `doing`
    - keep latest
    - reset others → `todo`

---

## 🔹 EC-T2: No Tasks Exist

### Behavior:

- Show:
    - “Add your first task”

---

## 🔹 EC-T3: Empty Task Input

### Scenario:

User presses Enter with no text

### Behavior:

- Ignore input
- No API call

---

## 🔹 EC-T4: Very Long Task Title

### Behavior:

- Limit length (e.g. 255 chars)
- UI truncates visually

---

## 🔹 EC-T5: Rapid Status Switching

### Scenario:

User clicks multiple tasks quickly

### Behavior:

- Backend ensures:
    - only one `doing`
- UI updates based on response

---

## 🔹 EC-T6: Task Deleted While Active

### Scenario:

Active task removed

### Behavior:

- Clear active task
- Stop timer (if running)

---

# 📌 5. Timer Edge Cases (CRITICAL)

---

## 🔹 EC-TR1: Timer Running → Page Reload

### Behavior:

- Recalculate:

elapsed = now - started_at

- Continue timer display

---

## 🔹 EC-TR2: Timer Running → App Closed

### Behavior:

- On reopen:
    - continue calculation from timestamp

---

## 🔹 EC-TR3: Timer Running → System Sleep

### Behavior:

- On resume:
    - calculate time difference
    - continue

---

## 🔹 EC-TR4: Multiple Timers Started

### Scenario:

User tries to start multiple timers

### Behavior:

- Stop previous timer automatically
- Start new one

---

## 🔹 EC-TR5: Timer Without Task

### Scenario:

User clicks start with no active task

### Behavior:

- Prevent action
- Show message:
    - “Select a task first”

---

## 🔹 EC-TR6: Negative or Corrupt Time

### Scenario:

Clock issue / bad data

### Behavior:

- Clamp value to 0
- Log error

---

# 📌 6. Context Edge Cases

---

## 🔹 EC-C1: Empty Note Save

### Behavior:

- Ignore OR delete note

---

## 🔹 EC-C2: Invalid Markdown

### Behavior:

- Render safely
- No crash

---

## 🔹 EC-C3: Very Large Note

### Behavior:

- Allow but:
    - lazy render
    - avoid UI lag

---

## 🔹 EC-C4: Invalid URL

### Behavior:

- Validate before save
- Show error

---

# 📌 7. Execution Edge Cases

---

## 🔹 EC-E1: Copy Command Failure

### Scenario:

Clipboard API fails

### Behavior:

- Show fallback message
- Allow manual copy

---

## 🔹 EC-E2: Broken URL

### Behavior:

- Still open
- Browser handles error

---

# 📌 8. UI / UX Edge Cases

---

## 🔹 EC-UI1: Slow Response

### Behavior:

- Show loading indicator

---

## 🔹 EC-UI2: Double Click Actions

### Behavior:

- Debounce actions

---

## 🔹 EC-UI3: Empty Dashboard

### Behavior:

- Show guided UI

---

## 🔹 EC-UI4: Overflow UI (Too Many Tasks)

### Behavior:

- Scrollable list
- Maintain layout

---

# 📌 9. Data Integrity Cases

---

## 🔹 EC-DI1: Orphan Tasks

### Scenario:

Task exists without project

### Behavior:

- Delete OR ignore

---

## 🔹 EC-DI2: Invalid Status Value

### Behavior:

- Reject update
- Return error

---

## 🔹 EC-DI3: Duplicate IDs (rare)

### Behavior:

- Prevent at DB level

---

# 📌 10. System Failures

---

## 🔹 EC-S1: DB Failure

### Behavior:

- Show:
    - “Data error occurred”
- Prevent UI crash

---

## 🔹 EC-S2: API Failure

### Behavior:

- Show error toast
- Retry option

---

## 🔹 EC-S3: Partial Data Load

### Behavior:

- Load available data
- Show fallback

---

# 📌 11. Validation Rules (Error Prevention)

---

## Tasks:

- title required
- max length

---

## Projects:

- name required

---

## Links:

- valid URL

---

# 📌 12. Error Messaging Strategy

---

## Principles:

- Short
- Clear
- Actionable

---

## Examples:

- “Select a task first”
- “Invalid URL”
- “Something went wrong”

---

# 📌 13. Recovery Strategies

---

## Strategy 1: Safe Defaults

- fallback states

---

## Strategy 2: Retry

- allow retry on failure

---

## Strategy 3: Graceful Degradation

- continue app with limited features

---

# 📌 14. Logging Strategy

---

Log only critical issues:

- Timer anomalies
- DB errors
- invalid states

---

# 📌 15. Testing Checklist

---

You should test:

- Timer persistence
- Task switching
- Empty states
- Rapid actions
- Data recovery