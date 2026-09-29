"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Everything on v3's list that moves. Renders nothing; works on the rows the
 * server rendered, found by their data attributes.
 *
 * 1. Rows rise in as they enter the viewport, a few at a time. The hidden
 *    start state is set here rather than in CSS, inside a layout effect, so
 *    it is applied before first paint and a page without JavaScript shows
 *    everything as it is.
 *
 * 2. See project / Close. A <details> snaps open and shut; here the click
 *    is intercepted and the content animates — height and opacity — and
 *    only then is the element's own state changed. The native `toggle` event
 *    still fires afterwards, so the URL mirroring below sees every change.
 *
 * 3. On /v3/work/[slug] the row is already open in the HTML; this scrolls
 *    the page to it. window.scrollTo rather than scrollIntoView, which walks
 *    up through same-origin frames — the hub embeds this page in one and
 *    would be dragged along. Instant, before the rows' entrance runs, so the
 *    entrance happens where you land rather than where you were.
 *
 * 4. Toggling a row rewrites the address to that project, so an open row is
 *    a shareable URL and reload renders it open. replaceState, not push: the
 *    page has not changed, only what is open on it. `toggle` does not
 *    bubble, hence the capturing listener.
 *
 * 5. The thumbnail is a second way to open and close its row: a click on it
 *    is passed on to the row's See project, so it gets the same animation and
 *    the same URL change, and never drifts from it.
 *
 * 6. The page's cream fades to a project's tint when it opens, and any
 *    close fades it back to the cream — even with another row still open,
 *    the page returns to where it started rather than to another project's
 *    colour. The fade itself is a CSS transition on the ground.
 *
 * 7. Opening a row brings it to the top of the screen, 24px down so the
 *    dotted rule above it stays in view, on the same duration and ease as
 *    the opening — the page scrolls up and the project unfolds below in one
 *    movement. The scroll is a tween calling window.scrollTo each frame
 *    rather than a fixed target, so near the foot of the page, where the
 *    document is not yet tall enough to reach it, it keeps gaining ground
 *    as the content grows.
 *
 * 8. Escape closes whatever is open, through each row's own Close, so it
 *    animates, returns the URL and fades back to the cream like a click.
 *
 * Reduced motion skips 1 and 2 and keeps 3, 4 and 5: the scroll is instant,
 * the URL is not motion, and the thumbnail then opens the row without the
 * animation, as See project does.
 */
/** An element's distance from the top of the document by layout, not by
    getBoundingClientRect: the rect includes the rows' entrance transform,
    and a measurement taken mid-rise lands a scroll that much short. */
const layoutTop = (el: HTMLElement) => {
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) y += node.offsetTop;
  return y;
};

export function V3Motion({ base, open }: { base: string; open?: string }) {
  useGSAP(() => {
    if (open) {
      const row = document.getElementById(open);
      if (row) {
        const scrollToRow = () => window.scrollTo({ top: layoutTop(row) - 24, behavior: "instant" });
        scrollToRow();
        // Once more when the web font is in: the rows above reflow as it
        // swaps for the fallback.
        document.fonts.ready.then(scrollToRow);
      }
    }

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      const aside = document.querySelector<HTMLElement>("[data-about]");

      gsap.set(rows, { opacity: 0, y: 28 });
      if (aside) gsap.set(aside.children, { opacity: 0, y: 16 });

      ScrollTrigger.batch(rows, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.09,
            overwrite: true,
          }),
      });

      if (aside) {
        gsap.to(aside.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.2,
        });
      }

      // See project / Close. Only pointer and keyboard activations of the
      // summary come through here; a details opened by the browser (find in
      // page, say) just snaps, which is right for that.
      const onClick = (event: MouseEvent) => {
        const summary = (event.target as Element | null)?.closest("summary");
        const details = summary?.parentElement as HTMLDetailsElement | null;
        const content = details?.querySelector<HTMLElement>("[data-content]");
        if (!summary || !details || !content || !details.hasAttribute("data-slug")) return;
        if (gsap.isTweening(content)) {
          event.preventDefault();
          return;
        }
        event.preventDefault();

        if (details.open) {
          gsap.to(content, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            overflow: "hidden",
            onComplete: () => {
              details.open = false;
              gsap.set(content, { clearProps: "all" });
            },
          });
        } else {
          details.open = true;
          gsap.from(content, {
            height: 0,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            overflow: "hidden",
            onComplete: () => gsap.set(content, { clearProps: "all" }),
          });

          const row = details.closest<HTMLElement>("[data-row]");
          if (row) {
            const scroll = { y: window.scrollY };
            gsap.to(scroll, {
              y: layoutTop(row) - 24,
              duration: 0.6,
              ease: "power3.out",
              onUpdate: () => window.scrollTo(0, scroll.y),
            });
          }
        }
      };
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    });

    return () => mm.revert();
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      // Leave Escape alone in a text field: there it belongs to the field.
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;

      const open = [...document.querySelectorAll<HTMLDetailsElement>("details[data-slug][open]")];
      if (!open.length) return;
      event.preventDefault();

      for (const details of open) {
        const summary = details.querySelector("summary");
        // Focus inside what is about to close would be lost with it, so it
        // moves to the control that reopens it.
        if (details.contains(active) && summary !== active) summary?.focus({ preventScroll: true });
        summary?.click();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onThumb = (event: MouseEvent) => {
      const thumb = (event.target as Element | null)?.closest("[data-thumb]");
      thumb?.closest("[data-row]")?.querySelector("summary")?.click();
    };
    document.addEventListener("click", onThumb);
    return () => document.removeEventListener("click", onThumb);
  }, []);

  useEffect(() => {
    const onToggle = (event: Event) => {
      const details = event.target as HTMLDetailsElement;
      const slug = details.dataset?.slug;
      if (!slug) return;

      if (details.open) {
        history.replaceState(null, "", `${base}/work/${slug}`);

        // With reduced motion there is no tween to carry the scroll (see 7),
        // so the row is brought up here, at once.
        const row = details.closest<HTMLElement>("[data-row]");
        if (row && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          window.scrollTo({ top: layoutTop(row) - 24, behavior: "instant" });
        }
      } else if (location.pathname.endsWith(`/work/${slug}`)) {
        history.replaceState(null, "", base);
      }

      const ground = document.querySelector<HTMLElement>("[data-ground]");
      if (!ground) return;
      if (details.open && details.dataset.tint) ground.style.setProperty("--ground", details.dataset.tint);
      else ground.style.removeProperty("--ground");
    };
    document.addEventListener("toggle", onToggle, true);
    return () => document.removeEventListener("toggle", onToggle, true);
  }, [base]);

  return null;
}
