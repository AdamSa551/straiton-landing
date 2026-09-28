'use client'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { contact, landing, sectionIds } from '@/content/landing'
import { goToAssessment } from '@/lib/assessment'

/**
 * S11, final conversion. Position 11 of twelve, and the third and last dark
 * section. Provenance: design-handoff/03-SECTIONS.md position 11.
 *
 * Continuous with the footer. This section carries no bottom border and S12
 * supplies no section-level top border above itself, so the two ink blocks read
 * as one closing block rather than as two stacked dark bands. The hairline the
 * footer draws sits inside its own container, above its columns, not between
 * the two sections.
 *
 * Single centred column, `items-center` plus `text-center`, 24px gap. This is
 * the ONLY section on the page where centred text is permitted, at any
 * breakpoint. Everything else stays left aligned.
 *
 * 'use client' is here for one reason only: the primary CTA calls
 * `goToAssessment()`.
 */

export default function S11FinalCta(): JSX.Element {
  const { finalCta } = landing

  return (
    <Section id={sectionIds.finalCta} surface="ink">
      <div className="flex flex-col items-center gap-6 text-center">
        {/*
          The heading trio is rendered here rather than through `SectionHeading`,
          which is the escape hatch the task allows, because the shared
          primitive pins three things this section needs to differ on and
          exposes no prop for any of them:

            1. Size. Its h2 is hardcoded `text-h2` (clamp 28px to 40px). The
               closing heading renders one step up at `text-h1` (clamp 30px to
               52px). globals.css records that the --t-h1 mobile floor was set
               to 30px specifically so this centred heading holds at 320px, so
               the size is load-bearing, not decorative.
            2. Sub measure. Its paragraph is pinned to --measure (620px). The
               handoff caps this one at 520px. Passing `className` would not
               reach it: className lands on the wrapper, and capping the wrapper
               would also squeeze the h2, whose 20ch at 52px is wider than
               520px.
            3. Internal gap. It stacks eyebrow, heading and sub at 16px. Here
               all three sit in the section's own 24px rhythm.

          Token choices are copied from the primitive so the two cannot drift:
          brand-400 eyebrow on ink, on-dark-secondary sub. It stays an h2. The
          page's only h1 is the hero proposition.
        */}
        <p className="text-eyebrow uppercase text-brand-400">{finalCta.eyebrow}</p>
        <h2 className="max-w-[20ch] font-display text-h1">{finalCta.h2}</h2>
        <p className="max-w-[520px] text-body-lg text-on-dark-secondary">{finalCta.sub}</p>

        {/*
          Action row. Wraps rather than shrinks, so neither control drops below
          its 44px target at 320px, and stays centred on one line or two. Both
          are `lg`, which is the 52px height the section board draws and matches
          the same pair in S04. 8px of top padding separates the row from the
          copy above it without breaking the 24px column rhythm.
        */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/*
            The primary scrolls back to the hero form and focuses the amount
            input rather than opening a second form inline. One form means one
            validation state, one confirmation state and one unambiguous
            submission, and it keeps the rule that no viewport section shows
            more than one primary button. Focus, not just scroll, is the part
            that matters: a keyboard user lands on the field they need.
          */}
          <Button variant="primary" tone="dark" size="lg" withArrow onClick={goToAssessment}>
            {finalCta.primaryCta}
          </Button>
          <Button variant="secondary" tone="dark" size="lg" href={contact.bankQuoteHref}>
            {finalCta.secondaryCta}
          </Button>
        </div>

        {/* Ghost, below the row, so the two weighted actions above it stay the
            pair the eye resolves first. */}
        <Button variant="ghost" tone="dark" href={contact.whatsappHref}>
          {/*
            Same grouping as the S08 WhatsApp control. `Button` wraps its
            children in a single span it owns, so the icon and the label are
            grouped in one nested inline-flex here instead of passed as two
            siblings, which is what keeps the glyph optically centred against
            the label. `leading-snug` is carried over for the same reason it was
            needed there: `text-button` carries line-height 1, which collides
            with itself once this label wraps, and at 320px it wraps. Size,
            weight and tracking of the role are untouched. The icon is
            decorative and `Icon` is aria-hidden by default, since the label
            beside it carries the meaning.
          */}
          <span className="inline-flex items-center gap-2 leading-snug">
            <Icon name="whatsapp" size={20} className="shrink-0" />
            {finalCta.ghostLink}
          </span>
        </Button>
      </div>
    </Section>
  )
}
