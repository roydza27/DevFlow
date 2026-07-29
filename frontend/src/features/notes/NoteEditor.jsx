import { useState, useEffect, useRef } from 'react'
import { Eye, Edit3 } from 'lucide-react'

// Line-by-line GFM Markdown parser supporting Tables, Headers, Code Blocks, Lists, Blockquotes & Formatting
function parseMarkdown(md = '') {
  if (!md.trim()) return '<p class="text-outline italic">Empty note...</p>'

  const lines = md.split('\n')
  const out = []
  let inCode = false
  let codeBuffer = []
  let inTable = false
  let tableRows = []

  function flushTable() {
    if (!inTable || tableRows.length === 0) return
    inTable = false

    const rows = tableRows.map(r => r.trim())
    tableRows = []

    if (rows.length < 1) return

    // Extract headers (row 0)
    const headers = rows[0]
      .split('|')
      .map(c => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)

    // Skip separator row if present (row 1 containing ---)
    let startIdx = 1
    if (rows[1] && rows[1].includes('---')) {
      startIdx = 2
    }

    // Extract body rows
    const bodyRows = rows.slice(startIdx).map(row => {
      return row
        .split('|')
        .map(c => c.trim())
        .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
    })

    const headHtml = `<thead><tr class="bg-surface-container-high border-b border-outline-variant/60">${headers.map(h => `<th class="px-3 py-2 text-left text-xs font-semibold text-primary font-mono uppercase tracking-wider">${formatInline(h)}</th>`).join('')}</tr></thead>`

    const bodyHtml = `<tbody>${bodyRows.map(r => `<tr class="border-b border-outline-variant/30 hover:bg-surface-container-high/40 transition-colors">${r.map(c => `<td class="px-3 py-2 text-xs text-on-surface font-mono">${formatInline(c)}</td>`).join('')}</tr>`).join('')}</tbody>`

    out.push(`<div class="overflow-x-auto my-4 rounded-lg border border-outline-variant/50"><table class="w-full text-left border-collapse">${headHtml}${bodyHtml}</table></div>`)
  }

  function formatInline(text = '') {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/`([^`]+)`/g, '<code class="bg-surface-container-high px-1.5 py-0.5 rounded text-xs font-mono text-tertiary">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-on-surface">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="font-bold text-on-surface">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-on-surface-variant">$1</em>')
      .replace(/_(.*?)_/g, '<em class="italic text-on-surface-variant">$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-on-primary-container">$1</a>')
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const trimmed = rawLine.trim()

    // 1. Code blocks (```)
    if (trimmed.startsWith('```')) {
      if (inTable) flushTable()
      if (inCode) {
        inCode = false
        out.push(`<pre class="bg-surface-container-high p-3 rounded-lg border border-outline-variant/60 font-mono text-xs overflow-x-auto my-3 text-tertiary"><code>${codeBuffer.join('\n')}</code></pre>`)
        codeBuffer = []
      } else {
        inCode = true
      }
      continue
    }

    if (inCode) {
      codeBuffer.push(rawLine.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
      continue
    }

    // 2. Tables (| col | col |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true
      tableRows.push(trimmed)
      continue
    } else if (inTable) {
      flushTable()
    }

    // 3. Horizontal rules (---)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      out.push('<hr class="my-4 border-outline-variant/50" />')
      continue
    }

    // 4. Headers (# H1, ## H2, ### H3, #### H4)
    if (trimmed.startsWith('# ')) {
      out.push(`<h1 class="text-xl font-extrabold text-primary mt-6 mb-3 border-b border-primary/30 pb-1">${formatInline(trimmed.slice(2))}</h1>`)
      continue
    }
    if (trimmed.startsWith('## ')) {
      out.push(`<h2 class="text-lg font-bold text-primary mt-5 mb-2 border-b border-outline-variant/30 pb-1">${formatInline(trimmed.slice(3))}</h2>`)
      continue
    }
    if (trimmed.startsWith('### ')) {
      out.push(`<h3 class="text-base font-semibold text-on-surface mt-4 mb-1.5">${formatInline(trimmed.slice(4))}</h3>`)
      continue
    }
    if (trimmed.startsWith('#### ')) {
      out.push(`<h4 class="text-sm font-bold text-on-surface mt-4 mb-1">${formatInline(trimmed.slice(5))}</h4>`)
      continue
    }

    // 5. Blockquotes (> Quote)
    if (trimmed.startsWith('> ')) {
      out.push(`<blockquote class="border-l-4 border-primary pl-3 py-1 my-2 text-outline italic bg-primary/5 rounded-r">${formatInline(trimmed.slice(2))}</blockquote>`)
      continue
    }

    // 6. Lists (- or * or 1.)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      out.push(`<li class="ml-5 list-disc text-on-surface-variant my-0.5">${formatInline(trimmed.slice(2))}</li>`)
      continue
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s+/, '')
      out.push(`<li class="ml-5 list-decimal text-on-surface-variant my-0.5">${formatInline(text)}</li>`)
      continue
    }

    // Empty line
    if (!trimmed) {
      out.push('<div class="h-2"></div>')
      continue
    }

    // Regular paragraph
    out.push(`<p class="mb-1 leading-relaxed text-on-surface font-body">${formatInline(trimmed)}</p>`)
  }

  if (inTable) flushTable()

  return out.join('')
}

export default function NoteEditor({ note, onChange, expanded = false }) {
  const [isPreview, setIsPreview] = useState(true) // Default to Markdown preview mode for loaded notes
  const editorRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current || !note || isPreview) return
    const content = note.content ?? ''
    if (editorRef.current.innerText !== content) {
      editorRef.current.innerText = content
    }
    editorRef.current.dataset.empty = content.trim() === '' ? 'true' : 'false'
  }, [note?.id, note?.content, isPreview])

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-outline">Select or create a note</p>
      </div>
    )
  }

  function handleInput(e) {
    const text = e.currentTarget.innerText
    e.currentTarget.dataset.empty = text.trim() === '' ? 'true' : 'false'
    onChange?.(note.id, text)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      {/* View / Edit Mode Toggle Header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-outline-variant bg-surface-container/50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-label text-outline uppercase tracking-wider">
            {isPreview ? 'Preview Mode' : 'Markdown Source'}
          </span>
          {note.path && (
            <span className="text-[10px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded font-mono truncate max-w-xs">
              {note.path}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsPreview(v => !v)}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface-variant transition-colors"
        >
          {isPreview ? (
            <>
              <Edit3 size={12} />
              <span>Edit Markdown</span>
            </>
          ) : (
            <>
              <Eye size={12} />
              <span>Live Preview</span>
            </>
          )}
        </button>
      </div>

      {/* Editor or Preview Viewport */}
      {isPreview ? (
        <div
          className={`flex-1 overflow-y-auto hide-scrollbar font-body ${
            expanded ? 'px-12 py-8 text-[15px]' : 'px-6 py-4 text-sm'
          }`}
          dangerouslySetInnerHTML={{ __html: parseMarkdown(note.content) }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder="Start writing markdown notes..."
          data-empty="false"
          spellCheck={false}
          className={`note-editor flex-1 overflow-y-auto hide-scrollbar focus:outline-none text-on-surface font-mono leading-7 ${
            expanded ? 'px-12 py-8 text-[15px]' : 'px-6 py-4 text-sm'
          }`}
        />
      )}
    </div>
  )
}
