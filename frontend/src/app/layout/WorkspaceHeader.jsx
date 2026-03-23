import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Layers, Plus, Check } from 'lucide-react'

export default function WorkspaceHeader({ projects = [], currentProject = null, onProjectSwitch, onCreateProject, activeTask = null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
        setCreating(false)
        setNewName('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (creating) inputRef.current?.focus()
  }, [creating])

  function handleSelect(projectId) {
    onProjectSwitch?.(projectId)
    setDropdownOpen(false)
    setCreating(false)
    setNewName('')
  }

  function handleCreate() {
    const name = newName.trim()
    if (!name) return
    onCreateProject?.(name)
    setDropdownOpen(false)
    setCreating(false)
    setNewName('')
  }

  function handleNewKeyDown(e) {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') { setCreating(false); setNewName('') }
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
          <ChevronDown
            size={12}
            className={`text-outline transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-52 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-50 py-1 overflow-hidden">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => handleSelect(project.id)}
                className={`w-full text-left px-3 py-2 text-sm font-body transition-colors flex items-center gap-2 ${
                  project.id === currentProject?.id
                    ? 'text-primary bg-primary-container/20'
                    : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
                }`}
              >
                {project.id === currentProject?.id ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                ) : (
                  <span className="w-1.5 h-1.5 shrink-0" />
                )}
                {project.name}
              </button>
            ))}

            {/* Create new workspace */}
            <div className="border-t border-outline-variant mt-1 pt-1 px-2 pb-1">
              {creating ? (
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
                    className="p-1 rounded text-tertiary hover:text-on-surface disabled:opacity-30 transition-colors"
                    title="Create"
                  >
                    <Check size={13} />
                  </button>
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
