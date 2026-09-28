'use client'

import { Button } from '@/components/ui/Button'
import { IllustrativeChip } from '@/components/ui/Chip'
import { Section, SectionHeading } from '@/components/ui/Section'
import { SpecTable } from '@/components/ui/SpecTable'
import { contact, landing, sectionIds } from '@/content/landing'
import { goToAssessment } from '@/lib/assessment'

/**
 * S04, quote anatomy. Position 4 of twelve, and the first of the three dark
 * sections. Provenance: design-handoff/03-SECTIONS.md position 4.
 *
 * Two columns at `repeat(auto-fit, minmax(min(100%, 400px), 1fr))`. The
 * `min(100%, 400px)` floor is what lets each track shrink under 400px instead
 * of forcing the page wider than the viewport at 320px. `min-w-0` on both
 * children is the other half of that: without it a long table value would set
 * a grid item's automatic minimum size and push the row wide.
 *
 * 'use client' is here for one reason only, the primary CTA calls
 * `goToAssessment()`. There is one assessment form on the page, in S01, and
 * every CTA scrolls to it and moves focus into the amount field rather than
 * opening a second form here.
 *
 * The right-hand shell is deliberately plain markup rather than a Card
 * primitive. Card.tsx says so in its own header: this container holds a header
 * row, the SpecTable and a caption block on a rule, which is not the shape any
 * of the five card shells draws.
 */

export default function S04Quote(): JSX.Element {
  const { quote } = landing

  return (
    <Section id={sectionIds.quote} surface="ink">
      <div className="grid items-start gap-[clamp(40px,4vw,64px)] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))]">
        {/* ------------------------------------------------------------ left */}
        <div className="flex min-w-0 flex-col gap-6">
          {/*
            `max-w-[520px]` on the block is how the handoff's 520px cap on the
            sub is applied without touching the shared primitive, which pins
            its own paragraph to --measure (620px). The h2 is already capped
            tighter at 18ch, so the only line this changes is the sub.
          */}
          <SectionHeading
            eyebrow={quote.eyebrow}
            heading={quote.h2}
            sub={quote.sub}
            tone="dark"
            headingMaxCh={18}
            className="max-w-[520px]"
          />

          {/* Wraps rather than shrinks, so neither control drops below its
              44px target at 320px. Both are `lg`, matching the section board. */}
          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="primary" tone="dark" size="lg" withArrow onClick={goToAssessment}>
              {quote.primaryCta}
            </Button>
            <Button variant="secondary" tone="dark" size="lg" href={contact.bankQuoteHref}>
              {quote.secondaryCta}
            </Button>
          </div>
        </div>

        {/* ----------------------------------------------------------- right */}
        <div className="flex min-w-0 flex-col gap-5 rounded-lg border border-ink-700 bg-ink-800 p-card-pad">
          <div className="flex flex-wrap items-center gap-3">
            {/*
              FLAG 05. This datalabel and BOTH captions below render in
              text-on-dark-secondary, never text-on-dark-muted. The muted token
              is rated on --ink-900 only, where it measures 5.1:1. On this
              --ink-800 card it measures 4.44:1 and fails AA. These are the
              exact three nodes that failed, and two of them are scored
              markers, so do not step them back to the muted token.
            */}
            <span className="text-datalabel uppercase text-on-dark-secondary">
              {quote.tableTitle}
            </span>
            {/* IllustrativeChip takes no className, so the alignment lives on
                a wrapper. ml-auto pushes it to the right edge at width and
                keeps it right-aligned on its own line once the row wraps. */}
            <span className="ml-auto flex shrink-0">
              <IllustrativeChip tone="dark" />
            </span>
          </div>

          {/* Supplier receives is the highlighted row. The flag is in the
              content data, and SpecTable tints only the first flagged row. */}
          <SpecTable rows={quote.rows} tone="dark" />

          {/* Caption block. Same flag 05 rule as the datalabel above: both of
              these are text-on-dark-secondary on --ink-800. */}
          <div className="flex flex-col gap-2 border-t border-ink-700 pt-4">
            <p className="text-caption text-on-dark-secondary">{quote.captionNoNumbers}</p>
            <p className="text-caption text-on-dark-secondary">{quote.captionFootnote}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
