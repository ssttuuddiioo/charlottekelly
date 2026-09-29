import Image from "next/image";
import { Facts, Gallery, Paragraphs } from "@/components/work/CaseStudy";
import type { Project } from "@/lib/projects";

/**
 * v2's case study: the project column of V2Shell, which supplies the sidebar
 * and the index around it.
 *
 * Laid out on the grid of the Jueves de [Archivo] series, loosened where the
 * poster's conventions got in the way:
 *
 *   title            the client's name, top left, her role under it
 *   descriptor       what the client makes, top right
 *   scope            the deliverables, grouped in the order they happened
 *   photograph       the hero image
 *
 * then the copy and any further images. Sentence case throughout: in
 * capitals at full weight the sheet read as corporate signage rather than as
 * her work.
 *
 * One black for every word on the cream, and two weights — semibold for the
 * title and headings, regular for everything else — shared with the index
 * beside it, so hierarchy comes from size and weight, not from greys.
 *
 * A slot with nothing to fill it is left out rather than padded. Only Fulton
 * fills them all so far — projects.ts notes which field feeds which slot.
 */

/*
 * The project is a size container, and everything inside it is measured in
 * cqi — hundredths of the column's width — so the layout keeps its
 * proportions at whatever width the column gives it, the way a poster does
 * when it is scaled. The clamps are legibility floors and ceilings on top of
 * that; the mono in particular sits on its 12px floor at most widths.
 */

/** Gap only on x: the rows differ too much in what they need vertically for
    one value to suit them, so each sets its own. The scope's nested pair
    repeats this gap, which is what lands its second column on column 6.
    Shared with the landing, so the columns hold still between the two. */
export const GRID = "grid gap-x-[3cqi] @md:grid-cols-8";

/** The running copy — a case study's body, and the landing's bio. */
export const COPY = "text-[clamp(1.125rem,0.95rem+0.6vw,1.75rem)] leading-[1.22]";

/** The small labels. Mono, at a 12px floor. */
const LABEL = "font-poster-mono text-[clamp(0.75rem,1.7cqi,0.9375rem)] leading-[1.35]";

/** Everything set big that is not the title. */
const HEAD =
  "text-[clamp(1.0625rem,3.2cqi,1.875rem)] leading-[1.05] font-semibold tracking-[-0.015em]";

/** `base` is unused here — the shell carries every link out of the page —
    but kept so every version's template takes the same props. */
export function V2Project({ project }: { project: Project; base: string }) {
  // Without groups of its own, the services line stands in as one untitled
  // group running across both columns.
  const scope: { title?: string; items: string[] }[] = project.scope ?? [
    { items: project.services.split(" • ") },
  ];

  return (
    <div className="px-[6vw] pt-l pb-3xl lg:px-[4%]">
      <article className="@container font-poster">
        {/* Title over the columns the descriptor leaves it, her role under
            it, the descriptor on the right from column 6 — the edge the
            second scope group starts on below. In the document the
            role follows the title, so on a narrow column, where the
            three stack, they stay under it there too; the grid lifts the
            descriptor back up beside the title once there is room. */}
        <header className={`${GRID} items-start gap-y-[2.5cqi]`}>
          <h1 className="text-[clamp(2.75rem,10.5cqi,7rem)] leading-[0.95] font-semibold tracking-[-0.035em] [overflow-wrap:anywhere] @md:col-span-5">
            {project.title}
          </h1>
          <p className="font-display text-[clamp(1rem,2.4cqi,1.5rem)] leading-[1.2] @md:col-span-5">
            {project.role.join(", ")}
          </p>
          {project.descriptor ? (
            <p className={`${HEAD} @md:col-span-3 @md:col-start-6 @md:row-start-1 @md:pt-[0.35em]`}>
              {project.descriptor}
            </p>
          ) : null}
        </header>

        {/* Baseline-aligned across the row, so Scope and the group headings
            — or, without groups, the first line of services — sit on one
            line. Each group is its heading flush left with its items under
            it; the order carries the sequence, so there are no numbers. */}
        <section
          aria-labelledby="scope"
          className={`${GRID} gap-y-[3cqi] pt-[14cqi] @md:items-baseline`}
        >
          <h2 id="scope" className={`${HEAD} @md:col-span-2`}>
            Scope
          </h2>
          <ol className="grid gap-x-[3cqi] gap-y-[4cqi] @md:col-span-6 @md:grid-cols-2">
            {scope.map((group) => (
              <li
                key={group.title ?? "services"}
                className={group.title ? undefined : "@md:col-span-2"}
              >
                {group.title ? <h3 className={HEAD}>{group.title}</h3> : null}
                {/* The space before each dot is non-breaking, so a line
                    can end on a dot but never start with one. */}
                <p className={`${LABEL} ${group.title ? "pt-[1.5cqi]" : ""}`}>
                  {group.items.join(" · ")}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* The largest thing on the page at every width, so it loads first.
            Eager with high priority rather than `preload`, which Next 16
            recommends against where the layout can change the LCP element. */}
        <div className="bg-poster-well relative mt-[4cqi] aspect-[3/2] overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 96rem) 56vw, (min-width: 64rem) 77vw, 88vw"
            className="object-cover"
          />
        </div>
      </article>

      <Paragraphs body={project.body} className={`${COPY} pt-l`} />
      <Facts project={project} className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-s pt-m" term={LABEL} />

      <Gallery
        project={project}
        well="bg-poster-well"
        sizes={{
          full: "(min-width: 96rem) 56vw, (min-width: 64rem) 77vw, 88vw",
          half: "(min-width: 96rem) 28vw, (min-width: 64rem) 38vw, 88vw",
        }}
        className="pt-l"
      />
    </div>
  );
}
