// ─── File System Access API service ──────────────────────────────────────────
//
// All filesystem operations live here. The store and components call these
// functions; this module has no knowledge of Zustand or React.
//
// Architecture:
//  • dirHandleMap  — in-memory Map<projectId, FileSystemDirectoryHandle>
//                    (not serialisable, lives only while the tab is open)
//  • IndexedDB     — persists handles across sessions so the user doesn't
//                    have to re-select a folder every time
//  • Graceful degradation — when the API is unavailable (Firefox, Safari)
//                    all exported functions become safe no-ops.

// ─── Feature detection ────────────────────────────────────────────────────────

export function isFileSystemSupported() {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window
}

// ─── In-memory handle registry ────────────────────────────────────────────────

const dirHandleMap = new Map() // projectId → FileSystemDirectoryHandle

export function getDirHandle(projectId) {
  return dirHandleMap.get(projectId) ?? null
}

export function setDirHandle(projectId, handle) {
  if (handle) dirHandleMap.set(projectId, handle)
  else dirHandleMap.delete(projectId)
}

export function hasDirHandle(projectId) {
  return dirHandleMap.has(projectId)
}

// ─── Permission helper ────────────────────────────────────────────────────────

export async function verifyPermission(handle) {
  if (!handle) return false
  try {
    const opts = { mode: 'readwrite' }
    if ((await handle.queryPermission(opts)) === 'granted') return true
    if ((await handle.requestPermission(opts)) === 'granted') return true
    return false
  } catch {
    return false
  }
}

// ─── Directory picker ─────────────────────────────────────────────────────────

/**
 * Opens the native folder picker.
 * Returns the FileSystemDirectoryHandle or null (user cancelled / API unavailable).
 */
export async function pickDirectory() {
  if (!isFileSystemSupported()) return null
  try {
    return await window.showDirectoryPicker({ mode: 'readwrite' })
  } catch (err) {
    if (err.name === 'AbortError') return null
    throw err
  }
}

// ─── .devflow structure ───────────────────────────────────────────────────────

const DEVFLOW_DIR = '.devflow'

async function getOrCreateDevflowDir(dirHandle) {
  return dirHandle.getDirectoryHandle(DEVFLOW_DIR, { create: true })
}

async function getDevflowDir(dirHandle) {
  try {
    return await dirHandle.getDirectoryHandle(DEVFLOW_DIR)
  } catch {
    return null
  }
}

// ─── JSON helpers ─────────────────────────────────────────────────────────────

async function readJson(dirHandle, filename, fallback = null) {
  try {
    const fh = await dirHandle.getFileHandle(filename)
    const file = await fh.getFile()
    return JSON.parse(await file.text())
  } catch {
    return fallback
  }
}

async function writeJson(dirHandle, filename, data) {
  const fh = await dirHandle.getFileHandle(filename, { create: true })
  const writable = await fh.createWritable()
  await writable.write(JSON.stringify(data, null, 2))
  await writable.close()
}

// ─── Full project read from folder ───────────────────────────────────────────

/**
 * Reads all project data from .devflow/ inside the given directory handle.
 * Returns null if .devflow/ doesn't exist yet.
 */
export async function readProjectFromDir(dirHandle) {
  const df = await getDevflowDir(dirHandle)
  if (!df) return null

  const meta = await readJson(df, 'meta.json', {})
  const tasks = await readJson(df, 'tasks.json', [])
  const resources = await readJson(df, 'resources.json', [])
  const commands = await readJson(df, 'commands.json', [])
  const logs = await readJson(df, 'logs.json', [])
  const timer = await readJson(df, 'timer.json', { startedAt: null, accumulated: 0, activeTaskId: null })

  // Notes: each is a .md file inside notes/
  const notesIndex = await readJson(df, 'notes-index.json', [])
  const notes = []
  try {
    const notesDir = await df.getDirectoryHandle('notes')
    for (const entry of notesIndex) {
      try {
        const fh = await notesDir.getFileHandle(`${entry.id}.md`)
        const content = await (await fh.getFile()).text()
        notes.push({ id: entry.id, title: entry.title, content })
      } catch {
        // Note file missing — skip
      }
    }
  } catch {
    // notes/ dir missing — return empty array
  }

  return { ...meta, tasks, resources, commands, logs, timer, notes }
}

// ─── Full project write to folder ─────────────────────────────────────────────

/**
 * Writes the entire project to .devflow/ creating files as needed.
 * Safe to call after every state change (files are small).
 */
