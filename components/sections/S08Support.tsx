import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { TopicChip } from '@/components/ui/Chip'
import { Section, SectionHeading } from '@/components/ui/Section'
import { contact, landing, sectionIds } from '@/content/landing'

/**
 * Position 8, `S08-support`. Manager support, on `--ink-900`.
 *
 * Second of the page's three dark sections. Three columns in one auto-fit grid:
 * identity, message, actions. The `min(100%, 280px)` floor rather than a bare
 * 280px is what lets a track shrink under its floor at 320px instead of forcing
 * the grid wider than the viewport, and the collapse order on mobile is the DOM
 * order, so identity reads first and the actions land last, next to the scroll
 * the reader is already in.
 *
 * `items-start` rather than the default stretch: the three columns are three
 * different kinds of thing, not a card row, so they top-align and keep their
 * own heights instead of padding out to a shared one.
 *
 * Heading order: `SectionHeading` supplies this section's only heading, an h2.
 * The identity block, the chips and the contact rows add no headings, so
 * nothing below it is skipped.
 *
 * Server component. Nothing here holds state: every control is a link.
 */

/* Both contact rows are the same object, so the shared classes are named once.
   Reasons the two non-scale values here are spelled out:

   - `min-h-[52px]` is the row height the handoff pins. It is not a step on this
     project's replaced spacing scale, and it clears the 44px touch minimum on
     its own. Width comes from the column, which is never under 280px.
   - `border-ink-500`, not `--ink-600`. This border is the row's only boundary,
     so it carries meaning and needs 3:1. `--ink-600` measures 2.0:1 on
     `--ink-900` and fails that; `--ink-500` measures 3.1:1. FLAG 03, and the
     reason the token exists.

   Focus: the base layer in globals.css draws `outline: 2px solid
   var(--brand-600)` on `:focus-visible`, which is close to invisible on ink, so
   the ring is re-coloured to `--brand-400` and the dark halo token is added on
   top. Same treatment `Button` gives its ink tones. */
const CONTACT_ROW =
  'flex min-h-[52px] items-center gap-3 rounded-md border border-ink-500 px-4 py-3 ' +
  'text-on-dark-primary transition-[border-color,box-shadow] duration-fast ease-out ' +
  'hover:border-brand-400 focus-visible:shadow-focus-dark focus-visible:outline-brand-400'

export default function S08Support(): JSX.Element {
  const { support } = landing

  return (
    <Section id={sectionIds.support} surface="ink">
      {/* The gap is the `clamp(32px, 3vw, 48px)` the handoff pins for this
          section, which is 3vw and not the 4vw of `gap-block`, so it is written
          as one-off geometry rather than borrowed from a near neighbour. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-start gap-[clamp(32px,3vw,48px)]">
        {/* ------------------------------------------------- identity, left */}
        <div className="flex flex-col gap-5">
          {/*
            The monogram is an avatar stand-in, not content: the team name and
            the role sit directly beneath it in text, so a screen reader reading
            out "IN" would add noise and no information. Marked aria-hidden for
            that reason, which the handoff did not cover.

            22px weight 600 is pinned by the handoff and has no typographic role
            on the scale, so the size, weight and line height are set explicitly
            here rather than by borrowing `text-h3`, which is a fluid clamp and
            would drift off 22px above 1100px. `--ink-600` is fine for this
            border: the square reports nothing, so its edge is decorative.
          */}
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-ink-600 bg-ink-800 font-display text-[22px] font-semibold leading-none text-brand-400"
          >
            {support.identityInitials}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-datalabel text-on-dark-secondary">{support.identityTeam}</p>
            <p className="text-body-sm text-on-dark-secondary">{support.identityRole}</p>
          </div>

          {/* `--on-dark-muted` is rated against `--ink-900` only, where it
              measures 5.1:1. This caption sits on the section ground, not on
              the ink-800 square above it, so it is inside its rating. FLAG 05.

              The caption is load bearing copy, not decoration: it is the line
              that stops a reader taking the placeholder phone number and email
              for real ones. It ships at full strength, verbatim. */}
          <p className="text-caption text-on-dark-muted">{support.caption}</p>
        </div>

        {/* -------------------------------------------------- message, centre */}
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow={support.eyebrow}
            heading={support.h2}
            sub={support.sub}
            tone="dark"
          />

          {/* A list, because these six are a set of peers naming what a manager
              can help with. `TopicChip` is a non-interactive span, so the row
              needs no focus treatment and no touch target. */}
          <ul className="flex flex-wrap gap-2">
            {support.topics.map((topic) => (
              <li key={topic}>
                <TopicChip label={topic} />
              </li>
            ))}
          </ul>
        </div>

        {/* -------------------------------------------------- actions, right */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" tone="dark" fullWidth href={contact.whatsappHref}>
            {/*
              `Button` wraps its children in a single span it owns, so the icon
              and the label are grouped in one nested inline-flex here rather
              than passed as two siblings, which is what keeps the glyph
              optically centred against the label.

              `leading-snug` on that group is a decision the handoff did not
              cover. `text-button` carries line-height 1, which is right for a
              single line and collides with itself the moment this label wraps,
              and at 280px "WhatsApp an India payments manager" does wrap. The
              size, weight and tracking of the role are untouched.
            */}
            <span className="inline-flex items-center gap-2 leading-snug">
              <Icon name="whatsapp" size={20} className="shrink-0" />
              {support.whatsappCta}
            </span>
          </Button>

          <a href={contact.phoneHref} className={CONTACT_ROW}>
            <Icon name="phone" size={20} className="shrink-0 text-brand-400" />
            {/* `min-w-0` is what makes the wrapping actually work. A flex item
                defaults to `min-width: auto`, so without it the text box cannot
                narrow below its longest unbroken run and would push the row,
                and the page, wider than 320px. */}
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-datalabel text-on-dark-secondary">{support.phoneLabel}</span>
              <span className="text-body-sm">{contact.phoneDisplay}</span>
            </span>
          </a>

          <a href={contact.emailHref} className={CONTACT_ROW}>
            <Icon name="mail" size={20} className="shrink-0 text-brand-400" />
            {/* The email breaks mid-address if it has to: globals.css sets
                `overflow-wrap: anywhere` on every `a[href^="mailto:"]`, and
                this anchor is one, so the value inherits it. Verified: the
                inherited property plus the `min-w-0` above is the pair that
                holds, since `overflow-wrap` alone cannot shrink a flex item
                whose `min-width` is still auto. */}
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-datalabel text-on-dark-secondary">{support.emailLabel}</span>
              <span className="text-body-sm">{contact.emailDisplay}</span>
            </span>
          </a>
        </div>
      </div>
    </Section>
  )
}
