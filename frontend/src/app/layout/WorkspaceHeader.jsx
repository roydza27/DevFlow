import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Layers } from 'lucide-react'

export default function WorkspaceHeader({ projects = [], currentProject = null, onProjectSwitch, activeTask = null }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(projectId) {
    onProjectSwitch?.(projectId)
    setDropdownOpen(false)
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
          <div className="absolute top-full left-0 mt-1 w-48 bg-surface-container-high border border-outline-variant rounded-lg shadow-xl z-50 py-1 overflow-hidden">
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
