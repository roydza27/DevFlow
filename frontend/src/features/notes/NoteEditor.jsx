import { useState, useEffect, useRef } from 'react'
import { Eye, Edit3 } from 'lucide-react'

// Lightweight robust Markdown parser for preview mode
function parseMarkdown(md = '') {
  if (!md.trim()) return '<p class="text-outline italic">Empty note...</p>'

  let html = md
    // Escape HTML special characters first for security
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Code blocks (```)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="bg-surface-container-high p-3 rounded-lg border border-outline-variant/60 font-mono text-xs overflow-x-auto my-3 text-tertiary"><code>${code.trim()}</code></pre>`
  })

  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-surface-container-high px-1.5 py-0.5 rounded text-xs font-mono text-tertiary">$1</code>')

  // Headers (# H1, ## H2, ### H3, #### H4)
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-sm font-bold text-on-surface mt-4 mb-1">$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-on-surface mt-4 mb-1.5">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-primary mt-5 mb-2 border-b border-outline-variant/30 pb-1">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-primary mt-6 mb-3 border-b border-primary/30 pb-1">$1</h1>')

  // Blockquotes (> Quote)
  html = html.replace(/^\&gt; (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-3 py-1 my-2 text-outline italic bg-primary/5 rounded-r">$1</blockquote>')

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-on-surface">$1</strong>')
  html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-on-surface">$1</strong>')

  // Italic (*text* or _text_)
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-on-surface-variant">$1</em>')
  html = html.replace(/_(.*?)_/g, '<em class="italic text-on-surface-variant">$1</em>')

  // Links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-on-primary-container">$1</a>')

  // Unordered lists (- or *)
  html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li class="ml-5 list-disc text-on-surface-variant my-0.5">$1</li>')

  // Ordered lists (1. 2.)
  html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-5 list-decimal text-on-surface-variant my-0.5">$1</li>')

  // Horizontal rules (--- or ***)
  html = html.replace(/^(\-\-\-|[*]{3})$/gim, '<hr class="my-4 border-outline-variant/50" />')

  // Paragraph breaks & line breaks
  const paragraphs = html
    .split(/\n\n+/)
    .map(p => {
      p = p.trim()
      if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<blockquote') || p.startsWith('<li') || p.startsWith('<hr')) {
        return p
      }
      return `<p class="mb-2 leading-relaxed text-on-surface font-body">${p.replace(/\n/g, '<br />')}</p>`
    })
    .join('')

  return paragraphs
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
