'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { contact, landing, sectionIds } from '@/content/landing'
import { goToAssessment } from '@/lib/assessment'

/**
 * The below-1024px menu panel, and the shared active-section hook.
 *
 * Provenance: design-handoff/02-COMPONENTS.md section 7 for the geometry,
 * 04-BEHAVIOUR-AND-STATE.md sections 1, 3 and 4 for the state, the focus trap
 * and the ARIA contract.
 *
 * The panel is MOUNTED ONLY WHILE OPEN. That is not a rendering nicety: the
 * hamburger's `aria-controls` may only be present while the element it names
 * exists, so a closed menu has to be absent from the DOM rather than merely
 * hidden.
 *
 * `useActiveSection` lives in this file rather than in the header because both
 * components need it and `MobileMenu`'s prop contract is fixed at
 * `{ open, onClose }`, so the header cannot pass the value down. The header
 * already imports this module, so exporting the hook from here keeps the
 * dependency one-directional. Exporting it from the header instead would make
 * the two files import each other.
 */

/** The dialog's id. One menu instance per page, so a static id is correct. */
export const MOBILE_MENU_ID = 'mobile-menu'

/**
 * The focusable set is queried against this on every keydown, never cached, so
 * it stays correct if the panel's contents change. Both element types here are
 * genuinely focusable in the panel: nav rows, contact rows, the close button
 * and the footer CTA.
 */
const FOCUSABLE = 'a[href], button'

/**
 * The five nav target ids, in document order.
 *
 * Render order is S01, S02, S03, S04, S06, S07, S05, S08, S09, S10, S11, S12,
 * which puts the nav's five targets on the page as S03, S07, S05, S08, S10.
 * That is the order `landing.nav.items` already lists them in, so "first entry
 * still in view" below can iterate this array directly.
 */
const NAV_IDS: readonly string[] = landing.nav.items.map((item) => item.href.slice(1))

/**
 * Matches `--scroll-offset`: the compact nav's 64px plus 20px of clearance. A
 * section only counts as current once it has reached the point where the sticky
 * nav stops covering it.
 */
const OBSERVER_MARGIN = '-84px 0px -55% 0px'

/* -------------------------------------------------------------------------- */
/*                              active section                                */
/* -------------------------------------------------------------------------- */

/**
 * Reports which of the five nav targets is currently in view, so the matching
 * link can be marked active.
 *
 * This is an IntersectionObserver, not a measurement: nothing here reads a
 * viewport width or switches a layout, which stays entirely in CSS. The
 * observer watches a band running from 84px down to 45% of the viewport and
 * keeps the set of sections overlapping it. The active one is the first of
 * those in document order, which is stable while two sections overlap the band
 * during a scroll.
 *
 * Returns `null` until a target is in view, and stays `null` if none of the
 * five sections is on the page, so a partially built page shows no false
 * active link.
 *
 * @param enabled pass `false` to skip observing entirely. The menu passes its
 * own `open`, so a closed menu costs nothing.
 */
export function useActiveSection(enabled = true): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const elements = NAV_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (elements.length === 0) return

    const inView = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target.id)
          else inView.delete(entry.target.id)
        }
        setActiveId(NAV_IDS.find((id) => inView.has(id)) ?? null)
      },
      { rootMargin: OBSERVER_MARGIN, threshold: 0 },
    )

    for (const el of elements) observer.observe(el)

    return () => observer.disconnect()
  }, [enabled])

  return activeId
}

