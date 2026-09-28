import { Section } from '@/components/ui/Section'
import { EligibilityChip } from '@/components/ui/Chip'
import { landing, sectionIds } from '@/content/landing'

/**
 * S02, the eligibility strip. Handoff 03-SECTIONS.md position 2.
 *
 * A single horizontal band between the hero and the corridor facts, doing one
 * job: stating who the pilot is for before the reader invests any more time,
 * and saying plainly that the final answer is not ours to give here.
 *
 * The section has NO heading, by design. It is a qualifying strip rather than a
 * content section, so there is no eyebrow, no h2 and no SectionHeading. The
 * page's heading order is untouched by it.
 *
 * Nothing here is interactive. Every chip is a non-interactive span from the
 * Chip primitive, which is why no focus ring and no 44px target appear below:
 * there is no control to focus or to hit.
 */

export default function S02Eligibility(): JSX.Element {
  /* The chip list is labelled by the lead-in line, so the four criteria still
     announce what they are when a screen reader reaches the list on its own. */
  const labelId = `${sectionIds.eligibility}-label`

  return (
    <Section
      id={sectionIds.eligibility}
      surface="subtle"
      pad="none"
      borderTop
      borderBottom
      /*
        DEVIATION, 4px. The handoff asks for 28px block padding, which the
        spacing scale does not carry: it steps 24, then 32. py-8 is 32px, so the
        strip sits 4px taller top and bottom than specced. 24px is equally far
        the other way, and the taller value was chosen because this band already
        reads as the tightest thing on the page and losing height makes the
        chips feel crowded against the two hairlines. An off-scale 28px padding class
        would emit no rule at all, which is the worse failure.
      */
      className="py-8"
    >
      {/* Outer row: 20px between wrapped rows, 32px between the left group and
          the caption. Wraps to two rows on mobile. */}
      <div className="flex flex-wrap items-center justify-between gap-5 gap-x-8">
        {/* The label and the chips travel together as one left-hand group, so a
            wrap never leaves the lead-in stranded on a row of its own above an
            unrelated caption. min-w-0 lets the group shrink instead of forcing
            the row wide at 320px. */}
        <div className="flex min-w-0 flex-wrap items-center gap-3 gap-x-5">
          <p id={labelId} className="text-datalabel uppercase text-text-muted">
            {landing.eligibility.label}
          </p>
          <ul aria-labelledby={labelId} className="flex flex-wrap gap-2">
            {landing.eligibility.chips.map((chip) => (
              <li key={chip}>
                <EligibilityChip label={chip} />
              </li>
            ))}
          </ul>
        </div>

        {/*
          The conditional, kept verbatim and kept in the strip rather than
          moved to a footnote. It is the sentence that stops the chips from
          reading as a promise of acceptance.

          text-muted measures 4.6:1 on surface-subtle and passes. That rating is
          against THIS ground only. Do not step this caption onto surface-muted
          or any tinted fill without re-rating it.
        */}
        <p className="ml-auto text-caption text-text-muted">{landing.eligibility.caption}</p>
      </div>
    </Section>
  )
}
