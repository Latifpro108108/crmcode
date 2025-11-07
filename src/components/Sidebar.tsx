import { RiNotification3Line, RiSettings3Line } from 'react-icons/ri'
import type { AppSection } from '../types'

interface SidebarProps {
  sections: AppSection[]
  activeSection: AppSection
  onSelectSection: (section: AppSection) => void
  onNotificationsClick: () => void
}

export function Sidebar({ sections, activeSection, onSelectSection, onNotificationsClick }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="sidebar__brand">
        <span className="sidebar__mark" aria-hidden>Pulse</span>
        <p className="sidebar__subtitle">CRM for Tech Teams</p>
      </div>
      <nav aria-label="Main sections">
        <ul className="sidebar__nav">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection.id === section.id
            return (
              <li key={section.id}>
                <button
                  type="button"
                  className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSelectSection(section)}
                >
                  <Icon aria-hidden size={20} />
                  <span className="sidebar__text">
                    <span className="sidebar__label">{section.label}</span>
                    <span className="sidebar__description">{section.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__utility"
          onClick={onNotificationsClick}
        >
          <RiNotification3Line aria-hidden size={18} />
          Notifications
        </button>
        <button type="button" className="sidebar__utility">
          <RiSettings3Line aria-hidden size={18} />
          Workspace Settings
        </button>
      </div>
    </aside>
  )
}

