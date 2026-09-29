import Image from "next/image";
import Link from "next/link";
import { MailingList } from "@/components/landing/MailingList";
import { Facts, heroOf, Masonry, Paragraphs } from "@/components/work/CaseStudy";
import { ProjectEnquiry } from "@/components/site/ProjectEnquiry";
import { FloatingMark } from "@/components/site/FloatingMark";
import { V3Motion } from "@/components/work/V3Motion";
import { PROJECTS, type Project } from "@/lib/projects";
import { AGENCIES, BIO_SHORT, EMAIL, NOTABLE, SERVICES, SOCIAL } from "@/lib/site";

/**
 * v3: every project in one column, and beside it, pinned, a short
 * column about her. Modelled on andiewexler.com, with the column set in the
 * blue of v2's sidebar.
 *
 * The landing and every case study are this one page. A project opens in
 * place, under its own row — a native <details>, so it opens, closes and is
 * announced as a disclosure with no JavaScript — and /v3/work/[slug] is the
 * same page with that row open and scrolled to. The motion — rows rising in,
 * the open and close animating — is layered on top in V3Motion.
 *
 * One size and one weight for every word. What sets things apart is only
 * where they sit: the title first, the scope in its own column, an
 * underline on a label or a link. The dashed hairline between rows is the
 * one rule on the page.
 */

/** Links and labels underline in the text's own black. The base rule would
    colour them with the cyanotype accent, which this page does not use. */
const UNDERLINE = "underline decoration-current underline-offset-[0.25em]";
export const LINK = `${UNDERLINE} min-h-tap inline-flex items-center`;

/**
 * The thumbnail, sized by height rather than as a share of the row. The
 * row's first line is as tall as its tallest cell, and the image has to be
 * that cell for the row to read as one shape: 13rem clears the longest
 * scope in the data (eight lines at the body size) with room. The width
 * follows from the print's proportions (543 x 714). The See project indent
 * repeats the width, written out: Tailwind only generates classes it can
 * read whole in the source.
 *
 * `wide` is v5's: 4:3 and about a third bigger by area, 15.2 x 11.4rem. It
 * still clears every scope but Pernod Ricard's nine lines, which also run
 * past the print. The print is cropped to its middle band to fill it.
 */
const THUMBS = {
  print: { box: "h-[13rem] w-[9.9rem]", sizes: "9.9rem", indent: "md:ml-[calc(9.9rem_+_var(--spacing-s))]" },
  wide: { box: "h-[11.4rem] w-[15.2rem]", sizes: "15.2rem", indent: "md:ml-[calc(15.2rem_+_var(--spacing-s))]" },
};

type Thumb = keyof typeof THUMBS;

