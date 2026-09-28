# Straiton, web designer assignment

**Live preview:** _[Vercel URL]_
**Source:** _[repo URL]_
**Approximate time spent:** _[fill in]_

Route A, Vercel preview. A deployed Next.js page plus editable source, rather than a Figma file. I design and ship the front end, so the working build is the deliverable and the design system sits inside it as code.

---

## The messaging decision

I rewrote the page around the problem the buyer actually has.

Speed and FX are what this category sells. But a UAE finance lead paying Indian suppliers loses more time to returned payments and document chases than to settlement. The supplier calls asking where the money is, and they do not have an answer. That is the pain worth naming.

So **payment readiness moved up the page and became the emotional centre**, and the four stage process follows it as the resolution. "Most India payments fail on paperwork, not on money" is the line the whole page hangs off.

The second decision was to **treat the pilot's unconfirmed parameters as an asset**. The corridor specification section shows payout method, cut-off, and minimum and maximum amount as explicitly `To be confirmed`. Every competitor hides this. Saying it out loud is the most credible differentiator available to a product that cannot yet make pricing or regulatory claims, and it sets the tone for everything else. There are exactly three of those chips and the build has a check that fails if that count ever changes.

The same logic drives FAQ seven. "Do you guarantee same-day execution?" is answered "No." That is the page's credibility anchor.

Tone is operator to operator. Short sentences, operational nouns, conditional wording preserved wherever capability is not confirmed. No guarantees, no pricing, no savings percentages, no regulatory claims. Every illustrative figure is visibly labelled. Stablecoins never appear in user facing copy, because the customer never touches them and should never be asked to.

Structurally I cut one dark section and redistributed the remaining three so they punctuate the page rather than weigh it down, and I moved quote structure forward to position four, because "what does this cost me" is the second question every reader has. Answering it immediately, even structurally rather than numerically, stops the page feeling evasive.

---

## The design decision

Restraint reads as trust in this category, so the page is mostly light, with large calm type and few colours.

Headings are **weight 400, not bold**. The authority comes from size and negative tracking. That one choice does more for the tone than any amount of colour would.

Three dark sections, evenly spaced, as punctuation. The footer shares the ink ground with the final CTA with no border between them, so the reader perceives one closing block rather than two.

Everything is built from a token layer. Every colour, type role, spacing step, radius, shadow and motion value is a CSS custom property, mapped into the Tailwind theme so class names reference tokens and never raw values. Changing a brand colour is a one line edit in one file.

The Tailwind spacing scale is **replaced rather than extended**, restricted to the permitted 4px steps. An off scale value has nothing to resolve to, so it fails while you are writing it instead of shipping as an element with no styling.

---

## Accessibility

Treated as a design constraint, not a pass at the end.

Measuring the contrast rather than reading it off the spec turned up **six corrections**. The pilot badge amber measured 3.85:1 on its own fill against a 4.5:1 requirement and was darkened. Two new tokens were added for strokes that carry meaning, because the specified values measured 2.0:1 and 1.56:1 against a 3:1 requirement. Two muted text tokens failed on the tinted fills they were specified to sit on, including the `To be confirmed` chip, which is one of the page's signature elements. A focus ring was added for dark surfaces, since the light one is invisible on ink.

Each correction is marked inline in the token file with its flag number and measured ratio. They need sign off and writing back into the design system.

The result: **zero axe violations** across WCAG 2.0 A and AA, 2.1 A and AA, and best practice. No state is signalled by colour alone, and the page is checked in greyscale. The mobile menu traps focus and returns it on close. Every form field's description resolves in every state, which is a real axe failure that is easy to ship by pointing a field at an error element that only exists while the error does.

---

## Assumptions

- **Contact details are placeholders.** The email uses the reserved `.example` TLD so it cannot resolve. The support section says so on the page.
- **The regulatory block is a neutral placeholder.** No licensing or coverage should be inferred from it.
- **No guide pages exist**, so the four resource rows point at the sections of this page that answer them, with a note telling the reader that is what will happen. Four dead links would have been worse.
- **The assessment form is three fields.** Adding a work email and company name in front of the conversion event contradicts "No signup required" and "No account needed", both of which I considered load bearing. Contact details are collected by the manager afterwards.
- **`Sign in` is not in the navigation**, because there is no sign in on this page. A nav item should resolve to something real or be removed.
- **The footer has three columns, not four.** About, Partners and Contact have no destination on a single page build.

---

## What I would do next

- **Automated accessibility and visual regression in CI.** The static guards catch content and token drift, but they cannot catch a computed contrast failure or a focus order problem. An axe pass and snapshots at five widths would make the responsive claims enforced rather than asserted.
- **Unit tests on the validation rules.** Pure functions with exact required messages, so the cheapest thing on the page to test and the easiest to break by editing a string.
- **A components board route**, rebuilt from the real primitives, so every variant and state is reviewable without hunting through the page and cannot drift from the code.
- Real guide pages, and scroll reveal, which is specified as optional and not implemented.

---

## Notes on the build

No backend, no authentication, no database, no payment processing. The assessment form runs real validation, waits a simulated delay, then resolves to a local confirmation state carrying a `DEMO ONLY` badge. No network request is made and nothing leaves the browser.

```bash
npm install && npm run dev
```

`npm run check` runs the content and token guards. `npm run check:classes` confirms every Tailwind class in the source actually emits CSS, which matters because Tailwind fails silently.

The README covers the token system, the component map, what is demo only, and known gaps.
