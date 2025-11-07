import { RiCheckboxCircleLine, RiErrorWarningLine, RiInformationLine } from 'react-icons/ri'
import type { NotificationItem } from '../types'
import { notifications } from '../data/mockData'

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const iconMap: Record<NotificationItem['type'], JSX.Element> = {
  info: <RiInformationLine aria-hidden size={20} />,
  warning: <RiErrorWarningLine aria-hidden size={20} />,
  success: <RiCheckboxCircleLine aria-hidden size={20} />
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  return (
    <div
      className={`notification-drawer ${isOpen ? 'notification-drawer--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-title"
    >
      <div className="notification-drawer__header">
        <div>
          <h2 id="notification-title">Updates &amp; Alerts</h2>
          <p>Contextual nudges based on your recent activity.</p>
        </div>
        <button type="button" onClick={onClose} className="notification-drawer__close">
          Close
        </button>
      </div>
      <ul className="notification-list">
        {notifications.map((item) => (
          <li key={item.id} className={`notification notification--${item.type}`}>
            <span className="notification__icon">{iconMap[item.type]}</span>
            <div>
              <p className="notification__title">{item.title}</p>
              <p className="notification__message">{item.message}</p>
              <span className="notification__time">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

