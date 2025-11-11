import { useState } from 'react'
import type { SectionId } from '../types'

export interface OnboardingStep {
  id: string
  title: string
  section: SectionId
  summary: string
  highlights: string[]
  cta?: string
}

interface OnboardingGuideProps {
  steps: OnboardingStep[]
  onNavigate: (section: SectionId) => void
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingGuide({ steps, onNavigate, onComplete, onSkip }: OnboardingGuideProps) {
  const [index, setIndex] = useState(0)
  const current = steps[index]
  const total = steps.length

  const goToStep = (nextIndex: number) => {
    const clamped = Math.min(total - 1, Math.max(0, nextIndex))
    setIndex(clamped)
    onNavigate(steps[clamped].section)
  }

  const handleNext = () => {
    if (index === total - 1) {
      onComplete()
      return
    }
    goToStep(index + 1)
  }

  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="pulse-onboarding-title">
      <div className="onboarding-panel">
        <header className="onboarding-header">
          <div>
            <p className="onboarding-kicker">Welcome to Pulse CRM</p>
            <h2 id="pulse-onboarding-title">{current.title}</h2>
            <p className="onboarding-summary">{current.summary}</p>
          </div>
          <button type="button" className="ghost-btn ghost-btn--pill" onClick={onSkip}>
            Skip tour
          </button>
        </header>

        <ol className="onboarding-list">
          {current.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ol>

        <footer className="onboarding-footer">
          <div className="onboarding-progress" aria-hidden>
            {steps.map((step, stepIndex) => (
              <button
                key={step.id}
                type="button"
                className={`onboarding-progress__dot ${stepIndex === index ? 'onboarding-progress__dot--active' : ''}`}
                onClick={() => goToStep(stepIndex)}
              >
                <span className="visually-hidden">Go to {step.title}</span>
              </button>
            ))}
          </div>
          <button type="button" className="primary-btn" onClick={handleNext}>
            {index === total - 1 ? 'Finish tour' : current.cta ?? 'Next'}
          </button>
        </footer>
      </div>
    </div>
  )
}


