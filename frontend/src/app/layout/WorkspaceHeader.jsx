import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Layers, Plus, Check, FolderOpen, Link, Unlink } from 'lucide-react'
import { isFileSystemSupported, pickDirectory } from '../../services/fileSystemService'

const FS_SUPPORTED = isFileSystemSupported()

export default function WorkspaceHeader({
  projects = [],
  currentProject = null,
  onProjectSwitch,
  onCreateProject,
  onLinkFolder,
  onUnlinkFolder,
  activeTask = null,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [pendingHandle, setPendingHandle] = useState(null) // FileSystemDirectoryHandle
  const [pickingFolder, setPickingFolder] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
        resetCreateState()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (creating) inputRef.current?.focus()
  }, [creating])

  function resetCreateState() {
    setCreating(false)
    setNewName('')
    setPendingHandle(null)
    setPickingFolder(false)
  }

  function handleSelect(projectId) {
    onProjectSwitch?.(projectId)
    setDropdownOpen(false)
    resetCreateState()
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
    resetCreateState()
  }

  function handleNewKeyDown(e) {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') resetCreateState()
  }

  async function handleLinkFolder(e, projectId) {
    e.stopPropagation() // don't trigger project switch
    try {
      const handle = await pickDirectory()
      if (handle) onLinkFolder?.(projectId, handle)
    } catch { /* cancelled */ }
  }

  function handleUnlink(e, projectId) {
    e.stopPropagation()
    onUnlinkFolder?.(projectId)
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-outline-variant bg-surface-container shrink-0">
      {/* Project switcher */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface-variant transition-colors group"
        >
          <Layers size={14} className="text-primary shrink-0" />
          <span className="text-sm font-headline font-semibold text-on-surface">
            {currentProject?.name ?? 'Select Project'}
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
          <div className="absolute top-full left-0 mt-1 w-60 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-50 py-1 overflow-hidden">
            {projects.map(project => (
              <div
                key={project.id}
                className={`flex items-center gap-1 px-2 pr-1 py-1.5 transition-colors ${
                  project.id === currentProject?.id
                    ? 'bg-primary-container/20'
                    : 'hover:bg-surface-variant'
                }`}
              >
                {/* Switch button */}
                <button
                  onClick={() => handleSelect(project.id)}
                  className={`flex items-center gap-2 flex-1 min-w-0 text-left text-sm font-body ${
                    project.id === currentProject?.id ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {project.id === currentProject?.id ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  ) : (
                    <span className="w-1.5 h-1.5 shrink-0" />
                  )}
                  <span className="truncate">{project.name}</span>
                  {project.linkedFolderName && (
                    <span className="text-[10px] text-tertiary shrink-0" title={`Linked: ${project.linkedFolderName}`}>
                      📁
                    </span>
                  )}
                </button>

                {/* Folder link / unlink controls (only shown when FS API is available) */}
                {FS_SUPPORTED && (
                  project.linkedFolderName ? (
                    <button
                      onClick={e => handleUnlink(e, project.id)}
                      title={`Unlink folder: ${project.linkedFolderName}`}
                      className="p-1 rounded text-outline hover:text-error transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                      style={{ opacity: undefined }} // Let CSS handle via group
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
                          : 'Select Folder (optional)'}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setCreating(true)}
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