export async function writeProjectToDir(dirHandle, project) {
  try {
    const ok = await verifyPermission(dirHandle)
    if (!ok) return

    const df = await getOrCreateDevflowDir(dirHandle)
    await df.getDirectoryHandle('notes', { create: true })

    await writeJson(df, 'meta.json', {
      name: project.name,
      lastAccessed: project.lastAccessed,
    })
    await writeJson(df, 'tasks.json', project.tasks ?? [])
    await writeJson(df, 'resources.json', project.resources ?? [])
    await writeJson(df, 'commands.json', project.commands ?? [])
    await writeJson(df, 'logs.json', (project.logs ?? []).slice(0, 200))
    await writeJson(df, 'timer.json', project.timer ?? { startedAt: null, accumulated: 0, activeTaskId: null })

    await _writeNotesToDir(df, project.notes ?? [])
  } catch {
    // Fire-and-forget — never crash the UI
  }
}

async function _writeNotesToDir(df, notes) {
  const notesDir = await df.getDirectoryHandle('notes', { create: true })
  const notesIndex = []

  for (const note of notes) {
    try {
      const fh = await notesDir.getFileHandle(`${note.id}.md`, { create: true })
      const writable = await fh.createWritable()
      await writable.write(note.content ?? '')
      await writable.close()
      notesIndex.push({ id: note.id, title: note.title })
    } catch {
      // Skip individual note write errors
    }
  }

  await writeJson(df, 'notes-index.json', notesIndex)
}

// ─── Partial writes (for performance-sensitive paths) ─────────────────────────

export async function writeNoteToDir(dirHandle, note) {
  try {
    const ok = await verifyPermission(dirHandle)
    if (!ok) return
    const df = await getDevflowDir(dirHandle)
    if (!df) return
    const notesDir = await df.getDirectoryHandle('notes', { create: true })
    const fh = await notesDir.getFileHandle(`${note.id}.md`, { create: true })
    const writable = await fh.createWritable()
    await writable.write(note.content ?? '')
    await writable.close()
    // Update index
    const index = await readJson(df, 'notes-index.json', [])
    const newIndex = index.filter(n => n.id !== note.id).concat({ id: note.id, title: note.title })
    await writeJson(df, 'notes-index.json', newIndex)
  } catch {
    // Fire-and-forget
  }
}

export async function deleteNoteFromDir(dirHandle, noteId) {
  try {
    const ok = await verifyPermission(dirHandle)
    if (!ok) return
    const df = await getDevflowDir(dirHandle)
    if (!df) return
    const notesDir = await df.getDirectoryHandle('notes', { create: true })
    try { await notesDir.removeEntry(`${noteId}.md`) } catch { /* already gone */ }
    const index = await readJson(df, 'notes-index.json', [])
    await writeJson(df, 'notes-index.json', index.filter(n => n.id !== noteId))
  } catch {
    // Fire-and-forget
  }
}

// ─── IndexedDB handle persistence ────────────────────────────────────────────
//
// FileSystemDirectoryHandle can be stored in IndexedDB and re-used across
// sessions. The user may need to re-grant permission on re-open, but the
// handle remembers which folder was previously selected.

const IDB_DB = 'devflow-fs'
const IDB_STORE = 'handles'

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_DB, 1)
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(IDB_STORE)
    }
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveHandleToIDB(projectId, handle) {
  try {
    const db = await openIDB()
    const tx = db.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).put(handle, `dir_${projectId}`)
    return new Promise((res, rej) => {
      tx.oncomplete = res
      tx.onerror = () => rej(tx.error)
    })
  } catch {
    // IndexedDB not available — silently skip
  }
}

export async function loadHandleFromIDB(projectId) {
  try {
    const db = await openIDB()
    const tx = db.transaction(IDB_STORE, 'readonly')
    const req = tx.objectStore(IDB_STORE).get(`dir_${projectId}`)
    return new Promise(resolve => {
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

export async function removeHandleFromIDB(projectId) {
  try {
    const db = await openIDB()
    const tx = db.transaction(IDB_STORE, 'readwrite')
    tx.objectStore(IDB_STORE).delete(`dir_${projectId}`)
  } catch {
    // silently skip
  }
}

/**
 * Restore all stored handles for the given project IDs.
 * Returns a Map<projectId, handle | null> with permission verified.
 */
export async function restoreHandles(projectIds) {
  if (!isFileSystemSupported()) return new Map()
  const results = new Map()
  await Promise.all(
    projectIds.map(async id => {
      const handle = await loadHandleFromIDB(id)
      if (handle) {
        const ok = await verifyPermission(handle)
        if (ok) {
          setDirHandle(id, handle)
          results.set(id, handle)
        }
      }
    }),
  )
  return results
}
