'use client'

import { sectionIds } from '@/content/landing'

/**
 * The assessment CTA behaviour, shared by the four places that trigger it: the
 * sticky header button, the mobile menu button, the S04 primary CTA and the
 * S11 primary CTA.
 *
 * There is exactly ONE assessment form on the page, in S01. Every CTA scrolls
 * to it and moves focus into the amount input rather than opening a second
 * form inline. One form means one validation state, one confirmation state and
 * one unambiguous submission. It also keeps the "never more than one primary
 * button visible in a single viewport section" rule intact.
 *
 * Moving focus, not just scrolling, is the part that matters: a keyboard user
 * lands on the field they need rather than at the top of the section.
 */

/** Static id. There is one form instance per page, so no namespacing is
 *  needed. The prototype generated a per-instance prefix only because its
 *  review board mounted the page four times. */
export const AMOUNT_FIELD_ID = 'assessment-amount'

/**
 * The confirmation replaces the form in place, so once a reader has submitted,
 * `AMOUNT_FIELD_ID` is no longer in the document. Without a fallback the CTAs
 * would still scroll but their focus call would silently do nothing, which is
 * the same invisible no-op the handoff warns about, just in a state nobody
 * tested. The confirmation wrapper already takes `tabIndex={-1}` for its own
 * post-submit focus, so it is the correct thing to land on.
 */
export const CONFIRMATION_ID = 'assessment-confirmation'

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Focus is deferred until after the smooth scroll settles, otherwise the
 * browser's scroll-into-view on focus fights the animation and the page jumps.
 * Under reduced motion the scroll is instant, so the delay drops to zero.
 *
 * `preventScroll` stops the focus call from re-scrolling once it lands.
 */
export function goToAssessment(): void {
  const section = document.getElementById(sectionIds.hero)
  section?.scrollIntoView({ block: 'start' })

  const delay = prefersReducedMotion() ? 0 : 520

  window.setTimeout(() => {
    const target =
      document.getElementById(AMOUNT_FIELD_ID) ?? document.getElementById(CONFIRMATION_ID)
    if (target instanceof HTMLElement) target.focus({ preventScroll: true })
  }, delay)
}
