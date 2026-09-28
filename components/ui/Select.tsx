'use client'

import { fieldChrome } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'
import { landing } from '@/content/landing'

export type SelectProps = {
  id: string
  label: string
  /** Persistent helper. Rendered whenever there is no error, never removed. */
  helper: string
  error?: string
  /**
   * Optional validated-field message. Handoff 02 section 2 lists `success` as a
   * field state for all three field primitives, so this one implements it and
   * stays symmetric with Input. Outranked by `error`, and it replaces the helper
   * under the same description id, so describedby still resolves to exactly one
   * node. The hero form never enters it: validation there clears the error and
   * returns the field to default.
   */
  success?: string
  value: string
  onChange: (value: string) => void
  /** Validation runs on blur, never on keystroke, so the parent owns this. */
  onBlur: () => void
  options: readonly string[]
  placeholder?: string
}

/**
 * A native select, styled with appearance-none and an overlaid chevron.
 *
 * Native is the whole point: it is keyboard operable for free with Up, Down,
 * Home, End and Escape, it opens the platform picker on mobile, and it needs no
 * custom listbox, no roving tabindex and no check glyph work, because the
 * platform already marks the selected option without relying on hue.
 */
export function Select({
  id,
  label,
  helper,
  error,
  success,
  value,
  onChange,
  onBlur,
  options,
  placeholder = landing.form.placeholders.select,
}: SelectProps): JSX.Element {
  const hasError = Boolean(error)
  // Error outranks success everywhere: chrome, in-field icon and message.
  const hasSuccess = !hasError && Boolean(success)

  /**
   * ONE description id, pointed at in every state. See Input for the full note.
   * aria-describedby must always resolve: the element below holds the error when
   * there is one, the success message when there is one, and the persistent
   * helper otherwise, all under the same id. The two selects are where the
   * original prototype's dangling IDREF lived, so this is the file most likely
   * to regress. Do not make any branch conditional on anything else.
   */
  const descId = `${id}-desc`

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-body-sm font-semibold text-text-primary">
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={descId}
          className={[
            fieldChrome(hasError ? 'error' : hasSuccess ? 'success' : 'default'),
            'appearance-none cursor-pointer',
            // Safety net for a long option in a narrow track. A select clips
            // its value by default, which cuts the selected text mid word and
            // leaves the reader unsure what they chose. An ellipsis at least
            // signals that the value continues. Callers should still size the
            // track for their longest option; this only stops the degradation
            // being silent.
            'truncate',
            // Muting the unchosen value keeps it from reading as a real
            // selection. It is reinforcement only: the visible label above and
            // the disabled placeholder option are what state the field is empty,
            // and an empty required select is reported by its error message.
            value === '' ? 'text-text-muted' : 'text-text-primary',
            // 42px is the handoff's stated end padding for Select: 14px edge
            // inset, the 20px chevron, then an 8px gap before the value. In error
            // or success the state icon is parked inline start of the chevron
            // rather than on top of it, so the value clears both, which is a
            // further 20px plus a further 8px gap. Both sit off the 4px scale
            // because the 14px inset and the 20px glyph do, and 42px is literal
            // in the handoff.
            hasError || hasSuccess ? 'pe-[70px]' : 'pe-[42px]',
          ].join(' ')}
        >
          {/* Disabled so it cannot be chosen again once a real option is picked.
              Its empty value is what the required check tests. */}
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {hasError || hasSuccess ? (
          // 42px = 14px edge inset + the 20px chevron + an 8px gap. The chevron
          // is the select's only affordance and cannot be displaced or replaced,
          // so it keeps the end edge and the state icon takes the slot before it.
          // pointer-events-none so neither glyph swallows a click meant for the
          // select, and aria-hidden by default because the message below is what
          // a screen reader announces.
          <span
            className={[
              'pointer-events-none absolute inset-y-0 end-[42px] flex items-center',
              hasError ? 'text-status-error' : 'text-status-success',
            ].join(' ')}
          >
            <Icon name={hasError ? 'alert-circle' : 'check-circle'} size={20} />
          </span>
        ) : null}

        {/* 14px from the end edge, and pointer-events-none so a click on the
            glyph falls through to the select and opens it. */}
        <span className="pointer-events-none absolute inset-y-0 end-[14px] flex items-center text-text-secondary">
          <Icon name="chevron-down" size={20} />
        </span>
      </div>

      {/* Every branch carries descId. The differing keys force a fresh node when
          the state flips, so the role="alert" paragraph is genuinely inserted
          rather than patched onto the helper node. */}
      {hasError ? (
        <p
          key="error"
          id={descId}
          role="alert"
          className="flex items-start gap-2 text-caption font-medium text-status-error"
        >
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
