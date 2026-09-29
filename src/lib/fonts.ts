import { Archivo, Google_Sans, IBM_Plex_Mono, Inter, Newsreader } from "next/font/google";

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

/**
 * v2's pair, after the Jueves de [Archivo] poster its case study is mapped to:
 * Archivo for everything set big, IBM Plex Mono for the small caps labels.
 *
 * Applied on v2's own wrapper rather than <html>, so v2 pages load them and
 * the rest of the site does not. That is also why theme.css reads them through
 * `@theme inline` — see the note there.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

/** Not variable, so the one weight in use has to be named. */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plex-mono",
  weight: "400",
});
