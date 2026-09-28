import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Inter, Inter_Tight } from 'next/font/google'
import { landing } from '@/content/landing'
import './globals.css'

/**
 * Fonts go through `next/font`, which self-hosts them at build time. The
 * design handoff loads them from Google Fonts because the prototyping
 * environment required it; here there is no render-blocking third-party
 * request and no layout shift, which is what the handoff asked for.
 *
 * Each family is exposed as a CSS variable so `globals.css` can keep owning
 * the `--font-display` / `--font-body` / `--font-mono` token names. The font
 * stack stays declared in one place: the token layer.
 */

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display-loaded',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body-loaded',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-loaded',
  display: 'swap',
})

export const metadata: Metadata = {
  title: landing.meta.title,
  description: landing.meta.description,
  robots: {
    // This is an assignment prototype with placeholder contact details and a
    // placeholder regulatory block. It should not be indexed.
    index: false,
    follow: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Deliberately not capping maximumScale. Blocking pinch zoom fails WCAG
  // 1.4.4. Fields are 16px so iOS does not auto-zoom on focus anyway.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
