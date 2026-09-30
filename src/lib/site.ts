/**
 * The one copy of the site's own details.
 *
 * The footer and the slide-out menu show the same links in the same order, so
 * they read them from here rather than each keeping a list. Adding a social
 * account or changing the address is a one-line edit in one file.
 *
 * Hashes rather than hrefs: every version of the site has its own landing
 * (/v1, /v2), so each link is built against the version it is rendered in —
 * `${base}${hash}`, which also works from a project page, where the target
 * section is on another route.
 */
export const NAV = [
  { label: "Home", hash: "#top" },
  { label: "Work", hash: "#work" },
  { label: "About", hash: "#about" },
] as const;

export const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kellycharlotte/" },
  { label: "Instagram", href: "https://www.instagram.com/charlottekellycopy/" },
] as const;

export const EMAIL = "hello@charlottekelly.com";

/** The one-line bio, for the columns beside a project in v2 and v3. */
export const BIO_SHORT =
  "Charlotte Kelly is an independent senior copywriter, partnering with agencies, founders, and friends since 2015.";

/**
 * The long bio. v1's about section and v2's landing both set it, so it is
 * kept once. One string per paragraph.
 */
export const BIO = [
  "Charlotte Kelly is an independent senior copywriter. She has been partnering with agencies, studios, and friends on brand strategy, verbal identity, and all kinds of writing since 2015. Before then, she worked for literary agents and publishing houses. Her projects have ranged from groundbreaking startups to established global brands across beauty, wellness, tech, fashion, and more.",
  "After many years in NYC, she’s currently based in San Diego, CA, working with teams everywhere.",
];

/*
 * The lists from the about page on her current site, in her order, for v2's
 * landing and v3's column. The agencies carry the links her site gives them.
 */
export const AGENCIES = [
  { name: "Jones Knowles Ritchie", href: "https://jkrglobal.com" },
  { name: "Red Antler", href: "https://www.redantler.com" },
  { name: "Instrument", href: "https://www.instrument.com" },
  { name: "Smith & Diction", href: "https://smith-diction.com/" },
  { name: "Established", href: "https://establishednyc.com" },
  { name: "Company Policy", href: "https://www.companypolicy.studio" },
  { name: "Formal Studio", href: "https://formal-studio.com" },
  { name: "Zan Inc.", href: "https://www.zangoodman.com/" },
  { name: "Mythology", href: "https://www.mythology.com" },
  { name: "Chandelier Creative", href: "https://chandeliercreative.com" },
  { name: "Brains", href: "https://www.brains.co/" },
  { name: "SMAKK Studios", href: "https://smakkstudios.com" },
  { name: "Fonzie LA", href: "https://fonzie.la/" },
  { name: "DEBRAIN", href: "https://hellodebrain.com" },
];

export const NOTABLE = [
  "Gusto",
  "Target",
  "Dame",
  "Snackville at Pacific Park",
  "RUX",
  "EEZ Co.",
  "doublesoul",
  "Fair Harbor",
  "Fulton",
  "Burt’s Bees",
  "Little Spoon",
  "Gamma",
  "Fortell",
  "Wilderness Trail",
  "Campari",
  "Nutrire",
  "Commence",
  "Allies of Skin",
  "Respin Health",
  "Cynthia Cannell Literary Agency",
];

export const SERVICES = [
  "Brand strategy",
  "Creative concepts",
  "Brand narrative",
  "Copywriting",
  "Tone of voice",
  "Verbal identity",
  "Naming",
];
