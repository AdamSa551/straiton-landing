'use client'

import { Icon } from '@/components/ui/Icon'

export type InputProps = {
  id: string
  label: string
  /** Persistent helper. Rendered whenever there is no error, never removed. */
  helper: string
  error?: string
  /**
   * Optional validated-field message. Handoff 02 section 2 lists `success` as a
   * field state, so the primitive implements it even though the hero form never
   * enters it: validation there clears the error and returns the field to
   * default. Outranked by `error`, and it replaces the helper under the same
   * description id, so describedby still resolves to exactly one node.
   */
  success?: string
  value: string
  onChange: (value: string) => void
  /** Validation runs on blur, never on keystroke, so the parent owns this. */
  onBlur: () => void
  placeholder?: string
  inputMode?: 'numeric' | 'text'
  autoComplete?: string
}

/**
 * Field chrome shared by Input and Select. Select imports this so the two
 * controls cannot drift apart on height, radius, border, fill or focus.
 *
 * Inline padding is set only on the start edge here. The end edge differs per
 * control: Input reserves it for the state icon, Select for the chevron and, in
 * error, for both. Declaring `pe` here and overriding it in the caller would
 * leave the winner to stylesheet order rather than to intent.
 *
 * Text colour is also left to the caller, because Select tints its resting
 * placeholder value and Input does not.
 */
export const fieldChrome = (state: 'default' | 'error' | 'success') =>
  [
    // 52px at every width. 48px is the desktop spec floor, and this form is the
    // conversion event, so it keeps the roomier mobile height throughout. Well
    // clear of the 44px minimum touch target. 52px and the 14px inline padding
    // are both stated literally in the handoff and neither sits on the 4px
    // spacing scale, so they are the two deliberate arbitrary values here.
    'block w-full h-[52px] ps-[14px] rounded-sm border',
    // 16px body size. Anything smaller makes iOS Safari zoom the viewport on
    // focus, which throws the reader out of the form.
    'font-body text-body placeholder:text-text-muted',
    'transition-colors duration-fast ease-out',
    // The outline is replaced, not dropped: shadow-focus is a 3px ring outside
    // the 1px border, and in the default state the border also turns brand-600.
    // The ring sits flush against the border rather than at a 2px gap because an
    // offset gap has to be painted in the colour of the surface behind the
    // field, which this component cannot know. The border change carries the
    // second signal instead. shadow-focus is the light-surface ring, which is
    // the only one this field needs: the form appears in the S01 hero panel on
    // canvas, and S11 re-enters it by scrolling back rather than repeating it on
    // ink, so shadow-focus-dark never applies to a field.
    'focus:outline-none focus:shadow-focus',
    // No disabled prop is exposed on either control, but a parent fieldset can
    // disable them, and the chrome has to answer correctly when it does. The
    // disabled variant is emitted after hover and focus, so it wins on a
    // disabled field without needing a specificity trick.
    'disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted disabled:opacity-40',
    state === 'error'
      ? // Error outranks hover and focus on border and fill. A field the reader
        // has just focused to correct must still look wrong. The in-field icon
        // and the message below mean the state is never hue alone regardless.
        'border-status-error bg-status-error-bg'
      : state === 'success'
        ? // Same reasoning: a validated field keeps saying so under the pointer
          // and under focus. Check icon in the field and check icon plus text
          // below carry it without hue.
          'border-status-success bg-canvas'
        : 'border-border-field bg-surface-subtle hover:border-text-muted hover:bg-canvas focus:border-brand-600 focus:bg-canvas',
  ].join(' ')

export function Input({
  id,
  label,
  helper,
  error,
  success,
  value,
  onChange,
  onBlur,
  placeholder,
  inputMode = 'text',
  autoComplete,
}: InputProps): JSX.Element {
  const hasError = Boolean(error)
  // Error outranks success everywhere: chrome, in-field icon and message.
  const hasSuccess = !hasError && Boolean(success)

  /**
   * ONE description id, pointed at in every state.
   *
   * aria-describedby must always resolve. Exactly one element carries this id at
   * all times: it holds the error when there is one, the success message when
   * there is one, and the persistent helper otherwise. Pointing describedby at
   * an element that exists only while an error is present is an axe
   * aria-valid-attr-value violation firing on the resting state of the page's
   * primary form. No branch below may become conditional on anything else.
   */
  const descId = `${id}-desc`

  return (
    <div className="flex flex-col gap-2">
      {/* Always visible, always above the field. A placeholder is an example,
          never a label. Weight 600 is the label role and does not fight
          text-body-sm, which carries no weight of its own at this size. */}
      <label htmlFor={id} className="text-body-sm font-semibold text-text-primary">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={descId}
          className={[
            fieldChrome(hasError ? 'error' : hasSuccess ? 'success' : 'default'),
            'text-text-primary',
            // Clears the in-field state icon so a long value cannot slide under it.
            hasError || hasSuccess ? 'pe-10' : 'pe-[14px]',
          ].join(' ')}
        />

        {hasError || hasSuccess ? (
          // Third of the four error signals, and the second of the three success
          // signals: the icon inside the field on the end edge.
          // pointer-events-none so it can never swallow a click meant for the
          // input, and aria-hidden by default because the message below is what
          // a screen reader announces.
          <span
            className={[
              'pointer-events-none absolute inset-y-0 end-[14px] flex items-center',
              hasError ? 'text-status-error' : 'text-status-success',
            ].join(' ')}
          >
            <Icon name={hasError ? 'alert-circle' : 'check-circle'} size={20} />
          </span>
        ) : null}
      </div>

      {/* Every branch carries descId. The differing keys force a fresh node when
          the state flips, so the role="alert" paragraph is genuinely inserted
          rather than patched onto the helper node: a role added to an element
          already in the accessibility tree is not reliably announced. */}
      {hasError ? (
        <p
          key="error"
          id={descId}
          role="alert"
          className="flex items-start gap-2 text-caption font-medium text-status-error"
        >
          {/* 16px heavy stroke is the message size in the icon set. mt-px sets it
              against the cap height of a 13px line rather than its box top. */}
          <Icon name="alert-circle" size={16} weight="heavy" className="mt-px shrink-0" />
          {error}
        </p>
      ) : hasSuccess ? (
        // role="status", not role="alert": a field that has just validated is
        // worth announcing but must not interrupt, and assertive on a positive
        // confirmation talks over the reader's next keystroke.
        <p
          key="success"
          id={descId}
          role="status"
          className="flex items-start gap-2 text-caption font-medium text-status-success"
        >
          <Icon name="check-circle" size={16} weight="heavy" className="mt-px shrink-0" />
          {success}
        </p>
      ) : (
        <p key="helper" id={descId} className="text-caption text-text-muted">
          {helper}
        </p>
      )}
    </div>
  )
}
