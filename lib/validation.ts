import { landing, type Currency, type PaymentType } from '@/content/landing'

/**
 * The three field rules and their messages, kept out of the component so they
 * can be read and tested on their own.
 *
 * Messages are exact strings from the approved copy. They are checked.
 */

export type FieldName = 'amount' | 'currency' | 'paymentType'
export type Errors = Partial<Record<FieldName, string>>

/** Field order, used to focus the first failing field on an invalid submit. */
export const fieldOrder: readonly FieldName[] = ['amount', 'currency', 'paymentType'] as const

const AMOUNT_PATTERN = /^\d+(\.\d+)?$/

/**
 * A sanity floor on the input, NOT a stated product minimum. S05 lists
 * "Minimum / maximum amount" as `To be confirmed`, and nothing on the page may
 * contradict that, so the message this triggers talks about the entry rather
 * than about a limit. Change the message with the floor if this ever moves.
 */
const AMOUNT_FLOOR = 1000

/** Strips the spaces and commas a formatted value carries, so `250,000`
 *  re-validates as `250000`. */
export function stripAmount(raw: string): string {
  return raw.replace(/[\s,]/g, '')
}

/**
 * Rules run in order and the first failure wins, so an empty field reports
 * "enter the amount" rather than "enter a number".
 */
export function validateAmount(raw: string): string | undefined {
  if (!raw.trim()) return landing.form.errors.amountEmpty

  const clean = stripAmount(raw)
  if (!AMOUNT_PATTERN.test(clean)) return landing.form.errors.amountNotNumeric
  if (Number(clean) <= AMOUNT_FLOOR) return landing.form.errors.amountTooLow

  return undefined
}

export function validateCurrency(value: Currency | ''): string | undefined {
  return value ? undefined : landing.form.errors.currencyEmpty
}

export function validatePaymentType(value: PaymentType | ''): string | undefined {
  return value ? undefined : landing.form.errors.paymentTypeEmpty
}

/**
 * Formats a valid amount with thousands separators. Called on blur only, never
 * on keystroke, so the caret cannot jump while someone is typing.
 *
 * Returns the raw value unchanged when it is not a clean number, so an invalid
 * entry stays visible next to its error message instead of being silently
 * rewritten.
 */
export function formatAmount(raw: string): string {
  const clean = stripAmount(raw)
  if (!AMOUNT_PATTERN.test(clean)) return raw
  return Number(clean).toLocaleString('en-US')
}

export type FormValues = {
  amount: string
  currency: Currency | ''
  paymentType: PaymentType | ''
}

/** Re-validates every field. Used on submit. */
export function validateAll(values: FormValues): Errors {
  const errors: Errors = {}

  const amount = validateAmount(values.amount)
  if (amount) errors.amount = amount

  const currency = validateCurrency(values.currency)
  if (currency) errors.currency = currency

  const paymentType = validatePaymentType(values.paymentType)
  if (paymentType) errors.paymentType = paymentType

  return errors
}

export function firstFailing(errors: Errors): FieldName | undefined {
  return fieldOrder.find((name) => errors[name])
}
