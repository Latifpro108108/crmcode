import type { AppSection, ShortcutAction } from '../types'

interface ContextPanelProps {
  section: AppSection
  shortcuts: ShortcutAction[]
}

export function ContextPanel({ section, shortcuts }: ContextPanelProps) {
  return (
    <aside className="context-panel" aria-label={`${section.label} toolkit`}>
      <section className="panel-block">
        <h2>Quick Shortcuts</h2>
        <ul className="shortcut-list">
          {shortcuts.map((shortcut) => (
            <li key={shortcut.label}>
              <button type="button" onClick={shortcut.action} className="shortcut-button">
                {shortcut.label}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel-block" aria-live="polite">
        <h2>Support &amp; Resources</h2>
        <ul className="resource-list">
          <li>
            Video walkthrough: Getting started with {section.label}
          </li>
          <li>Policy updates posted 2 days ago</li>
          <li>Live chat available 8am – 8pm</li>
        </ul>
      </section>
    </aside>
  )
}

