import { Section, SectionHeading } from '@/components/ui/Section'
import { SpecTable } from '@/components/ui/SpecTable'
import { landing, sectionIds } from '@/content/landing'

/**
 * `S05-spec`, the full corridor specification. Provenance:
 * design-handoff/03-SECTIONS.md position 7.
 *
 * Position and id are different things. This renders SEVENTH despite the S05
 * name, after the quote, the readiness pair and the process steps. A ten row
 * parameter table is only interesting to a reader who already wants the
 * payment, so it sits after the argument for it rather than before.
 *
 * Two columns at `repeat(auto-fit, minmax(min(100%, 340px), 1fr))`. The
 * `min(100%, 340px)` floor, rather than a bare `340px`, is what lets a track
 * shrink below 340px instead of forcing the page wider than a 320px viewport.
 * `min-w-0` on both children is the other half of it: the longest value in the
 * table is "Supplier payments, invoice payments, other eligible business
 * payments", which would otherwise set the grid item's automatic minimum size
 * and push the row wide.
 *
 * `items-start` so the heading block stays at the top of its track rather than
 * centring itself against a table that is much taller than it is.
 *
 * THREE TbcChips render here, one for each `tbc` row in `landing.spec.rows`.
 * They are the strategic centre of the page, not an omission to tidy up, and
 * `npm run check` fails if the count is not three. The chips come from the
 * content data through SpecTable, so nothing in this file adds or removes one.
 *
 * The right hand shell is plain markup rather than a Card primitive: it is a
 * single bordered container around one table, which is not the shape any of
 * the card shells draws, and Card.tsx asks not to be bent into it.
 *
 * Server component. Nothing here holds state, and the table's two forms switch
 * on the `table` breakpoint inside SpecTable, with no width sniffing anywhere.
 */
export default function S05Spec(): JSX.Element {
  const { spec } = landing

  return (
    <Section id={sectionIds.spec} surface="canvas">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[clamp(32px,4vw,64px)]">
        {/* ------------------------------------------------------------ left */}
        {/*
          The handoff caps this block at 480px. It goes on the shared
          primitive's className rather than into the primitive, which pins its
          own paragraph to --measure (620px), so the cap here is the narrower
          of the two and the sub wraps at 480.
        */}
        <SectionHeading
          eyebrow={spec.eyebrow}
          heading={spec.h2}
          sub={spec.sub}
          className="min-w-0 max-w-[480px]"
        />

        {/* ----------------------------------------------------------- right */}
        {/*
          Two column above 620px, label over value below it, and it never
          scrolls in either form. That behaviour belongs to SpecTable, which
          changes one row element's direction at the breakpoint, so this
          container only supplies the border, the radius and the padding.
        */}
        <div className="min-w-0 rounded-lg border border-border p-card-pad">
          <SpecTable rows={spec.rows} />
        </div>
      </div>
    </Section>
  )
}
