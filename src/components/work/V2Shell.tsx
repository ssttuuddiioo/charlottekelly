import type { ReactNode } from "react";
import Link from "next/link";
import { ProjectIndex } from "@/components/work/ProjectIndex";
import { V2Sidebar } from "@/components/work/V2Sidebar";
import { archivo, plexMono } from "@/lib/fonts";
import { PROJECTS } from "@/lib/projects";

/**
 * Everything in v2 that is not the project itself: the blue sidebar about
 * her, the index of every project, and the column the open project sits in.
 * The landing and every case study share it, so it is the layout for both,
 * and only the project column is re-rendered as you move between them.
 *
 * One column on a phone, two on a desktop, three on a wide one:
 *
 *   below lg    project, then the index, then the blue block
 *   lg          index | project, the blue block at the project's foot
 *   2xl         index | project | sidebar, the blue column on the far right
 *
 * The index is kept narrow — a sixth of the page with two columns, 11.5%
 * with three, half what the mock gave it — and the width it gives up goes to
 * the project; the blue column keeps the mock's 28%.
 *
 * The document order is the phone's — project, index, sidebar — which is
 * also the order they matter in; the grid only moves them. The index and,
 * at 2xl, the sidebar are pinned at the viewport's height and scroll on
 * their own, so the page's own scroll belongs to the project.
 */

/** Just what a thumbnail needs, so the project copy stays on the server. */
const ITEMS = PROJECTS.map(({ slug, title, image }) => ({ slug, title, image }));

const NAME =
  "text-small min-h-tap inline-flex items-center no-underline decoration-current hover:underline";

export function V2Shell({ base, children }: { base: string; children: ReactNode }) {
  return (
    <div
      className={`${archivo.variable} ${plexMono.variable} bg-alt-paper text-alt-ink font-display min-h-dvh lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,5fr)] 2xl:grid-cols-[minmax(0,11.5fr)_minmax(0,60.5fr)_minmax(0,28fr)]`}
    >
      {/* With no sidebar beside it, something has to say whose site this is
          and lead home. Above the project on a phone; above the index on a
          desktop, where that is the column on the left. */}
      <p className="px-[6vw] pt-2xs lg:hidden">
        <Link href={base} className={NAME}>
          Charlotte Kelly
        </Link>
      </p>

      <div className="min-w-0 lg:col-start-2">{children}</div>

      <ProjectIndex
        items={ITEMS}
        base={base}
        // Every row set explicitly at 2xl: row-span writes the grid-row
        // shorthand, which would otherwise wipe the row-start inherited from
        // lg and let auto-placement drop the index into a second row.
        //
        // The scrollbar is hidden, not the scrolling: wheel, trackpad, touch
        // and keyboard all still move the column. Drawn, it stood between the
        // index and the project as a stray grey rule, and the thumbnail cut
        // off at the foot of the column already says there is more below.
        className="lg:sticky lg:top-0 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-dvh lg:self-start lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden 2xl:row-span-1 2xl:row-start-1"
      >
        <p className="hidden px-[10%] pt-2xs lg:block 2xl:hidden">
          <Link href={base} className={NAME}>
            Charlotte Kelly
          </Link>
        </p>
      </ProjectIndex>

      <V2Sidebar
        base={base}
        className="lg:col-start-2 2xl:col-start-3 2xl:row-start-1 2xl:self-start"
      />
    </div>
  );
}
