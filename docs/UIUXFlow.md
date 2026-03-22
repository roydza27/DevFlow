---
modified: 2026-03-21T12:35:25+05:30
---
# DEVFLOW UI FLOW DOCUMENT

---

# 📌 1. Purpose

Define **how the user interacts with DevFlow step-by-step**.

Focus:

- No friction
- No unnecessary decisions
- One-screen workflow

---

# 📌 2. Core UX Philosophy

---

## 🧠 Guiding Flow

Open → Resume → Focus → Act → Track → Finish

---

## 🎯 UX Goals

- Zero navigation
- Minimal clicks
- Instant interaction
- Clear “what to do next”

---

# 📌 3. Entry Flow (App Launch)

---

## 🔹 FLOW: Open Application

### Step-by-step:

1. User opens app
2. System loads last active project
3. System fetches:
    - tasks
    - notes
    - links
    - actions
    - stats

---

## 🖥️ UI STATE:

User sees:

- Project name
- Active task (highlighted)
- Task list
- Timer button
- Quick actions
- Notes + links
- Progress

---

## 🧠 Decision State:

👉 **User should NOT think**  
System answers:

> “Continue this task”

---

---

# 📌 4. Main Dashboard Layout Flow

---

## 🧩 Layout Zones

[ Top Bar ]  
   ├── Project Name  
   ├── Status  
   └── Progress  
  
[ Left Panel ]  
   ├── Task List  
   └── Quick Add  
  
[ Center Panel ]  
   ├── Active Task  
   └── Timer  
  
[ Right Panel ]  
   ├── Actions  
   ├── Notes  
   └── Links  
  
[ Bottom Bar ]  
   ├── Time Today  
   └── Tasks Done Today

---

## 🎯 UX Principle:

👉 Everything visible  
👉 No switching screens

---

# 📌 5. Task Flow (CORE)

---

## 🔹 FLOW: Add Task

### Steps:

1. User focuses input
2. Types task
3. Presses Enter

---

### UI Behavior:

- Task appears instantly
- Status = `todo`
- Added to middle section

---

---

## 🔹 FLOW: Start Working on Task

---

### Steps:

1. User clicks task OR sets to `doing`

---

### System Behavior:

- Previous `doing` → reset to `todo`
- Selected task → `doing`
- Moves to top

---

### UI Behavior:

- Highlight task
- Update Active Task panel

---

---

## 🔹 FLOW: Complete Task

---

### Steps:

1. User marks task as `done`

---

### System Behavior:

- Task moves to bottom
- Count toward daily stats

---

---

## 🔹 FLOW: Block Task

---

### Steps:

1. User sets status → `blocked`

---

### UI Behavior:

- Task moves below todo
- Visually distinct

---

---

# 📌 6. Timer Flow

---

## 🔹 FLOW: Start Timer

---

### Steps:

1. User clicks “Start Timer”

---

### System Behavior:

- Save `started_at`
- Timer begins

---

### UI Behavior:

- Timer starts counting
- Button changes to “Stop”

---

---

## 🔹 FLOW: Stop Timer

---

### Steps:

1. User clicks “Stop Timer”

---

### System Behavior:

- Calculate duration
- Update time_spent
- Reset `started_at`

---

### UI Behavior:

- Timer resets
- Update stats

---

---

## 🔹 EDGE FLOW: Page Reload

---

### Behavior:

- Timer continues using timestamp
- UI recalculates elapsed time

---

# 📌 7. Quick Actions Flow

---

## 🔹 FLOW: Copy Command

---

### Steps:

1. User clicks action

---

### Behavior:

- Command copied to clipboard

---

### UI Feedback:

- Toast / small indicator  
    → “Copied”

---

---

## 🔹 FLOW: Open Link

---

### Steps:

1. User clicks link

---

### Behavior:

- Opens new tab

---

# 📌 8. Context Flow (Notes + Links)

---

## 🔹 FLOW: Add Note

---

### Steps:

1. User types in note field
2. Saves automatically OR on Enter

---

---

## 🔹 FLOW: Edit Note

---

### Behavior:

- Markdown supported
- Live editing

---

---

## 🔹 FLOW: Add Link

---

### Steps:

1. User inputs:
    - title
    - url
2. Press Enter

---

### Behavior:

- Link appears instantly

---

# 📌 9. Quick Add Flow (Unified Input)

---

## 🔹 FLOW: Instant Input

---

### Steps:

1. User types
2. Press Enter

---

### Behavior:

- Detect input type (task/note/link)
- Save instantly

---

### UX Goal:

👉 No form  
👉 No delay

---

# 📌 10. Feedback Flow

---

## 🔹 Display:

- Tasks completed today
- Time spent today
- Progress %

---

## 🔹 Update Behavior:

- Updates instantly on:
    - task completion
    - timer stop

---

# 📌 11. Empty State Flow

---

## 🔹 Case: No Project

UI shows:

- “Create your first project”

---

## 🔹 Case: No Tasks

UI shows:

- “Add your first task”

---

👉 Guides user instantly

---

# 📌 12. Error Flow

---

## 🔹 Invalid Input

- Show inline message

---

## 🔹 Failed Action

- Show toast:
    - “Something went wrong”

---

# 📌 13. Keyboard Flow

---

## 🔹 Basic:

- Enter → submit input

---

## 🔹 Future:

- `Ctrl + K` → open command palette

---

# 📌 14. State Flow Summary

---

## UI State Loop:

User Action  
   ↓  
UI Update (optimistic)  
   ↓  
Backend Sync  
   ↓  
Final UI State

---

# 📌 15. Critical UX Rules

---

## Rule 1:

👉 Always show current task

---

## Rule 2:

👉 Never require navigation

---

## Rule 3:

👉 Minimize clicks

---

## Rule 4:

👉 Show feedback instantly

---

## Rule 5:

👉 Avoid user confusion