/**
 * Letter layout for the landing name.
 *
 * Both states — scattered and aligned — sit on ONE horizontal rhythm, measured
 * off the aligned mock: 1.56em centre-to-centre between letters, 2.75em between
 * the two words. The scatter then adds a small horizontal jitter and the
 * vertical offsets that give the composition its character.
 *
 * That shared rhythm is deliberate. In the original scattered mock the letter
 * gaps ranged from 9px to 97px, and the tightest pair sat 0.56 cap-heights
 * apart — close enough to read as one glyph. Keeping the advance constant fixes
 * the spacing, guarantees reading order, and turns the align into a mostly
 * vertical resolve, which is a better move than letters sliding sideways.
 *
 * `jx` is bounded to ±0.18em and alternates sign, so the worst-case gap between
 * neighbours is 1.26em rather than the 1.56em base — still comfortably clear.
 * `dy` is the vertical rhythm from the mock, untouched.
 */

/** em, centre-to-centre between adjacent letters in a word. */
export const ADVANCE = 1.56;
/** em, centre-to-centre between the last letter of CHARLOTTE and the K of KELLY. */
export const WORD_GAP = 2.75;

export type Letter = { ch: string; jx: number; dy: number };
export type Word = { word: string; letters: Letter[] };

export const WORDS: Word[] = [
  {
    word: "CHARLOTTE",
    letters: [
      { ch: "C", jx: 0.1, dy: 1.72 },
      { ch: "H", jx: -0.14, dy: 0.25 },
      { ch: "A", jx: 0.18, dy: 1.25 },
      { ch: "R", jx: -0.08, dy: -0.74 },
      { ch: "L", jx: 0.12, dy: -2.22 },
      { ch: "O", jx: -0.18, dy: -1.74 },
      { ch: "T", jx: 0.06, dy: 0.02 },
      { ch: "T", jx: -0.12, dy: 1.51 },
      { ch: "E", jx: 0.16, dy: 0.68 },
    ],
  },
  {
    word: "KELLY",
    letters: [
      { ch: "K", jx: -0.12, dy: -1.74 },
      { ch: "E", jx: 0.16, dy: 1.99 },
      { ch: "L", jx: -0.1, dy: -1.24 },
      { ch: "L", jx: 0.14, dy: 0.51 },
      { ch: "Y", jx: -0.16, dy: -0.24 },
    ],
  },
];

/**
 * A letter's aligned position as a MULTIPLE of the advance, measured from its
 * word's centre. Returned unitless on purpose: the advance itself is a CSS
 * variable (--adv) that changes at the md breakpoint, so the layout multiplies
 * this index by that variable rather than baking a length in here.
 */
export const alignedIndex = (i: number, n: number) => i - (n - 1) / 2;

/** Every letter in reading order, flattened — the order GSAP sees in the DOM. */
export const ALL_LETTERS: Letter[] = WORDS.flatMap((w) => w.letters);
