'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DemoOnlyBadge } from '@/components/ui/Chip'
import { Disclosure } from '@/components/ui/Disclosure'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { contact, landing, type Currency, type PaymentType } from '@/content/landing'
import { AMOUNT_FIELD_ID } from '@/lib/assessment'
import {
  fieldOrder,
  firstFailing,
  formatAmount,
  validateAll,
  validateAmount,
  validateCurrency,
  validatePaymentType,
  type Errors,
  type FieldName,
} from '@/lib/validation'

/**
 * The assessment form. This is the product of the page, and the only form on
 * it, per the note in `lib/assessment.ts`.
 *
 * State, validation timing, the simulated submit and the focus moves are
 * specified in design-handoff/04-BEHAVIOUR-AND-STATE.md sections 1 to 3. Two
 * things there are load bearing and easy to lose in a refactor:
 *
 *   `amount` is a string, so the raw entry and the formatted value are one
 *   field and the caret cannot jump. Formatting happens on blur only.
 *
 *   `errors` holds messages rather than booleans, so the message and the error
 *   state cannot drift apart.
 *
 * There is no network call of any kind. The submit resolves locally after a
 * fixed delay and the confirmation says so in as many words.
 */

/* -------------------------------------------------------------------------- */
/*                                 constants                                  */
/* -------------------------------------------------------------------------- */

/**
 * Static ids. One form instance per page, so nothing is namespaced: see the
 * note on duplicate ids in 04 section 4. The amount id is imported rather than
 * written here because the four off-section CTAs focus that field by id.
 */
const CURRENCY_FIELD_ID = 'assessment-currency'
const PAYMENT_TYPE_FIELD_ID = 'assessment-payment-type'

const FIELD_IDS: Record<FieldName, string> = {
  amount: AMOUNT_FIELD_ID,
  currency: CURRENCY_FIELD_ID,
  paymentType: PAYMENT_TYPE_FIELD_ID,
}

/** The three hero micro-sections. These are the keys of `microOpen`, and they
 *  match the ids in `landing.hero.micro`. */
type MicroId = 'timing' | 'quote' | 'docs'

/** The echoed payload. The confirmation renders from this snapshot rather than
 *  from live field state, because `Start another assessment` clears the fields
 *  and the confirmation would otherwise echo three empty values on its way out. */
type Snapshot = { amount: string; currency: string; paymentType: string }

/** Simulated, not a request. 04 section 2 pins the value. */
const SIMULATED_DELAY_MS = 700

/**
 * Moves focus to the first failing field after an invalid submit.
 *
 * The field primitives expose no ref, so the target is found by id. That is
 * also why this is worth being careful about: `getElementById` returning null
 * would make the focus call a silent no-op, which 04 section 3 singles out as
 * the failure that looks implemented and is not.
 *
 * `firstFailing` reads the error map in `fieldOrder`. The fallback covers the
 * defensive case of an empty map, so focus still lands in the form.
 */
function focusFirstFailing(errors: Errors): void {
  const name = firstFailing(errors) ?? fieldOrder[0]
  if (!name) return

  const field = document.getElementById(FIELD_IDS[name])
  if (field instanceof HTMLElement) field.focus()
}

/* -------------------------------------------------------------------------- */
/*                                 component                                  */
/* -------------------------------------------------------------------------- */

