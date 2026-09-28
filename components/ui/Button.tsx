/**
 * Button. The one control primitive for every call to action on the page.
 *
 * Polymorphic by `href`: an anchor when it navigates, a `<button type="button">`
 * when it acts. Callers may pass `type="submit"` and it wins, because the
 * default is spread before the caller's own attributes.
 *
 * Provenance: design-handoff/02-COMPONENTS.md section 1. Every cell of the two
 * state tables is implemented here, on both tones.
 *
 * Tone is passed, never sniffed. Nine sections are light and three are ink, and
 * several of these buttons appear on both.
 *
 * Focus: the base layer in globals.css already draws `outline: 2px solid
 * var(--brand-600)` at `outline-offset: 2px` on `:focus-visible`. That supplies
 * the 2px offset ring, so each variant only adds the token halo on top, and the
 * ink tones re-colour the outline to `--brand-400` because `--brand-600` is
 * close to invisible on `--ink-900`. No variant removes an outline.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type Tone = 'light' | 'dark'

type Common = {
  variant?: ButtonVariant
  size?: ButtonSize
  tone?: Tone
  /** Swaps the label for a spinner without letting the control shrink. */
  loading?: boolean
  fullWidth?: boolean
  /** Trailing arrow glyph. A separate span, so it can shift without moving the label. */
  withArrow?: boolean
  children: React.ReactNode
  className?: string
}

export type ButtonProps = Common &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
  )

/**
 * Both attribute sets in one shape. Callers still see the exclusive union
 * above, so `disabled` on an anchor or `href` on a submit button stays a type
 * error, but inside the component one read serves both branches.
 */
type ElementAttributes = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'children'
>

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/* -------------------------------------------------------------------------- */
/*                                  classes                                   */
/* -------------------------------------------------------------------------- */

/* `relative` is here for the loading overlay, which is absolutely centred over
   the hidden label so the control keeps its labelled width. `gap` is in the
   transition list because the arrow shift is a gap change, not a transform. */
const BASE =
  'relative inline-flex items-center justify-center transition-[background-color,border-color,color,box-shadow,gap,opacity,text-decoration-thickness] duration-fast ease-out'

/**
 * Height, inline padding and type size per size. `text-button` carries weight,
 * tracking and line-height as well as its 15px size, so `md` needs nothing
 * else. `sm` and `lg` have no typographic role of their own, so they take the
 * size from a token and repeat the button role's other three values.
 *
 * `min-w-touch` holds the 44px minimum width. 36px on `sm` is below the 44px
 * touch minimum on purpose: `sm` is the compacted sticky nav above 1024px in
 * this build, so it is desktop only. Nothing here enforces that.
 */
const SIZE: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] min-w-touch rounded-md px-4 text-[length:var(--t-body-sm)] font-semibold leading-none tracking-[var(--tr-button)]',
  md: 'min-h-touch min-w-touch rounded-md px-5 text-button',
  // 28px inline padding has no step on the 4px spacing scale, so it is spelled
  // out as one-off geometry rather than rounded to 24px or 32px.
  lg: 'min-h-[52px] min-w-touch rounded-md px-[28px] text-[length:var(--t-body)] font-semibold leading-none tracking-[var(--tr-button)]',
}

/* `link` is an inline text link, so it takes no height, padding or type size
   and inherits the type of the copy around it. Its focus ring follows
   --radius-sm rather than the button radius. */
const LINK_BOX = 'rounded-sm'

/**
 * Variant by tone. Two things to read here.
 *
 * 1. Each row ends with a `disabled:` restore of whatever `hover:` and
 *    `active:` repaint. `:hover` still matches a disabled button in every
 *    browser, so without the restore a disabled primary would darken under the
 *    40% opacity when the pointer crossed it.
 *
 * 2. The translucent overlays are composed with `color-mix` against the token
 *    rather than written as an rgba literal. Tailwind cannot apply an opacity
 *    modifier to a colour that lives in a CSS variable, and a literal rgba
 *    would be a raw colour outside the token layer. The computed values are the
 *    rgba(255,255,255,0.06 / 0.12) and rgba(46,211,167,0.14) of the handoff.
 */
