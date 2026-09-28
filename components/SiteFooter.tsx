import { CorridorTag } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { contact, landing, sectionIds } from '@/content/landing'

/**
 * Position 12, `S12-footer`. The closing block, on `--ink-900`.
 *
 * Provenance: design-handoff/02-COMPONENTS.md section 8 and
 * design-handoff/03-SECTIONS.md position 12.
 *
 * Continuous with S11. There is no border between the two, no separate top
 * padding on the ground and no change of surface, so the reader perceives one
 * closing ink block rather than two stacked dark sections. S11 supplies the
 * space above; this component supplies only its own top padding.
 *
 * WHY THIS DOES NOT WRAP `Section`. Three of the footer's requirements are
 * things the shared shell deliberately does not do, and all three come from
 * the handoff rather than from taste:
 *   1. The anchor id belongs on the `<footer>` landmark itself, and `Section`
 *      puts its id on the element it renders, which here would be a nested
 *      `div`. Section.tsx already anticipates this: its `as` prop exists "for
 *      the footer, which is a <footer> supplied by its own component".
 *   2. The 1px `--ink-700` rule runs INSIDE the container, across the content
 *      measure, not across the full section edge. `Section`'s `borderTop`
 *      paints the section edge.
 *   3. The accent bar is full bleed, so it has to sit OUTSIDE the container.
 *      Every child of `Section` is inside `.container-page` by construction.
 * The container geometry is still the shared one: `.container-page` from
 * globals.css is used directly, so nothing about the 1200px content box or the
 * fluid gutters is reimplemented here.
 *
 * Nothing here links to `#S12-footer`, so the missing `scroll-margin-top` that
 * globals.css grants `section[id]` and `div[id]` but not `footer[id]` costs
 * nothing.
 *
 * Server component. Every control is a link and nothing holds state.
 */

/* Shared row treatment. Two notes, both about the ink ground:

   - The `:focus-visible` backstop in globals.css draws its outline in
     `--brand-600`, which is nearly invisible on `--ink-900`, so every
     interactive element here re-colours the ring to `--brand-400` and adds the
     dark halo token on top. Same treatment `Button` and S08 give ink tones.
   - `min-h-touch` is 44px, the touch minimum. These rows sit at full touch size
     at every width, including desktop, because the footer is the one place a
     reader lands after scrolling the whole page and precision is lowest. */
const FOCUS_ON_INK =
  'rounded-sm focus-visible:shadow-focus-dark focus-visible:outline-brand-400'

/* Contact rows in the brand block. `--on-dark-primary` rather than secondary:
   these are the page's only contact details below S08 and they are the reason
   someone reaches the bottom of the page. */
const CONTACT_ROW =
  `inline-flex min-h-touch items-center gap-3 text-body-sm text-on-dark-primary ` +
  `transition-colors duration-fast ease-out hover:text-brand-400 ${FOCUS_ON_INK}`

/* Column links. 14px is `text-body-sm`, which carries the size, the 1.55 line
   height and weight 400 together, so the pinned 14px arrives as a type role
   rather than as a loose pixel value. */
const COLUMN_LINK =
  `inline-flex min-h-touch items-center text-body-sm text-on-dark-secondary ` +
  `transition-colors duration-fast ease-out hover:text-brand-400 ${FOCUS_ON_INK}`

/* The two planned corridors. Same size and same colour as a link, because they
   are real content and not a disabled state, and they are NOT wrapped in an
   anchor because they resolve nowhere. What separates them from a link is the
   `Next` tag beside them, which says so in a word, plus the absence of hover
   and focus affordances. Never hue alone. */
const COLUMN_STATIC = 'inline-flex min-h-touch items-center text-body-sm text-on-dark-secondary'

