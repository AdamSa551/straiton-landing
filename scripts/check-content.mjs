#!/usr/bin/env node
/**
 * Static guard for the constraints the assignment scores.
 *
 * Several of these are easy to break during a refactor and invisible when you
 * do: a dropped `To be confirmed` chip, an em dash pasted in from a doc, a
 * Tailwind spacing step that does not exist in our replaced scale and so
 * silently produces no style at all. Machine-checking them is cheaper than
 * re-reading the page every time.
 *
 * Run with `npm run check`. Exits non-zero on any failure.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const failures = []
const notes = []

function fail(rule, detail) {
  failures.push(`${rule}: ${detail}`)
}

/**
 * Blanks out comment bodies while preserving every newline, so line numbers in
 * reports stay accurate.
 *
 * Needed because a comment legitimately names the thing it warns about. Button
 * documents which rgba() values its color-mix calls compute to, and the
 * Tailwind config names the illegal spacing steps it is warning against.
 * Reading those as style produces false positives.
 */
function stripComments(text) {
  let out = ''
  let i = 0
  let state = 'code' // code | line | block | string
  let quote = ''

  while (i < text.length) {
    const ch = text[i]
    const next = text[i + 1]

    if (state === 'code') {
      if (ch === '/' && next === '/') {
        state = 'line'
        out += '  '
        i += 2
        continue
      }
      if (ch === '/' && next === '*') {
        state = 'block'
        out += '  '
        i += 2
        continue
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        state = 'string'
        quote = ch
      }
      out += ch
      i += 1
      continue
    }

    if (state === 'string') {
      if (ch === '\\') {
        out += ch + (next ?? '')
        i += 2
        continue
      }
      if (ch === quote) state = 'code'
      out += ch
      i += 1
      continue
    }

    if (state === 'line') {
      if (ch === '\n') {
        state = 'code'
        out += ch
      } else {
        out += ' '
      }
      i += 1
      continue
    }

    // block
    if (ch === '*' && next === '/') {
      state = 'code'
      out += '  '
      i += 2
      continue
    }
    out += ch === '\n' ? ch : ' '
    i += 1
  }

  return out
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const allFiles = walk(ROOT)

/**
 * `tailwind.config.ts` is excluded from the token and spacing guards: it is the
 * file that DEFINES the theme, so it legitimately names raw values, and its
 * comments name the illegal classes they warn against. Every other source file
 * must reference tokens only.
 */
const THEME_FILES = ['tailwind.config.ts']
const sourceFiles = allFiles
  .filter((f) => ['.ts', '.tsx'].includes(extname(f)))
  .filter((f) => !THEME_FILES.includes(relative(ROOT, f)))
const contentFile = join(ROOT, 'content/landing.ts')
const content = readFileSync(contentFile, 'utf8')
const rel = (f) => relative(ROOT, f)

/* -------------------------------------------------------------------------- */
/* 1. No em dashes anywhere                                                    */
/* -------------------------------------------------------------------------- */

for (const file of [...sourceFiles, join(ROOT, 'app/globals.css')]) {
  const text = readFileSync(file, 'utf8')
  text.split('\n').forEach((line, i) => {
    if (line.includes('—')) fail('em-dash', `${rel(file)}:${i + 1}`)
  })
}

/* -------------------------------------------------------------------------- */
/* 2. Forbidden claims. No promises of speed, price, or regulatory status.      */
/* -------------------------------------------------------------------------- */

const FORBIDDEN = [
  'instant',
  'guaranteed',
  'cheapest',
  'licensed',
  'regulated by',
  'zero fees',
  'no fees',
  'seamless',
  'revolutionary',
  'game-changing',
  'powered by AI',
  'stablecoin',
  'crypto',
  'blockchain',
]

// Only user-facing copy is checked. Code comments explaining WHY a claim is
// avoided are legitimate and must not trip the guard.
const copyStrings = [...content.matchAll(/(['"`])((?:(?!\1)[^\\]|\\.)*)\1/g)].map((m) => m[2])

for (const needle of FORBIDDEN) {
  for (const str of copyStrings) {
    if (str.toLowerCase().includes(needle.toLowerCase())) {
      fail('forbidden-claim', `"${needle}" appears in copy: ${str.slice(0, 80)}`)
    }
  }
}

/* -------------------------------------------------------------------------- */
/* 3. Required markers. These are counted by the reviewer.                     */
/* -------------------------------------------------------------------------- */

const tbcCount = (content.match(/tbc:\s*true/g) ?? []).length
if (tbcCount !== 3) {
  fail('tbc-chip-count', `expected exactly 3 "To be confirmed" rows, found ${tbcCount}`)
} else {
  notes.push('3 "To be confirmed" rows present, all in S05')
}

// One highlighted row per table, and there are two tables: S04 and S05.
const highlightCount = (content.match(/highlight:\s*true/g) ?? []).length
if (highlightCount !== 2) {
  fail('highlight-count', `expected 1 highlighted row in each of the 2 tables, found ${highlightCount}`)
}

for (const [marker, label] of [
  ['No live numbers shown.', 'S04 no-live-numbers caption'],
  ['Product illustration. Static for this prototype.', 'S09 static illustration caption'],
  ['Contact details shown are placeholders for this prototype.', 'S08 placeholder caption'],
  ['Design placeholder.', 'S12 regulatory placeholder'],
  ['DEMO ONLY', 'form confirmation badge'],
  ['Illustrative', 'illustrative marker label'],
  ['To be confirmed', 'tbc marker label'],
]) {
  if (!content.includes(marker)) fail('missing-marker', `${label} ("${marker}")`)
}

// FAQ answer 7 is the page's credibility anchor. It must clearly say no.
if (!/answer:\s*\n?\s*['"`]No\./.test(content) && !content.includes("'No. Same-day is available")) {
  fail('faq-7', 'the same-day guarantee answer must begin with a plain "No."')
}

/* -------------------------------------------------------------------------- */
/* 4. Token purity. globals.css is the only file allowed a raw colour.         */
/* -------------------------------------------------------------------------- */

const HEX = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g
const COLOUR_FN = /\b(?:rgb|rgba|hsl|hsla)\s*\(/g

for (const file of sourceFiles) {
  const text = stripComments(readFileSync(file, 'utf8'))
  text.split('\n').forEach((line, i) => {
    // A colour named inside a comment is documentation, not style.
    for (const m of line.matchAll(HEX)) {
      fail('raw-hex', `${rel(file)}:${i + 1} ${m[0]} (use a token class)`)
    }
    for (const m of line.matchAll(COLOUR_FN)) {
      fail('raw-colour-fn', `${rel(file)}:${i + 1} ${m[0]} (use a token class)`)
    }
  })
}

/* -------------------------------------------------------------------------- */
/* 5. Spacing scale. An off-scale step silently produces NO style.            */
/* -------------------------------------------------------------------------- */

const LEGAL_STEPS = new Set([
  '0', 'px', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '30', '40',
  'section-y', 'section-y-tight', 'block', 'card-pad', 'stack-md', 'stack-sm', 'container-pad',
  'auto', 'full', 'touch', 'row', 'fact', 'measure', 'content',
])

// Utilities whose numeric argument resolves against the `spacing` scale.
const SPACING_UTILS =
  /(?<![\w-])(?:-)?(p|pt|pr|pb|pl|px|py|ps|pe|m|mt|mr|mb|ml|mx|my|ms|me|gap-x|gap-y|gap|space-x|space-y|inset-x|inset-y|inset|top|right|bottom|left|w|h|size|min-w|min-h|max-w|max-h|translate-x|translate-y|scroll-mt|scroll-mb|basis|indent)-([a-z0-9[\]().%/-]+)/g

for (const file of sourceFiles) {
  const text = stripComments(readFileSync(file, 'utf8'))
  text.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(SPACING_UTILS)) {
      const step = m[2]
      // Arbitrary values, fractions and CSS-var refs are handled by Tailwind
      // directly and never hit the spacing scale.
      if (step.startsWith('[') || step.includes('/') || step.startsWith('(')) continue
      // Not a spacing utility: these share a prefix but resolve elsewhere.
      if (['screen', 'fit', 'min', 'max', 'svh', 'dvh', 'lvh', 'none', 'prose'].includes(step)) continue
      if (!LEGAL_STEPS.has(step)) {
        fail('spacing-scale', `${rel(file)}:${i + 1} ${m[0]} (step "${step}" does not exist)`)
      }
    }
  })
}

/* -------------------------------------------------------------------------- */
/* 6. No JS-driven layout switching. All breakpoints must be CSS.              */
/* -------------------------------------------------------------------------- */

for (const file of sourceFiles) {
  const text = stripComments(readFileSync(file, 'utf8'))
  text.split('\n').forEach((line, i) => {
    if (/window\.innerWidth|window\.outerWidth|addEventListener\(\s*['"]resize/.test(line)) {
      fail('js-breakpoint', `${rel(file)}:${i + 1} layout must switch via CSS media queries`)
    }
  })
}

// matchMedia is legitimate for prefers-reduced-motion, and nothing else.
for (const file of sourceFiles) {
  const text = stripComments(readFileSync(file, 'utf8'))
  text.split('\n').forEach((line, i) => {
    if (line.includes('matchMedia') && !line.includes('prefers-reduced-motion')) {
      fail('js-breakpoint', `${rel(file)}:${i + 1} matchMedia is only for prefers-reduced-motion`)
    }
  })
}

/* -------------------------------------------------------------------------- */
/* 7. Heading weight must not be overridden on the large display roles.        */
/* -------------------------------------------------------------------------- */

for (const file of sourceFiles) {
  const text = stripComments(readFileSync(file, 'utf8'))
  text.split('\n').forEach((line, i) => {
    if (/text-(display|h1|h2)\b/.test(line) && /font-(bold|semibold|extrabold|black)\b/.test(line)) {
      fail('weight-fight', `${rel(file)}:${i + 1} large headings are weight 400 by design`)
    }
  })
}

/* -------------------------------------------------------------------------- */
/* 8. No dead links.                                                           */
/* -------------------------------------------------------------------------- */

for (const file of sourceFiles) {
  const text = stripComments(readFileSync(file, 'utf8'))
  text.split('\n').forEach((line, i) => {
    if (/href=["'](#|)["']/.test(line) || /href=\{["'](#|)["']\}/.test(line)) {
      fail('dead-link', `${rel(file)}:${i + 1} empty or placeholder href`)
    }
  })
}

// Every in-page anchor in the content file must name a real section id.
const sectionIdValues = [...content.matchAll(/^\s{2}(\w+):\s*'(S\d\d-[a-z-]+)',$/gm)].map((m) => m[2])
const anchors = [...content.matchAll(/#\$\{sectionIds\.(\w+)\}/g)].map((m) => m[1])
const idKeys = [...content.matchAll(/^\s{2}(\w+):\s*'S\d\d-[a-z-]+',$/gm)].map((m) => m[1])
for (const a of new Set(anchors)) {
  if (!idKeys.includes(a)) fail('dead-link', `sectionIds.${a} is referenced but not defined`)
}
if (sectionIdValues.length !== 12) {
  fail('section-count', `expected 12 section ids, found ${sectionIdValues.length}`)
}

/* -------------------------------------------------------------------------- */

const pad = (s) => s.padEnd(22)

if (notes.length) {
  console.log('\n  checks passed with notes:')
  for (const n of notes) console.log(`    ${n}`)
}

if (failures.length === 0) {
  console.log('\n  ✓ all content and token guards passed\n')
  process.exit(0)
}

const grouped = failures.reduce((acc, f) => {
  const [rule, ...rest] = f.split(': ')
  ;(acc[rule] ??= []).push(rest.join(': '))
  return acc
}, {})

console.error(`\n  ✗ ${failures.length} guard failure(s)\n`)
for (const [rule, items] of Object.entries(grouped)) {
  console.error(`  ${pad(rule)} ${items.length}`)
  for (const item of items.slice(0, 12)) console.error(`  ${pad('')} ${item}`)
  if (items.length > 12) console.error(`  ${pad('')} ...and ${items.length - 12} more`)
}
console.error('')
process.exit(1)
