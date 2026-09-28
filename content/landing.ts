/**
 * Every string rendered on the page lives here, so copy can be changed without
 * touching layout. Section components read from this object and hold no
 * hardcoded text.
 *
 * Copy is approved and signed off in STRAITON-NARRATIVE-AND-COPY.md and is
 * used verbatim. Three constraints are enforced by the content of this file
 * rather than by any component:
 *
 *   1. No em dashes anywhere. Commas, colons or a full stop.
 *   2. Conditional wording stays conditional. "where supported", "subject to",
 *      "may be required", "to be confirmed". Do not tighten a hedge to make a
 *      line fit a layout.
 *   3. No pricing, no savings percentages, no guarantees, no regulatory or
 *      licensing claims, and no mention of crypto or stablecoins.
 *
 * The corridor is written typographically as `UAE → India`. No flag or
 * country imagery anywhere.
 */

/* -------------------------------------------------------------------------- */
/*                                   types                                    */
/* -------------------------------------------------------------------------- */

export type NavItem = { label: string; href: string }
export type FactCardContent = { icon: IconName; label: string; value: string }
export type ParameterCell = { key: string; value: string }
export type SpecRow = { label: string; value?: string; tbc?: boolean; highlight?: boolean }
export type StepContent = { index: string; title: string; body: string; tag: string }
export type FaqItem = { question: string; answer: string }
export type ResourceRow = { index: string; title: string; href: string }
export type FooterColumn = { heading: string; items: FooterLink[] }
export type FooterLink = { label: string; href?: string; tag?: 'active' | 'next' }
export type DisclosureItem = { id: string; title: string; body: string }

export type IconName =
  | 'clock'
  | 'exchange'
  | 'card'
  | 'layers'
  | 'document-check'
  | 'headset'
  | 'check'
  | 'cross'
  | 'alert-circle'
  | 'check-circle'
  | 'shield-check'
  | 'whatsapp'
  | 'phone'
  | 'mail'
  | 'chevron-down'
  | 'menu'
  | 'close'
  | 'info-circle'
  | 'question-circle'
  | 'circle-minus'
  | 'document'

export type PaymentType =
  | 'Supplier payment'
  | 'Invoice payment'
  | 'Other eligible business payment'
export type Currency = 'AED' | 'USD'

/* -------------------------------------------------------------------------- */
/*                          placeholder contact values                        */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately, visibly generic. `straiton.example` uses the reserved
 * `.example` TLD so it can never resolve. Keep these generic until real
 * values are supplied. S08 carries a visible caption saying they are
 * placeholders.
 */
export const contact = {
  phoneDisplay: '+971 00 000 0000',
  phoneHref: 'tel:+971000000000',
  emailDisplay: 'india@straiton.example',
  emailHref: 'mailto:india@straiton.example',
  whatsappHref: 'https://wa.me/971000000000',
  bankQuoteHref: 'mailto:india@straiton.example?subject=Bank%20quote%20review',
} as const

/* -------------------------------------------------------------------------- */
/*                                  sections                                  */
/* -------------------------------------------------------------------------- */

/** Section ids, used for anchors and for the nav map. Position and id are
 *  separate things: the render order is S01, S02, S03, S04, S06, S07, S05,
 *  S08, S09, S10, S11, S12. */
export const sectionIds = {
  hero: 'S01-hero',
  eligibility: 'S02-eligibility',
  corridorFacts: 'S03-corridor-facts',
  quote: 'S04-quote',
  spec: 'S05-spec',
  readiness: 'S06-readiness',
  process: 'S07-process',
  support: 'S08-support',
  workspace: 'S09-workspace',
  faq: 'S10-faq',
  finalCta: 'S11-final-cta',
  footer: 'S12-footer',
} as const

