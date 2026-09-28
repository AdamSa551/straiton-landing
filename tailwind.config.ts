import type { Config } from 'tailwindcss'

/**
 * Every value here resolves to a CSS custom property declared in
 * `app/globals.css`. Nothing in this file is a literal colour, type size or
 * shadow, so `globals.css` stays the single place a token changes.
 *
 * `spacing` is deliberately replaced rather than extended. The design system
 * permits exactly the 4px steps below, so an off-scale value like `p-[22px]`
 * or `gap-7` has no class to resolve to and fails visibly at author time
 * instead of quietly shipping.
 */

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    // Replaced, not extended. See note above.
    spacing: {
      0: '0px',
      px: '1px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
      30: '120px',
      40: '160px',
      // Semantic spacing, for the values that flex between viewports.
      'section-y': 'var(--space-section-y)',
      'section-y-tight': 'var(--space-section-y-tight)',
      block: 'var(--space-block)',
      'card-pad': 'var(--space-card-pad)',
      'stack-md': 'var(--space-stack-md)',
      'stack-sm': 'var(--space-stack-sm)',
      'container-pad': 'var(--container-pad)',
    },

    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      // Two layout-only thresholds. `process` switches the four-step layout,
      // `table` switches SpecTable between two-column and stacked.
      process: '1100px',
      table: '620px',
    },

    extend: {
      colors: {
        ink: {
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: 'var(--ink-600)',
          500: 'var(--ink-500)',
        },
        brand: {
          800: 'var(--brand-800)',
          700: 'var(--brand-700)',
          600: 'var(--brand-600)',
          500: 'var(--brand-500)',
          400: 'var(--brand-400)',
          100: 'var(--brand-100)',
        },
        'accent-line': 'var(--accent-line)',
        canvas: 'var(--canvas)',
        surface: {
          subtle: 'var(--surface-subtle)',
          muted: 'var(--surface-muted)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          field: 'var(--border-field)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        'on-dark': {
          primary: 'var(--on-dark-primary)',
          secondary: 'var(--on-dark-secondary)',
          muted: 'var(--on-dark-muted)',
        },
        status: {
          pilot: 'var(--status-pilot)',
          'pilot-bg': 'var(--status-pilot-bg)',
          info: 'var(--status-info)',
          success: 'var(--status-success)',
          error: 'var(--status-error)',
          'error-bg': 'var(--status-error-bg)',
        },
      },

      /**
       * Each role carries its size, line height, tracking and weight, so one
       * class applies the whole typographic role and the three values cannot
       * drift apart across components.
       */
      fontSize: {
        display: [
          'var(--t-display)',
          { lineHeight: 'var(--lh-display)', letterSpacing: 'var(--tr-display)', fontWeight: '400' },
        ],
        h1: [
          'var(--t-h1)',
          { lineHeight: 'var(--lh-h1)', letterSpacing: 'var(--tr-h1)', fontWeight: '400' },
        ],
        h2: [
          'var(--t-h2)',
          { lineHeight: 'var(--lh-h2)', letterSpacing: 'var(--tr-h2)', fontWeight: '400' },
        ],
        h3: [
          'var(--t-h3)',
          { lineHeight: 'var(--lh-h3)', letterSpacing: 'var(--tr-h3)', fontWeight: '500' },
        ],
        h4: [
          'var(--t-h4)',
          { lineHeight: 'var(--lh-h4)', letterSpacing: 'var(--tr-h4)', fontWeight: '600' },
        ],
        'body-lg': ['var(--t-body-lg)', { lineHeight: 'var(--lh-body)', fontWeight: '400' }],
        body: ['var(--t-body)', { lineHeight: 'var(--lh-body)', fontWeight: '400' }],
        'body-sm': ['var(--t-body-sm)', { lineHeight: 'var(--lh-body-sm)', fontWeight: '400' }],
        caption: ['var(--t-caption)', { lineHeight: 'var(--lh-caption)', fontWeight: '400' }],
        eyebrow: [
          'var(--t-eyebrow)',
          { lineHeight: 'var(--lh-eyebrow)', letterSpacing: 'var(--tr-eyebrow)', fontWeight: '600' },
        ],
        datalabel: [
          'var(--t-datalabel)',
          {
            lineHeight: 'var(--lh-datalabel)',
            letterSpacing: 'var(--tr-datalabel)',
            fontWeight: '600',
          },
        ],
        button: [
          'var(--t-button)',
          { lineHeight: '1', letterSpacing: 'var(--tr-button)', fontWeight: '600' },
        ],
      },

      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },

      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },

      boxShadow: {
        card: 'var(--shadow-card)',
        float: 'var(--shadow-float)',
        focus: 'var(--shadow-focus)',
        'focus-dark': 'var(--shadow-focus-dark)',
        'pressed-dark': 'var(--shadow-pressed-dark)',
      },

      maxWidth: {
        content: 'var(--content-max)',
        measure: 'var(--measure)',
      },

      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },

      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },

      minHeight: {
        // 44px is the minimum touch target. 56px is the minimum row height for
        // disclosure rows, spec table rows and nav rows.
        touch: '44px',
        row: '56px',
        fact: '184px',
      },

      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}

export default config
