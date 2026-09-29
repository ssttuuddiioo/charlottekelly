"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type IndexItem = { slug: string; title: string; image: string };

/**
 * v2's index: every project, a thumbnail and a title each, in a column that
 * scrolls on its own beside the one project open next to it.
 *
 * Rendered by the layout rather than the page, so it stays mounted while the
 * project beside it changes — the column keeps its scroll position and its
 * images, and only the project swaps. That is also why it works out which
 * project is open from the URL rather than being told: a layout is not
 * re-rendered with the page's params.
 *
 * `children` go above the list, inside the scrolling column — the shell puts
 * the name there on a desktop, where this is the column on the left.
 *
 * The open project is at full strength; the rest sit back, washed out, until
 * pointed at. On the landing no project is open, so none sits back. Only from lg up, where there is a pointer to point with and the
 * project is beside the list rather than above it — on a phone the list is
 * the way to everything else and should read as such.
 */
export function ProjectIndex({
  items,
  base,
  className = "",
  children,
}: {
  items: IndexItem[];
  base: string;
  className?: string;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const prefix = `${base}/work/`;
  const open = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : null;

  const column = useRef<HTMLDivElement>(null);

  // Bring the open project into view within the column — on a deep link to
  // the fourteenth project, say — without touching the page's own scroll.
  // Done by hand rather than with scrollIntoView, which would also scroll the
  // window wherever the column is not its own scroller (below lg).
  useEffect(() => {
    const scroller = column.current;
    const item = scroller?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!scroller || !item || scroller.scrollHeight <= scroller.clientHeight) return;

    const top = item.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    if (top >= 0 && top + item.offsetHeight <= scroller.clientHeight) return;
    // A little air above it, rather than the thumbnail flush with the top.
    scroller.scrollTop += top - 24;
  }, [open]);

  return (
    <div ref={column} className={className}>
      {children}
      <nav
        id="projects"
        aria-labelledby="projects-heading"
        // No top padding below lg: the project above already ends on its own.
        className="px-[6vw] pb-2xl lg:px-[10%] lg:pt-l"
      >
        {/* Visible only where the list follows the project down the page and
            needs saying what it is; beside it, the thumbnails say so. */}
        <h2 id="projects-heading" className="pb-l text-heading font-semibold lg:sr-only">
          All projects
        </h2>

        <ul className="flex flex-col gap-l">
          {items.map((item) => {
            const current = item.slug === open;
            const dim = open !== null && !current;
            return (
              <li key={item.slug}>
                <Link
                  href={`${prefix}${item.slug}`}
                  aria-current={current ? "page" : undefined}
                  className="group block no-underline"
                >
                  <div className="bg-poster-well relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 96rem) 10vw, (min-width: 64rem) 14vw, 88vw"
                      className={`object-cover transition-opacity duration-300 ${
                        dim
                          ? "lg:opacity-55 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
                          : ""
                      }`}
                    />
                  </div>
                  <p className="flex items-baseline justify-between gap-s pt-2xs text-[clamp(1.0625rem,0.95rem+0.4vw,1.375rem)] leading-[1.2] font-semibold">
                    <span className="group-hover:underline">{item.title}</span>
                    <span aria-hidden="true">→</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