export const landing = {
  /* ------------------------------------------------------------------ meta */

  meta: {
    title: 'Straiton | UAE to India business payments',
    description:
      'Get a corridor-specific payment assessment before you fund. Quote structure, the documents your payment will need, and a named India payments manager who answers.',
    brandName: 'Straiton',
  },

  /* ----------------------------------------------------------- navigation */

  nav: {
    /** Every item resolves to a real section on this page. There is no
     *  `Sign in`: there is no sign-in here, and design system 5.7 requires
     *  that a nav item either resolve or be removed. */
    items: [
      { label: 'Corridor', href: `#${sectionIds.corridorFacts}` },
      { label: 'How it works', href: `#${sectionIds.process}` },
      { label: 'Specification', href: `#${sectionIds.spec}` },
      { label: 'Support', href: `#${sectionIds.support}` },
      { label: 'FAQ', href: `#${sectionIds.faq}` },
    ] as NavItem[],
    cta: 'Get assessment',
    menuOpenLabel: 'Open menu',
    menuCloseLabel: 'Close menu',
    menuLabel: 'Menu',
    navLabel: 'Page sections',
    mobileCta: 'Get a payment assessment',
    utilityStatus: 'India pilot, accepting qualified UAE businesses',
  },

  /* ------------------------------------------------------- S01 hero + form */

  hero: {
    eyebrow: 'UAE → INDIA BUSINESS PAYMENTS',
    badge: 'PILOT PREPARATION',
    h1: 'Pay suppliers in India without guessing what happens next.',
    sub: 'Get a corridor-specific payment assessment before you fund. Quote structure, the documents your payment will need, and a named India payments manager who answers.',
    primaryCta: 'Get a payment assessment',
    secondaryCta: 'Already have a bank quote? Send it to us',
    ghostLink: 'WhatsApp an India payments manager',
    statusLine: 'Accepting qualified UAE businesses for the India pilot.',

    panel: {
      eyebrow: 'PAYMENT ASSESSMENT',
      heading: 'Start with the payment you need to make.',
      sub: 'Share the details and get a corridor-specific assessment. No account needed.',
      submit: 'Get my payment assessment',
      submitHelper: 'No signup required.',
      managerLink: 'Prefer to talk first? Message a payments manager',
    },

    /** The three disclosure micro-sections below the submit button. Bodies are
     *  written from the product fact sheet and keep their hedges. */
    micro: [
      {
        id: 'timing',
        title: 'Indicative timing',
        body: 'Same-day where supported. Timing depends on eligibility, payment details, documentation, cut-offs and compliance review.',
      },
      {
        id: 'quote',
        title: 'Quote structure',
        body: 'You see what you send, the transaction-specific FX quote, any fee where applicable, and the INR the supplier receives, before funding.',
      },
      {
        id: 'docs',
        title: 'Document checklist',
        body: 'A payment-specific checklist. Requirements depend on the transaction and remain subject to review.',
      },
    ] as DisclosureItem[],

    /** Lower-emphasis card below the panel. Not a competing primary button. */
    bankQuoteCard: {
      title: 'Already have a bank quote?',
      body: 'Send it to us for an execution path review.',
    },
  },

  /* ------------------------------------------------------- S02 eligibility */

  eligibility: {
    label: 'The India pilot is currently designed for',
    chips: [
      'UAE companies',
      'Genuine B2B payments',
      'Indian business beneficiaries',
      'Documented commercial purpose',
    ],
    caption: 'Final eligibility is subject to compliance review.',
  },

  /* ---------------------------------------------------- S03 corridor facts */

  corridorFacts: {
    eyebrow: 'CORRIDOR FACTS',
    h2: 'UAE → India, at a glance.',
    sub: 'Six things worth knowing before you commit a payment.',
    cards: [
      { icon: 'clock', label: 'Speed', value: 'Same-day where supported' },
      { icon: 'exchange', label: 'FX', value: 'Transaction-specific quote before funding' },
      { icon: 'card', label: 'Payout', value: 'INR business payout, subject to confirmed capability' },
      {
        icon: 'layers',
        label: 'Payment types',
        value: 'Supplier, invoice and other eligible business payments',
      },
      { icon: 'document-check', label: 'Documents', value: 'Payment-specific checklist' },
      { icon: 'headset', label: 'Support', value: 'Dedicated India payments manager' },
    ] as FactCardContent[],
    parameters: [
      { key: 'From', value: 'United Arab Emirates' },
      { key: 'To', value: 'India' },
      { key: 'Funding currencies', value: 'AED / USD' },
      { key: 'Supplier receives', value: 'INR' },
      { key: 'Status', value: 'Pilot preparation' },
      { key: 'Tracking', value: 'Payment status and confirmation' },
    ] as ParameterCell[],
  },

  /* ------------------------------------------------------- S04 quote, dark */

  quote: {
    eyebrow: 'QUOTE STRUCTURE',
    h2: 'See the whole payment before you fund it.',
    sub: 'You see what you send, what the supplier receives, and where a fee applies. Before money moves, not after.',
    primaryCta: 'Get a payment assessment',
    secondaryCta: 'Send us your bank quote',
    tableTitle: 'Illustrative quote anatomy',
    rows: [
      { label: 'You send', value: 'Amount you select for your request' },
      { label: 'FX rate', value: 'Transaction-specific quote' },
      { label: 'Fee', value: 'Shown where applicable' },
      { label: 'Supplier receives', value: 'INR amount shown before funding', highlight: true },
      { label: 'Expected timing', value: 'Confirmed for the approved payment' },
    ] as SpecRow[],
    /** Both captions and the table datalabel are scored markers. They render in
     *  --on-dark-secondary, not --on-dark-muted, because they sit on an
     *  --ink-800 card where the muted token measures 4.4:1. See flag 05. */
    captionNoNumbers: 'No live numbers shown.',
    captionFootnote:
      'Same-day execution may be available where supported. Pricing and timing remain transaction-specific.',
  },

  /* --------------------------------------------------------- S06 readiness */

  readiness: {
    eyebrow: 'PAYMENT READINESS',
    h2: 'Most India payments fail on paperwork, not on money.',
    sub: 'We identify what a payment needs upfront, so avoidable issues do not surface after you have funded.',
    cardA: {
      title: 'What we check upfront',
      items: [
        'Company information',
        'Invoice or contract context',
        'Beneficiary details',
        'Payment purpose',
        'Supporting documents where required',
      ],
      caption:
        'Information and documents may be required depending on the transaction and remain subject to review.',
    },
    cardB: {
      title: 'What that avoids',
      items: [
        'Payments returned for missing or inconsistent information',
        'Additional document requests after submission',
        'Beneficiary mismatches',
        'Unnecessary compliance back-and-forth',
        'Missed cut-offs and delayed execution',
      ],
      caption:
        'Preparation reduces avoidable friction. It does not guarantee approval or execution timing.',
    },
  },

  /* ----------------------------------------------------------- S07 process */

  process: {
    eyebrow: 'HOW IT WORKS',
    h2: 'From payment request to supplier confirmation.',
    steps: [
      { index: '01', title: 'Share', body: 'Share your payment details.', tag: 'request' },
      {
        index: '02',
        title: 'Assess',
        body: 'Receive an assessment, quote structure and document checklist.',
        tag: 'quote + docs',
      },
      {
        index: '03',
        title: 'Complete',
        body: 'Complete onboarding and fund the approved transaction.',
        tag: 'onboarding',
      },
      {
        index: '04',
        title: 'Track',
        body: 'Track the payment through to beneficiary confirmation.',
        tag: 'confirmation',
      },
    ] as StepContent[],
    supportBar: {
      text: 'Manager support available across all four stages.',
      linkLabel: 'Talk to the India team',
      href: `#${sectionIds.support}`,
    },
  },

  /* -------------------------------------------------------------- S05 spec */

  spec: {
    eyebrow: 'CORRIDOR SPECIFICATION',
    h2: 'The full specification, including what is not fixed yet.',
    sub: 'This corridor is in pilot preparation. Where a parameter is not confirmed, we say so rather than guessing.',
    /** Exactly three `tbc` rows. They are the strategic centre of the page,
     *  not an omission to tidy up later. The build is verified against a
     *  count of three. */
    rows: [
      { label: 'Funding currencies', value: 'AED / USD' },
      { label: 'Supplier receives', value: 'INR', highlight: true },
      { label: 'Beneficiary type', value: 'Eligible Indian businesses' },
      {
        label: 'Supported payment types',
        value: 'Supplier payments, invoice payments, other eligible business payments',
      },
      { label: 'Expected timing', value: 'Same-day where supported' },
      { label: 'Payout method', tbc: true },
      { label: 'Cut-off', tbc: true },
      { label: 'Minimum / maximum amount', tbc: true },
      { label: 'Required information', value: 'Transaction-specific' },
      { label: 'Tracking', value: 'Status and confirmation available' },
    ] as SpecRow[],
  },

  /* ----------------------------------------------------- S08 support, dark */

  support: {
    eyebrow: 'CORRIDOR SUPPORT',
    h2: 'A person who knows this corridor, not a ticket queue.',
    sub: 'Speak directly with a payments manager who can help with onboarding, quotes, documents, payment setup, status and exceptions.',
    identityInitials: 'IN',
    identityTeam: 'STRAITON CORRIDOR TEAM',
    identityRole: 'India payments manager',
    topics: ['Quote', 'Onboarding', 'Documents', 'Payment setup', 'Status', 'Exceptions'],
    whatsappCta: 'WhatsApp an India payments manager',
    phoneLabel: 'PHONE',
    emailLabel: 'EMAIL',
    caption: 'Contact details shown are placeholders for this prototype.',
  },

  /* --------------------------------------------------------- S09 workspace */

  workspace: {
    eyebrow: 'PAYMENT WORKSPACE',
    h2: 'Every payment detail in one place.',
    sub: 'Beneficiary, amount, quote, required information, funding status and confirmation. Visible to you and to your payments manager.',
    chips: [
      'Beneficiary',
      'Amount',
      'Quote',
      'Required info',
      'Funding status',
      'Payment status',
      'Confirmation',
      'Contact manager',
    ],
    caption: 'Product illustration. Static for this prototype.',

    /** Contents of the static illustration. Values are illustrative. The frame
     *  is role="img" and its accessible name already says "illustration", and
     *  the caption states it is static. */
    illustration: {
      headerTitle: 'Supplier payment',
      headerBadge: 'In assessment',
      cells: [
        { key: 'Beneficiary', value: 'Supplier name, India', mono: false },
        { key: 'You send', value: 'AED 250,000', mono: true },
        { key: 'Quote', value: 'QTE-000-000', mono: true },
      ],
      receivesLabel: 'Supplier receives',
      receivesValue: 'INR amount shown before funding',
      requiredLabel: 'Required information',
      requiredItems: [
        { text: 'Company information', state: 'done' as const },
        { text: 'Beneficiary details', state: 'done' as const },
        { text: 'Invoice or contract, pending', state: 'pending' as const },
      ],
      progressLabel: 'Progress',
      stages: [
        { label: 'Share', state: 'done' as const },
        { label: 'Assess, current', state: 'current' as const },
        { label: 'Complete', state: 'pending' as const },
        { label: 'Track', state: 'pending' as const },
      ],
      managerLink: 'Contact your payments manager',
      ariaLabel:
        'Illustration of the Straiton payment workspace. A supplier payment record shows the beneficiary, the amount in AED with the INR the supplier receives, the quote reference, a required information checklist, a four stage progress rail currently at the assessment stage, and a link to contact the payments manager.',
    },
  },

  /* --------------------------------------------------------------- S10 faq */

  faq: {
    eyebrow: 'FAQ',
    h2: 'Questions we get from UAE finance teams.',
    items: [
      {
        question: 'How fast can a UAE to India business payment be?',
        answer:
          'Same-day where supported. Actual timing depends on eligibility, payment details, documentation, cut-offs and compliance review.',
      },
      {
        question: 'What currencies can I fund in?',
        answer: 'AED or USD. Your supplier receives INR.',
      },
      {
        question: 'What does my supplier receive?',
        answer:
          'INR, paid to an eligible Indian business beneficiary. The INR amount is shown before you fund.',
      },
      {
        question: 'What types of payments are supported?',
        answer:
          'Supplier payments, invoice payments and other eligible business payments, where there is a documented commercial purpose.',
      },
      {
        question: 'What documents may be required?',
        answer:
          'A payment-specific checklist. Requirements depend on the transaction and remain subject to review. Your payments manager confirms the list before funding.',
      },
      {
        question: 'Can I speak to someone before onboarding?',
        answer:
          'Yes. A dedicated India payments manager is available from the assessment stage onward, by WhatsApp, phone or email.',
      },
      {
        /** The page's credibility anchor. It must clearly say no. Do not
         *  shorten it. */
        question: 'Do you guarantee same-day execution?',
        answer:
          'No. Same-day is available where supported. Timing depends on factors we do not control, and we would rather say that now than after you have funded.',
      },
    ] as FaqItem[],

    /** No guide pages exist. Rather than four dead links, each row points at
     *  the section of this page that answers it, and the closing note tells
     *  the reader that is what will happen. */
    guides: {
      cluster: 'INDIA RESOURCE CLUSTER',
      title: 'Related India payment guides',
      rows: [
        {
          index: '01',
          title: 'How to pay a supplier in India from the UAE',
          href: `#${sectionIds.process}`,
        },
        {
          index: '02',
          title: 'Documents for UAE to India business payments',
          href: `#${sectionIds.readiness}`,
        },
        {
          index: '03',
          title: 'How long UAE to India business payments take',
          href: `#${sectionIds.corridorFacts}`,
        },
        {
          index: '04',
          title: 'Understanding FX and total payment cost for UAE to India',
          href: `#${sectionIds.quote}`,
        },
      ] as ResourceRow[],
      closingNote: 'Each guide answers one question on this page in more depth.',
    },
  },

  /* -------------------------------------------------- S11 final CTA, dark */

  finalCta: {
    eyebrow: 'HAVE A PAYMENT TO INDIA?',
    h2: "Let's look at the payment you actually need to make.",
    sub: 'Get a payment assessment, send us your bank quote, or contact a payments manager directly.',
    primaryCta: 'Get a payment assessment',
    secondaryCta: 'Send us your quote',
    ghostLink: 'WhatsApp an India payments manager',
  },

  /* ------------------------------------------------------ S12 footer, dark */

  footer: {
    brandLine: 'Business payments built for GCC to Asia corridors.',
    sub: 'Deeply built corridors. Direct access to the people handling your payment.',
    /** Three columns. The approved copy lists a fourth, Company, holding
     *  About, Partners and Contact. None has a destination on a single-page
     *  build and the no-dead-ends rule outranks the column count, so it is
     *  dropped. Contact is served by S08 and by the footer's own contact
     *  rows. Reinstate when those pages exist. */
    columns: [
      {
        heading: 'CORRIDORS',
        items: [
          { label: 'UAE → India', href: `#${sectionIds.spec}`, tag: 'active' },
          { label: 'UAE → Philippines', tag: 'next' },
          { label: 'UAE → China', tag: 'next' },
        ],
      },
      {
        heading: 'PLATFORM',
        items: [
          { label: 'How it works', href: `#${sectionIds.process}` },
          { label: 'Payment readiness', href: `#${sectionIds.readiness}` },
          { label: 'Support', href: `#${sectionIds.support}` },
        ],
      },
      {
        heading: 'RESOURCES',
        items: [
          { label: 'India payment guides', href: `#${sectionIds.faq}` },
          { label: 'Required documents', href: `#${sectionIds.readiness}` },
          { label: 'FX and total cost', href: `#${sectionIds.quote}` },
        ],
      },
    ] as FooterColumn[],
    nextTag: 'Next',
    activeTag: 'Active',
    regulatoryHeading: 'STRAITON / REGULATORY INFORMATION',
    regulatoryBody:
      'Design placeholder. Approved legal entity details and regulatory disclosures will be supplied separately. Do not infer licensing, coverage or guaranteed execution from this prototype.',
  },

  /* -------------------------------------------------------- form microcopy */

  form: {
    labels: {
      amount: 'Payment amount',
      currency: 'Funding currency',
      paymentType: 'Payment type',
    },
    placeholders: {
      amount: 'e.g. AED 250,000',
      select: 'Select',
    },
    /** Every field's aria-describedby must always resolve. Each field renders
     *  either its error message or this persistent helper, both under the same
     *  id. A dangling IDREF here is an axe violation firing on the resting
     *  state of the page's primary form. */
    helpers: {
      amount: 'Numbers only. We format it for you.',
      currency: 'AED or USD.',
      paymentType: 'Supplier, invoice or other eligible business payment.',
    },
    errors: {
      amountEmpty: 'Enter the payment amount.',
      amountNotNumeric: 'Enter a number, without currency symbols.',
      amountTooLow: 'Enter an amount above 1,000.',
      currencyEmpty: 'Choose a funding currency.',
      paymentTypeEmpty: 'Choose a payment type.',
    },
    currencyOptions: ['AED', 'USD'] as Currency[],
    paymentTypeOptions: [
      'Supplier payment',
      'Invoice payment',
      'Other eligible business payment',
    ] as PaymentType[],

    confirmation: {
      badge: 'DEMO ONLY',
      heading: 'Assessment request received.',
      body: 'An India payments manager reviews corridor eligibility, quote structure and the document checklist for a payment of this type, then comes back to you directly.',
      summaryLabels: {
        amount: 'AMOUNT',
        currency: 'FUNDING CURRENCY',
        paymentType: 'PAYMENT TYPE',
      },
      caption:
        'This is a prototype. Nothing was sent, no payment was created and no data left your browser.',
      restart: 'Start another assessment',
    },
  },

  /* -------------------------------------------------------- shared markers */

  markers: {
    illustrative: 'Illustrative',
    tbc: 'To be confirmed',
  },
} as const

export type Landing = typeof landing
