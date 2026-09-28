import type { IconName } from '@/content/landing'

/**
 * Single stroke icon set. 1.5px stroke, rounded joins and caps, 20px and 24px
 * sizes. Icons inside error and success messages use a heavier 2px stroke at
 * 16px so they hold up at caption size.
 *
 * An icon never carries meaning alone. Every icon is either paired with a text
 * label or is `aria-hidden`, which is the default here: pass a `title` only
 * when the icon is genuinely the sole content of a control.
 *
 * No flag or country imagery. The corridor is typographic.
 *
 * The `→` arrow used in CTAs and resource rows is a text character in a
 * separate span, not an icon, so it can shift on hover without moving the
 * label. It is not in this set.
 */

const PATHS: Record<IconName, React.ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 8h13l-3-3M20 16H7l3 3" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  'document-check': (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      <path d="m9 14.5 2 2 3.5-3.5" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3v-6h1Z" />
      <path d="M20 14a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1v-6h-1Z" />
      <path d="M18 20a3 3 0 0 1-3 3h-2" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-10" />,
  cross: <path d="M6 6l12 12M18 6 6 18" />,
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4.5M12 16h.01" />
    </>
  ),
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" />
      <path d="M8.8 8.6c0 3 2.3 5.4 5.3 5.6.5 0 1-.3 1.1-.8v-.7l-1.5-.6-.8.8a4.4 4.4 0 0 1-1.9-1.9l.8-.8-.6-1.5h-.7c-.5.1-.8.5-.7 1Z" />
    </>
  ),
  phone: <path d="M6 3h3l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2L19 13v3a2 2 0 0 1-2 2A13 13 0 0 1 4 5a2 2 0 0 1 2-2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  'info-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  'question-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 16.5h.01" />
    </>
  ),
  'circle-minus': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12h7" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
}

export type IconProps = {
  name: IconName
  /** Rendered pixel size. 20 and 24 are the set's sizes. 16 is for messages. */
  size?: 16 | 18 | 20 | 22 | 24
  /** Heavier stroke, for the 16px icons inside error and success messages. */
  weight?: 'regular' | 'heavy'
  className?: string
  /** Supply only when the icon is the sole content of a control. Otherwise the
   *  icon stays aria-hidden and the adjacent text carries the meaning. */
  title?: string
}

export function Icon({ name, size = 20, weight = 'regular', className, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight === 'heavy' ? 2 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  )
}
