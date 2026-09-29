/**
 * Recent work, for the "Recently..." list.
 *
 * Titles and credits are Charlotte's own words, split at "with —" the studio
 * moves into the row's left cell, where it plays the part the publication
 * plays in the reference layout, and the rest of her line is the title
 * unaltered. Nothing here is paraphrased.
 *
 * DATES ARE INVENTED. They are the one field Charlotte has not supplied, and
 * the row design needs one. They are ordered to agree with the campaign
 * seasons named in the titles (a holiday '26 campaign is concepted in mid-'26,
 * a summer '25 campaign in early '25), but every one of them is a guess and
 * needs replacing before this is shown to anyone.
 *
 * Slugs are provisional too, and `image` and the body arrive with the post
 * page itself, so neither is modelled here yet.
 */
export type Post = {
  slug: string;
  title: string;
  /**
   * The studio or agency she did the work with. Exactly one, by design: the
   * row's left cell has one slot for it. Named `credit` to match the field
   * that already carries this in src/lib/projects.ts.
   */
  credit: string;
  /** ISO `YYYY-MM-DD`. Sorting and formatting both rely on that. */
  date: string;
  /**
   * The link behind "View project" on the entry page — whatever her about
   * page on charlottekellycopy.com links the entry to, which is sometimes
   * the client and sometimes the studio's write-up. Four entries have no link
   * there, so none here: a guessed domain would go out under a client's name.
   */
  clientUrl?: string;
};

/**
 * Newest first. Kept in order by hand rather than sorted on render — the file
 * is the running order, and a sort would hide a typo'd date instead of showing
 * it in the wrong place.
 */
export const POSTS: Post[] = [
  {
    slug: "gusto",
    title:
      "Verbal identity and copy as part of a full brand refresh for Gusto, the small business payroll and HR platform",
    credit: "Smith & Diction",
    date: "2026-08-04",
    clientUrl: "https://gusto.com/company-news/gusto-brand-refresh-2026",
  },
  {
    slug: "target-holiday-26",
    title: "Concepts for Target’s holiday ’26 campaign",
    credit: "Mythology",
    date: "2026-05-19",
  },
  {
    slug: "allies-of-skin",
    title:
      "Strategic foundations, voice guidelines, and messaging to refresh cult favorite skincare brand Allies of Skin",
    credit: "Established",
    date: "2026-02-10",
    clientUrl: "https://establishednyc.com/allies-of-skin",
  },
  {
    slug: "target-summer-25",
    title: "Concepts and scripts for Target’s summer ’25 campaign",
    credit: "Mythology",
    date: "2025-01-21",
  },
  {
    slug: "gamma",
    title: "Messaging for Gamma, a content creation platform",
    credit: "Smith & Diction",
    date: "2024-11-12",
    clientUrl: "https://gamma.app/",
  },
  {
    slug: "fortell",
    title:
      "Verbal identity and messaging for Fortell, a company making AI-powered hearing aids",
    credit: "Smith & Diction",
    date: "2024-09-03",
    clientUrl: "https://www.fortell.com/",
  },
  {
    slug: "commence",
    title:
      "Creative concepts, brand story, and messaging for Commence, a haircare line founded by Brooke Shields",
    credit: "Established",
    date: "2024-06-18",
    clientUrl: "https://establishednyc.com/commence",
  },
  {
    slug: "smash-kitchen",
    title:
      "Packaging and site copy for Smash Kitchen, a line of pantry staples from actor Glen Powell",
    credit: "Brains",
    date: "2024-04-09",
    clientUrl: "https://smashkitchen.com/",
  },
  {
    slug: "fashion-retailer",
    title:
      "Verbal identity, brand guidelines, and more as part of a brand refresh for a major fashion retailer",
    credit: "Instrument",
    date: "2024-01-23",
  },
  {
    slug: "cloud-platform",
    title: "Extensive site copy for a global cloud computing platform",
    credit: "Instrument",
    date: "2023-10-17",
  },
  {
    slug: "larret",
    title:
      "Verbal identity and menu copy for L’Arrêt, James Beard award-winning chef Mashama Bailey’s first Paris restaurant",
    credit: "Zan Inc.",
    date: "2023-07-25",
    clientUrl: "https://www.zangoodman.com/projects/larret",
  },
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * `2026-08-04` → `4 Aug 2026`.
 *
 * Deliberately string surgery rather than `Date` + `toLocaleDateString`: a
 * date-only ISO string parses as UTC while the formatter runs in the local
 * zone, so west of Greenwich every entry renders a day early. Splitting the
 * string cannot drift, and needs no locale to be pinned.
 */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}
