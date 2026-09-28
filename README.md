# Straiton, UAE to India business payments landing page

A single responsive marketing landing page for Straiton, a cross-border B2B payments product, for the UAE to India corridor.

The page has one job: move a qualified reader from arrival to submitting a payment assessment request. That form is the conversion event. Secondary actions are "send us your existing bank quote" and "talk to an India payments manager on WhatsApp".

Twelve sections, one page. No backend, no authentication, no database, no payment processing.

---

## 1. Local setup

```bash
git clone <this-repo> && cd straiton-landing
npm install
npm run dev
```

Open `http://localhost:3000`.

Two more commands worth knowing:

```bash
npm run verify
```

Runs four things in order: the type check, the content and token guard, the Tailwind class-emission check, and a production build. This is what to run before pushing. Run it with the dev server stopped, since a production build writes to the same `.next` directory the dev server is serving from.

```bash
npm run check
```

The content and token guard on its own. See section 5.

```bash
npm run check:classes
```

Compiles the real Tailwind config over the real source and confirms every class in the codebase actually emits CSS. Worth its own command because Tailwind fails silently: a class that does not resolve renders unstyled with no warning.

Requires Node 18.17 or newer. No environment variables, no external services, no accounts.

---

## 2. The token system

Every colour, type role, radius, shadow and motion value is a CSS custom property declared once in [`app/globals.css`](app/globals.css). [`tailwind.config.ts`](tailwind.config.ts) maps those properties onto Tailwind class names, so no component names a colour or a type size directly.

Three things in the config are literal rather than token references, deliberately: the spacing scale, the breakpoints and a few named `min-height` / `min-width` values. Breakpoints cannot be custom properties at all, since those do not work inside media queries, and the spacing scale is literal because restricting it is the point, as below.

So a component writes `bg-brand-600`, never `bg-[#0B7F68]`.

### Changing a colour in one place

Edit the hex in `:root` in `app/globals.css`. That is the whole change. Every class bound to it updates, on both light and dark surfaces, in every component.

```css
:root {
  --brand-600: #0b7f68;  /* change this */
}
```

### Why the spacing scale is replaced, not extended

The design system permits exactly these steps: `4 8 12 16 20 24 32 40 48 64 80 96 120 160`. `tailwind.config.ts` **replaces** Tailwind's default `spacing` scale rather than extending it, so an off-scale class like `gap-7` or `p-9` has nothing to resolve to and emits no CSS at all.

That failure mode is silent in the browser, so [`npm run check`](scripts/check-content.mjs) catches it at author time instead.

Semantic spacing steps that flex between viewports are available as named classes: `py-section-y`, `gap-block`, `p-card-pad`, `gap-stack-md`.

### Typography roles carry four values at once

`text-h2` applies size, line height, letter spacing **and** weight together, so the three cannot drift apart between components. Large headings are deliberately weight **400**: the authority comes from size and negative tracking, not from bold. Adding `font-bold` on top of `text-display`, `text-h1` or `text-h2` is a guard failure.

Sizes interpolate with `clamp()` between the mobile and desktop anchors rather than snapping at a breakpoint.

### Breakpoints

Declared in `tailwind.config.ts`, not in `:root`, because CSS custom properties do not work inside media queries.

| Prefix | Width | What actually uses it |
|---|---|---|
| `sm` | 480px | the two form selects go side by side; the footer brand block spans two tracks |
| `table` | 620px | SpecTable switches from stacked blocks to two columns |
| `md` | 768px | one rule: the FAQ answer's inline-end padding, so it clears the chevron |
| `lg` | 1024px | utility bar and desktop nav appear, hamburger hides, hero goes two-column and its primary CTA hides |
| `process` | 1100px | the four-step process goes 4-across with connector arrows |
| `xl` | 1280px | configured, currently unused |

The footer's column collapse is **not** driven by a breakpoint. It uses `repeat(auto-fit, minmax(min(100%, 180px), 1fr))`, so the column count falls out of the available width on its own. Same for the fact, feature and step grids. Only the six behaviours above are breakpoint-switched.

All layout switching is CSS. No component reads `window.innerWidth`; the guard rejects it.

---

## 3. Component map

### Foundation

| File | Role |
|---|---|
| [`app/globals.css`](app/globals.css) | The token layer. Reset, reduced-motion block, focus backstop, three shared classes. |
| [`tailwind.config.ts`](tailwind.config.ts) | Tokens mapped to class names. Spacing scale replaced. |
| [`content/landing.ts`](content/landing.ts) | Every string on the page, typed. Copy changes never touch layout. |
| [`lib/validation.ts`](lib/validation.ts) | The three field rules and their exact messages. |
| [`lib/assessment.ts`](lib/assessment.ts) | The shared scroll-to-form-and-focus behaviour used by all four assessment CTAs. |

