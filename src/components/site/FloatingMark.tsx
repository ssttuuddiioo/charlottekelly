import { WORDS, alignedIndex } from "@/components/landing/letters";

/**
 * The name lockup at mark size: the same scatter, the same travelling wave,
 * the whole of CHARLOTTE KELLY rather than a monogram.
 *
 * It reads from the same `letters.ts` the hero does, so the composition here is
 * the composition there — if a letter's offset is ever retuned, both move.
 *
 * Two things are scaled down rather than copied. `--letter` drops to ~10px, and
 * `--amp` drops to 0.45: at the hero's full amplitude the lockup would stand
 * 45px tall and could not sit in a bar at all, and at mark size the scatter
 * only has to be legible as a scatter, not as a composition you read.
 *
 * Structurally identical to ScatteredName: an absolutely positioned outer span
 * holds each letter's place, an inner span carries the wave, so the two
 * transforms compose instead of overwriting each other. The wave is CSS here
 * rather than GSAP — nothing about it is scroll-linked, and this keeps the
 * animation bundle off every project page.
 */

/** Seconds of phase per letter: the hero's 0.42 rad at its speed of 1.1 rad/s. */
const PHASE_STEP = 0.42 / 1.1;

export function FloatingMark() {
  let index = 0;

  return (
    <span aria-hidden="true" className="site-mark">
      {WORDS.map((word) => (
        <span
          key={word.word}
          className="site-mark__word"
          style={{ width: `calc(var(--adv) * ${word.letters.length - 1})` }}
        >
          {word.letters.map((letter, i) => {
            // Flat index across both words, so the wave travels through the
            // whole lockup the way it does in the hero rather than restarting
            // at the K of KELLY.
            const delay = `-${(index++ * PHASE_STEP).toFixed(2)}s`;

            return (
              <span
                key={`${word.word}-${i}`}
                className="site-mark__slot"
                style={{
                  left: `calc(50% + (var(--adv) * ${alignedIndex(i, word.letters.length)}) + ${letter.jx}em)`,
                  top: `calc(50% + (${letter.dy}em * var(--amp)))`,
                }}
              >
                <span className="site-mark__float" style={{ animationDelay: delay }}>
                  {letter.ch}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