const VARIANT: Record<ButtonVariant, Record<Tone, string>> = {
  primary: {
    light:
      'bg-brand-600 text-on-dark-primary hover:bg-brand-700 active:bg-brand-800 focus-visible:shadow-focus disabled:bg-brand-600',
    /* Documented deviation from design system 5.1. Pressed keeps the
       --brand-500 fill and adds an inset instead of darkening a third step: a
       third step would drop the --ink-900 label below 4.5:1 against its own
       fill. The inset reads as pressed and holds the contrast. Needs the same
       sign-off as the flags in 01-FOUNDATIONS.md. */
    dark: 'bg-brand-400 text-ink-900 hover:bg-brand-500 active:bg-brand-500 active:shadow-pressed-dark focus-visible:shadow-focus-dark focus-visible:outline-brand-400 disabled:bg-brand-400',
  },
  secondary: {
    light:
      'border border-border-strong bg-canvas text-text-primary hover:border-border-field hover:bg-surface-subtle active:border-text-muted active:bg-surface-muted focus-visible:border-brand-600 focus-visible:shadow-focus disabled:border-border-strong disabled:bg-canvas',
    dark: 'border border-ink-500 bg-transparent text-on-dark-primary hover:border-on-dark-muted hover:bg-[color:color-mix(in_srgb,var(--on-dark-primary)_6%,transparent)] active:border-on-dark-secondary active:bg-[color:color-mix(in_srgb,var(--on-dark-primary)_12%,transparent)] focus-visible:border-brand-400 focus-visible:shadow-focus-dark focus-visible:outline-brand-400 disabled:border-ink-500 disabled:bg-transparent',
  },
  ghost: {
    light:
      'bg-transparent text-brand-600 hover:bg-transparent hover:text-brand-700 hover:underline active:bg-brand-100 active:text-brand-800 focus-visible:shadow-focus disabled:bg-transparent disabled:text-brand-600 disabled:no-underline',
    dark: 'bg-transparent text-brand-400 hover:underline active:bg-[color:color-mix(in_srgb,var(--brand-400)_14%,transparent)] focus-visible:shadow-focus-dark focus-visible:outline-brand-400 disabled:bg-transparent disabled:no-underline',
  },
  link: {
    light:
      'text-brand-600 underline decoration-1 underline-offset-[3px] hover:text-brand-700 hover:decoration-2 active:text-brand-800 active:decoration-2 focus-visible:shadow-focus disabled:text-brand-600 disabled:decoration-1',
    dark: 'text-brand-400 underline decoration-1 underline-offset-[3px] hover:decoration-2 active:text-on-dark-primary active:decoration-2 focus-visible:shadow-focus-dark focus-visible:outline-brand-400 disabled:text-brand-400 disabled:decoration-1',
  },
}

/* Disabled is not signalled by the dimming alone: the control is genuinely
   disabled, so it is out of the tab order and cannot be activated. */
const DISABLED = 'disabled:cursor-not-allowed disabled:opacity-40'

/* 8px to 10px on hover. That moves the arrow 2px and leaves the label where it
   was, which a transform on the arrow could not do without nudging the glyph
   off the text baseline. `disabled:` pins it back, same reason as above. */
const ARROW_GAP = 'gap-2 hover:gap-[10px] disabled:gap-2'

/* -------------------------------------------------------------------------- */
/*                                 component                                  */
/* -------------------------------------------------------------------------- */

export function Button(props: ButtonProps): JSX.Element {
  const {
    variant = 'primary',
    size = 'md',
    tone = 'light',
    loading = false,
    fullWidth = false,
    withArrow = false,
    children,
    className,
    ...rest
  } = props as Common & ElementAttributes

  const { href, disabled, ...attrs } = rest

  const classes = cx(
    BASE,
    variant === 'link' ? LINK_BOX : SIZE[size],
    VARIANT[variant][tone],
    withArrow ? ARROW_GAP : 'gap-2',
    fullWidth && 'w-full',
    // While loading the control is unhittable, so hover cannot repaint it
    // under the spinner. It stays focusable on purpose, see below.
    loading && 'pointer-events-none',
    DISABLED,
    className,
  )

  /**
   * The label stays in the DOM and is hidden with opacity rather than with
   * `visibility`, which buys two things. The control keeps the exact width it
   * had with its label and does not collapse mid submit, and the label stays in
   * the accessibility tree. `visibility: hidden` removes it, which would leave
   * a busy button with no accessible name at all for as long as the request is
   * in flight, an axe `button-name` failure.
   * The spinner is the 18px .spinner from globals.css, laid over the label.
   *
   * On ink, `secondary` is the one case where the spinner is not the label
   * colour: the handoff asks for a --brand-400 head against the white label.
   */
  const content = (
    <>
      <span className={loading ? 'opacity-0' : undefined}>{children}</span>
      {withArrow ? (
        <span aria-hidden="true" className={loading ? 'opacity-0' : undefined}>
          →
        </span>
      ) : null}
      {loading ? (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <span className={cx('spinner', variant === 'secondary' && tone === 'dark' && 'text-brand-400')} />
        </span>
      ) : null}
    </>
  )

  /* Loading is announced with aria-busy and aria-disabled rather than the
     native disabled attribute. Disabling a focused control moves focus to the
     body, which would drop a keyboard or screen reader user out of the form at
     the moment the result arrives. Guarding the second submit stays with the
     caller that owns the request. */
  const busy = loading || undefined

  if (href !== undefined) {
    return (
      <a
        href={href}
        {...(attrs as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
        aria-busy={busy}
        aria-disabled={busy}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      {...(attrs as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
      disabled={disabled}
      aria-busy={busy}
      aria-disabled={busy}
    >
      {content}
    </button>
  )
}
