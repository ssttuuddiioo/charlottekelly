/**
 * The one copy of the site's own details.
 *
 * The footer and the slide-out menu show the same links in the same order, so
 * they read them from here rather than each keeping a list. Adding a social
 * account or changing the address is a one-line edit in one file.
 *
 * Hrefs are root-relative with a hash (`/#work`, not `#work`) so the same list
 * works from a project page, where the target section is on another route.
 */
export const NAV = [
  { label: "Home", href: "/#top" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
] as const;

export const EMAIL = "hello@charlottekelly.com";
