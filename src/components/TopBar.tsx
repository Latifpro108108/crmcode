import { RiLogoutBoxLine, RiMenuLine, RiNotification3Line, RiQuestionLine, RiRefreshLine, RiSearchLine } from 'react-icons/ri'
import type { AppSection } from '../types'

interface TopBarProps {
  activeSection: AppSection
  onOpenNotifications: () => void
  userName: string
  onShowHelp: () => void
  onResetTour: () => void
  onSignOut: () => void
}

const getInitials = (name: string) => {
  if (!name) return 'JD'
  return name
    .split(' ')
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TopBar({ activeSection, onOpenNotifications, userName, onShowHelp, onResetTour, onSignOut }: TopBarProps) {
  return (
    <header className="topbar" role="banner">
      <div className="topbar__left">
        <button className="topbar__menu" type="button" aria-label="Toggle navigation">
          <RiMenuLine aria-hidden size={20} />
        </button>
        <div>
          <h1 className="topbar__title">{activeSection.label}</h1>
          <p className="topbar__subtitle">{activeSection.description}</p>
        </div>
      </div>
      <form className="topbar__search" role="search">
        <label className="visually-hidden" htmlFor="global-search">
          Search clients, deals, or documents
        </label>
        <RiSearchLine aria-hidden size={20} />
        <input
          id="global-search"
          name="search"
          type="search"
          placeholder="Search clients, deals, or documents"
          aria-label="Search CRM"
        />
      </form>
      <div className="topbar__actions">
        <button type="button" className="topbar__action" onClick={onOpenNotifications}>
          <RiNotification3Line aria-hidden size={20} />
          Notifications
        </button>
        <button type="button" className="topbar__action" aria-label="Get help" onClick={onShowHelp}>
          <RiQuestionLine aria-hidden size={20} />
          Help
        </button>
        <button type="button" className="topbar__action" onClick={onResetTour}>
          <RiRefreshLine aria-hidden size={20} />
          Reset tour
        </button>
        <button type="button" className="topbar__action" onClick={onSignOut}>
          <RiLogoutBoxLine aria-hidden size={20} />
          Sign out
        </button>
        <button type="button" className="topbar__avatar" aria-haspopup="menu" aria-expanded="false">
          <span className="topbar__avatar-image" aria-hidden>
            {getInitials(userName)}
          </span>
          <span className="visually-hidden">Open profile menu</span>
        </button>
      </div>
    </header>
  )
}

