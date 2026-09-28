import type { ReactNode } from 'react'

/**
 * The shared section shell. Every one of the eleven page sections uses it, so
 * surface, vertical rhythm and the content container are defined once and
 * cannot drift apart between sections.
 *
 * `surface` is the only place the three grounds are named. Nine sections are
 * light, three are ink. Dark sections are structural punctuation, spaced apart,
 * so the page still reads as light.
 */

export type SectionSurface = 'canvas' | 'subtle' | 'ink'

const SURFACE: Record<SectionSurface, string> = {
  canvas: 'bg-canvas text-text-primary',
  subtle: 'bg-surface-subtle text-text-primary',
  ink: 'bg-ink-900 text-on-dark-primary',
}

export type SectionProps = {
  /** Section id from `sectionIds`. Doubles as the anchor target, and carries
   *  scroll-margin-top from globals.css so the sticky nav never covers the
   *  heading. */
  id: string
  surface: SectionSurface
  children: ReactNode
  /** `tight` is 80/48px, `none` lets a section own its own padding. */
  pad?: 'default' | 'tight' | 'none'
  borderTop?: boolean
  borderBottom?: boolean
  className?: string
  /** Renders a plain <div> instead of <section>, for the footer, which is a
   *  <footer> supplied by its own component. */
  as?: 'section' | 'div'
}

export function Section({
  id,
  surface,
  children,
  pad = 'default',
  borderTop = false,
  borderBottom = false,
  className = '',
  as: Tag = 'section',
}: SectionProps) {
  const padding =
    pad === 'none' ? '' : pad === 'tight' ? 'py-section-y-tight' : 'py-section-y'

  // Border colour follows the ground, so a dark section never gets a light
  // hairline across it.
  const edge = surface === 'ink' ? 'border-ink-700' : 'border-border'

  return (
    <Tag
      id={id}
      className={[
        SURFACE[surface],
        padding,
        borderTop ? `border-t ${edge}` : '',
        borderBottom ? `border-b ${edge}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="container-page">{children}</div>
    </Tag>
  )
}

/**
 * Eyebrow, h2 and supporting line. Ten sections open with this exact trio, so
 * the heading level, the eyebrow colour per surface and the paragraph measure
 * are settled in one place.
 *
 * The hero does NOT use this: its proposition is the page's only h1.
 */
export type SectionHeadingProps = {
  eyebrow: string
  heading: string
  sub?: string
  tone?: 'light' | 'dark'
  /** Centres the block. Permitted in S11 only, which is the one section where
   *  centred text is allowed. */
  align?: 'start' | 'center'
  /** Caps the heading in characters, for the few headings the handoff pins. */
  headingMaxCh?: number
  className?: string
}

export function SectionHeading({
  eyebrow,
  heading,
  sub,
  tone = 'light',
  align = 'start',
  headingMaxCh,
  className = '',
}: SectionHeadingProps) {
  // Eyebrows are brand-600 on light and brand-400 on dark. Never mixed.
  const eyebrowColour = tone === 'dark' ? 'text-brand-400' : 'text-brand-600'
  const subColour = tone === 'dark' ? 'text-on-dark-secondary' : 'text-text-secondary'
  const centred = align === 'center'

  return (
    <div
      className={[
        'flex flex-col gap-4',
        centred ? 'items-center text-center' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className={`text-eyebrow uppercase ${eyebrowColour}`}>{eyebrow}</p>
      <h2
        className="text-h2 font-display"
        style={headingMaxCh ? { maxWidth: `${headingMaxCh}ch` } : undefined}
      >
        {heading}
      </h2>
      {sub ? (
        <p className={`text-body-lg max-w-measure ${subColour} ${centred ? 'mx-auto' : ''}`}>
          {sub}
        </p>
      ) : null}
    </div>
  )
}
