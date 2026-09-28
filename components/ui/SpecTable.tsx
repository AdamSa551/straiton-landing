import type { SpecRow } from '@/content/landing'
import { TbcChip } from '@/components/ui/Chip'

/**
 * Two column definition table. Serves S04 (dark, on the ink-800 quote card)
 * and S05 (light, inside a bordered container), in both the two column and the
 * stacked form.
 *
 * Both forms are the same DOM. One row element changes its own flex direction,
 * alignment and type role at the `table` breakpoint (620px), so there is no
 * width sniffing, no duplicated markup, and the stacked form is correct on the
 * server render as well as in print. Below 620px the table stacks into
 * label-over-value blocks. It never scrolls, in its own container or
 * otherwise, which is what the responsive checklist requires.
 *
 * Markup is a `<dl>` of `<div>` grouped `<dt>`/`<dd>` pairs. The grouping div
 * is valid inside `dl` and is what lets each pair be its own flex row while
 * the definition semantics survive. `m-0` on the `dl` and on every `dd`
 * removes the user agent margins, which globals.css resets for `p`, `ul` and
 * `ol` but not for these.
 */

type SpecTableTone = 'light' | 'dark'

export type SpecTableProps = {
  rows: readonly SpecRow[]
  tone?: SpecTableTone
}

/**
 * Per tone values. Dark labels use on-dark-secondary at both widths rather
 * than on-dark-muted: the dark table sits on an ink-800 card where the muted
 * token measures 4.4:1. See flag 05 in 01-FOUNDATIONS.md.
 */
const TONE: Record<
  SpecTableTone,
  {
    rowBorder: string
    label: string
    value: string
    highlightRow: string
    highlightLabel: string
  }
> = {
  light: {
    rowBorder: 'border-b-border',
    label: 'text-text-muted table:text-text-secondary',
    value: 'text-text-primary',
    highlightRow: 'bg-brand-100',
    highlightLabel: 'text-brand-700',
  },
  dark: {
    rowBorder: 'border-b-ink-700',
    label: 'text-on-dark-secondary',
    value: 'text-on-dark-primary',
    // The 3px left edge is required, not decorative. An ink-900 fill on an
    // ink-800 ground all but disappears under a greyscale check, so the edge
    // is what keeps the highlight legible without relying on hue.
    highlightRow: 'bg-ink-900 border-l-[3px] border-l-brand-400',
    highlightLabel: 'text-brand-400',
  },
}

/**
 * 14px block padding stacked, 8px inline padding at width, and the 14px
 * inline padding plus -14px inline margin on a highlighted row, are the three
 * off scale values section 5 specifies. The padding and the negative margin
 * are the same number on purpose: the tint bleeds to the table edge and the
 * container does not get any wider.
 */
const ROW_BASE =
  'flex flex-col flex-wrap items-start gap-1 border-b py-[14px] last:border-b-0 ' +
  'table:min-h-row table:flex-row table:items-center table:justify-between table:gap-5 table:py-2'

const HIGHLIGHT_BOX = 'rounded-sm px-[14px] -mx-[14px]'

/**
 * Stacked: datalabel in caps above the value. At width: body-sm, sentence
 * case. `table:tracking-normal` is needed because the datalabel role carries
 * 0.08em tracking and the body-sm role sets no tracking of its own, so without
 * the reset the two column label would keep the caps spacing.
 */
const LABEL_BASE =
  'text-datalabel uppercase ' +
  'table:text-body-sm table:normal-case table:tracking-normal table:max-w-[45%]'

/**
 * `table:grow` makes the value fill the rest of the line so right alignment
 * holds, including when flex-wrap drops a long value onto its own line rather
 * than letting it overflow at narrow widths.
 */
const VALUE_BASE = 'm-0 table:grow table:text-right'

export function SpecTable({ rows, tone = 'light' }: SpecTableProps): JSX.Element {
  const t = TONE[tone]

  // One highlighted row per table. If content ever flags a second, only the
  // first is tinted: two emphasised rows would leave the reader with two lines
  // competing to be the one that matters most.
  const highlightIndex = rows.findIndex((row) => row.highlight)

  return (
    <dl className="m-0 flex flex-col">
      {rows.map((row, index) => {
        const isHighlight = index === highlightIndex

        return (
          <div
            key={row.label}
            className={[
              ROW_BASE,
              t.rowBorder,
              isHighlight ? `${HIGHLIGHT_BOX} ${t.highlightRow}` : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <dt
              className={[
                LABEL_BASE,
                isHighlight ? `${t.highlightLabel} table:font-medium` : t.label,
              ].join(' ')}
            >
              {row.label}
            </dt>
            <dd
              className={[
                VALUE_BASE,
                // A tbc row hands its value position to the chip, which owns
                // its own size, weight and colour, so the value type role is
                // applied only to real values.
                row.tbc ? '' : `text-body font-semibold ${t.value}`,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {row.tbc ? <TbcChip /> : row.value}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
