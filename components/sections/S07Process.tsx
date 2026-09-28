import { Fragment } from 'react'

import { Button } from '@/components/ui/Button'
import { StepCard } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Section, SectionHeading } from '@/components/ui/Section'
import { landing, sectionIds } from '@/content/landing'

/**
 * Position 6 on the page, `S07-process`.
 *
 * Three layout variants, all pure CSS, from ONE list of four steps. The
 * restructuring is done by the grid and by two decorations that are present in
 * the DOM at every width and displayed only at the width they belong to:
 *
 *   below 620px   the container is a single column. Each step is a flex row:
 *                 the rail marker on the left, the card on the right.
 *   620 to 1100   `table:hidden` drops the rail marker, so each step collapses
 *                 to its card alone and the container becomes the 2x2 grid.
 *   1100px and up `process:flex` reveals the three arrow cells, which then take
 *                 the three `auto` tracks of the 7-cell grid.
 *
 * Why this works rather than branching the markup: the arrow cells are already
 * interleaved between the steps in source order, so when they switch from
 * `display: none` to `display: flex` they land in cells 2, 4 and 6 of
 * `1fr auto 1fr auto 1fr auto 1fr` without anything moving. A `display: none`
 * grid item generates no box at all, so at the two narrower widths the grid
 * sees exactly four children.
 *
 * Reading order is card 01 to card 04 at all three widths, because that is the
 * source order and no variant reorders anything. Both decorations carry
 * `aria-hidden`, so the connector and the arrows are absent from the
 * accessibility tree at every width.
 *
 * One ordering hazard, checked rather than assumed: `tailwind.config.ts` lists
 * `process` (1100px) before `table` (620px), and `process:gap-0` has to beat
 * `table:gap-5` above 1100px. Tailwind sorts screens by min-width when it emits
 * them, so the 620px block is written first and the 1100px block second, and
 * the override lands the right way round.
 *
 * Server component. Nothing here holds state, and no width is ever read in JS.
 */
export default function S07Process(): JSX.Element {
  const flow = landing.process
  const lastStep = flow.steps.length - 1

  return (
    <Section id={sectionIds.process} surface="subtle" borderTop>
      <div className="flex flex-col gap-block">
        {/* No `sub`: this section opens on the eyebrow and the h2 alone. 22ch is
            the cap the handoff pins on this heading. */}
        <SectionHeading eyebrow={flow.eyebrow} heading={flow.h2} headingMaxCh={22} />

        {/* Exactly two columns between 620 and 1100, not an auto-fit track list.
            The handoff quotes both "a plain 2x2 grid" and an auto-fit formula
            with a 240px floor, and the two disagree: auto-fit admits a third
            track once the content box passes 760px, which is a viewport of
            roughly 910px, and four steps then render as three plus an orphan.
            A numbered sequence reads worse that way, and the responsive
            checklist asks for the sequence to stay legible, so the stated
            intent wins over the stated formula. */}
        <div className="grid grid-cols-1 table:grid-cols-2 table:gap-5 process:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] process:items-stretch process:gap-0">
          {flow.steps.map((step, i) => {
            const isLast = i === lastStep

            return (
              <Fragment key={step.index}>
                <div className="flex items-stretch gap-4">
                  {/*
                    The rail. Decoration at every width, so the whole column is
                    aria-hidden: the card already carries the step number, and
                    the connector says nothing a reading order does not.

                    The circle is a fixed 32px square on `--radius-pill`. The
                    line takes the height the circle leaves, which is why the
                    column has to stretch, and it is omitted on the last step so
                    the rail terminates instead of trailing off.
                  */}
                  <div
                    aria-hidden="true"
                    className="flex w-8 shrink-0 flex-col items-center table:hidden"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-border-field bg-canvas font-mono text-caption text-brand-600">
                      {step.index}
                    </span>
                    {isLast ? null : (
                      <span className="min-h-4 w-px flex-1 bg-border-strong" />
                    )}
                  </div>

                  {/*
                    The card's 16px bottom margin lives on this wrapper, which is
                    also what makes the rail continuous: a flex line is sized
                    from its items' OUTER heights, so the marker column stretches
                    16px past the card and the line arrives at the next circle
                    with no break. It goes at `table:` and above, where the cards
                    are grid tracks and the grid owns the spacing.

                    `min-w-0` lets the track shrink under its content instead of
                    pushing the page wide at 320px. `flex-1` is what fills the
                    row once the marker is hidden.
                  */}
                  <div className="mb-4 min-w-0 flex-1 table:mb-0">
                    <StepCard
                      index={step.index}
                      title={step.title}
                      body={step.body}
                      tag={step.tag}
                    />
                  </div>
                </div>

                {/*
                  Arrow cell. Hidden below 1100px, and a 40px flex cell above it,
                  which is what sizes the `auto` track. The glyph is the text
                  character in its own span, never an icon, per the icon set
                  note. 18px has no type role of its own, so it is spelled out.
                */}
                {isLast ? null : (
                  <span
                    aria-hidden="true"
                    className="hidden w-10 items-center justify-center text-[18px] leading-none text-border-strong process:flex"
                  >
                    &#8594;
                  </span>
                )}
              </Fragment>
            )
          })}
        </div>

        {/*
          Support bar. One row that wraps: the line and its icon stay together on
          the left, the link drops beneath them when there is no room.
        */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-canvas p-card-pad">
          <p className="flex items-center gap-3 text-body text-text-primary">
            <Icon name="headset" size={22} className="shrink-0 text-brand-600" />
            {flow.supportBar.text}
          </p>
          {/*
            `link` deliberately carries no height or type size of its own, so the
            44px minimum target and the 15px button role are added here rather
            than by reaching for a sized variant the handoff did not draw. The
            focus ring comes with the variant.
          */}
          <Button
            variant="link"
            href={flow.supportBar.href}
            withArrow
            className="min-h-touch text-button"
          >
            {flow.supportBar.linkLabel}
          </Button>
        </div>
      </div>
    </Section>
  )
}
