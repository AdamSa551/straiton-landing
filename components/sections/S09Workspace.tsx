import WorkspaceIllustration from '@/components/WorkspaceIllustration'
import { EligibilityChip } from '@/components/ui/Chip'
import { Section, SectionHeading } from '@/components/ui/Section'
import { landing, sectionIds } from '@/content/landing'

/**
 * Position 9, `S09-workspace`. Payment workspace.
 *
 * Two columns on `--canvas`, vertically centred against each other: copy capped
 * at 520px on the left, the static illustration plus its caption on the right.
 * The `min(100%, 380px)` floor, rather than a bare 380px, is what lets a track
 * shrink under its floor at 320px instead of pushing the page wide, and the
 * auto-fit grid is also what collapses the pair to one column on a phone with
 * no breakpoint and no measurement of the viewport.
 *
 * The check chips use the tinted `EligibilityChip` variant, `--brand-100` fill
 * with a `--brand-700` check. This is the only place on the page that variant
 * appears, which is why it is passed explicitly here rather than made the
 * default in the primitive.
 *
 * Heading order: `SectionHeading` supplies this section's only heading, an h2.
 * The illustration is `role="img"` and renders no heading of its own, so
 * nothing below the h2 is skipped.
 *
 * The caption sits below the frame and outside it, on purpose. Inside, it would
 * be swallowed by the frame's `role="img"` and the reader would lose the one
 * line that says the workspace is static.
 *
 * Nothing in this section is interactive. There is no link, button or control,
 * so no focus ring or 44px target applies here: the chips are spans and the
 * illustration is a single decorative image node.
 *
 * Server component. Nothing here holds state.
 */

export default function S09Workspace(): JSX.Element {
  const { workspace } = landing

  return (
    <Section id={sectionIds.workspace} surface="canvas">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(32px,4vw,64px)]">
        {/* Left. Copy capped at 520px. The heading's own sub line is already
            capped at `--measure`, 620px, so the 520px cap here is what actually
            governs, and it stays on the column rather than on each child so the
            eyebrow, heading and chips all wrap to the same edge. */}
        <div className="flex min-w-0 max-w-[520px] flex-col gap-block">
          <SectionHeading
            eyebrow={workspace.eyebrow}
            heading={workspace.h2}
            sub={workspace.sub}
          />

          {/* Eight names of things the workspace holds, so a list. The reset in
              globals.css already removes the markers. */}
          <ul className="flex flex-wrap gap-2">
            {workspace.chips.map((chip) => (
              <li key={chip}>
                <EligibilityChip label={chip} tint="brand" />
              </li>
            ))}
          </ul>
        </div>

        {/* Right. Frame, then its caption, outside the frame. */}
        <div className="flex min-w-0 flex-col gap-3">
          <WorkspaceIllustration />
          <p className="text-caption text-text-muted">{workspace.caption}</p>
        </div>
      </div>
    </Section>
  )
}