function Row({
  project,
  open,
  thumb,
  lead,
}: {
  project: Project;
  open: boolean;
  thumb: Thumb;
  lead: boolean;
}) {
  const { box, sizes, indent } = THUMBS[thumb];
  const hero = heroOf(project);
  // With `lead`, the first paragraph comes out from the copy to open the
  // project, above the image, and the rest follow beside the facts.
  const [first, ...rest] = project.body;
  const body = lead ? rest : project.body;
  return (
    <li
      id={project.slug}
      data-row
      className="grid gap-x-s gap-y-2xs py-m md:grid-cols-[auto_minmax(0,1fr)_minmax(0,22%)] md:gap-y-0"
    >
      {/* The same shape as the tile in the blue column, and the tallest
          thing on the row's first line, which is what sets its height. */}
      <div
        // data-thumb: a click here opens and closes the row as See project
        // does (see V3Motion). Pointer only — keyboard users already have
        // See project, and a second stop for the same action is noise.
        data-thumb
        className={`${box} bg-alt-ink/5 relative cursor-pointer overflow-hidden md:col-start-1 md:row-start-1 md:self-start`}
      >
        <Image
          src={project.image}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>

      <div className="md:col-start-2 md:row-start-1">
        <h2>{project.title}</h2>
        <p className="pt-2xs">{project.summary}</p>
      </div>

      {/* The scope, one deliverable a line, unlabelled: in the third column
          of every row the position does the labelling. Sentence case for the
          first only, as the services line is written. Set right, against the
          row's edge, from md; stacked under the summary it stays left.

          Never taller than the image (see THUMBS), so it never sets the
          line's height. */}
      <ul className="md:col-start-3 md:row-start-1 md:self-start md:text-right">
        {project.services.split(" • ").map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>

      {/* Its own item on the row's second line rather than part of the text
          cell: <summary> cannot hold headings or paragraphs. It runs the
          whole row, so what opens sits on the thumbnail's left edge; the
          summary is indented to the text column instead, and pulled up by
          the height of its own tap target so the words sit on the image's
          bottom edge — into the empty foot of the text cell, which is never
          that tall. The opened content then starts under the image. */}
      <details
        open={open || undefined}
        data-slug={project.slug}
        data-tint={project.tint}
        className="group md:col-span-3 md:col-start-1 md:row-start-2"
      >
        <summary
          // flex w-fit, not inline-flex: a negative top margin cannot lift
          // an inline box above its line, and the pull-up below depends on it.
          className={`${UNDERLINE} min-h-tap flex w-fit cursor-pointer list-none items-end [&::-webkit-details-marker]:hidden md:-mt-tap ${indent}`}
        >
          <span className="group-open:hidden">See project</span>
          <span className="hidden group-open:inline">Close</span>
        </summary>

        {/* pt-l rather than pt-m: the longest scope in the data ends a few
            pixels below where a pt-m would put the top of this image. */}
        <div data-content className="pt-l">
          {lead && first ? (
            <Paragraphs body={[first]} className="max-w-[64ch] pb-m" />
          ) : null}

          {/* From her gallery rather than the thumbnail, so opening a row
              shows something the index does not. */}
          {hero ? (
            <div className="bg-alt-ink/5 relative aspect-video overflow-hidden">
              <Image
                src={hero.src}
                alt={project.title}
                fill
                sizes="(min-width: 64rem) 60vw, 88vw"
                unoptimized={hero.src.endsWith(".gif")}
                className={`object-cover ${hero.width / hero.height < 1.2 ? "object-top" : ""}`}
              />
            </div>
          ) : null}

          {/* The copy, and beside it the facts, in the row's own right
              column: the same 22% track and gap, so they sit under the scope
              above and set right as it is. Each label over its value, as the
              scope has one item a line; the labels take a colon, as the
              blue column's do, to tell them from the linked names. Stacked
              under the copy they stay left, as the scope does. */}
          <div className="grid gap-x-s gap-y-m pt-m md:grid-cols-[minmax(0,1fr)_minmax(0,22%)]">
            <Paragraphs body={body} className="max-w-[64ch]" />
            <Facts
              project={project}
              className="md:text-right [&>dt~dt]:pt-xs"
              term={UNDERLINE}
              after=":"
            />
          </div>

          {/* The rest of the gallery kept small, so the next project is a
              short scroll away rather than a gallery's length. */}
          <Masonry project={project} exclude={hero?.src} className="pt-m" />
        </div>
      </details>
    </li>
  );
}

/** A label in the about column: underlined, with its content under it. */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pt-m">
      <h2>
        <span className={UNDERLINE}>{label}</span>:
      </h2>
      {children}
    </div>
  );
}

/**
 * v3's blue column under the name: the short bio, her lists, the ways to
 * reach her and the sign-up. A fragment, so each block is the column's own
 * child — the entrance motion staggers them one by one, and the sign-up's
 * mt-auto can send it to the column's foot.
 */
