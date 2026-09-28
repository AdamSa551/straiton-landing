import { StatusBadge } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { landing } from '@/content/landing'

/**
 * The S09 payment workspace illustration, from 02-COMPONENTS.md section 10.
 *
 * Static and decorative, built as real markup rather than a screenshot, so it
 * stays crisp at any density and takes every colour from the token layer.
 *
 * ACCESSIBILITY. The frame is one `role="img"` carrying the approved
 * `aria-label`, so everything inside it is ignored by assistive technology.
 * That is the correct outcome, not a compromise: nothing in here is
 * interactive, and a screen reader user gets a single description of the whole
 * picture instead of two dozen orphan fragments. Nothing inside is tabbable,
 * which is why the manager row is a styled span and not an anchor. A real link
 * inside `role="img"` would be a focus stop with no accessible name.
 *
 * WHY THERE IS NO `IllustrativeChip` IN HERE. `AED 250,000` and `QTE-000-000`
 * are illustrative values, and the page's rule is that illustrative figures are
 * marked. The rule is already satisfied twice over: the accessible name of the
 * element containing them says "Illustration of the Straiton payment
 * workspace", and the caption S09 renders directly below the frame says
 * "Product illustration. Static for this prototype." Adding a chip inside the
 * frame would read as part of the product UI and would imply the workspace
 * itself mocks live data, which is the opposite of what the marker exists to
 * say. So the marker stays outside, in the caption.
 *
 * DEVIATIONS from the handoff's pixel values, each forced by the replaced
 * spacing scale and repeated as a comment where it happens:
 *   body gap             18px renders as 20px (`gap-5`)
 *   tinted row padding   14px/16px renders as 12px/16px (`py-3 px-4`)
 * Two pinned values are kept exactly with arbitrary utilities rather than
 * rounded, because they are shape rather than rhythm: the 22px rail marker and
 * its 3px ring. Both emit real CSS, unlike an off-scale step such as `h-22`.
 *
 * Server component. No state, no refs, no handlers.
 */

const { illustration } = landing.workspace

type StageState = 'done' | 'current' | 'pending'

/** The 22px marker. Fill for done, a 3px ring on canvas for current, a muted
 *  disc with a strong hairline for pending. */
const MARKER: Record<StageState, string> = {
  done: 'bg-brand-600',
  current: 'border-[3px] border-brand-600 bg-canvas',
  pending: 'border border-border-strong bg-surface-muted',
}

/** Connector to the right of a marker. Drawn as a 2px top border on a
 *  zero-height span, because 2px is not a step on this project's spacing scale
 *  and `border-t-2` gives the same line without an off-scale height. */
const CONNECTOR: Record<StageState, string> = {
  done: 'border-brand-600',
  current: 'border-border-strong',
  pending: 'border-border-strong',
}

/** Rail labels. Done and current are 12px weight 600 in `--text-primary`,
 *  pending drops to `--text-muted`. `text-eyebrow` is the 12px role but carries
 *  0.12em tracking for caps, which would stretch "Assess, current" past its
 *  column, so only its size is taken, through the `text-[length:var(--t-*)]`
 *  form the buttons and the nav already use. A hardcoded pixel value would
 *  restate the number and drift the moment the token moved. */
const STAGE_LABEL: Record<StageState, string> = {
  done: 'text-[length:var(--t-eyebrow)] font-semibold leading-tight text-text-primary',
  current: 'text-[length:var(--t-eyebrow)] font-semibold leading-tight text-text-primary',
  pending: 'text-[length:var(--t-eyebrow)] leading-tight text-text-muted',
}

