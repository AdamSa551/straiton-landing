import { Icon } from '@/components/ui/Icon'

/**
 * One disclosure row, controlled by its parent.
 *
 * Two consumers, one component:
 *   size 'md'  the S10 FAQ set
 *   size 'sm'  the three micro-sections inside the hero form panel
 *
 * The parent holds a `Record<key, boolean>`, so several rows can be open at
 * once. This is a disclosure set, not a single-select accordion, and nothing
 * here closes a sibling.
 *
 * No 'use client' directive. The file has no state, no refs and no handlers of
 * its own: `open` and `onToggle` both arrive as props, and only a client
 * component can create an `onToggle` function to pass in. Importing this file
 * from that client parent pulls it into the client bundle anyway, so the
 * directive would add nothing. Adding it here would instead push the module
 * boundary down a level and make the component unusable from a server parent
 * that legitimately renders a static open row.
 */

export type DisclosureSize = 'sm' | 'md'

export type DisclosureProps = {
  /** Stable, unique per instance. The trigger and panel ids derive from it. */
  id: string
  title: string
  /** Plain-text answer. Mutually exclusive with `children`. */
  body?: string
  /** Rich answer content. Used only when `body` is absent. */
  children?: React.ReactNode
  size?: DisclosureSize
  open: boolean
  onToggle: () => void
}

type SizeSpec = {
  trigger: string
  panel: string
  /** 24px at 'md', 20px at 'sm'. Both are sizes the icon set ships. */
  chevron: 20 | 24
}

const SIZES: Record<DisclosureSize, SizeSpec> = {
  md: {
    /* 18px block padding is specified in the handoff and has no step on the
       spacing scale, so it is the one arbitrary value here. min-h-row is the
       56px row minimum, which also clears the 44px touch target. */
    trigger: 'min-h-row gap-5 py-[18px] text-h4',
    /* 40px inline-end padding above 768px keeps the answer clear of the
       chevron. Below that the chevron column is narrow enough not to overlap,
       and the padding would waste scarce width. */
    panel: 'max-w-measure pb-5 md:pe-10 text-body',
    chevron: 24,
  },
  sm: {
    /* 48px row, still above the 44px minimum. The small question is 14px at
       weight 600 per the handoff, and body-sm carries weight 400, so the
       weight is applied here. This is not overriding a heading role: the
       deliberate weight 400 applies to the display and h1 to h2 roles. */
    trigger: 'min-h-12 gap-4 py-3 text-body-sm font-semibold',
    panel: 'pb-4 text-body-sm',
    chevron: 20,
  },
}

export function Disclosure({
  id,
  title,
  body,
  children,
  size = 'md',
  open,
  onToggle,
}: DisclosureProps): JSX.Element {
  const spec = SIZES[size]
  const triggerId = `${id}-trigger`
  const panelId = `${id}-panel`

  return (
    <div className="border-b border-border">
      <button
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        /* rounded-sm exists only to shape the focus ring: the row has no fill
           and no border of its own. The global :focus-visible outline in
           globals.css supplies the 2px offset ring and is deliberately left in
           place, so shadow-focus adds the brand halo rather than replacing a
           removed outline. */
        className={`flex w-full items-center justify-between rounded-sm text-left text-text-primary transition-colors duration-fast ease-out hover:text-brand-700 focus-visible:shadow-focus ${spec.trigger}`}
      >
        {/* min-w-0 lets a long question wrap instead of pushing the chevron
            off the row. */}
        <span className="min-w-0">{title}</span>
        <span
          aria-hidden="true"
          className={`inline-flex shrink-0 text-brand-600 transition-transform duration-base ease-out ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <Icon name="chevron-down" size={spec.chevron} />
        </span>
      </button>

      {/* The panel stays mounted in both states because .disclosure-panel
          animates grid-template-rows from 0fr to 1fr, which needs the content
          measured. Its inner div carries the overflow clip, so the collapsed
          row shows nothing. aria-expanded on the trigger is what announces the
          state, and aria-controls resolves in both states by design: the
          absent-while-closed rule applies to the mobile menu, whose panel
          really does unmount. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        data-open={open ? 'true' : 'false'}
        className="disclosure-panel"
      >
        <div>
          {body ? (
            <p className={`text-text-secondary ${spec.panel}`}>{body}</p>
          ) : (
            <div className={`text-text-secondary ${spec.panel}`}>{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}