function V3About() {
  return (
    <>
      <p className="pt-2xl">{BIO_SHORT}</p>

      <Group label="Notable clients">
        <p>{NOTABLE.join(", ")}</p>
      </Group>

      <Group label="Studios">
        {/* Comma-run like the clients above, each name its studio's link. */}
        <p>
          {AGENCIES.map((agency, i) => (
            <span key={agency.name}>
              {i ? ", " : null}
              <a href={agency.href} target="_blank" rel="noopener noreferrer" className="no-underline decoration-current hover:underline">
                {agency.name}
              </a>
            </span>
          ))}
        </p>
      </Group>

      {/* Services and the ways to reach her side by side, so the column
          stays short and top heavy and the name above has room to drift. */}
      <div className="grid grid-cols-2 gap-x-l">
        <Group label="Services">
          <ul>
            {SERVICES.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </Group>

        <Group label="Contact">
          <ul>
            <li>
              <a href={`mailto:${EMAIL}`} className={LINK}>
                Email
              </a>
            </li>
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={LINK}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </Group>
      </div>

      {/* The whole column's width, which the form it opens needs. */}
      <div className="pt-m">
        <ProjectEnquiry triggerClassName={LINK} />
      </div>

      {/* mt-auto sends it to the foot of the column when there is room,
          and lets it follow the links when there is not. */}
      <div className="mt-auto pt-2xl">
        <MailingList variant="sidebar" />
      </div>
    </>
  );
}

export function V3Page({
  base,
  open,
  hero,
  thumb = "print",
  about,
  lead = false,
  heading,
}: {
  base: string;
  open?: string;
  /** Set above the list, as a direct child of the column so it can pin
      against it. Pulls itself out through the column's padding to run edge to
      edge. v4's; v3 has none. */
  hero?: React.ReactNode;
  /** The rows' thumbnails: the print's portrait, or v5's wider 4:3. */
  thumb?: Thumb;
  /** What the blue column holds under the name. v3's lists by default;
      v5 swaps in a short bio that opens the rest. */
  about?: React.ReactNode;
  /** An open project's first paragraph set above its image rather than
      under it. v5's. */
  lead?: boolean;
  /** A visible heading over the list, in place of the hidden one. v5's. */
  heading?: string;
}) {
  // The open project's tint, set here too so a deep link arrives in its
  // colour rather than fading into it after load.
  const tint = PROJECTS.find((project) => project.slug === open)?.tint;

  return (
    // The ground is a variable rather than bg-alt-paper, so opening a row can
    // fade it to that project's tint (V3Motion sets --ground) and closing it
    // fades it back to the cream. The blue column paints its own ground and
    // is untouched.
    <div
      data-ground
      style={tint ? ({ "--ground": tint } as React.CSSProperties) : undefined}
      className="text-alt-ink font-display text-body min-h-dvh bg-[var(--ground,var(--color-alt-paper))] leading-[1.35] font-normal transition-[background-color] duration-700 ease-out lg:grid lg:grid-cols-[2fr_1fr] lg:items-start"
    >
      <V3Motion base={base} open={open} />

      {/* The blue column: full height and pinned from lg, running to the
          top and right edges of the page, the name at its head and the
          sign-up at its foot, 50px off the bottom edge. Taller than a short window,
          it scrolls on its own behind a hidden scrollbar rather than losing
          its foot. Below lg it is a blue block at the top of the page —
          first in the document for that reason, and put back on the right
          by the grid from lg. */}
      <aside
        aria-label="About Charlotte Kelly"
        data-about
        className="bg-alt-blue text-alt-paper flex flex-col px-[6vw] py-2xl lg:sticky lg:col-start-2 lg:row-start-1 lg:top-0 lg:h-dvh lg:overflow-y-auto lg:px-[3vw] lg:pt-2xl lg:pb-[50px] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
      >
        {/* The floating name — the header mark from v1, drawn larger — as
            the way home. The lockup is ~21 letters wide, so the letter size
            tracks the viewport to keep it inside the column at every width;
            the scatter and the drifting wave are the mark's own. */}
        <Link
          href={base}
          aria-label="Charlotte Kelly — home"
          className="block w-fit no-underline [&_.site-mark]:[--letter:clamp(0.625rem,1.1vw,1rem)]"
        >
          <FloatingMark />
        </Link>

        {about ?? <V3About />}
      </aside>

      <main className="px-[6vw] pb-3xl lg:col-start-1 lg:row-start-1 lg:px-[4vw]">
        {hero}
        {/* With `heading`, shown as the list's title at three times the
            size around it, in the same weight, with 100px more room above
            it than the list would have — positioned, as the list is, so it
            comes up over the pinned hero with it. data-list-head is what
            V5Tile scrolls to, so the heading lands on screen. */}
        {heading ? (
          <h1
            data-list-head
            className="relative pt-[calc(var(--spacing-l)+100px)] text-[3em] leading-[1.1]"
          >
            {heading}
          </h1>
        ) : (
          <h1 className="sr-only">Charlotte Kelly — work</h1>
        )}
        {/* Positioned so it paints over a hero that stays pinned while the
            list scrolls up across it (v4's). Without offsets it moves nothing. */}
        <ol className="divide-alt-ink relative divide-y divide-dashed">
          {PROJECTS.map((project) => (
            <Row key={project.slug} project={project} open={project.slug === open} thumb={thumb} lead={lead} />
          ))}
        </ol>
      </main>

    </div>
  );
}
