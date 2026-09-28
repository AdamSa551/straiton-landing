#!/usr/bin/env node
/**
 * Verifies that every Tailwind class written in the source actually emits CSS.
 *
 * This exists because Tailwind fails SILENTLY. A class that does not resolve,
 * whether from a typo or from a spacing step this project deliberately removed,
 * produces no rule and no warning. The element just renders unstyled, which is
 * easy to miss on a page this long and impossible to catch with a type check.
 *
 * `check-content.mjs` catches the common case by validating spacing steps
 * against the permitted scale. This catches everything else: a misspelled
 * colour token, a variant prefix that is not configured, a type role that does
 * not exist.
 *
 * Method: compile the real config over the real source, then confirm each class
 * found in the source appears as a selector in the output. Both sides are
 * unescaped first, because Tailwind writes `,` as the CSS hex escape `\2c ` and
 * `:` as `\:`, so a naive string match reports false misses.
 *
 * Run with `npm run check:classes`. Exits non-zero on any class that emits
 * nothing.
 */

import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { extname, join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

/** Same comment blanker as check-content.mjs: a class name inside a comment is
 *  documentation, not something Tailwind was ever asked to emit. */
function stripComments(text) {
  let out = ''
  let i = 0
  let state = 'code'
  let quote = ''
  while (i < text.length) {
    const ch = text[i]
    const next = text[i + 1]
    if (state === 'code') {
      if (ch === '/' && next === '/') { state = 'line'; out += '  '; i += 2; continue }
      if (ch === '/' && next === '*') { state = 'block'; out += '  '; i += 2; continue }
      if (ch === '"' || ch === "'" || ch === '`') { state = 'string'; quote = ch }
      out += ch; i += 1; continue
    }
    if (state === 'string') {
      if (ch === '\\') { out += ch + (next ?? ''); i += 2; continue }
      if (ch === quote) state = 'code'
      out += ch; i += 1; continue
    }
    if (state === 'line') {
      if (ch === '\n') { state = 'code'; out += ch } else out += ' '
      i += 1; continue
    }
    if (ch === '*' && next === '/') { state = 'code'; out += '  '; i += 2; continue }
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

/* -------------------------------------------------------------------------- */
/* 1. Compile the real config over the real source.                           */
/* -------------------------------------------------------------------------- */

const outDir = mkdtempSync(join(tmpdir(), 'straiton-css-'))
const outFile = join(outDir, 'out.css')

try {
  execFileSync(
    'npx',
    ['tailwindcss', '-c', 'tailwind.config.ts', '-i', 'app/globals.css', '-o', outFile],
    { cwd: ROOT, stdio: 'pipe' }
  )
} catch (err) {
  console.error('\n  ✗ Tailwind build failed\n')
  console.error(String(err.stderr ?? err.message))
  process.exit(1)
}

/**
 * Undo CSS identifier escaping so the selector reads as the author wrote it.
 * `\2c ` and `\2C ` are the hex form Tailwind uses for a comma; a bare
 * backslash escapes the character that follows it.
 */
function unescapeCss(text) {
  return text
    .replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/\\(.)/g, '$1')
}

const emitted = unescapeCss(readFileSync(outFile, 'utf8'))

/* -------------------------------------------------------------------------- */
/* 2. Collect the classes the source actually writes.                         */
/* -------------------------------------------------------------------------- */

/**
 * Only `.tsx` files carry className strings. `content/landing.ts` is prose and
 * `lib/` is logic, and scanning either produces false hits: ordinary English
 * words like "gap", "select" and "left" are also Tailwind utility roots.
 */
const sourceFiles = walk(ROOT)
  .filter((f) => extname(f) === '.tsx')

/**
 * Only Tailwind-shaped tokens are considered. The leading group is the set of
 * utility roots this project actually uses; anything outside it is prose,
 * an identifier or a CSS variable name and is not a class.
 */
const UTILITY_ROOT =
  /^(?:(?:sm|md|lg|xl|table|process|hover|focus|focus-visible|active|disabled|last|first|group-hover|peer-focus|motion-safe|motion-reduce|aria-expanded|data-\[[^\]]+\]):)*-?(?:p|pt|pr|pb|pl|px|py|m|mt|mr|mb|ml|mx|my|gap|gap-x|gap-y|space-x|space-y|w|h|size|min-w|min-h|max-w|max-h|inset|inset-x|inset-y|top|right|bottom|left|flex|grid|grid-cols|grid-rows|col-span|row-span|items|justify|self|place|order|text|font|leading|tracking|uppercase|lowercase|normal-case|capitalize|truncate|align|whitespace|break|overflow|overflow-x|overflow-y|bg|border|border-t|border-r|border-b|border-l|border-x|border-y|rounded|rounded-t|rounded-b|rounded-l|rounded-r|shadow|opacity|outline|outline-offset|ring|ring-offset|cursor|pointer-events|select|appearance|transition|duration|ease|delay|animate|rotate|scale|translate|translate-x|translate-y|transform|sticky|fixed|absolute|relative|static|z|hidden|block|inline|inline-block|inline-flex|table-cell|sr-only|not-sr-only|aspect|object|fill|stroke|list|scroll-mt|scroll-mb|basis|grow|shrink|contents|isolate|antialiased|resize|caret|accent|underline|no-underline|underline-offset|decoration|line-through|indent|columns|content)(?:-[\w[\]().,%/#+*−-]+)?$/

const candidates = new Map() // class -> first "file:line"

/**
 * Utilities that are a bare word with no dash. Any other candidate must contain
 * a `-` or a variant `:`, otherwise a word in a comment or a sentence matches a
 * utility root and reports as a missing class.
 */
const STANDALONE = new Set([
  'flex', 'grid', 'hidden', 'block', 'inline', 'inline-block', 'inline-flex', 'contents',
  'relative', 'absolute', 'fixed', 'sticky', 'static', 'isolate', 'truncate', 'uppercase',
  'lowercase', 'capitalize', 'normal-case', 'italic', 'underline', 'no-underline',
  'line-through', 'antialiased', 'transform', 'grow', 'shrink', 'resize', 'sr-only',
  'not-sr-only', 'table-cell', 'columns',
])

function isUtilityShaped(token) {
  if (STANDALONE.has(token)) return true
  // Needs a value segment or a variant prefix to be a class rather than a word.
  return /[-:]/.test(token) && !/^[a-z]+$/.test(token)
}

for (const file of sourceFiles) {
  const text = stripComments(readFileSync(file, 'utf8'))
  text.split('\n').forEach((line, i) => {
    // Classes live inside string literals in this codebase.
    for (const m of line.matchAll(/(['"`])([^'"`\n]*)\1/g)) {
      for (const token of m[2].split(/\s+/)) {
        if (!token || token.includes('${')) continue
        if (!isUtilityShaped(token)) continue
        if (!UTILITY_ROOT.test(token)) continue
        if (!candidates.has(token)) candidates.set(token, `${relative(ROOT, file)}:${i + 1}`)
      }
    }
  })
}

/* -------------------------------------------------------------------------- */
/* 3. Report anything that emitted nothing.                                   */
/* -------------------------------------------------------------------------- */

// Utilities that legitimately emit no rule of their own: they only exist to be
// overridden by a paired responsive variant, or Tailwind folds them into a
// shared selector.
const NO_OP_OK = new Set(['transform', 'contents', 'isolate', 'static'])

const missing = []
for (const [cls, where] of candidates) {
  if (NO_OP_OK.has(cls)) continue
  // A selector is `.class` followed by a boundary: `{`, `,`, `:`, ` ` or `>`.
  if (!new RegExp(`\\.${escapeRegExp(cls)}(?=[{,:\\s>)])`).test(emitted)) {
    missing.push({ cls, where })
  }
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

if (missing.length === 0) {
  console.log(`\n  ✓ all ${candidates.size} Tailwind classes emit CSS\n`)
  process.exit(0)
}

console.error(`\n  ✗ ${missing.length} class(es) emit NO CSS and will render unstyled\n`)
for (const { cls, where } of missing) {
  console.error(`  ${where.padEnd(44)} ${cls}`)
}
console.error(
  '\n  A class that does not resolve is silent in the browser. Check it against\n' +
    '  tailwind.config.ts: the spacing scale is deliberately restricted, so an\n' +
    '  off-scale step like gap-7 has nothing to resolve to.\n'
)
process.exit(1)