export default function WorkspaceIllustration(): JSX.Element {
  return (
    <div
      role="img"
      aria-label={illustration.ariaLabel}
      className="overflow-hidden rounded-xl border border-border bg-canvas shadow-float"
    >
      {/* ------------------------------------------------------ header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-subtle px-5 py-4">
        <span className="flex items-center gap-2">
          {/* 8px brand dot. Pure decoration: the record's state is carried by
              the badge beside it, in words. */}
          <span className="h-2 w-2 shrink-0 rounded-pill bg-brand-500" />
          <span className="text-body-sm font-semibold text-text-primary">
            {illustration.headerTitle}
          </span>
        </span>
        {/* StatusBadge already supplies the clock glyph the spec asks for. */}
        <StatusBadge label={illustration.headerBadge} />
      </div>

      {/* -------------------------------------------------------------- body */}
      {/* The handoff asks for an 18px gap. 18px is not a step on the replaced
          spacing scale and an off-scale class emits nothing at all, so the
          stack takes `gap-5`, 20px. */}
      <div className="flex flex-col gap-5 p-5">
        {/* Three data cells. `min(100%, 120px)` rather than a bare 120px floor
            is what lets a track shrink below it at 320px instead of forcing the
            frame wider than its column. */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,120px),1fr))] gap-4">
          {illustration.cells.map((cell) => (
            <div key={cell.key} className="flex min-w-0 flex-col gap-2">
              {/* uppercase is a text transform, not a copy change. The string
                  stays verbatim in the DOM, and the datalabel role is uppercase
                  everywhere else on the page. */}
              <span className="text-datalabel uppercase text-text-muted">{cell.key}</span>
              <span
                className={`text-body-sm text-text-primary ${cell.mono ? 'font-mono' : ''}`}
              >
                {cell.value}
              </span>
            </div>
          ))}
        </div>

        {/* Supplier receives row. 14px vertical padding is off-scale, so this
            takes 12px, which keeps the row on the scale and is not perceptible
            beside a 13px label. */}
        <div className="flex flex-col gap-2 rounded-sm bg-brand-100 px-4 py-3">
          <span className="text-caption font-medium text-brand-700">
            {illustration.receivesLabel}
          </span>
          {/* 15px mono has no type role of its own: `text-button` is the 15px
              token but adds weight 600 and a line height of 1, which would
              collapse this string when it wraps. Only its size is taken, in the
              same `text-[length:var(--t-*)]` form, so the number is not
              restated here. Leading kept readable. */}
          <span className="font-mono text-[length:var(--t-button)] leading-snug text-text-primary">
            {illustration.receivesValue}
          </span>
        </div>

        {/* Required information checklist. */}
        <div className="flex flex-col gap-3">
          <span className="text-datalabel uppercase text-text-muted">
            {illustration.requiredLabel}
          </span>
          <div className="flex flex-col gap-2">
            {illustration.requiredItems.map((item) => {
              const done = item.state === 'done'
              return (
                <span key={item.text} className="flex items-start gap-2">
                  {/* State never rests on the glyph or on hue. The pending row
                      says "pending" in its own text, so it survives greyscale
                      and it survives the icon being missed entirely. */}
                  <Icon
                    name={done ? 'check' : 'circle-minus'}
                    size={18}
                    weight="heavy"
                    className={`mt-px shrink-0 ${done ? 'text-status-success' : 'text-text-muted'}`}
                  />
                  <span
                    className={`text-body-sm ${done ? 'text-text-secondary' : 'text-text-muted'}`}
                  >
                    {item.text}
                  </span>
                </span>
              )
            })}
          </div>
        </div>

        {/* ----------------------------------------------------- progress rail */}
        <div className="flex flex-col gap-3 border-t border-border pt-5">
          <span className="text-datalabel uppercase text-text-muted">
            {illustration.progressLabel}
          </span>
          <div className="grid grid-cols-4">
            {illustration.stages.map((stage, index) => {
              const last = index === illustration.stages.length - 1
              return (
                <div key={stage.label} className="flex min-w-0 flex-col gap-2">
                  <span className="flex items-center">
                    <span
                      className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-pill ${MARKER[stage.state]}`}
                    >
                      {stage.state === 'done' ? (
                        <Icon name="check" size={16} weight="heavy" className="text-canvas" />
                      ) : null}
                    </span>
                    {/* The last stage has no trailing connector, so the rail
                        ends on the marker rather than running off the edge. */}
                    {last ? null : (
                      <span
                        className={`h-0 flex-1 border-t-2 ${CONNECTOR[stage.state]}`}
                      />
                    )}
                  </span>
                  <span className={`${STAGE_LABEL[stage.state]} pr-2`}>{stage.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ---------------------------------------------------- manager row */}
        <div className="border-t border-border pt-5">
          {/* Styled to look like the link it represents, but deliberately a
              span: see the accessibility note at the top of this file. */}
          <span className="inline-flex items-center gap-2 text-body-sm font-semibold text-brand-600">
            <Icon name="whatsapp" size={20} className="shrink-0" />
            {illustration.managerLink}
          </span>
        </div>
      </div>
    </div>
  )
}
