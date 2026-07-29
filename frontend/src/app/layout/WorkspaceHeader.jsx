import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Layers, Plus, Check, FolderOpen, Link, Unlink, Pencil, Trash2, X } from 'lucide-react'
import { isFileSystemSupported, pickDirectory } from '../../services/fileSystemService'

const FS_SUPPORTED = isFileSystemSupported()

export default function WorkspaceHeader({
  projects = [],
  currentProject = null,
  onProjectSwitch,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  onLinkFolder,
  onUnlinkFolder,
  activeTask = null,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [pendingHandle, setPendingHandle] = useState(null)
  const [pickingFolder, setPickingFolder] = useState(false)

  // Rename state
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')

  // Delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const renameInputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
        resetAll()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (creating) inputRef.current?.focus()
  }, [creating])

  useEffect(() => {
    if (renamingId !== null) renameInputRef.current?.focus()
  }, [renamingId])

  function resetAll() {
    setCreating(false)
    setNewName('')
    setPendingHandle(null)
    setPickingFolder(false)
    setRenamingId(null)
    setRenameValue('')
    setConfirmDeleteId(null)
  }

  function handleSelect(projectId) {
    if (renamingId !== null || confirmDeleteId !== null) return
    onProjectSwitch?.(projectId)
    setDropdownOpen(false)
    resetAll()
  }

  async function handlePickFolder() {
    setPickingFolder(true)
    try {
      const handle = await pickDirectory()
      setPendingHandle(handle ?? null)
    } catch {
      setPendingHandle(null)
    } finally {
      setPickingFolder(false)
    }
  }

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    onCreateProject?.(name, pendingHandle)
    setDropdownOpen(false)
    resetAll()
  }

  function handleNewKeyDown(e) {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') resetAll()
  }

  async function handleLinkFolder(e, projectId) {
    e.stopPropagation()
    try {
      const handle = await pickDirectory()
      if (handle) onLinkFolder?.(projectId, handle)
    } catch { /* cancelled */ }
  }

  function handleUnlink(e, projectId) {
    e.stopPropagation()
    onUnlinkFolder?.(projectId)
  }

  // ── Rename ──────────────────────────────────────────────────────────────────

  function startRename(e, project) {
    e.stopPropagation()
    setConfirmDeleteId(null)
    setCreating(false)
    setRenamingId(project.id)
    setRenameValue(project.name)
  }

  function commitRename() {
    if (renameValue.trim() && renamingId !== null) {
      onRenameProject?.(renamingId, renameValue.trim())
    }
    setRenamingId(null)
    setRenameValue('')
  }

  function handleRenameKeyDown(e) {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') { setRenamingId(null); setRenameValue('') }
  }

  // ── Delete ───────────────────────────────────────────────────────────────────

  function requestDelete(e, projectId) {
    e.stopPropagation()
    setRenamingId(null)
    setCreating(false)
    setConfirmDeleteId(projectId)
  }

  function confirmDelete(e, projectId) {
    e.stopPropagation()
    onDeleteProject?.(projectId)
    setConfirmDeleteId(null)
    // If we deleted the only project the dropdown should close
    if (projects.length <= 1) {
      setDropdownOpen(false)
      resetAll()
    }
  }

  function cancelDelete(e) {
    e.stopPropagation()
    setConfirmDeleteId(null)
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-outline-variant bg-surface-container shrink-0">
      {/* Project switcher */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => { setDropdownOpen(o => !o); if (dropdownOpen) resetAll() }}
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface-variant transition-colors group"
        >
          <Layers size={14} className="text-primary shrink-0" />
          <span className="text-sm font-headline font-semibold text-on-surface">
            {currentProject?.name ?? 'Select Workspace'}
          </span>
          {currentProject?.linkedFolderName && (
            <span className="text-[10px] font-label text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded truncate max-w-[90px]">
              📁 {currentProject.linkedFolderName}
            </span>
          )}
          <ChevronDown
            size={12}
            className={`text-outline transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-72 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-50 py-1 overflow-hidden">

            {projects.length === 0 && (
              <p className="text-xs text-outline px-3 py-2">No workspaces yet</p>
            )}

            {projects.map(project => (
              <div key={project.id}>
                {/* Delete confirmation row */}
                {confirmDeleteId === project.id ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-error/10">
                    <span className="text-xs text-on-surface flex-1 truncate">
                      Delete <span className="font-semibold">{project.name}</span>?
                    </span>
                    <button
                      onClick={e => confirmDelete(e, project.id)}
                      className="text-xs px-2 py-0.5 rounded bg-error text-on-error font-label hover:opacity-90 transition-opacity shrink-0"
                    >
                      Delete
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="p-0.5 rounded text-outline hover:text-on-surface transition-colors shrink-0"
                      title="Cancel"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : renamingId === project.id ? (
                  /* Rename input row */
                  <div className="flex items-center gap-1.5 px-3 py-1.5" onClick={e => e.stopPropagation()}>
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={handleRenameKeyDown}
                      onBlur={commitRename}
                      className="flex-1 min-w-0 px-2 py-0.5 rounded bg-surface-container text-sm text-on-surface border border-primary focus:outline-none font-body"
                    />
                    <button
                      onClick={commitRename}
                      className="p-0.5 rounded text-tertiary hover:text-on-surface transition-colors shrink-0"
                      title="Confirm rename"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={() => { setRenamingId(null); setRenameValue('') }}
                      className="p-0.5 rounded text-outline hover:text-on-surface transition-colors shrink-0"
                      title="Cancel"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  /* Normal project row */
                  <div
                    className={`group flex items-center gap-1 px-2 pr-1 py-1.5 transition-colors cursor-pointer ${
                      project.id === currentProject?.id
                        ? 'bg-primary-container/20'
                        : 'hover:bg-surface-variant'
                    }`}
                    onClick={() => handleSelect(project.id)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {project.id === currentProject?.id ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 shrink-0" />
                      )}
                      <span className={`truncate text-sm font-body ${
                        project.id === currentProject?.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                      }`}>
                        {project.name}
                      </span>
                      {project.linkedFolderName && (
                        <span className="text-[10px] text-tertiary shrink-0" title={`Linked: ${project.linkedFolderName}`}>
                          📁
                        </span>
                      )}
                    </div>

                    {/* Action buttons — visible on hover */}
                    <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                      {/* Rename */}
                      <button
                        onClick={e => startRename(e, project)}
                        className="p-1 rounded text-outline hover:text-on-surface transition-colors"
                        title="Rename workspace"
                      >
                        <Pencil size={11} />
                      </button>

                      {/* Folder link / unlink (only when FS API available) */}
                      {FS_SUPPORTED && (
                        project.linkedFolderName ? (
                          <button
                            onClick={e => handleUnlink(e, project.id)}
                            title={`Unlink folder: ${project.linkedFolderName}`}
                            className="p-1 rounded text-outline hover:text-error transition-colors shrink-0"
                          >
                            <Unlink size={11} />
                          </button>
                        ) : (
                          <button
                            onClick={e => handleLinkFolder(e, project.id)}
                            title="Link local folder"
                            className="p-1 rounded text-outline hover:text-tertiary transition-colors shrink-0"
                          >
                            <Link size={11} />
                          </button>
                        )
                      )}

                      {/* Delete */}
                      <button
                        onClick={e => requestDelete(e, project.id)}
                        className="p-1 rounded text-outline hover:text-error transition-colors"
                        title="Delete workspace"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Create new workspace */}
            <div className="border-t border-outline-variant mt-1 pt-1 px-2 pb-1">
              {creating ? (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1">
                    <input
                      ref={inputRef}
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={handleNewKeyDown}
                      placeholder="Workspace name…"
                      className="flex-1 min-w-0 px-2 py-1 rounded bg-surface-container text-xs text-on-surface placeholder-outline border border-outline-variant focus:border-primary focus:outline-none font-body"
                    />
                    <button
                      onClick={handleCreate}
                      disabled={!newName.trim()}
                      className="p-1 rounded text-tertiary hover:text-on-surface disabled:opacity-30 transition-colors shrink-0"
                      title="Create workspace"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={resetAll}
                      className="p-1 rounded text-outline hover:text-on-surface transition-colors shrink-0"
                      title="Cancel"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  {/* Folder picker (only when File System API is available) */}
                  {FS_SUPPORTED && (
                    <button
                      onClick={handlePickFolder}
                      disabled={pickingFolder}
                      className={`flex items-center gap-1.5 w-full px-2 py-1 rounded text-xs transition-colors border ${
                        pendingHandle
                          ? 'border-tertiary text-tertiary bg-tertiary/10'
                          : 'border-outline-variant text-outline hover:text-on-surface hover:border-primary'
                      }`}
                    >
                      <FolderOpen size={12} />
                      {pickingFolder
                        ? 'Selecting…'
                        : pendingHandle
                          ? `📁 ${pendingHandle.name}`
                          : 'Link Project Folder (optional)'}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setCreating(true); setConfirmDeleteId(null); setRenamingId(null) }}
                  className="flex items-center gap-1.5 px-1 py-1 w-full text-xs text-outline hover:text-on-surface transition-colors"
                >
                  <Plus size={12} />
                  New Workspace
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active task indicator */}
      {activeTask && (
        <div className="flex items-center gap-2 max-w-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse shrink-0" />
          <span className="text-sm font-body text-on-surface-variant truncate">
            {activeTask.title}
          </span>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center gap-2" aria-label="Workspace active status">
        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
        <span className="text-xs font-label text-outline">workspace</span>
      </div>
    </header>
  )
}
