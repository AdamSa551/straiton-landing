import type { ReactNode } from 'react'

import { Tag } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/content/landing'

/**
 * The five card shells, per design system 5.3.
 *
 * Three of the five share one geometry: 1px `--border`, `--radius-lg` and
 * `--space-card-pad`. `Panel` and `ResourceCard` are the two exceptions and
 * each says why inline.
 *
 * A note on the class names: the colour group in `tailwind.config.ts` is
 * called `text`, so a text colour reads `text-text-muted`, and a font size
 * reads `text-caption`. The doubling is correct, not a typo.
 *
 * Tone. Only `FeatureCard` takes one. 02-COMPONENTS.md pins a dark rule for
 * that variant by name, "on dark, feature card captions and datalabels use
 * --on-dark-secondary, not --on-dark-muted" per flag 05, and the components
 * board draws the dark feature card, so the branch has to exist for that rule
 * to be implementable at all. The same board draws no dark fact, step,
 * resource or panel, so those four stay light only rather than shipping
 * branches nothing specifies. The dark shell in S04 is that section's own
 * container rather than a card: it holds a header row, the SpecTable and a
 * caption block on an --ink-700 rule, which is not this component's shape.
 */

export type CardTone = 'light' | 'dark'

/**
 * Geometry for the cards in the set. The fill and the border colour arrive
 * per card, not from here, so a tone can replace them without two
 * border-colour utilities competing over which one the stylesheet emits last.
 */
const CARD_SHELL = 'rounded-lg border p-card-pad'

/* ------------------------------------------------------------------ fact --- */

export type FactCardProps = {
  icon: IconName
  label: string
  value: string
}

/**
 * S03 corridor facts. `min-h-fact` is what keeps the 3x2 grid on a shared
 * baseline: the six values differ in length by more than two lines, and
 * without a floor the row heights would step visibly.
 *
 * The icon stays `--brand-500`, which 01-FOUNDATIONS.md rates at 2.8:1 on
 * white and marks non-text only. It is decoration here, the label and the
 * value carry the fact, so the 3:1 graphical floor does not apply to it.
 */
export function FactCard({ icon, label, value }: FactCardProps): JSX.Element {
  return (
    <div className={`${CARD_SHELL} flex min-h-fact flex-col gap-3 border-border bg-canvas`}>
      <Icon name={icon} size={24} className="text-brand-500" />
      <span className="text-datalabel uppercase text-text-muted">{label}</span>
      {/* mt-auto, not a spacer: the value sits on the card's bottom edge so
          the six values align across the grid regardless of label length. */}
      <span className="mt-auto text-h4 text-text-primary">{value}</span>
    </div>
  )
}

/* --------------------------------------------------------------- feature --- */

export type FeatureCardProps = {
  title: string
  items: readonly string[]
  caption: string
  listIcon: 'check' | 'cross'
  surface: 'canvas' | 'subtle'
  /**
   * Optional, defaults to `light`, which is the only tone S06 renders. `dark`
   * is the components board treatment. It ignores `surface`, because on ink
   * both cards of the pair fill `--ink-800` and the comparison is carried by
   * order and by the two titles instead of by two fills.
   */
  tone?: CardTone
}

/** Card A is canvas and card B is subtle, so the pair reads as a comparison
 *  without needing a divider between them. */
const FEATURE_SURFACE: Record<FeatureCardProps['surface'], string> = {
  canvas: 'border-border bg-canvas',
  subtle: 'border-border bg-surface-subtle',
}

type FeatureToneStyles = {
  title: string
  item: string
  rule: string
  caption: string
  glyph: Record<FeatureCardProps['listIcon'], string>
}

/**
 * The cross list is things that do NOT happen, so it must not read as a
 * second list of positives. The shape of the glyph carries that on both
 * tones. On light the muted stroke reinforces it, so check against cross is
 * never hue alone.
 */
const FEATURE_TONE: Record<CardTone, FeatureToneStyles> = {
  light: {
    title: 'text-text-primary',
    item: 'text-text-secondary',
    rule: 'border-border',
    caption: 'text-text-muted',
    glyph: { check: 'text-brand-600', cross: 'text-text-muted' },
  },
  dark: {
    title: 'text-on-dark-primary',
    item: 'text-on-dark-secondary',
    rule: 'border-ink-700',
    // Flag 05. --on-dark-muted measures 4.44:1 on an --ink-800 ground and
    // fails, so the caption steps up to --on-dark-secondary at 8.1:1. The
    // board still draws the muted token here. Do not move it back.
    caption: 'text-on-dark-secondary',
    // --brand-600 measures 2.7:1 on --ink-800 and misses the 3:1 graphical
    // floor, so both glyphs step to --brand-400 at 7.1:1, which is what the
    // board draws. The check against cross distinction stays one of shape.
    glyph: { check: 'text-brand-400', cross: 'text-brand-400' },
  },
}

/**
 * S06 payment readiness. The title is an `h3`: these two are the only `h3`s
 * on the page, and the verified heading order (H1, H2x4, H3x2, H2x6) depends
 * on them, so a card title elsewhere must not become a heading.
 */
