import { Icon } from '@/components/ui/Icon'
import { landing } from '@/content/landing'

/**
 * Every chip and badge on the page, from 02-COMPONENTS.md section 4.
 *
 * All of them are non-interactive <span>s. They report state, they never change
 * it, so none carries a focus ring, a 44px target or a handler, and the file
 * needs no 'use client'. If a chip ever becomes a control, it moves to Button
 * rather than gaining an onClick here.
 *
 * Two rules govern the colour choices below and neither is cosmetic:
 *   1. No state is signalled by hue alone. Every chip that reports a state
 *      carries a glyph, so it survives greyscale and colour blindness.
 *   2. A muted text token is rated against one surface only. Stepping it onto a
 *      tinted fill requires re-rating, which is what flag 05 is about. See the
 *      TbcChip comment.
 *
 * Padding sits on the 4px spacing scale rather than on the specimen's odd
 * values (9px, 7px, 6px, 14px), which the scale does not carry. The optical
 * difference is sub-pixel at these sizes; an off-scale class would not compile.
 */

/** align-middle so a chip sitting inline beside a label baseline does not drag
 *  the line box down. shrink-0 on each glyph keeps it round when a long label
 *  wraps inside a pill at 320px. */
const BASE = 'inline-flex items-center align-middle'

/* -------------------------------------------------------------------------- */

type EligibilityChipProps = {
  label: string
  /** 'brand' is the S09 workspace treatment. S02 uses the default. */
  tint?: 'muted' | 'brand'
}

export function EligibilityChip({ label, tint = 'muted' }: EligibilityChipProps): JSX.Element {
  const tinted = tint === 'brand'
  return (
    <span
      className={`${BASE} gap-2 rounded-pill px-4 py-2 text-body-sm text-text-primary ${
        tinted ? 'bg-brand-100' : 'bg-surface-muted'
      }`}
    >
      {/* The check is what makes "this qualifies" read without colour. Heavier
          stroke because 18px hairlines disappear against a tinted fill. */}
      <Icon
        name="check"
        size={18}
        weight="heavy"
        className={`shrink-0 ${tinted ? 'text-brand-700' : 'text-brand-600'}`}
      />
      {label}
    </span>
  )
}

/* -------------------------------------------------------------------------- */

type StatusBadgeProps = { label: string }

export function StatusBadge({ label }: StatusBadgeProps): JSX.Element {
  return (
    <span
      className={`${BASE} gap-2 whitespace-nowrap rounded-pill bg-status-pilot-bg px-3 py-2 text-datalabel uppercase text-status-pilot`}
    >
      {/* The clock is load bearing. Amber on cream is the only thing separating
          this badge from a neutral one, and hue alone may not carry a state. */}
      <Icon name="clock" size={16} weight="heavy" className="shrink-0" />
      {label}
    </span>
  )
}

/* -------------------------------------------------------------------------- */

type TagProps = { label: string }

export function Tag({ label }: TagProps): JSX.Element {
  return (
    <span
      className={`${BASE} whitespace-nowrap rounded-sm bg-surface-muted px-3 py-1 text-datalabel uppercase text-text-secondary`}
    >
      {/* nowrap so 'quote + docs' cannot break across two lines in a step card. */}
      {label}
    </span>
  )
}

/* -------------------------------------------------------------------------- */

export function TbcChip(): JSX.Element {
  return (
    <span
      className={`${BASE} gap-2 rounded-sm bg-surface-muted px-3 py-2 text-caption text-text-secondary`}
    >
      {/*
        FLAG 05, required and not cosmetic. The handoff originally specced
        text-muted on surface-muted, which measures 4.29:1 and fails AA. This is
        the page's signature element: three of these carry the whole "we say what
        is not fixed yet" argument in S05, so it cannot ship failing. text-
        secondary measures 5.6:1 on the same fill and still reads clearly quieter
        than the 600 weight values beside it. Do not step this back to text-muted.
      */}
      <Icon name="question-circle" size={16} weight="heavy" className="shrink-0" />
      {landing.markers.tbc}
    </span>
  )
}

/* -------------------------------------------------------------------------- */

type IllustrativeChipProps = {
  /** 'dark' is the S04 quote table. 'light' is every other example figure. */
  tone?: 'light' | 'dark'
}

export function IllustrativeChip({ tone = 'light' }: IllustrativeChipProps): JSX.Element {
  /* The dark chip fills ink-900 rather than inheriting the ink-800 card it sits
     on, which is what keeps its brand-400 label at 8.1:1 instead of the lower
     ratio it would measure against ink-800. The ink-600 border is decorative
     only at 2.0:1; the glyph and the word carry the meaning. */
  const toned =
    tone === 'dark'
      ? 'bg-ink-900 border border-ink-600 text-brand-400'
      : 'bg-brand-100 text-brand-700'
  return (
    <span
      className={`${BASE} gap-2 whitespace-nowrap rounded-sm px-3 py-2 text-datalabel uppercase ${toned}`}
    >
      <Icon name="info-circle" size={16} weight="heavy" className="shrink-0" />
      {landing.markers.illustrative}
    </span>
  )
}

/* -------------------------------------------------------------------------- */

type TopicChipProps = { label: string }

export function TopicChip({ label }: TopicChipProps): JSX.Element {
  return (
    <span
      className={`${BASE} rounded-pill border border-ink-700 bg-ink-800 px-4 py-2 text-body-sm text-on-dark-secondary`}
    >
      {/* S08 support topics. Label only: these name what a manager can help
          with, they report no state, so there is nothing for a glyph to say. */}
      {label}
    </span>
  )
}

/* -------------------------------------------------------------------------- */

type CorridorTagProps = { kind: 'active' | 'next' }

export function CorridorTag({ kind }: CorridorTagProps): JSX.Element {
  /* Live corridor versus planned one, in the S12 list. The two differ in fill,
     weight of surround and text, not in hue alone: 'active' is a solid brand
     block, 'next' is a bordered ink block, and each says which it is in words. */
  const toned =
    kind === 'active'
      ? 'bg-brand-400 text-ink-900'
      : 'border border-ink-700 bg-ink-800 text-on-dark-secondary'
  return (
    <span className={`${BASE} whitespace-nowrap rounded-sm px-3 py-1 text-datalabel uppercase ${toned}`}>
      {kind === 'active' ? landing.footer.activeTag : landing.footer.nextTag}
    </span>
  )
}

/* -------------------------------------------------------------------------- */

export function DemoOnlyBadge(): JSX.Element {
  return (
    <span
      className={`${BASE} gap-2 whitespace-nowrap rounded-sm border border-border-strong bg-surface-muted px-3 py-2 text-datalabel uppercase text-text-secondary`}
    >
      {/* The border is the point. This badge sits on the form confirmation, the
          one place a reader could mistake the prototype for a real submission,
          so it is drawn as a hard edged object rather than a soft tint. */}
      <Icon name="info-circle" size={16} weight="heavy" className="shrink-0" />
      {landing.form.confirmation.badge}
    </span>
  )
}
