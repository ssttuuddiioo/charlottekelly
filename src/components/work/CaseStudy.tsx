import Image from "next/image";
import { BodyRuns } from "@/components/work/BodyRuns";
import type { Project } from "@/lib/projects";

/**
 * The three parts of a case study every version renders the same way, each
 * styled by the template around it: the copy, the facts and the gallery.
 * Shared so her content reads identically in v1, v2 and v3 and only the
 * setting changes.
 */

/** Her copy, a paragraph per entry. `className` sets the type; paragraphs
    after the first are spaced by `gap`. */
export function Paragraphs({
  body,
  className = "",
  gap = "mt-[0.9em]",
}: {
  body: Project["body"];
  className?: string;
  gap?: string;
}) {
  return (
    <div className={`[&_a]:decoration-current ${className}`}>
      {body.map((runs, i) => (
        <p key={i} className={i ? gap : undefined}>
          <BodyRuns runs={runs} />
        </p>
      ))}
    </div>
  );
}

/** A name, linked where she links it. Links open in a new tab, as the
    copy's do. */
function Name({ name, href }: { name: string; href?: string }) {
  if (!href) return name;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-current underline-offset-[0.2em]"
    >
      {name}
    </a>
  );
}

/**
 * The project's facts, one labelled row each: Role, then Agency or Studio,
 * then Team where she credits one — a person to a line, "Web design: No
 * Ideas". Unstyled: each template lays it out — label beside value, or
 * stacked — through `className`, and sets the labels in its own way with
 * `term`, followed by `after` where it wants one ("Role:").
 */
export function Facts({
  project,
  className = "",
  term = "",
  after = "",
}: {
  project: Project;
  className?: string;
  term?: string;
  after?: string;
}) {
  const { role, agency, team } = project;
  const label = (text: string) => (
    <dt>
      <span className={term}>{text}</span>
      {after}
    </dt>
  );
  return (
    <dl className={className}>
      {label("Role")}
      <dd>{role.join(", ")}</dd>
      {label(agency.kind)}
      <dd>
        <Name {...agency} />
      </dd>
      {team?.length ? (
        <>
          {label("Team")}
          <dd>
            <ul>
              {team.map((member) => (
                <li key={`${member.role}-${member.name}`}>
                  {member.role}: <Name {...member} />
                </li>
              ))}
            </ul>
          </dd>
        </>
      ) : null}
    </dl>
  );
}

/**
 * The gallery, every image at its own proportions. Many of hers are
 * full-page screenshots of the sites she wrote — several times taller than
 * wide — and any fixed crop would show only a strip from the top of them.
 *
 * Two columns from md: a landscape image takes both, anything squarer or
 * taller takes one, so a 500 x 2191 page capture sits at half the width
 * instead of running several screens deep. One column on a phone.
 *
 * GIFs are left unoptimized: the optimizer would flatten them to their first
 * frame, and several of hers are animations.
 */
export function Gallery({
  project,
  sizes,
  well = "bg-alt-ink/5",
  className = "",
}: {
  project: Project;
  /** The `sizes` for a full-width image; half-width ones halve it. */
  sizes: { full: string; half: string };
  well?: string;
  className?: string;
}) {
  if (!project.gallery.length) return null;
  return (
    <ul className={`grid grid-cols-1 items-start gap-m md:grid-cols-2 ${className}`}>
      {project.gallery.map((shot, i) => {
        const wide = shot.width / shot.height >= 1.2;
        return (
          <li key={shot.src} className={wide ? "md:col-span-2" : undefined}>
            <div className={`${well} relative overflow-hidden`} style={{ aspectRatio: `${shot.width} / ${shot.height}` }}>
              <Image
                src={shot.src}
                alt={`${project.title}, ${i + 1} of ${project.gallery.length}`}
                fill
                sizes={wide ? sizes.full : sizes.half}
                unoptimized={shot.src.endsWith(".gif")}
                className="object-cover"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

type Shot = Project["gallery"][number];

/**
 * The picture a case study opens on: the widest landscape image in her
 * gallery — the sharpest at hero size, where the first is sometimes a small
 * screenshot that would be stretched soft — and never the thumbnail the
 * index already shows. Ties keep her order. A project whose gallery has no
 * landscape image opens on its first, cropped from the top: her tall images
 * are page captures, and the top is where they start. A project's own
 * `hero` overrides all of this.
 */
export function heroOf(project: Project): Shot | null {
  const chosen = project.gallery.find((shot) => shot.src === project.hero);
  if (chosen) return chosen;
  const landscape = project.gallery.filter((shot) => shot.width / shot.height >= 1.2);
  if (!landscape.length) return project.gallery[0] ?? null;
  return landscape.reduce((best, shot) => (shot.width > best.width ? shot : best));
}

/** Tallest a masonry tile may be, as height over width. Past this a page
    capture is cropped from its top rather than run to its full length. */
const MAX_TALL = 1.5;

/**
 * The rest of the gallery, small: a masonry of tiles in CSS columns, each
 * at its own proportions up to MAX_TALL, so a whole gallery reads at a
 * glance and the next project is never far below.
 */
export function Masonry({
  project,
  exclude,
  className = "",
}: {
  project: Project;
  /** The hero, so it is not shown twice. */
  exclude?: string;
  className?: string;
}) {
  const shots = project.gallery.filter((shot) => shot.src !== exclude);
  if (!shots.length) return null;
  return (
    <ul className={`columns-2 gap-2xs md:columns-3 xl:columns-4 ${className}`}>
      {shots.map((shot, i) => {
        const tall = shot.height / shot.width > MAX_TALL;
        return (
          <li key={shot.src} className="mb-2xs break-inside-avoid">
            <div
              className="bg-alt-ink/5 relative overflow-hidden"
              style={{ aspectRatio: `${shot.width} / ${Math.min(shot.height, shot.width * MAX_TALL)}` }}
            >
              <Image
                src={shot.src}
                alt={`${project.title}, ${i + 1} of ${shots.length}`}
                fill
                sizes="(min-width: 80rem) 15vw, (min-width: 48rem) 20vw, 45vw"
                unoptimized={shot.src.endsWith(".gif")}
                className={`object-cover ${tall ? "object-top" : ""}`}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
