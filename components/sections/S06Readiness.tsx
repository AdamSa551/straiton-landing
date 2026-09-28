import { FeatureCard } from '@/components/ui/Card'
import { Section, SectionHeading } from '@/components/ui/Section'
import { landing, sectionIds } from '@/content/landing'

/**
 * Position 5 on the page, `S06-readiness`.
 *
 * Surface is `--canvas`, not ink. The approved order flipped this so the page
 * carries only three dark blocks, which keeps the dark sections reading as
 * structural punctuation rather than as a second ground.
 *
 * The two cards are a comparison: what we check upfront against what that
 * avoids. Card A takes the canvas fill and card B the subtle fill, so the pair
 * separates without a divider between them, and card B's list uses crosses
 * because that list is things that do NOT happen.
 *
 * `FeatureCard` renders its own `h3` title and pins its caption with `mt-auto`,
 * so the two captions land on the same line across cards of different height.
 * The grid supplies the equal height that depends on: tracks are stretched by
 * default and the card is `h-full`.
 *
 * The `min(100%, 360px)` floor, rather than a bare `360px`, is what lets a
 * track shrink under 360px instead of pushing the page wide at 320px.
 *
 * Server component. Nothing here holds state.
 */
export default function S06Readiness(): JSX.Element {
  const { readiness } = landing

  return (
    <Section id={sectionIds.readiness} surface="canvas">
      <div className="flex flex-col gap-block">
        <SectionHeading
          eyebrow={readiness.eyebrow}
          heading={readiness.h2}
          sub={readiness.sub}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-5">
          <FeatureCard
            title={readiness.cardA.title}
            items={readiness.cardA.items}
            caption={readiness.cardA.caption}
            listIcon="check"
            surface="canvas"
          />
          <FeatureCard
            title={readiness.cardB.title}
            items={readiness.cardB.items}
            caption={readiness.cardB.caption}
            listIcon="cross"
            surface="subtle"
          />
        </div>
      </div>
    </Section>
  )
}
