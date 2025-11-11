import { useState } from 'react'

interface AuthScreenProps {
  mode: 'login' | 'signup'
  onSwitchMode: (mode: 'login' | 'signup') => void
  onAuthenticate: (profile: { name: string; email: string }) => void
  onContinueAsGuest: () => void
}

interface FormState {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const initialState: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export function AuthScreen({ mode, onSwitchMode, onAuthenticate, onContinueAsGuest }: AuthScreenProps) {
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setError(null)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.email || !form.password) {
      setError('Add your email and a password to continue.')
      return
    }
    if (mode === 'signup') {
      if (!form.name.trim()) {
        setError('Let us know your name so the workspace feels personal.')
        return
      }
      if (form.password.length < 6) {
        setError('Choose a password with at least 6 characters.')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('The passwords do not match. Try again.')
        return
      }
    }

    const profileName = mode === 'signup' ? form.name.trim() : form.email.split('@')[0] || 'Guest'
    onAuthenticate({ name: profileName, email: form.email.trim().toLowerCase() })
    setForm(initialState)
  }

  return (
    <div className="auth-screen">
      <section className="auth-panel" aria-live="polite">
        <header className="auth-panel__header">
          <h1>PULSE CRM</h1>
          <p>Operational clarity for product-led teams.</p>
        </header>

        <nav className="auth-tabs" aria-label="Select authentication mode">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => onSwitchMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => onSwitchMode('signup')}
          >
            Create workspace
          </button>
        </nav>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <label>
              Full name
              <input
                type="text"
                value={form.name}
                onChange={handleInputChange('name')}
                placeholder="Ada Lovelace"
                autoComplete="name"
                required
              />
            </label>
          )}
          <label>
            Work email
            <input
              type="email"
              value={form.email}
              onChange={handleInputChange('email')}
              placeholder="team@pulsecrm.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={handleInputChange('password')}
              placeholder="••••••••"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
            />
          </label>
          {mode === 'signup' && (
            <label>
              Confirm password
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                placeholder="Repeat password"
                autoComplete="new-password"
                required
              />
            </label>
          )}
          {error && <p className="auth-form__error">{error}</p>}
          <button type="submit" className="primary-btn auth-form__submit">
            {mode === 'signup' ? 'Create my workspace' : 'Log in'}
          </button>
        </form>

        <section className="auth-hints">
          <h2>Workspace checklist</h2>
          <ul>
            <li>Invite your revenue, finance, and people teams.</li>
            <li>Define pipeline stages that match your deal reviews.</li>
            <li>Sync calendar reminders so approvals never slip.</li>
            <li>Turn on notification summaries for daily highlights.</li>
          </ul>
          <button type="button" className="ghost-btn ghost-btn--pill auth-guest" onClick={onContinueAsGuest}>
            Explore as guest
          </button>
        </section>
      </section>

      <aside className="auth-sidebar">
        <h2>Why teams choose Pulse</h2>
        <ul>
          <li>
            Unified dashboards that surface sales, finance, and people health in one command center.
          </li>
          <li>
            Drag-and-drop widgets, quick capture shortcuts, and context panels designed for momentum.
          </li>
          <li>
            Granular guidance for first-time users so no one gets lost during onboarding.
          </li>
        </ul>
      </aside>
    </div>
  )
}


