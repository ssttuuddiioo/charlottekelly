import { Google_Sans, Inter, Newsreader } from "next/font/google";

/**
 * PLACEHOLDER pairing while the real typefaces are chosen.
 *
 * Swapping is meant to happen here and nowhere else: these exports set CSS
 * variables that src/styles/theme.css reads, so no component references a
 * typeface by name.
 *
 * Newsreader carries the copy. It is a variable serif with a real italic and
 * an optical-size axis, which means it holds up at body size in long Portable
 * Text as well as it does in a heading. Inter is the meta face: navigation,
 * client, role, year. Two roles, not two moods.
 */
export const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Google Sans, for the alternate landing direction under review at
 * /lab/landing. It went up on Google Fonts in 2025, so next/font self-hosts it
 * at build like any other family — no licensing workaround needed.
 *
 * Variable across wght 400–700; the mock uses Medium, which is 500.
 */
export const googleSans = Google_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google-sans",
});
