/**
 * The layouts under review, side by side.
 *
 * Each one is the whole site under its own prefix — /v1, /v2 — reading the
 * same projects and posts, so the only thing that differs between them is the
 * design. The root page lists each.
 *
 * Adding one is an entry here plus its three parts under app/[version]/(shell):
 * a shell in layout.tsx, a landing in page.tsx and a case-study template in
 * work/[slug]/page.tsx. Each of those maps is typed against this list, so an
 * entry missing one fails the build rather than a page.
 */
export const VERSIONS = [
  {
    id: "v1",
    name: "Portfolio grid",
    note: "The site as built: the blue landing, and case studies under a fixed blue bar.",
  },
  {
    id: "v2",
    name: "Poster grid",
    note: "One layout for landing and case studies: a scrolling index of every project, the project beside it, and a sidebar about her. The landing sets out her bio and lists on the same grid.",
  },
  {
    id: "v3",
    name: "List",
    note: "Every project in one column, each opening in place under its own row; beside it, pinned and blue, a short column about her — bio, clients, studios, services, contact.",
  },
  {
    id: "v4",
    name: "List with hero",
    note: "v3, opening on a full-screen hero above the project list. A block of colour for now.",
  },
  {
    id: "v5",
    name: "List with takeover",
    note: "v4 with wider 4:3 thumbnails, and a blue column cut to her bio. Learn more spreads the blue over the page, carrying the rest of v2’s about.",
  },
] as const;

export type VersionId = (typeof VERSIONS)[number]["id"];

export const isVersion = (id: string): id is VersionId =>
  VERSIONS.some((version) => version.id === id);

/**
 * The case study every thumbnail opens on. Fulton, because it is the project
 * the v2 mock was drawn with and the only one carrying all of its slots.
 */
export const PREVIEW_SLUG = "fulton";
