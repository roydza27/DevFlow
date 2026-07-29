import { useState, useRef } from 'react'
import { FilePlus, FileText, Trash2, Pencil, Check, FolderOpen, Upload, FolderSync } from 'lucide-react'
import { pickDirectory, isFileSystemSupported } from '../../services/fileSystemService'

export default function NotesSidebar({
  notes,
  activeNoteId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  onSyncObsidian,
  onImportFileList,
  expanded = false,
}) {
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [syncing, setSyncing] = useState(false)
  const fileInputRef = useRef(null)

  function startRename(note, e) {
    e.stopPropagation()
    setRenamingId(note.id)
    setRenameValue(note.title)
  }

  function commitRename(id) {
    onRename?.(id, renameValue)
    setRenamingId(null)
  }

  function handleRenameKey(e, id) {
    if (e.key === 'Enter') commitRename(id)
    if (e.key === 'Escape') setRenamingId(null)
  }

  async function handleNativeDirectoryPick() {
    setSyncing(true)
    try {
      if (isFileSystemSupported()) {
        const handle = await pickDirectory()
        if (handle && onSyncObsidian) {
          await onSyncObsidian(handle)
        }
      } else {
        fileInputRef.current?.click()
      }
    } catch {
      /* cancelled or error */
    } finally {
      setSyncing(false)
    }
  }

  async function handleFileChange(e) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setSyncing(true)
    try {
      await onImportFileList?.(files)
    } finally {
      setSyncing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`flex flex-col shrink-0 border-r border-outline-variant/60 overflow-hidden h-full ${expanded ? 'w-64' : 'w-52'}`}>
      {/* Hidden file input for directory/file selection fallback */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        webkitdirectory="true"
        directory="true"
        accept=".md"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header controls */}
      <div className="flex items-center justify-between px-2 py-1.5 shrink-0 border-b border-outline-variant/40 bg-surface-container/30">
        <span className="text-[11px] font-label uppercase tracking-wider text-outline">Notes & Docs</span>
        <div className="flex items-center gap-1">
          {/* Pick directory via File System Access API */}
          <button
            onClick={handleNativeDirectoryPick}
            disabled={syncing}
            className="p-1 rounded text-outline hover:text-tertiary transition-colors disabled:opacity-40"
            title="Link & Sync folder via File System API"
          >
            <FolderSync size={13} className={syncing ? 'animate-spin' : ''} />
          </button>

          {/* Upload files / folder path button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={syncing}
            className="p-1 rounded text-outline hover:text-primary transition-colors disabled:opacity-40"
            title="Import .md files or select folder path"
          >
            <Upload size={13} />
          </button>

          {/* New blank note */}
          <button
            onClick={onNew}
            className="p-1 rounded text-outline hover:text-on-surface transition-colors"
            title="New blank note"
          >
            <FilePlus size={13} />
          </button>
        </div>
      </div>

      {/* Local Path Quick Import Bar */}
      <div className="px-1.5 py-1 border-b border-outline-variant/30 bg-surface-container/10 flex items-center gap-1">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-between px-2 py-1 rounded bg-surface-container-high hover:bg-surface-variant text-xs text-outline hover:text-on-surface transition-colors"
        >
          <span className="truncate font-mono text-[10px]">Select path / files…</span>
          <FolderOpen size={11} className="shrink-0 text-tertiary" />
        </button>
      </div>

      {/* File list */}
      <div className="flex flex-col gap-0.5 overflow-y-auto hide-scrollbar flex-1 px-1 py-1">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center p-3 text-center gap-2">
            <p className="text-xs text-outline">No notes yet</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-variant text-tertiary transition-colors font-label"
            >
              <Upload size={12} />
              Import .md files/folder
            </button>
          </div>
        )}

        {notes.map(note => (
          <div
            key={note.id}
            className={`group flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors ${
              note.id === activeNoteId
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-bright'
            }`}
            onClick={() => onSelect(note.id)}
            title={note.path ? `${note.path}` : note.title}
          >
            <FileText size={11} className="shrink-0 opacity-60" />
            {renamingId === note.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => handleRenameKey(e, note.id)}
                onBlur={() => commitRename(note.id)}
                onClick={e => e.stopPropagation()}
                className="flex-1 min-w-0 bg-transparent border-b border-primary text-xs focus:outline-none text-on-surface"
              />
            ) : (
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-xs truncate font-body leading-tight">{note.title}</span>
                {note.path && (
                  <span className="text-[9px] text-outline/70 truncate font-mono">{note.path}</span>
                )}
              </div>
            )}

            {/* Hover actions */}
            {renamingId === note.id ? (
              <button
                onClick={e => { e.stopPropagation(); commitRename(note.id) }}
                className="shrink-0 p-0.5 rounded text-tertiary"
              >
                <Check size={11} />
              </button>
            ) : (
              <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                <button
                  onClick={e => startRename(note, e)}
                  className="p-0.5 rounded text-outline hover:text-on-surface"
                  title="Rename"
                >
                  <Pencil size={11} />
                </button>
                {notes.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); onDelete?.(note.id) }}
                    className="p-0.5 rounded text-outline hover:text-error"
                    title="Delete note"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