### Primitives, `components/ui/`

| Component | Variants and notes |
|---|---|
| `Button` | 4 variants x 6 states x 2 tones x 3 sizes. Polymorphic: renders `<a>` with `href`, else `<button>`. |
| `Input` | 6 states. `aria-describedby` always resolves. |
| `Select` | Native `<select>`, styled. Keyboard operable for free. |
| `Card` | `FactCard`, `FeatureCard`, `StepCard`, `ResourceCard`, `Panel`. |
| `Chip` | `EligibilityChip`, `StatusBadge`, `Tag`, `TbcChip`, `IllustrativeChip`, `TopicChip`, `CorridorTag`, `DemoOnlyBadge`. |
| `SpecTable` | Serves S04 dark and S05 light, two-column and stacked, from one DOM tree. |
| `Disclosure` | Controlled. Serves the FAQ set and the three hero micro-sections via a `size` prop. |
| `Section` | The shared section shell plus `SectionHeading`. Surfaces defined once. |
| `Icon` | Single stroke set, 1.5px, rounded joins. `aria-hidden` by default. |

### Sections, in render order

Position and section id are deliberately different things. The ids are the shared vocabulary with the design system, and they did not change when the narrative was reordered.

| # | id | Component | Surface |
|---|---|---|---|
| 1 | `S01-hero` | `S01Hero` + `AssessmentForm` | light |
| 2 | `S02-eligibility` | `S02Eligibility` | subtle |
| 3 | `S03-corridor-facts` | `S03CorridorFacts` | light |
| 4 | `S04-quote` | `S04Quote` | **dark** |
| 5 | `S06-readiness` | `S06Readiness` | light |
| 6 | `S07-process` | `S07Process` | subtle |
| 7 | `S05-spec` | `S05Spec` | light |
| 8 | `S08-support` | `S08Support` | **dark** |
| 9 | `S09-workspace` | `S09Workspace` + `WorkspaceIllustration` | light |
| 10 | `S10-faq` | `S10Faq` | light |
| 11 | `S11-final-cta` | `S11FinalCta` | **dark** |
| 12 | `S12-footer` | `SiteFooter` | **dark**, continuous with 11 |

Three dark blocks, evenly spaced, so the page reads light. The footer shares the ink ground with S11 with no border between them, so the reader perceives one closing block rather than two.

Plus `SiteHeader` and `MobileMenu`, outside the section sequence.

---

## 4. What is demo only

Everything in this list is a prototype stand-in and is labelled as such on the page.

**The assessment form confirmation.** Submitting runs the real validation, then waits 700ms and swaps the form for a confirmation state. **No network request is made.** Nothing is sent, no payment is created, and no data leaves the browser. The confirmation carries a visible `DEMO ONLY` badge and says this in its caption.

**All contact details are placeholders.** Phone `+971 00 000 0000`, email `india@straiton.example`, WhatsApp `wa.me/971000000000`. The email uses the reserved `.example` TLD so it can never resolve. S08 carries a visible caption saying the details are placeholders.

**The workspace illustration** in S09 is static markup, not a screenshot and not live data. Its `AED 250,000` and `QTE-000-000` are illustrative. The frame is `role="img"` with a descriptive label, and a caption below it reads "Product illustration. Static for this prototype."

**The regulatory block** in the footer is a neutral design placeholder. No licensing, coverage or execution guarantee should be inferred from it.

**The four guide rows** in S10 point at the sections of this page that answer them, because no guide pages exist. A closing note tells the reader that is what will happen. This was chosen over four dead links. Swap the four `href`s and delete the note when real guides ship.

**The two future corridors** in the footer, UAE to Philippines and UAE to China, are plain text rather than links, because they do not resolve anywhere.

---

## 5. Guards

`npm run check` statically verifies the constraints the brief scores, because several of them are easy to break in a refactor and invisible when you do.

| Guard | What it catches |
|---|---|
| em dashes | Any `—` in source or copy, comments included |
| forbidden claims | `instant`, `guaranteed`, `cheapest`, `licensed`, `regulated by`, `zero fees`, and any mention of crypto or stablecoins, in user-facing copy |
| marker counts | Exactly three `To be confirmed` rows, one highlighted row per table, and every required caption present |
| token purity | Any raw hex or colour function outside the token layer |
| spacing scale | Any Tailwind spacing step that does not exist and so emits no CSS |
| JS breakpoints | `window.innerWidth`, resize listeners, `matchMedia` outside reduced-motion |
| weight fights | `font-bold` on a heading role that is deliberately weight 400 |
| dead links | Empty `href`, and any anchor naming a section id that is not defined |