export default function SiteFooter(): JSX.Element {
  const { footer, meta, support } = landing

  return (
    <footer id={sectionIds.footer} className="bg-ink-900 text-on-dark-primary">
      <div className="container-page">
        {/* The rule and the top padding sit on a child of the container, which
            is what keeps the hairline inside the content measure instead of
            running edge to edge. `pt-section-y-tight` is the token whose value
            is exactly the clamp(48px, 5vw, 80px) the handoff pins.

            The 48px bottom padding is a decision the handoff did not cover: it
            matches the clamp's floor, so the block is symmetric at 320px and
            opens up at the top as the viewport grows. */}
        <div className="border-t border-ink-700 pb-12 pt-section-y-tight">
          {/*
            One auto-fit grid for the brand block and the three link columns.
            `min(100%, 180px)` rather than a bare 180px is the whole trick: it
            lets a track shrink under its own floor at 320px instead of forcing
            the grid wider than the viewport. The collapse points then fall out
            of the arithmetic with no media query: five tracks at the 1200px
            content box, three around 768px and two at 480px, one below it.

            `sm:col-span-2` and not a bare `col-span-2`. Below 480px the grid
            resolves to a single track, and a span of two there would create an
            IMPLICIT second column and push the page wide, which is the exact
            overflow this section is supposed to avoid. 480px is also precisely
            where the second track appears, so the span switches on at the
            moment there is room for it.
          */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-x-10 gap-y-12">
            {/* --------------------------------------------- brand block */}
            <div className="flex flex-col gap-4 sm:col-span-2">
              {/* Plain text, not a second link to the top of the page: the
                  header wordmark already does that, and a duplicate target
                  adds a tab stop that goes somewhere the reader has just been.
                  The 21px lockup geometry is the header's, so the mark reads as
                  the same object at both ends of the page. The dot is
                  decoration and carries no meaning, so it is aria-hidden. */}
              <p className="inline-flex items-center gap-2 font-display text-[21px] font-semibold leading-none tracking-[-0.01em] text-on-dark-primary">
                {meta.brandName}
                <span aria-hidden="true" className="h-[6px] w-[6px] rounded-pill bg-brand-500" />
              </p>

              {/* 15px has no role on the type scale. `text-button` is also 15px
                  but carries weight 600 and line height 1, which is a control
                  label and not a positioning line, so the size is spelled out
                  as one-off geometry with its own leading instead. */}
              <p className="text-[15px] leading-relaxed text-on-dark-primary">{footer.brandLine}</p>

              <p className="text-body-sm text-on-dark-secondary">{footer.sub}</p>

              {/* WhatsApp, phone, email. The WhatsApp label is
                  `support.whatsappCta`, reused verbatim: the approved copy has
                  no footer specific WhatsApp string, and inventing one here
                  would be hardcoding user facing text. Decision the handoff did
                  not cover.

                  `min-w-0` on each label span is what lets a long label wrap
                  inside the row. A flex item defaults to `min-width: auto`, so
                  without it the email cannot narrow below its longest unbroken
                  run, and `overflow-wrap: anywhere`, which globals.css gives
                  every `a[href^="mailto:"]`, cannot help on its own. */}
              <ul className="mt-2 flex flex-col">
                <li>
                  <a href={contact.whatsappHref} className={CONTACT_ROW}>
                    <Icon name="whatsapp" size={20} className="shrink-0 text-brand-400" />
                    <span className="min-w-0">{support.whatsappCta}</span>
                  </a>
                </li>
                <li>
                  <a href={contact.phoneHref} className={CONTACT_ROW}>
                    <Icon name="phone" size={20} className="shrink-0 text-brand-400" />
                    <span className="min-w-0">{contact.phoneDisplay}</span>
                  </a>
                </li>
                <li>
                  <a href={contact.emailHref} className={CONTACT_ROW}>
                    <Icon name="mail" size={20} className="shrink-0 text-brand-400" />
                    <span className="min-w-0">{contact.emailDisplay}</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* ----------------------------------------- three link columns */}
            {/*
              THREE columns, not four. The approved copy lists a fourth,
              Company, holding About, Partners and Contact. None of the three
              has a destination on a single page build, and the no dead ends
              rule outranks the column count, so the column is not rendered.
              Contact is already served by S08 and by this footer's own contact
              rows above. This is a decision, not an omission: reinstate the
              column the moment those pages exist.

              The headings are `h2`. The page's only `h1` is the hero
              proposition and every section heading is an `h2`, so a column
              heading here skips no level, and a heading is what lets a screen
              reader user reach a footer column directly instead of arrowing
              through the whole page. Rendering them as styled paragraphs would
              give sighted readers a heading that assistive tech cannot find.
              `--on-dark-muted` is rated against `--ink-900` only, where it
              measures 5.1:1, and that is the ground here. FLAG 05.
            */}
            {footer.columns.map((column) => (
              <div key={column.heading}>
                <h2 className="text-datalabel uppercase text-on-dark-muted">{column.heading}</h2>
                <ul className="mt-3 flex flex-col">
                  {column.items.map((item) => (
                    /*
                      The tag sits beside the label rather than inside the
                      anchor, so the active corridor's link is named exactly
                      `UAE → India` and all three corridor rows carry their tag
                      the same way, whether or not the label is a link.

                      The arrow in `UAE → India` is part of the approved label
                      string, not a glyph this component adds, so it is not
                      split into its own aria-hidden span: doing that would mean
                      editing copy. The corridor is typographic by design and
                      there is no flag or country imagery anywhere.
                    */
                    <li key={item.label} className="flex flex-wrap items-center gap-x-3">
                      {item.href ? (
                        <a href={item.href} className={COLUMN_LINK}>
                          {item.label}
                        </a>
                      ) : (
                        <span className={COLUMN_STATIC}>{item.label}</span>
                      )}
                      {item.tag ? <CorridorTag kind={item.tag} /> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ------------------------------------------- regulatory block */}
          {/* Capped at 760px so the placeholder reads as a legal note rather
              than as a full width band of small text. It ships verbatim,
              including the sentence telling the reader not to infer licensing,
              coverage or guaranteed execution from it. That sentence is the
              point of the block and is not softened or trimmed to fit. */}
          <div className="mt-block max-w-[760px] border-t border-ink-700 pt-6">
            <h2 className="text-datalabel uppercase text-on-dark-muted">
              {footer.regulatoryHeading}
            </h2>
            <p className="mt-3 text-caption text-on-dark-muted">{footer.regulatoryBody}</p>
          </div>
        </div>
      </div>

      {/*
        The bottom rule. Full bleed, so it is a sibling of the container rather
        than a child of it, and the only element in the footer outside the
        content box.

        `--accent-line` is licensed for this one edge and nothing else: never
        text, never a state. The bar is decoration, it reports nothing, and no
        information anywhere on the page depends on seeing it, so it is
        aria-hidden.
      */}
      <div aria-hidden="true" className="h-[3px] w-full bg-accent-line" />
    </footer>
  )
}
