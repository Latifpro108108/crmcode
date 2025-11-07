import type { AppSection } from '../types'

interface GuidanceBannerProps {
  section: AppSection
  focus: {
    title: string
    summary: string
    highlights: string[]
  }
}

export function GuidanceBanner({ section, focus }: GuidanceBannerProps) {
  return (
    <div className="guidance-banner" role="status" aria-live="polite">
      <div className="guidance-banner__label">
        <span>{focus.title}</span>
        <span className="guidance-banner__tag">{section.label}</span>
      </div>
      <p className="guidance-banner__summary">{focus.summary}</p>
      <ul className="guidance-banner__highlights">
        {focus.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

