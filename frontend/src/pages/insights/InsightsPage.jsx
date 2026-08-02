import { useState, useMemo } from 'react'
import {
  BarChart3,
  Clock,
  CheckCircle2,
  FileText,
  Activity,
  Search,
  Layers,
  Calendar,
  Archive,
  ArrowRight,
  TrendingUp,
  Terminal,
  Link,
} from 'lucide-react'

export default function InsightsPage({ projects = [], currentProject = null, onProjectSwitch }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState(currentProject?.id || projects[0]?.id || null)
  const [timeFilter, setTimeFilter] = useState('all') // 'today' | 'week' | 'all'
  const [logFilter, setLogFilter] = useState('all') // 'all' | 'info' | 'success' | 'warning'

  // Current selected project object
  const project = useMemo(() => {
    return projects.find(p => String(p.id) === String(selectedProjectId)) || currentProject || projects[0] || null
  }, [projects, selectedProjectId, currentProject])

  // Helper time formatter
  function formatTimeStr(secs) {
    if (!secs || secs <= 0) return '0m'
    const hh = Math.floor(secs / 3600)
    const mm = Math.floor((secs % 3600) / 60)
    if (hh === 0) return `${mm}m`
    return `${hh}h ${String(mm).padStart(2, '0')}m`
  }

  // 1. Single Unified Search across all items (Tasks, Notes, Commands, Resources, Logs)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return null

    const results = {
      tasks: [],
      notes: [],
      commands: [],
      resources: [],
      logs: [],
    }

    projects.forEach(p => {
      ;(p.tasks || []).forEach(t => {
        if (t.title.toLowerCase().includes(q)) results.tasks.push({ ...t, projectName: p.name })
      })
      ;(p.notes || []).forEach(n => {
        if (n.title.toLowerCase().includes(q) || (n.content && n.content.toLowerCase().includes(q))) {
          results.notes.push({ ...n, projectName: p.name })
        }
      })
      ;(p.commands || []).forEach(c => {
        if (c.label.toLowerCase().includes(q) || c.command.toLowerCase().includes(q)) {
          results.commands.push({ ...c, projectName: p.name })
        }
      })
      ;(p.resources || []).forEach(r => {
        if (r.title.toLowerCase().includes(q) || r.url.toLowerCase().includes(q)) {
          results.resources.push({ ...r, projectName: p.name })
        }
      })
      ;(p.logs || []).forEach(l => {
        if (l.message.toLowerCase().includes(q)) {
          results.logs.push({ ...l, projectName: p.name })
        }
      })
    })

    return results
  }, [projects, searchQuery])

  // 2. Daily Summary & Workspace Statistics derived from SQLite models
  const stats = useMemo(() => {
    if (!project) return null

    const tasks = project.tasks || []
    const notes = project.notes || []
    const commands = project.commands || []
    const resources = project.resources || []
    const logs = project.logs || []

    const todoCount = tasks.filter(t => t.status === 'todo').length
    const doingCount = tasks.filter(t => t.status === 'doing').length
    const blockedCount = tasks.filter(t => t.status === 'blocked').length
    const doneCount = tasks.filter(t => t.status === 'done').length
    const archivedCount = tasks.filter(t => t.status === 'archived').length
    const totalTasks = tasks.length

    const totalProjectTime = tasks.reduce((sum, t) => sum + (t.totalTime || 0), 0)

    // TODO: When backend supports command copy counters and note edit timestamps, integrate them here.
    const todayDateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
    const todayLogs = logs.filter(l => l.timestamp && l.timestamp.includes(todayDateStr))
    const todayTasksCompleted = tasks.filter(t => t.status === 'done' || (t.status === 'archived' && t.updatedAt && new Date(t.updatedAt).toDateString() === new Date().toDateString())).length

    return {
      todoCount,
      doingCount,
      blockedCount,
      doneCount,
      archivedCount,
      totalTasks,
      totalProjectTime,
      notesCount: notes.length,
      commandsCount: commands.length,
      resourcesCount: resources.length,
      logsCount: logs.length,
      todayLogsCount: todayLogs.length,
      todayTasksCompleted,
    }
  }, [project])

  // 3. Time Analytics (Task level breakdown sorted by duration)
  const timeBreakdown = useMemo(() => {
    if (!project || !project.tasks) return []
    return [...project.tasks]
      .filter(t => (t.totalTime || 0) > 0)
      .sort((a, b) => (b.totalTime || 0) - (a.totalTime || 0))
  }, [project])

  // 4. Activity Timeline / Complete Log History with filtering (Newest First)
  const activityTimeline = useMemo(() => {
    if (!project || !project.logs) return []
    let logs = [...project.logs]
    if (logFilter !== 'all') {
      logs = logs.filter(l => l.type === logFilter)
    }
    return logs
  }, [project, logFilter])

  // 5. Archived & Completed Tasks list
  const archivedTasks = useMemo(() => {
    if (!project || !project.tasks) return []
    return project.tasks.filter(t => t.status === 'archived' || t.status === 'done')
  }, [project])

  // 6. Recent Workspaces sorted by lastAccessed
  const recentWorkspaces = useMemo(() => {
    return [...projects].sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
  }, [projects])

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-outline-variant">
        <div>
          <h1 className="text-xl font-headline font-semibold text-on-surface flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Workspace Insights & Activity History
          </h1>
          <p className="text-xs text-outline mt-0.5">
            Review progress, time allocation, complete log history, and archived tasks.
          </p>
        </div>

        {/* Unified Global Search Bar */}
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks, notes, commands, logs…"
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface placeholder-outline border border-outline-variant focus:border-primary focus:outline-none font-body"
          />
        </div>
      </div>

      {/* Global Search Results Overlay */}
      {searchResults && (
        <div className="bg-surface-container-high border border-outline-variant rounded-xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-2">
            <h3 className="text-sm font-label font-semibold text-primary flex items-center gap-1.5">
              <Search size={14} /> Search Results for "{searchQuery}"
            </h3>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-outline hover:text-on-surface"
            >
              Clear
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* Tasks search results */}
            <div className="space-y-1">
              <span className="font-label text-outline uppercase tracking-wider text-[10px]">Tasks ({searchResults.tasks.length})</span>
              {searchResults.tasks.length === 0 ? <p className="text-outline/60 text-[11px]">No matching tasks</p> : (
                searchResults.tasks.slice(0, 5).map(t => (
                  <div key={t.id} className="p-2 rounded bg-surface-container border border-outline-variant/40 flex justify-between items-center">
                    <span className="text-on-surface font-body truncate">{t.title}</span>
                    <span className="text-[10px] text-tertiary bg-tertiary/10 px-1 rounded">{t.projectName}</span>
                  </div>
                ))
              )}
            </div>

            {/* Notes search results */}
            <div className="space-y-1">
              <span className="font-label text-outline uppercase tracking-wider text-[10px]">Notes ({searchResults.notes.length})</span>
              {searchResults.notes.length === 0 ? <p className="text-outline/60 text-[11px]">No matching notes</p> : (
                searchResults.notes.slice(0, 5).map(n => (
                  <div key={n.id} className="p-2 rounded bg-surface-container border border-outline-variant/40 flex justify-between items-center">
                    <span className="text-on-surface font-body truncate">{n.title}</span>
                    <span className="text-[10px] text-tertiary bg-tertiary/10 px-1 rounded">{n.projectName}</span>
                  </div>
                ))
              )}
            </div>

            {/* Commands & Resources search results */}
            <div className="space-y-1">
              <span className="font-label text-outline uppercase tracking-wider text-[10px]">Commands & Links ({searchResults.commands.length + searchResults.resources.length})</span>
              {searchResults.commands.length + searchResults.resources.length === 0 ? <p className="text-outline/60 text-[11px]">No matching items</p> : (
                [...searchResults.commands, ...searchResults.resources].slice(0, 5).map((item, idx) => (
                  <div key={idx} className="p-2 rounded bg-surface-container border border-outline-variant/40 flex justify-between items-center">
                    <span className="text-on-surface font-body truncate">{item.label || item.title}</span>
                    <span className="text-[10px] text-tertiary bg-tertiary/10 px-1 rounded">{item.projectName}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2-Column Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Project Selector & Daily Summary Card */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-label uppercase tracking-widest text-outline">Selected Workspace</span>
                <select
                  value={project?.id || ''}
                  onChange={e => setSelectedProjectId(e.target.value)}
                  className="mt-1 block w-full sm:w-64 px-3 py-1.5 rounded-lg bg-surface-container-high text-sm font-semibold text-on-surface border border-outline-variant focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} {p.linkedFolderName ? `(📁 ${p.linkedFolderName})` : ''}</option>
                  ))}
                </select>
              </div>

              {/* Time Horizon Filter */}
              <div className="flex items-center bg-surface-container-high border border-outline-variant rounded-lg p-0.5 text-xs font-label">
                <button
                  onClick={() => setTimeFilter('today')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${timeFilter === 'today' ? 'bg-primary text-on-primary font-semibold' : 'text-outline hover:text-on-surface'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimeFilter('week')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${timeFilter === 'week' ? 'bg-primary text-on-primary font-semibold' : 'text-outline hover:text-on-surface'}`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setTimeFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${timeFilter === 'all' ? 'bg-primary text-on-primary font-semibold' : 'text-outline hover:text-on-surface'}`}
                >
                  All Time
                </button>
              </div>
            </div>

            {/* Section 1: Daily Summary Stat Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-surface-container-high border border-outline-variant/60">
                <div className="flex items-center gap-1.5 text-tertiary mb-1">
                  <Clock size={14} />
                  <span className="text-[11px] font-label text-outline">Time Worked</span>
                </div>
                <span className="text-lg font-headline font-semibold text-on-surface">
                  {formatTimeStr(stats?.totalProjectTime || 0)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-high border border-outline-variant/60">
                <div className="flex items-center gap-1.5 text-primary mb-1">
                  <CheckCircle2 size={14} />
                  <span className="text-[11px] font-label text-outline">Done / Archived</span>
                </div>
                <span className="text-lg font-headline font-semibold text-on-surface">
                  {(stats?.doneCount || 0) + (stats?.archivedCount || 0)}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-high border border-outline-variant/60">
                <div className="flex items-center gap-1.5 text-secondary mb-1">
                  <FileText size={14} />
                  <span className="text-[11px] font-label text-outline">Notes Created</span>
                </div>
                <span className="text-lg font-headline font-semibold text-on-surface">
                  {stats?.notesCount || 0}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-high border border-outline-variant/60">
                <div className="flex items-center gap-1.5 text-outline mb-1">
                  <Activity size={14} />
                  <span className="text-[11px] font-label text-outline">Logs Recorded</span>
                </div>
                <span className="text-lg font-headline font-semibold text-on-surface">
                  {stats?.logsCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Time Analytics / Task Breakdown */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-label font-semibold text-on-surface flex items-center gap-2">
              <TrendingUp size={16} className="text-tertiary" /> Time Allocation by Task
            </h2>

            {timeBreakdown.length === 0 ? (
              <div className="p-6 text-center text-xs text-outline bg-surface-container-high/30 rounded-lg border border-outline-variant/40">
                No tracked time recorded for tasks in this workspace yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {timeBreakdown.map(t => {
                  const pct = Math.min(100, Math.round(((t.totalTime || 0) / (stats?.totalProjectTime || 1)) * 100))
                  return (
                    <div key={t.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-body">
                        <span className="text-on-surface truncate max-w-md">{t.title}</span>
                        <span className="text-outline font-mono">{formatTimeStr(t.totalTime)} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-tertiary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Section 4: Archived Tasks Section */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-label font-semibold text-on-surface flex items-center gap-2">
                <Archive size={16} className="text-outline" /> Archived & Completed Task History
              </h2>
              <span className="text-xs text-outline font-label">
                {archivedTasks.length} Task{archivedTasks.length !== 1 ? 's' : ''}
              </span>
            </div>

            {archivedTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-outline bg-surface-container-high/30 rounded-lg border border-outline-variant/40">
                No archived or completed tasks recorded for this workspace.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                {archivedTasks.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded bg-surface-container-high border border-outline-variant/50 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 size={14} className={t.status === 'archived' ? 'text-outline' : 'text-primary'} />
                      <span className={`truncate font-body ${t.status === 'archived' ? 'text-outline line-through' : 'text-on-surface'}`}>
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-outline">{formatTimeStr(t.totalTime)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-label uppercase ${t.status === 'archived' ? 'bg-surface-variant text-outline' : 'bg-primary/10 text-primary'}`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3 & 5: Activity Timeline & Complete Log History */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-sm font-label font-semibold text-on-surface flex items-center gap-2">
                <Activity size={16} className="text-primary" /> Workspace Activity Log History
              </h2>

              {/* Log filter dropdown */}
              <div className="flex items-center gap-1.5 text-xs font-label">
                <span className="text-outline">Filter:</span>
                <select
                  value={logFilter}
                  onChange={e => setLogFilter(e.target.value)}
                  className="px-2 py-1 rounded bg-surface-container-high text-xs text-on-surface border border-outline-variant focus:outline-none"
                >
                  <option value="all">All Logs</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
            </div>

            {activityTimeline.length === 0 ? (
              <div className="p-6 text-center text-xs text-outline bg-surface-container-high/30 rounded-lg border border-outline-variant/40">
                No activity logs recorded matching the selected filter.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto hide-scrollbar">
                {activityTimeline.map((l, idx) => (
                  <div key={l.id || idx} className="flex items-start gap-3 text-xs p-2.5 rounded bg-surface-container-high/50 border border-outline-variant/30">
                    <span className="text-[10px] font-mono text-outline shrink-0 mt-0.5">{l.timestamp || 'Recorded'}</span>
                    <span className="text-on-surface font-body flex-1">{l.message}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-label shrink-0 ${l.type === 'success' ? 'bg-tertiary/15 text-tertiary' : l.type === 'warning' ? 'bg-error/15 text-error' : 'bg-primary/15 text-primary'}`}>
                      {l.type || 'info'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1-Column Section (Section 2 & Section 6: Workspace Statistics & History) */}
        <div className="space-y-6">

          {/* Section 2: Project Breakdown Stats */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-label font-semibold text-on-surface flex items-center gap-2">
              <Layers size={16} className="text-secondary" /> Workspace Statistics
            </h2>

            <div className="space-y-3 text-xs font-body">
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Total Tasks</span>
                <span className="font-semibold text-on-surface">{stats?.totalTasks || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Active Todo Tasks</span>
                <span className="font-semibold text-on-surface">{stats?.todoCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Tasks In Progress</span>
                <span className="font-semibold text-tertiary">{stats?.doingCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Blocked Tasks</span>
                <span className="font-semibold text-error">{stats?.blockedCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Completed Tasks</span>
                <span className="font-semibold text-primary">{stats?.doneCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Archived Tasks</span>
                <span className="font-semibold text-outline flex items-center gap-1"><Archive size={12} /> {stats?.archivedCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Markdown Notes</span>
                <span className="font-semibold text-on-surface">{stats?.notesCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Terminal Commands</span>
                <span className="font-semibold text-on-surface">{stats?.commandsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/40">
                <span className="text-outline">Resources & Links</span>
                <span className="font-semibold text-on-surface">{stats?.resourcesCount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-outline">Total Focus Time</span>
                <span className="font-semibold text-tertiary">{formatTimeStr(stats?.totalProjectTime || 0)}</span>
              </div>
            </div>
          </div>

          {/* Section 6: Workspace History & Recent Workspaces */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-label font-semibold text-on-surface flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> Workspace History & Switcher
            </h2>

            <div className="space-y-2">
              {recentWorkspaces.map(p => {
                const isCurrent = String(p.id) === String(project?.id)
                const pTaskCount = (p.tasks || []).length
                const pDoneCount = (p.tasks || []).filter(t => t.status === 'done' || t.status === 'archived').length
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id)
                      onProjectSwitch?.(p.id)
                    }}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${isCurrent ? 'bg-primary-container/20 border-primary' : 'bg-surface-container-high border-outline-variant/60 hover:bg-surface-variant'}`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-semibold text-on-surface truncate">{p.name}</div>
                      <div className="text-[10px] text-outline mt-0.5 flex items-center gap-2">
                        <span>{pDoneCount}/{pTaskCount} tasks done</span>
                        <span>•</span>
                        <span>{(p.notes || []).length} notes</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className={isCurrent ? 'text-primary shrink-0' : 'text-outline shrink-0'} />
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
