/**
 * Smooth in-page scrolling, in JS rather than CSS.
 *
 * `html { scroll-behavior: smooth }` would be the obvious way to do this, but
 * it applies to EVERY scroll the page makes, including the instantaneous
 * corrections ScrollTrigger performs when it creates or refreshes a pin. Those
 * corrections then animate, which is what made the page appear to drift on
 * load. Keeping the smoothness here means only a deliberate click gets it.
 */

/** The fixed bar's height, so a section does not land underneath it. */
const headerHeight = () =>
  parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
  ) || 0;

export function scrollToHash(hash: string) {
  const behavior: ScrollBehavior = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
    ? "auto"
    : "smooth";

  // The hero is pinned, so while the pin is engaged its box sits at the top of
  // the viewport no matter where you are on the page — measuring it would give
  // a target of "wherever you already are". It opens the document, so 0 is
  // both correct and cheaper.
  if (hash === "#top") {
    window.scrollTo({ top: 0, behavior });
    return true;
  }

  const target = document.querySelector(hash);
  if (!target) return false;

  const top = window.scrollY + target.getBoundingClientRect().top - headerHeight();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

/**
 * Whether a link points at a section of the page we are already on — either
 * `#work` or `/#work` while at `/`. Returns the hash, or null if the link
 * should be left to the router.
 */
export function sameDocumentHash(link: HTMLAnchorElement) {
  if (link.target && link.target !== "_self") return null;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (url.pathname !== window.location.pathname) return null;
  return url.hash || null;
}