/* -------------------------------------------------------------------------- */
/*                                   panel                                    */
/* -------------------------------------------------------------------------- */

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const activeId = useActiveSection(open)

  /**
   * Focus moves to the close button on open.
   *
   * Keyed on `open` so it runs after the panel has committed and the ref is
   * populated. Calling focus from the click handler that flips `open` would run
   * before the panel exists and silently do nothing, which is exactly how this
   * behaviour gets shipped broken. The animation-frame retry is a backstop for
   * the same failure mode.
   */
  useEffect(() => {
    if (!open) return

    const button = closeRef.current
    if (button) {
      button.focus()
      return
    }

    const frame = requestAnimationFrame(() => closeRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open])

  /**
   * Body scroll lock. Cleared on close and on unmount, both by the same
   * cleanup: without the unmount case, leaving the page with the menu open
   * leaves the document unscrollable.
   */
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  /**
   * Escape, and the focus trap.
   *
   * The listener is on `document`, not on the panel, for one specific reason:
   * a handler bound to the panel only sees keys pressed while focus is already
   * inside it, so it could never satisfy "if focus is somehow outside the
   * panel, the next Tab pulls it back".
   */
  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      // Queried live on every keydown. A cached list goes stale.
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
      )
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return

      const active = document.activeElement

      // Focus escaped the dialog, so pull it back rather than letting Tab walk
      // the page behind the panel.
      if (!(active instanceof Node) || !panel.contains(active)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
        return
      }

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
        return
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  /* The panel CTA closes the menu first, then runs the shared scroll-and-focus
     behaviour. Closing first restores body scroll, so the programmatic scroll
     to the hero has somewhere to go. */
  function handleCta(): void {
    onClose()
    goToAssessment()
  }

  return (
    <div
      ref={panelRef}
      id={MOBILE_MENU_ID}
      role="dialog"
      aria-modal="true"
      aria-label={landing.nav.menuLabel}
      className="fixed inset-0 z-[60] flex h-full flex-col bg-canvas"
    >
      {/* Header row: the logo again, with the hamburger swapped for close. */}
      <div className="flex min-h-[var(--nav-h-compact)] items-center justify-between gap-4 border-b border-border px-5">
        <a
          href={`#${sectionIds.hero}`}
          onClick={onClose}
          className="inline-flex whitespace-nowrap min-h-touch items-center gap-2 rounded-sm py-2 font-display text-[21px] font-semibold leading-none tracking-[-0.01em] text-text-primary focus-visible:shadow-focus"
        >
          {landing.meta.brandName}
          <span aria-hidden="true" className="h-[6px] w-[6px] rounded-pill bg-brand-500" />
        </a>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={landing.nav.menuCloseLabel}
          className="inline-flex min-h-touch min-w-touch items-center justify-center rounded-sm border border-border-field text-text-primary transition-colors duration-fast ease-out hover:border-border-strong focus-visible:shadow-focus"
        >
          <Icon name="close" size={24} />
        </button>
      </div>

      {/* Scrolls independently of the pinned footer, so the CTA stays reachable
          on a short viewport. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* A plain list, not a second <nav>. The dialog is already named "Menu",
            and the desktop nav landmark is display:none at this width, so
            adding a landmark here would only risk two identically labelled
            landmarks if the viewport were widened with the menu open. */}
        <ul className="divide-y divide-border border-b border-border">
          {landing.nav.items.map((item) => {
            const isActive = item.href.slice(1) === activeId
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'flex min-h-row items-center px-5 text-[18px] focus-visible:shadow-focus',
                    isActive ? 'font-semibold text-brand-700' : 'text-text-primary',
                  ].join(' ')}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* The utility bar's contact rows, which are hidden below 1024px, at a
            full touch target each. */}
        <ul className="divide-y divide-border border-b border-border">
          <li>
            <a
              href={contact.phoneHref}
              className="flex min-h-touch items-center gap-3 px-5 py-2 text-body text-text-primary focus-visible:shadow-focus"
            >
              <Icon name="phone" size={20} className="text-brand-600" />
              {contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a
              href={contact.emailHref}
              className="flex min-h-touch items-center gap-3 px-5 py-2 text-body text-text-primary focus-visible:shadow-focus"
            >
              <Icon name="mail" size={20} className="text-brand-600" />
              {contact.emailDisplay}
            </a>
          </li>
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-border bg-surface-subtle px-5 py-5">
        <Button variant="primary" size="lg" fullWidth onClick={handleCta}>
          {landing.nav.mobileCta}
        </Button>
        <p className="text-caption text-text-muted">{landing.hero.statusLine}</p>
      </div>
    </div>
  )
}
