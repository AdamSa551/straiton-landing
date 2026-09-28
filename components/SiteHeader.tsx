'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MOBILE_MENU_ID, MobileMenu, useActiveSection } from '@/components/MobileMenu'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { contact, landing, sectionIds } from '@/content/landing'
import { goToAssessment } from '@/lib/assessment'

/**
 * The sticky header: utility bar, desktop nav, mobile bar.
 *
 * Provenance: design-handoff/02-COMPONENTS.md section 7, with the state model
 * and the ARIA contract from 04-BEHAVIOUR-AND-STATE.md sections 1, 3 and 4.
 *
 * Two pieces of state, both from the handoff's state table: `scrolled`, owned
 * here, and `menuOpen`, owned here because the hamburger and the panel both
 * read it and focus returns to the hamburger on close.
 *
 * Every layout switch is a Tailwind responsive prefix. Nothing here measures
 * the viewport. `scrolled` is a scroll position, not a breakpoint.
 */

/** Past this scroll position the utility bar hides and the nav compacts. */
const SCROLL_THRESHOLD = 48

/* The logo lockup appears here and again in the panel header. 21px at weight
   600 with -0.01em is pinned by the handoff and has no type role, so it is
   spelled out as one-off geometry, the same way Button spells out its 28px
   inline padding. */
const LOGO =
  'inline-flex min-h-touch items-center gap-2 rounded-sm py-2 font-display text-[21px] font-semibold leading-none tracking-[-0.01em] text-text-primary focus-visible:shadow-focus'

/* Inactive links carry the same 2px bottom border as the active one, in
   transparent, so hover and the active state paint into space that is already
   reserved and nothing reflows. */
const LINK_BASE =
  'inline-flex min-h-touch items-center border-b-2 px-1 text-[length:var(--t-button)] transition-[color,border-color] duration-fast ease-out rounded-sm focus-visible:shadow-focus'
const LINK_INACTIVE = 'border-transparent text-text-secondary hover:border-border-strong'
const LINK_ACTIVE = 'border-brand-600 font-semibold text-brand-700'

/* 13px links on an ink ground, hovering to brand-400. The base focus outline
   in globals.css is --brand-600, which is close to invisible on --ink-900, so
   these re-colour it to --brand-400 the same way Button's ink tones and the
   footer links do. Without that the ring is the halo alone. */
const UTILITY_LINK =
  'rounded-sm text-caption text-on-dark-secondary transition-colors duration-fast ease-out hover:text-brand-400 hover:underline focus-visible:shadow-focus-dark focus-visible:outline-brand-400'

export default function SiteHeader(): JSX.Element {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const activeId = useActiveSection()

  /**
   * Scroll anchoring has to be off for this header, and the reason is worth
   * stating because the symptom is bizarre.
   *
   * The header is in normal flow, so collapsing it shortens everything below
   * it: 39.5px of utility bar plus 12px of nav. Chrome compensates for content
   * shrinking above the viewport by pulling the scroll position up by the same
   * amount, which is measurable: hiding the bar alone moves the page from 300
   * to 260.5. At the 48px threshold that compensation carries the position back
   * under the threshold, the header expands, the compensation reverses, and the
   * header flaps between 76px and 64px for as long as the reader sits there.
   * Measured, not theorised.
   *
   * `overflow-anchor: none` on the root is the documented opt-out. The page has
   * nothing else that resizes above the viewport, so nothing else loses by it.
   * Restored on unmount.
   */
  useEffect(() => {
    const previous = document.documentElement.style.overflowAnchor
    document.documentElement.style.overflowAnchor = 'none'

    return () => {
      document.documentElement.style.overflowAnchor = previous
    }
  }, [])

  /**
   * Scroll position only. Read once on mount as well, so a page restored
   * mid-scroll starts in the compacted state rather than snapping into it on
   * the first scroll event.
   */
  useEffect(() => {
    function onScroll(): void {
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /** Focus returns to the control that opened the panel. */
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40">
        {/*
          Utility bar. Above 1024px only, and gone once past 48px of scroll.
          Hiding it outright rather than at `lg` while scrolled keeps one class
          in charge of the whole rule. Nothing is lost: the same phone and email
          appear in S08 and in the footer, and in the mobile panel below.

          10px of block padding has no step on the replaced spacing scale, so it
          is written as one-off geometry. The two links sit below 44x44 here by
          design: this bar renders above 1024px only, where input is a pointer,
          and the acceptance checklist scopes the 44x44 minimum to mobile. Both
          rows appear at full touch size in the mobile panel, S08 and S12.
        */}
        <div className={scrolled ? 'hidden' : 'hidden bg-ink-900 lg:block'}>
          <div className="container-page">
            <div className="flex items-center justify-between gap-4 py-[10px]">
              <p className="flex items-center gap-2 text-caption text-on-dark-secondary">
                <span aria-hidden="true" className="h-[7px] w-[7px] rounded-pill bg-brand-400" />
                {landing.nav.utilityStatus}
              </p>
              <div className="flex items-center gap-6">
                <a href={contact.phoneHref} className={UTILITY_LINK}>
                  {contact.phoneDisplay}
                </a>
                <a href={contact.emailHref} className={UTILITY_LINK}>
                  {contact.emailDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Nav bar. Canvas ground, one hairline at the bottom, no shadow. */}
        <div className="border-b border-border bg-canvas">
          <div className="container-page">
            <div
              className={[
                'flex items-center justify-between gap-4 transition-[height] duration-fast ease-out',
                scrolled
                  ? 'h-[var(--nav-h-compact)]'
                  : 'h-[var(--nav-h-compact)] lg:h-[var(--nav-h)]',
              ].join(' ')}
            >
              {/* The logo was the one element on the page under 44px, so the
                  anchor carries min-h-touch and its own block padding. */}
              <a href={`#${sectionIds.hero}`} className={LOGO}>
                {landing.meta.brandName}
                <span aria-hidden="true" className="h-[6px] w-[6px] rounded-pill bg-brand-500" />
              </a>

              <nav aria-label={landing.nav.navLabel} className="hidden lg:block">
                <ul className="flex items-center gap-6">
                  {landing.nav.items.map((item) => {
                    const isActive = item.href.slice(1) === activeId
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          aria-current={isActive ? 'page' : undefined}
                          className={`${LINK_BASE} ${isActive ? LINK_ACTIVE : LINK_INACTIVE}`}
                        >
                          {item.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* One primary CTA, dropping a size in the compacted state. */}
              <div className="hidden lg:block">
                <Button
                  variant="primary"
                  size={scrolled ? 'sm' : 'md'}
                  onClick={goToAssessment}
                >
                  {landing.nav.cta}
                </Button>
              </div>

              {/*
                `aria-controls` names the dialog only while the dialog is
                mounted. Leaving it in place when the panel is closed points at
                an id that does not resolve, which is the same anti-pattern as a
                dangling aria-describedby.
              */}
              <button
                ref={hamburgerRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-label={landing.nav.menuOpenLabel}
                aria-controls={menuOpen ? MOBILE_MENU_ID : undefined}
                className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-sm border border-border-field text-text-primary transition-colors duration-fast ease-out hover:border-border-strong focus-visible:shadow-focus lg:hidden"
              >
                <Icon name="menu" size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/*
        Rendered as a sibling of the header, not inside it. The header is a
        positioned element with a z-index, so it opens a stacking context, and a
        panel nested inside it could never sit above content the header itself
        sits below.
      */}
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  )
}
