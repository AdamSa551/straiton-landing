import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import S01Hero from '@/components/sections/S01Hero'
import S02Eligibility from '@/components/sections/S02Eligibility'
import S03CorridorFacts from '@/components/sections/S03CorridorFacts'
import S04Quote from '@/components/sections/S04Quote'
import S05Spec from '@/components/sections/S05Spec'
import S06Readiness from '@/components/sections/S06Readiness'
import S07Process from '@/components/sections/S07Process'
import S08Support from '@/components/sections/S08Support'
import S09Workspace from '@/components/sections/S09Workspace'
import S10Faq from '@/components/sections/S10Faq'
import S11FinalCta from '@/components/sections/S11FinalCta'

/**
 * The page, in approved running order.
 *
 * Position and section id are deliberately different things. The ids are the
 * shared vocabulary with the design system and they did not change when the
 * narrative was reordered, so the sequence below is not S01 to S12. Two
 * sections moved:
 *
 *   S06-readiness runs fifth, not sixth. The reader's real pain is the returned
 *   payment and the document chase, so readiness is the emotional centre and
 *   sits immediately after the quote.
 *
 *   S05-spec runs seventh, not fifth. A full parameter table is only
 *   interesting once the reader wants the payment. Ahead of the process it made
 *   the page read like documentation.
 *
 * Three dark sections, S04, S08 and S11, evenly spaced so the page reads light.
 * The footer shares the ink ground with S11 with no border between them, so the
 * reader perceives one closing block rather than two.
 */

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <S01Hero />
        <S02Eligibility />
        <S03CorridorFacts />
        <S04Quote />
        <S06Readiness />
        <S07Process />
        <S05Spec />
        <S08Support />
        <S09Workspace />
        <S10Faq />
        <S11FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
