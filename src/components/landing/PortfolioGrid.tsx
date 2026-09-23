import type { ReactNode } from "react";
import { ProjectCard } from "@/components/work/ProjectCard";
import { PROJECTS, type Project } from "@/lib/projects";

/**
 * Proportions measured off the mock: three equal columns and ~10px gutters.
 * The card itself — crop, type, link — lives in ProjectCard, shared with the
 * "more work" row on a project page.
 *
 * The grid breaks once for an `interlude`, and both runs carry on in the same
 * columns on either side of it.
 */

/** Explicit column counts rather than auto-fit. Uncapped, auto-fit would keep
    adding columns on a wide display (5 at 1920px); the cards are meant to
    scale, not multiply. Gutters stay put. */
const COLUMNS = "grid grid-cols-1 gap-x-2xs gap-y-xl md:grid-cols-2 xl:grid-cols-3";

/** The grid is uncapped, so the columns are a fixed share of the viewport and
    sizes is expressed in vw: 3-up inside 84vw is ~28vw, 2-up is ~42vw, 1-up
    is 88vw. */
const SIZES = "(min-width: 80rem) 28vw, (min-width: 48rem) 42vw, 88vw";

/**
 * Where the grid breaks: after Little Spoon, which is the end of the third
 * row at three columns.
 *
 * Found by slug rather than written as `9`, so reordering the projects above
 * it keeps the break attached to the card it was chosen for. If that slug ever
 * goes, the break falls to the end of the list — the interlude lands late
 * rather than at the top of the page.
 */
const found = PROJECTS.findIndex((project) => project.slug === "little-spoon");
const BREAK = found === -1 ? PROJECTS.length : found + 1;

function Run({ projects }: { projects: Project[] }) {
  return (
    <ul className={COLUMNS}>
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} sizes={SIZES} />
        </li>
      ))}
    </ul>
  );
}

export function PortfolioGrid({ interlude }: { interlude?: ReactNode }) {
  return (
    /* Full page width — no max-width cap — so the columns keep growing with
       the viewport. Padding matches the bio copy above it exactly, and the
       interlude sits inside it, so everything here shares one left edge. */
    <div className="bg-alt-paper text-alt-ink px-[6vw] pb-3xl md:px-[8vw]">
      <section id="work" aria-labelledby="work-heading">
        <h2 id="work-heading" className="sr-only">
          Selected work
        </h2>
        <Run projects={PROJECTS.slice(0, BREAK)} />
      </section>

      {interlude}

      {/* Labelled by the first run's heading rather than given one of its own:
          it is the same list of work, continued, and announcing a second
          "Selected work" would say there were two. */}
      {BREAK < PROJECTS.length ? (
        <section aria-labelledby="work-heading">
          <Run projects={PROJECTS.slice(BREAK)} />
        </section>
      ) : null}
    </div>
  );
}
