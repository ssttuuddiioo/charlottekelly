/**
 * Projects carried over from charlottekellycopy.com.
 *
 * Titles and the services line are Charlotte's own, taken from each project
 * page on the old site. Images are the files already sitting in /public.
 *
 * This is placeholder data for the landing review. From phase 4 onward the same
 * shape comes out of Sanity, where `services` becomes the required one-line
 * summary and every image carries its own required alt text. Until then, alt
 * falls back to the project title, which is a stand-in, not real alt text.
 */
export type Project = {
  slug: string;
  title: string;
  services: string;
  credit?: string;
  image: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "snackville-at-pacific-park",
    title: "Snackville at Pacific Park",
    services: "Naming • messaging • brand guidelines",
    credit: "Zan Inc.",
    image: "/snackville.webp",
  },
  {
    slug: "nutrire",
    title: "Nutrire",
    services: "Creative concepts • product naming • packaging • verbal identity • messaging",
    image: "/NUTRIRE.webp",
  },
  {
    slug: "rux",
    title: "RUX",
    services: "Naming • verbal identity • site copy • brand story • messaging • brand guidelines",
    image: "/RUX_16.webp",
  },
  {
    slug: "fulton",
    title: "Fulton",
    services: "Verbal identity • messaging • brand story • blogs • packaging • site copy",
    credit: "Formal Studio",
    image: "/fulton.webp",
  },
  {
    slug: "eez-co",
    title: "EEZ Co.",
    services: "Verbal identity • brand story • messaging",
    image: "/eez.webp",
  },
  {
    slug: "doublesoul",
    title: "doublesoul",
    services: "Verbal identity • brand story • packaging • site copy",
    credit: "Formal Studio",
    image: "/DOUBLESoul.webp",
  },
  {
    slug: "respin-health",
    title: "Respin Health",
    services: "Creative concepts • brand positioning • manifesto • verbal identity • messaging • site copy",
    image: "/respin.webp",
  },
  {
    slug: "dame",
    title: "Dame",
    services: "Verbal identity • naming • newsletters • packaging • site copy • social",
    image: "/dame.webp",
  },
  {
    slug: "little-spoon",
    title: "Little Spoon",
    services: "Naming • messaging • packaging • site copy",
    image: "/littlespoon.webp",
  },
  {
    slug: "de-lune",
    title: "De Lune",
    services: "Verbal identity • brand story • product naming • packaging • site copy",
    credit: "Formal Studio",
    image: "/delune.webp",
  },
  {
    slug: "fair-harbor",
    title: "Fair Harbor",
    services: "Verbal identity • brand story • catalog • site copy",
    credit: "Formal Studio",
    image: "/fairharbor.webp",
  },
  {
    slug: "wilderness-trail",
    title: "Wilderness Trail",
    services: "Site copy • brand story • blog posts",
    image: "/Wilderness.webp",
  },
  {
    slug: "burts-bees",
    title: "Burt's Bees",
    services: "Verbal identity • site copy • emails • messaging",
    image: "/BurtsBees.webp",
  },
  {
    slug: "fur",
    title: "Fur",
    services: "Packaging • site copy",
    credit: "Formal Studio",
    image: "/fur.webp",
  },
  {
    slug: "targetbook",
    title: "Target: 20 Years of Design for All",
    services: "Articles • headlines • research",
    credit: "Marian Shelley Acuña",
    image: "/Target.webp",
  },
  {
    slug: "pernod-ricard",
    title: "Pernod Ricard",
    services: "Site copy • blogs • banner ads • gift guides • newsletters • ads • social • campaign scripts",
    image: "/PernodRicard.webp",
  },
  {
    slug: "tabitha-brown-target",
    title: "Tabitha Brown for Target",
    services: "Magazine copy • copyediting",
    image: "/TabithaBrownForTarget_02.webp",
  },
];
