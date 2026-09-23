# charlottekelly.com

Portfolio for Charlotte Kelly — copywriter and associate creative director.
Replaces charlottekellycopy.com.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Sanity (embedded Studio at
`/studio`) · GSAP + ScrollTrigger · video on Cloudflare R2 · deployed on Vercel.

## Running it

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Design tokens

Everything visual keys off one file: [`src/styles/theme.css`](src/styles/theme.css).

- **Colour** — cyanotype / sun print. A faded Prussian blue ramp on warm paper
  white, built in OKLCH so the steps are perceptually even. Hue drifts from cyan
  at the pale end to violet at the deep end, the way a real sun print behaves.
  Components use the semantic roles (`ink`, `ink-muted`, `rule`, `wash`,
  `accent`), not the raw `blue-*` ramp.
- **Type** — seven fluid steps, `text-fine` through `text-display`, clamped
  between 320 and 1280px viewports. Display caps at 44px on purpose.
- **Space** — nine fluid steps, `3xs` through `3xl`, for layout rhythm.
  Tailwind's numeric scale (`p-2`, `gap-4`) is still there for small details.

Tailwind's own colour, type-size and breakpoint namespaces are cleared in that
file, so the only utilities available are this site's. The block is
`@theme static` rather than `@theme`, which forces every token to be emitted as
a CSS variable even when no utility class references it — needed because some
tokens are read via `var()` from inline styles.

`/styleguide` renders a live specimen of all of it. It is `noindex`.

## Landing (in review)

`/lab/landing` is the landing page: one composed sequence, not a set of options.

1. **Settle** — letters drop in from a common line above and land on the scatter.
2. **Wave** — a slow travelling swell passes through the name while it idles.
3. **Align** — on scroll, the scatter resolves to a single evenly-spaced
   baseline and the wave stills. Scrubbed, so scrolling back up re-scatters.

On screens at or above `md` the hero pins while the name resolves, so the
moment lands on screen instead of sliding off the top. Below `md` the two words
stack, the pin is dropped (viewport height changes on phones as browser chrome
hides, which makes a pinned trigger jump) and the align is shortened to finish
while the name is still visible. The Replay button re-runs the entrance.

Both states share one horizontal rhythm, measured off the aligned mock: 1.56em
between letters, 2.75em between words. The scatter adds a bounded ±0.18em
jitter and the vertical offsets. That is a deliberate change from the scattered
mock, where letter gaps ran from 9px to 97px and the tightest pair sat 0.56
cap-heights apart — close enough to read as a single glyph. A constant advance
fixes the spacing, guarantees reading order, and makes the align a mostly
vertical resolve.

The letters are `aria-hidden` decoration; the accessible name is an `sr-only`
`<h1>`. They start hidden in CSS with a `<noscript>` override, because setting
the hidden state after mount made the name flash in and out before settling.

This direction has its own palette block at the bottom of `theme.css` and uses
Google Sans. Nothing about it has been folded into the main tokens yet.

## Conventions

- Mobile first. Base styles for the smallest screen, `min-width` breakpoints up.
- `100dvh`, never `100vh`.
- No information behind hover; hover effects go inside `@media (hover: hover)`.
- Tap targets ≥ 44px (`min-h-tap`).
- Project text is server rendered. Motion is small client leaf components.

## Placeholders

The blue hue, the paper warmth, and both typefaces are placeholders pending
sign-off. Fonts swap in [`src/lib/fonts.ts`](src/lib/fonts.ts) alone.