export default function AssessmentForm(): JSX.Element {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency | ''>('')
  const [paymentType, setPaymentType] = useState<PaymentType | ''>('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<Snapshot | null>(null)
  const [microOpen, setMicroOpen] = useState<Record<MicroId, boolean>>({
    timing: false,
    quote: false,
    docs: false,
  })

  const confirmationRef = useRef<HTMLDivElement | null>(null)
  const delayTimer = useRef<number | null>(null)

  /**
   * Focus moves to the confirmation once it has actually mounted.
   *
   * This runs after commit, which is the whole point. A focus call made from
   * the submit callback would fire before the element existed and do nothing
   * at all, silently, which is exactly the prototype bug recorded in 04
   * section 3. Keyed on `submitted`, so it fires on the transition into the
   * confirmation and not on the transition back out.
   */
  useEffect(() => {
    if (submitted) confirmationRef.current?.focus()
  }, [submitted])

  /* The pending delay is cleared on unmount, so a resolve cannot land after
     the component has gone. */
  useEffect(() => {
    return () => {
      if (delayTimer.current !== null) window.clearTimeout(delayTimer.current)
    }
  }, [])

  /**
   * One writer for the error map, so a message and its cleared state cannot be
   * expressed two different ways. Passing `undefined` removes the entry rather
   * than storing an empty string, which would read as an error with no text.
   */
  function applyMessage(name: FieldName, message: string | undefined): void {
    setErrors((previous) => {
      if (message) return { ...previous, [name]: message }
      if (!previous[name]) return previous

      const next = { ...previous }
      delete next[name]
      return next
    })
  }

  /* Amount. Nothing validates and nothing reformats on keystroke: the caret
     would jump and the reader would be corrected mid word. */
  function handleAmountBlur(): void {
    const message = validateAmount(amount)
    applyMessage('amount', message)
    if (!message) setAmount(formatAmount(amount))
  }

  function handleCurrencyChange(value: string): void {
    setCurrency(value as Currency | '')
    // Choosing a value answers the only rule this field has, so the message
    // goes immediately rather than waiting for the blur.
    if (value) applyMessage('currency', undefined)
  }

  function handlePaymentTypeChange(value: string): void {
    setPaymentType(value as PaymentType | '')
    if (value) applyMessage('paymentType', undefined)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    // The control stays focusable while busy rather than being disabled, see
    // the note in Button, so the second submit is guarded here.
    if (submitting) return

    const next = validateAll({ amount, currency, paymentType })
    setErrors(next)

    if (Object.keys(next).length > 0) {
      focusFirstFailing(next)
      return
    }

    setSubmitting(true)
    delayTimer.current = window.setTimeout(() => {
      delayTimer.current = null
      setSubmitting(false)
      /* The amount is formatted into the snapshot rather than read raw. Submit
         by pointer blurs the field first and so formats it, submit by Enter
         does not, and the confirmation should not echo two different shapes of
         the same number depending on which was used. */
      setSubmitted({ amount: formatAmount(amount), currency, paymentType })
    }, SIMULATED_DELAY_MS)
  }

  function restart(): void {
    setSubmitted(null)
    setAmount('')
    setCurrency('')
    setPaymentType('')
    setErrors({})
  }

  function toggleMicro(key: MicroId): void {
    // A set of disclosures, not a single-select accordion. Nothing closes a
    // sibling, so several may be open at once.
    setMicroOpen((previous) => ({ ...previous, [key]: !previous[key] }))
  }

  return (
    <div>
      {submitted ? (
        /* Replaces the form region only, inside the same panel, so the page
           does not jump. tabIndex -1 makes it a focus target without putting it
           in the tab order. No outline is removed: a programmatic focus on a
           tabindex -1 container does not match :focus-visible, so the global
           backstop ring does not draw a box round the whole confirmation. */
        <div ref={confirmationRef} tabIndex={-1} className="flex flex-col gap-5">
          {/* The badge is inline-flex, and a flex column would stretch it to the
              full panel width, so it gets a plain block wrapper of its own. */}
          <div>
            <DemoOnlyBadge />
          </div>

          <div className="flex items-start gap-3">
            <Icon
              name="check-circle"
              size={24}
              className="mt-px shrink-0 text-status-success"
            />
            {/* h2, the level the panel heading it replaces also uses. The hero
                proposition is the page's only h1. */}
            <h2 className="text-h3 font-display">{landing.form.confirmation.heading}</h2>
          </div>

          <p className="text-body text-text-secondary">{landing.form.confirmation.body}</p>

          <dl className="flex flex-col gap-3 rounded-sm bg-surface-subtle p-4">
            {(
              [
                [landing.form.confirmation.summaryLabels.amount, submitted.amount],
                [landing.form.confirmation.summaryLabels.currency, submitted.currency],
                [landing.form.confirmation.summaryLabels.paymentType, submitted.paymentType],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <dt className="text-datalabel uppercase text-text-muted">{label}</dt>
                {/* Mono, so the three echoed values line up as data rather than
                    reading as another sentence. */}
                <dd className="text-right font-mono text-body-sm font-medium text-text-primary">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-caption text-text-muted">{landing.form.confirmation.caption}</p>

          {/* link variant carries no box of its own, so the 44px target is
              applied here. */}
          <Button variant="link" onClick={restart} className="min-h-touch self-start">
            {landing.form.confirmation.restart}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow uppercase text-brand-600">
              {landing.hero.panel.eyebrow}
            </p>
            <h2 className="text-h3 font-display">{landing.hero.panel.heading}</h2>
            <p className="text-body-sm text-text-secondary">{landing.hero.panel.sub}</p>
          </div>

          {/* `helper` is passed on all three fields and never omitted. It is
              what keeps aria-describedby resolving in the resting state, which
              is the axe failure 02 section 2 and 04 section 2 both single out. */}
          <Input
            id={AMOUNT_FIELD_ID}
            label={landing.form.labels.amount}
            helper={landing.form.helpers.amount}
            error={errors.amount}
            value={amount}
            onChange={setAmount}
            onBlur={handleAmountBlur}
            placeholder={landing.form.placeholders.amount}
            inputMode="numeric"
            autoComplete="off"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* min-w-0 on each cell: without it a track can be sized by the
                widest option in the select and push the panel wide at 320px. */}
            <div className="min-w-0">
              <Select
                id={CURRENCY_FIELD_ID}
                label={landing.form.labels.currency}
                helper={landing.form.helpers.currency}
                error={errors.currency}
                value={currency}
                onChange={handleCurrencyChange}
                onBlur={() => applyMessage('currency', validateCurrency(currency))}
                options={landing.form.currencyOptions}
              />
            </div>
            <div className="min-w-0">
              <Select
                id={PAYMENT_TYPE_FIELD_ID}
                label={landing.form.labels.paymentType}
                helper={landing.form.helpers.paymentType}
                error={errors.paymentType}
                value={paymentType}
                onChange={handlePaymentTypeChange}
                onBlur={() => applyMessage('paymentType', validatePaymentType(paymentType))}
                options={landing.form.paymentTypeOptions}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              fullWidth
              withArrow
              loading={submitting}
            >
              {landing.hero.panel.submit}
            </Button>
            <p className="text-center text-caption text-text-muted">
              {landing.hero.panel.submitHelper}
            </p>
          </div>
        </form>
      )}

      {/* Outside the swapped region on purpose. The three micro-sections and
          the manager link stay readable while the confirmation is showing. */}
      <div className="mt-6 border-t border-border pt-1">
        {landing.hero.micro.map((item) => {
          /* content/landing.ts types these ids as string. The three literals
             are the keys of the state model, so this asserts what that file
             already lists rather than introducing a fourth possibility. */
          const key = item.id as MicroId
          return (
            <Disclosure
              key={item.id}
              id={`hero-micro-${item.id}`}
              title={item.title}
              body={item.body}
              size="sm"
              open={microOpen[key]}
              onToggle={() => toggleMicro(key)}
            />
          )
        })}

        <a
          href={contact.whatsappHref}
          className="flex min-h-12 items-center gap-2 rounded-sm text-body-sm font-semibold text-brand-600 transition-colors duration-fast ease-out hover:text-brand-700 hover:underline focus-visible:shadow-focus"
        >
          <Icon name="whatsapp" size={20} className="shrink-0" />
          {landing.hero.panel.managerLink}
        </a>
      </div>
    </div>
  )
}
