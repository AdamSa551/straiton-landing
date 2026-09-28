import AssessmentForm from '@/components/AssessmentForm'
import { Button } from '@/components/ui/Button'
import { Panel } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { Section } from '@/components/ui/Section'
import { contact, landing, sectionIds } from '@/content/landing'

/**
 * S01, the hero. Proposition on the left, assessment form on the right.
 *
 * A server component. The only interactive state in the section belongs to the
 * form, which is its own client component, so nothing here ships to the client.
 *
 * Provenance: design-handoff/03-SECTIONS.md position 1.
 */

/**
 * Anchor for the mobile primary CTA.
 *
 * Below 1024px the form sits under the proposition, so that CTA has somewhere
 * real to send the reader. It is a fragment link rather than the scroll-and-
 * focus handler the other four assessment CTAs use, because a handler here
 * would pull the whole hero, the h1 included, into the client bundle for one
 * button. Per the HTML navigation-to-fragment steps the browser also scrolls
 * this into view against the 84px scroll-margin the globals give any element
 * with an id, so the sticky nav does not cover the panel.
 */
const FORM_ANCHOR = 'S01-assessment'

export default function S01Hero(): JSX.Element {
  return (
    <Section
      id={sectionIds.hero}
      surface="canvas"
      pad="none"
      className="pt-[clamp(40px,5vw,72px)] pb-[clamp(64px,8vw,104px)]"
    >
      {/*
        Two columns above 1024px, one below, proposition first.

        The auto-fit track is the base, and it is what keeps the layout fluid
        and prevents a floor from pushing the page wide at 320px. `lg:grid-cols-2`
        pins the switch to exactly 1024px: the 440px floor on its own does not
        clear two tracks plus the gap until roughly 1130px, which would leave a
        100px band with the form still stacked and the mobile primary CTA
        already hidden by `lg:hidden`. Below 1024 the content box is never wide
        enough for two 440px tracks, so the base rule stays single column there.
      */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-start gap-[clamp(40px,4vw,64px)] lg:grid-cols-2">
        {/* ------------------------------------------------------------ left */}
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* The corridor arrow is part of the approved eyebrow string, so it
                is typographic copy rather than a decorative glyph. */}
            <p className="text-eyebrow uppercase text-brand-600">{landing.hero.eyebrow}</p>
            <StatusBadge label={landing.hero.badge} />
          </div>

          {/* The page's only h1. Weight 400 by design: authority comes from the
              size and the negative tracking. The 15ch cap is what stops the
              last line orphaning a single word at 390px. */}
          <h1 className="max-w-[15ch] text-display font-display">{landing.hero.h1}</h1>

          <p className="max-w-[560px] text-body-lg text-text-secondary">{landing.hero.sub}</p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Hidden from 1024px up, where the form panel sits beside the
                proposition and is itself the primary action. Two primaries in
                one viewport is what that rule exists to prevent. */}
            <Button
              variant="primary"
              size="lg"
              withArrow
              href={`#${FORM_ANCHOR}`}
              className="lg:hidden"
            >
              {landing.hero.primaryCta}
            </Button>
            <Button variant="secondary" size="lg" href={`#${sectionIds.quote}`}>
              {landing.hero.secondaryCta}
            </Button>
          </div>

          {/* Button lays out its own top level children, and the glyph and the
              label are one child of it, so the row that pairs them is written
              here rather than by adding an icon prop to the primitive. */}
          <Button
            variant="ghost"
            href={contact.whatsappHref}
            className="min-h-touch self-start"
          >
            <span className="inline-flex items-center gap-2">
              <Icon name="whatsapp" size={20} className="shrink-0" />
              {landing.hero.ghostLink}
            </span>
          </Button>

          <div className="flex max-w-[520px] items-start gap-3 border-t border-border pt-5">
            <Icon name="shield-check" size={20} className="mt-px shrink-0 text-brand-600" />
            <p className="text-body-sm text-text-secondary">{landing.hero.statusLine}</p>
          </div>
        </div>

        {/* ----------------------------------------------------------- right */}
        <div id={FORM_ANCHOR} className="flex min-w-0 flex-col gap-4">
          <Panel>
            <AssessmentForm />
          </Panel>

          {/*
            Lower emphasis on purpose. This is the second path for a reader who
            already has a quote, not a competing primary: subtle fill, hairline
            border, no button chrome. The whole card is the link, so the target
            is the card rather than the six words inside it.
          */}
          <a
            href={contact.bankQuoteHref}
            className="flex items-center gap-4 rounded-lg border border-border bg-surface-subtle p-5 no-underline transition-colors duration-fast ease-out hover:border-border-field focus-visible:shadow-focus"
          >
            <Icon name="document" size={24} className="shrink-0 text-brand-600" />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-body font-semibold text-text-primary">
                {landing.hero.bankQuoteCard.title}
              </span>
              <span className="text-body-sm text-text-secondary">
                {landing.hero.bankQuoteCard.body}
              </span>
            </span>
            {/* A text character in its own span, never an icon. */}
            <span aria-hidden="true" className="ms-auto shrink-0 text-brand-600">
              →
            </span>
          </a>
        </div>
      </div>
    </Section>
  )
}
