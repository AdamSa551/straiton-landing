'use client'

import { useState } from 'react'

import { ResourceCard } from '@/components/ui/Card'
import { Disclosure } from '@/components/ui/Disclosure'
import { Section, SectionHeading } from '@/components/ui/Section'
import { landing, sectionIds } from '@/content/landing'

/**
 * Position 10 on the page, `S10-faq`. FAQ set on the left, guides card on the
 * right.
 *
 * `'use client'` is here for one reason: this section owns the open-state map
 * for the disclosure set. `Disclosure` is controlled and takes `open` plus
 * `onToggle`, and only a client component can create the handler, so the state
 * has to live at this level. Nothing else in the file needs the boundary.
 *
 * State shape is a `Record<number, boolean>` seeded with `{ 0: true }`, so the
 * first question is open on load. The toggle spreads the previous map and
 * flips one key, so MULTIPLE answers can be open at once. This is a disclosure
 * set, not a single-select accordion: opening a question must never close a
 * sibling, per 02-COMPONENTS.md section 6.
 *
 * Answer 7, the same-day guarantee, is the page's credibility anchor. It gets
 * no clamp, no truncation and no character cap here, and `Disclosure` renders
 * the whole `body` string, so it lands in full. Do not add a line clamp to
 * tidy the column.
 *
 * Heading order: `SectionHeading` supplies this section's single h2. Every
 * other title in here is a span by design. The disclosure questions sit inside
 * their buttons, and the guides card title stays a span because the verified
 * page order is H1, H2 x4, H3 x2, H2 x6, and the only two h3s on the page are
 * the S06 feature card titles. A card title here must not become a heading.
 *
 * No interactive element is authored in this file. The disclosure triggers and
 * the resource rows are primitives that already carry their own focus ring and
 * clear the 44px target, and the arrow glyph on each row is the `→` character
 * in its own aria-hidden span inside `ResourceCard`.
 */
export default function S10Faq(): JSX.Element {
  const { eyebrow, h2, items, guides } = landing.faq

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true })

  /* Spread, then flip one key. Siblings keep whatever state they had. */
  const toggle = (index: number) => {
    setOpenItems((previous) => ({ ...previous, [index]: !previous[index] }))
  }

  return (
    <Section id={sectionIds.faq} surface="canvas" borderTop>
      {/*
        Two thirds and one third above 1024px, one column below. The handoff
        prototype used an auto-fit grid with the FAQ column spanning two
        tracks; 03-SECTIONS.md says an explicit `2fr 1fr` above 1024px is
        clearer in the real build, so that is what this is. The usual
        `minmax(min(100%, Npx), 1fr)` floor is not needed for overflow safety
        here because the grid is a single column below `lg`, and both children
        carry `min-w-0` so a long question cannot push the page wide at 320px.

        `items-start` is load-bearing, not cosmetic. Grid items stretch by
        default, which would make the right column exactly as tall as its grid
        area and leave `position: sticky` with nothing to move within. Starting
        the items lets the guides card size to its content and then stick.

        Both gaps are `clamp()` values the handoff pins by name and neither
        exists on the spacing scale, so they are arbitrary values rather than
        an off-scale step, which would emit no CSS at all.
      */}
      <div className="grid grid-cols-1 items-start gap-[clamp(32px,4vw,64px)] lg:grid-cols-[2fr_1fr]">
        <div className="flex min-w-0 flex-col gap-[clamp(24px,2vw,32px)]">
          {/* No `sub` in the copy for this section, and none is invented. */}
          <SectionHeading eyebrow={eyebrow} heading={h2} />

          {/* No gap on the set. Each `Disclosure` carries its own 1px bottom
              rule, so the rows read as one continuous list; a gap would float
              seven detached rules down the column. */}
          <div className="flex flex-col">
            {items.map((item, index) => (
              <Disclosure
                key={item.question}
                /* Prefixed with the section id so the derived trigger and
                   panel ids cannot collide with the hero's micro-disclosures,
                   which key off their own short names. */
                id={`${sectionIds.faq}-item-${index}`}
                title={item.question}
                body={item.answer}
                size="md"
                /* `noUncheckedIndexedAccess` types this lookup as possibly
                   undefined, which is also the runtime truth: only key 0 is
                   seeded, so the other six are absent until first toggled. */
                open={openItems[index] ?? false}
                onToggle={() => toggle(index)}
              />
            ))}
          </div>
        </div>

        {/* Sticky at 96px. It only does anything above 1024px, where the FAQ
            column is the taller of the two; below that the card is its own
            row, so there is no travel and the offset is inert. A plain <div>
            rather than an <aside>, matching the board, because an unnamed
            complementary landmark next to a titled card is noise. */}
        <div className="sticky top-24 min-w-0">
          {/* 03-SECTIONS.md pins `overflow: hidden` on this card. It is dropped
              here deliberately. Both the global :focus-visible outline and
              `shadow-focus` are clipped by an ancestor overflow, and every
              resource row spans this card's full content width, so the clip cut
              the ring's left and right segments away and left two detached bars
              rather than a ring around the focused row. Nothing inside the card
              has a fill, a radius or an image: the children are text and
              horizontal 1px rules that sit well clear of the 14px corner arcs,
              so the clip was doing nothing for the rounded corners. Checked
              side by side, the unclipped card is identical at rest and gets the
              whole ring back on focus. */}
          <div className="rounded-lg border border-border bg-surface-subtle">
            {/* `p-card-pad` on the header and the closing note, matching what
                `ResourceCard` uses, so the cluster label, the four row
                indices and the note all sit on one left edge. The handoff
                draws a 6px gap between the two header lines, which is not a
                step on the replaced scale, so this takes 8px: imperceptible
                under an 11px datalabel and it keeps the value on the scale. */}
            <div className="flex flex-col gap-2 border-b border-border p-card-pad">
              {/* uppercase is a text transform. The string stays verbatim in
                  the DOM, and it matches how the datalabel role is set
                  elsewhere on the page. */}
              <span className="text-datalabel uppercase text-text-muted">{guides.cluster}</span>
              {/* text-h4 already carries weight 600. Kept a span, not an h4:
                  see the heading-order note above. */}
              <span className="text-h4 text-text-primary">{guides.title}</span>
            </div>

            {/* No guide pages exist. Four rows pointing at unbuilt URLs would
                be four dead ends, so each row resolves to the section of THIS
                page that answers it: process, readiness, corridor facts and
                quote, in that order, as pinned in content/landing.ts. The
                closing note below is what tells the reader that is where a
                row goes. When real guide pages ship, swap the four hrefs in
                the content file and delete the note. */}
            {guides.rows.map((row) => (
              <ResourceCard key={row.index} index={row.index} title={row.title} href={row.href} />
            ))}

            <p className="p-card-pad text-caption text-text-muted">{guides.closingNote}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
