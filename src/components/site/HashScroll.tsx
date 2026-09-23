"use client";

import { useEffect } from "react";
import { sameDocumentHash, scrollToHash } from "@/lib/scrollToHash";

/**
 * Smooth scrolling for in-page links, delegated from the document.
 *
 * This exists because `html { scroll-behavior: smooth }` cannot: that applies
 * to every scroll the document makes, including the instant corrections
 * ScrollTrigger performs around a pin, which is what made the landing drift on
 * load. Here only a click gets the smoothness.
 *
 * Delegated rather than wired into each link so the hero's nav and the footer's
 * nav — both server components — keep their plain anchors and stay out of the
 * client bundle.
 */
export function HashScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element | null)?.closest?.("a");
      if (!link) return;

      const hash = sameDocumentHash(link as HTMLAnchorElement);
      if (!hash || !scrollToHash(hash)) return;

      event.preventDefault();
      // The address bar still gets the hash, so the link stays shareable and
      // Back still works — just without the browser's own instant jump.
      history.pushState(null, "", hash === "#top" ? location.pathname : hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