Comment bodies are stripped before the style checks run, so a comment that documents the value it warns about does not trip the guard.

---

## 6. Accessibility notes

Targeting WCAG 2.1 AA. The specifics worth calling out:

- **Contrast is rated against the surface a token actually sits on**, not against the base surface. Five token corrections came out of this and are marked inline in `globals.css` with their flag number and measured ratio. Two are worth knowing: `--on-dark-muted` fails on `--ink-800` (4.44:1) and is valid on `--ink-900` only; `--text-muted` fails on `--surface-muted` (4.29:1), which is why `TbcChip` text is `--text-secondary`.
- **No state is signalled by colour alone.** Errors add an icon and text, the pilot badge adds a clock glyph, the active nav link adds a 2px underline and `aria-current`, the workspace progress rail distinguishes stages by filled check, ring and hollow, and its current stage label literally reads "Assess, current". The page is intended to survive a greyscale check.
- **Every field's `aria-describedby` resolves in every state**, rendering either the error or a persistent helper under the same id. A describedby pointing at an element that only exists during an error is an axe violation firing on the resting state of the page's primary form.
- **The mobile menu traps focus**: focus moves into the dialog on open, Tab and Shift+Tab wrap at both ends, Escape closes, body scroll locks and is restored on close and on unmount. `aria-controls` is present only while the panel is mounted.
- **One `h1`**, the hero proposition. Section headings are `h2`, card titles `h3`, no skipped levels.
- **`prefers-reduced-motion`** collapses durations, removes transform movement, switches programmatic scrolling to instant, and drops the post-scroll focus delay to zero.
- Focus is visible on every interactive element, with a global `:focus-visible` backstop so a missed component still shows something.

---

## 7. Known gaps and what would come next

**Needs sign-off, not more time.** Six changes to the design system came out of measuring contrast rather than reading it. Five are documented as flags in the design handoff and all are applied here: the pilot badge amber darkened to pass on its own fill, a focus ring added for dark surfaces, two new tokens for strokes that carry meaning, and the two muted-token corrections above. The sixth is the dark pressed primary, which adds an inset shadow instead of darkening a third step, because a third step drops the label below 4.5:1 against its own fill. These should be written back into design system section 4.

**Deliberate departures from the spec, flagged rather than hidden.**
- The assessment form is three fields. Design system 5.9 mentions a work email and company name on a submit step; adding two required fields in front of the conversion event contradicts "No signup required." and "No account needed.", both of which are approved copy. Contact details are collected by the manager afterwards.
- `Sign in` is not in the nav. There is no sign-in on this page, and 5.7 requires a nav item to resolve or be removed.
- The footer has three columns, not the four in the approved copy. About, Partners and Contact have no destination on a single-page build.
- Spec tables stack on mobile rather than scrolling inside a container. Design system 4.4 says scroll with an edge fade; the later responsive checklist says stack. The checklist is the scored document.
- **The amount field's floor message was reworded.** The approved copy reads "Enter an amount above 1,000.", which asserts a minimum, while S05 lists "Minimum / maximum amount" as `To be confirmed`. The page contradicted itself on the one field the reader types into, and on exactly the point it is built around. It now reads "Enter a larger amount so we can assess it." The validation floor is unchanged; only the wording moves from a product limit to an input rule.

**What I would do with more time.**
- **Automated accessibility and visual regression in CI.** `npm run check` is static analysis over source. It cannot catch a computed contrast failure or a focus order problem. An axe pass against the rendered page plus Playwright snapshots at 320, 390, 768, 1024 and 1440 would close that gap, and the responsive claims here would then be enforced rather than asserted.
- **Unit tests on `lib/validation.ts`.** The rules are pure functions with exact required messages, which makes them the cheapest thing on the page to test and the easiest to break by editing a string.
- **Real guide pages**, so S10's four rows stop pointing back at this page.
- **Scroll reveal.** Specified as optional and not implemented. The motion tokens are in place for it.
- **A components board route.** The design handoff ships one as HTML. Rebuilding it at `/components` from the real primitives would make every variant and state reviewable without hunting through the page, and would keep the board from drifting from the code.
- **`next/image` and an asset pipeline**, if any real imagery ever replaces the built illustration. Nothing on the page is currently a raster image, which is why there is none.

---

## 8. Provenance

Built against two binding specs and a design handoff pack:

- `STRAITON-DESIGN-SYSTEM.md`, the visual and technical system. Wins over any screenshot.
- `STRAITON-NARRATIVE-AND-COPY.md`, the approved section order and all page copy, used verbatim.
- `design-handoff/`, five documents covering foundations, components, sections, behaviour and the review boards.

Where the design system and the later responsive checklist disagreed, the checklist won, because it is the scored document. Every such decision is noted at the point it applies.
