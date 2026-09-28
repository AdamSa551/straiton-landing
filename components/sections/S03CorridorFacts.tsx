import { FactCard } from '@/components/ui/Card'
import { Section, SectionHeading } from '@/components/ui/Section'
import { landing, sectionIds } from '@/content/landing'

/**
 * Position 3. Execution snapshot.
 *
 * Three stacked blocks on `--canvas`: the heading trio, the six fact cards,
 * then the parameter row. `gap-block` is the `clamp(32px, 4vw, 48px)` the
 * handoff asks for between the three, applied once on the column rather than
 * as a margin on each block, so the rhythm cannot drift if a block is
 * reordered.
 *
 * Nothing in this section is interactive. There is no link, button or control
 * here, so no focus ring or 44px target applies: the fact cards are static
 * divs and the parameter row is a description list.
 *
 * Heading order: `SectionHeading` supplies the section's only heading, an h2.
 * `FactCard` renders its label and value as spans by design, so the six cards
 * add no headings and nothing below the h2 is skipped.
 */

export default function S03CorridorFacts(): JSX.Element {
  const { eyebrow, h2, sub, cards, parameters } = landing.corridorFacts

  return (
    <Section id={sectionIds.corridorFacts} surface="canvas">
      <div className="flex flex-col gap-block">
        <SectionHeading eyebrow={eyebrow} heading={h2} sub={sub} />

        {/* `min(100%, 300px)` rather than a bare 300px floor: the min() form is
            what lets a track shrink under its floor at 320px instead of
            forcing the grid wider than the viewport. The cards are the grid
            items directly, not wrapped in list rows, so each card's own
            `min-h-fact` sets the track height and the six values stay on a
            shared baseline. */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
          {cards.map((card) => (
            <FactCard key={card.label} icon={card.icon} label={card.label} value={card.value} />
          ))}
        </div>

        {/* Parameter row. One bordered `--surface-subtle` container at
            `--radius-lg` with 4px padding, holding six canvas cells. The 4px
            padding only reads as a gutter if the cells are separated by the
            same 4px, so the inner grid takes `gap-1`: the handoff pins the
            container padding and the track floor but not the gap, and any
            larger gap would make the outer inset look like a mistake.

            `rounded-md` on the cells is 10px, which is exactly
            `--radius-lg` minus the 4px inset, so the inner and outer curves
            stay concentric.

            The handoff asks for 18px/20px cell padding. 18px is not a step on
            this project's replaced spacing scale, and an off-scale class emits
            no CSS at all here, so the cells take `p-5` (20px) uniformly. The
            2px difference is not perceptible next to an 11px key, and it keeps
            the cell on the scale rather than spending an arbitrary value on a
            value the scale nearly holds. */}
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-1 rounded-lg border border-border bg-surface-subtle p-1">
          {parameters.map((parameter) => (
            /* A div wrapping each dt and dd pair is permitted inside a dl and
               is what gives each pair a single grid item to sit in. */
            <div key={parameter.key} className="flex flex-col gap-2 rounded-md bg-canvas p-5">
              {/* uppercase is a text transform, not a copy change: the string
                  stays verbatim in the DOM. It matches how the datalabel role
                  is set everywhere else, and the role's 0.08em tracking is cut
                  for caps. */}
              <dt className="text-datalabel uppercase text-text-muted">{parameter.key}</dt>
              <dd className="font-mono text-body-sm text-text-primary">{parameter.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