export function FeatureCard({
  title,
  items,
  caption,
  listIcon,
  surface,
  tone = 'light',
}: FeatureCardProps): JSX.Element {
  const t = FEATURE_TONE[tone]
  const shell = tone === 'dark' ? 'border-ink-700 bg-ink-800' : FEATURE_SURFACE[surface]

  return (
    <div className={`${CARD_SHELL} ${shell} flex h-full flex-col gap-5`}>
      {/* `font-display` is not decoration here. The design system sets the
          display face at 28px and above, and `text-h3` tops out at 28px, so
          without it these two card titles were the only headings at that size
          on the page set in the body face. */}
      <h3 className={`text-h3 font-display ${t.title}`}>{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className={`flex items-start gap-3 text-body ${t.item}`}>
            {/* items-start plus mt-1 sits the glyph on the first line's cap
                height rather than centring it on a wrapped two-line item.
                Heavy stroke because a 1.5px check reads as decoration next to
                16px body copy. */}
            <Icon
              name={listIcon}
              size={20}
              weight="heavy"
              className={`mt-1 shrink-0 ${t.glyph[listIcon]}`}
            />
            {item}
          </li>
        ))}
      </ul>
      {/* Pinned with mt-auto so both captions sit on the same line even though
          card B carries five longer items than card A. */}
      <p className={`mt-auto border-t ${t.rule} pt-4 text-caption ${t.caption}`}>{caption}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ step --- */

export type StepCardProps = {
  index: string
  title: string
  body: string
  tag: string
}

/** S07 how it works. h-full so the four cards stretch to equal height in the
 *  stretch grid, which is what lets the tags line up. */
export function StepCard({ index, title, body, tag }: StepCardProps): JSX.Element {
  return (
    <div className={`${CARD_SHELL} flex h-full flex-col gap-4 border-border bg-canvas`}>
      <span className="font-mono text-caption text-brand-600">{index}</span>
      <span className="text-h4 text-text-primary">{title}</span>
      <p className="text-body text-text-secondary">{body}</p>
      {/* The wrapper takes mt-auto so the Tag keeps its own intrinsic width
          instead of stretching across the card. */}
      <div className="mt-auto">
        <Tag label={tag} />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- resource --- */

export type ResourceCardProps = {
  index: string
  title: string
  href: string
}

/**
 * S10 guides. A `resource` is a ROW inside the guides card, not a card of its
 * own. 03-SECTIONS.md gives the S10 guides container the `--surface-subtle`
 * fill, the 1px `--border`, the `--radius-lg` and `overflow: hidden`, then
 * puts four resource rows inside it, and the components board draws them
 * flush, separated by a 1px `--border` bottom rule. So this row carries no
 * fill, no radius and no outer border, only its own bottom rule, and it
 * inherits the container's ground. Giving each row its own bordered canvas
 * card renders four nested boxes inside that container, which is not the
 * drawn design.
 *
 * The whole row is the anchor, so the hit target is the row and not just the
 * title, and `min-h-row` holds it at 56px, well past the 44px minimum.
 *
 * Hover lifts the row's rule to `--border-strong` and changes nothing else.
 * No fill change, no underline, no arrow translate, no padding change: per
 * 02-COMPONENTS.md the row must not reflow under the pointer. The components
 * board draws a fill, an underline and a 2px arrow shift on hover, and the
 * prose rule overrides it, so this follows the prose.
 *
 * `rounded-sm` arrives on focus only, which is how the board draws the focus
 * row, so the ring reads as deliberate against an otherwise square row.
 * Border radius does not reflow anything, so the no-shift rule still holds.
 *
 * The arrow is a text character in its own aria-hidden span, per the icon set
 * note. It is decoration; the title is the accessible name.
 */
export function ResourceCard({ index, title, href }: ResourceCardProps): JSX.Element {
  return (
    <a
      href={href}
      /* shadow-focus is added, never substituted: the global :focus-visible
         outline in globals.css supplies the solid 2px ring at 2px offset and
         is deliberately left in place. */
      className="flex min-h-row items-center gap-4 border-b border-b-border p-card-pad no-underline transition-colors duration-fast ease-out hover:border-b-border-strong focus-visible:rounded-sm focus-visible:shadow-focus"
    >
      <span className="shrink-0 font-mono text-caption text-text-muted">{index}</span>
      <span className="flex-1 text-body font-semibold text-text-primary">{title}</span>
      <span aria-hidden="true" className="ml-auto shrink-0 text-body text-brand-600">
        &#8594;
      </span>
    </a>
  )
}

/* ----------------------------------------------------------------- panel --- */

export type PanelProps = {
  children: ReactNode
  className?: string
}

/**
 * The hero assessment form container.
 *
 * `shadow-float` is rationed: this panel and the S09 workspace illustration
 * frame are the ONLY two elements on the page permitted to use it. Every
 * other raised-looking surface gets the 1px border and nothing more. Adding a
 * third float breaks the page's single point of elevation.
 *
 * Also the only card on `--radius-xl` rather than `--radius-lg`, because it is
 * a container for a form rather than a card in a set. Light only: the board
 * draws it for S01, which is a canvas section, and a dark panel would have to
 * drop the rationed float that defines the variant.
 */
export function Panel({ children, className }: PanelProps): JSX.Element {
  return (
    <div
      className={`rounded-xl border border-border bg-canvas p-card-pad shadow-float${
        className ? ` ${className}` : ''
      }`}
    >
      {children}
    </div>
  )
}
