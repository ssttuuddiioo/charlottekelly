import type { ReactNode } from "react";
import Link from "next/link";
import { ContactForm } from "@/components/work/ContactForm";
import { COPY, GRID } from "@/components/work/V2Project";
import { V5Footer } from "@/components/work/V5Footer";
import { formatDate, POSTS, type Post } from "@/lib/posts";
import { AGENCIES, BIO, EMAIL, NOTABLE, SERVICES, SOCIAL } from "@/lib/site";

/**
 * v2's landing: what sits in the project column when no project is open.
 *
 * A structured version of the about page on her current site — the bio,
 * then one section per list — with its "Recently" swapped for the posts
 * list the v1 landing carries. Set on the same eight columns as a case study,
 * so opening a project from here the grid holds still.
 *
 * Old-fashioned grid rather than decoration: each section is a label on
 * columns 1–2 and its content on 3–8, lists run in columns that fall on the
 * grid's own, and sections are separated by space alone — no rules, no big
 * headings. A label differs from what it labels only by weight.
 */

/** One size for every label and list on the page; only the bio is larger. */
const TEXT = "text-[clamp(1rem,0.9rem+0.3vw,1.25rem)] leading-[1.35]";

const LINK = "no-underline decoration-current hover:underline";

/**
 * v5's takeover sets each section in a colour of its own: the label in it,
 * the whole section on a 15% tint of it. In page order, from the palette's
 * two triads (red, blue, orange; ocher, Lyons blue — the buff is too pale
 * to carry a label).
 */
const PALETTE = ["#d0402c", "#213bc9", "#eb9a5a", "#e2b540", "#1c4286"];

/** How many posts show before See more. */
const RECENT = 3;

/** One post: the title across four columns, who with and when across two. */
function PostRow({ post, base }: { post: Post; base: string }) {
  return (
    <li className="grid gap-x-[3cqi] @md:grid-cols-6">
      <Link href={`${base}/blog/${post.slug}`} className={`${LINK} @md:col-span-4`}>
        {post.title}
      </Link>
      <p className="@md:col-span-2">
        {post.credit}
        <br />
        {formatDate(post.date)}
      </p>
    </li>
  );
}

/** `top` is the space above a section — the gap between sections, less
    for one that opens the page. With a `color`, the label is set in it and
    the section sits on a 15% tint of it, full bleed: the tint runs edge to
    edge and meets the next section's with no gap, the gutter moving inside
    it and the line length held by the inner grid. */
function Section({
  id,
  label,
  top = "pt-2xl",
  color,
  children,
}: {
  id: string;
  label: string;
  top?: string;
  color?: string;
  children: ReactNode;
}) {
  const inner = (
    <>
      <h2 id={`${id}-label`} className="font-semibold @md:col-span-2" style={color ? { color } : undefined}>
        {label}
      </h2>
      <div className="@md:col-span-6">{children}</div>
    </>
  );
  // Baseline-aligned, so the label sits on the first line of its content.
  const grid = `${GRID} ${TEXT} gap-y-2xs @md:items-baseline`;

  if (!color) {
    return (
      <section id={id} aria-labelledby={`${id}-label`} className={`${grid} ${top}`}>
        {inner}
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className="px-[6vw] py-xl lg:px-[4%]"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)` }}
    >
      <div className={`${grid} max-w-[78rem]`}>{inner}</div>
    </section>
  );
}

/**
 * A list set in columns. The column gap is the grid's gap, so two columns
 * across six grid columns start on columns 3 and 6, and three start on 3, 5
 * and 7 — the list falls on the grid rather than beside it.
 *
 * Items hang: a name that wraps indents its second line, so "Cynthia Cannell
 * Literary Agency" cannot read as "Agency" on a line of its own.
 */
function Columns({ children }: { children: ReactNode }) {
  return (
    <ul className="columns-2 gap-x-[3cqi] @2xl:columns-3 [&>li]:break-inside-avoid [&>li]:pl-[0.75em] [&>li]:-indent-[0.75em]">
      {children}
    </ul>
  );
}

/** `bio` off leaves the bio out. `colored` gives each section a colour
    from PALETTE, for v5's takeover, where the bio sits above them on the
    cream. `posts` fills Recently — v5 passes
    one entry per project on its landing. */
export function V2Landing({
  base,
  bio = true,
  colored = false,
  posts = POSTS,
}: {
  base: string;
  bio?: boolean;
  colored?: boolean;
  posts?: Post[];
}) {
  const color = (i: number) => (colored ? PALETTE[i] : undefined);
  return (
    <div className={colored ? undefined : "px-[6vw] pt-l pb-3xl lg:px-[4%]"}>
      <div className="@container">
        <h1 className="sr-only">Charlotte Kelly</h1>

        {/* Seven columns rather than eight: at this size the full width runs
            past a comfortable line.

            In the takeover it is a section like the rest instead: "About" in
            the label column and the copy in the content column, on the edge
            the titles below start from. The page has no padding of its own
            there (the tinted sections run full bleed), so it takes theirs,
            on the cream, untinted. */}
        {bio && colored ? (
          <section
            id="about"
            aria-labelledby="about-label"
            className="px-[6vw] pt-s pb-xl lg:px-[4%]"
          >
            <div className={`${GRID} max-w-[78rem] gap-y-2xs @md:items-baseline`}>
              <h2 id="about-label" className={`${TEXT} font-semibold @md:col-span-2`}>
                About
              </h2>
              <div className={`${COPY} @md:col-span-6`}>
                {BIO.map((paragraph, i) => (
                  <p key={i} className={i ? "mt-[0.9em]" : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ) : bio ? (
          <div id="about" className={GRID}>
            <div className={`${COPY} @md:col-span-7`}>
              {BIO.map((paragraph, i) => (
                <p key={i} className={i ? "mt-[0.9em]" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {/* The v1 landing's list — what, who with, when — with the rules
            taken out; the gap between entries does their work. Each title
            opens its post.

            The newest three, and the rest behind See more. A plain <details>,
            as on v1: it opens and closes, works from the keyboard and is
            announced as a disclosure with no JavaScript. The control stays
            under the third entry when open — a hinge, not a footer. It sits
            in the title column, on the edge the titles start from. */}
        <Section id="recently" label="Recently" top={bio ? undefined : "pt-s"} color={color(0)}>
          <ol className="flex flex-col gap-y-s">
            {posts.slice(0, RECENT).map((post) => (
              <PostRow key={post.slug} post={post} base={base} />
            ))}
          </ol>
          {posts.length > RECENT ? (
            <details className="group pt-2xs">
              <summary className="min-h-tap inline-flex cursor-pointer list-none items-center underline decoration-current underline-offset-[0.25em] [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">See more</span>
                <span className="hidden group-open:inline">See less</span>
              </summary>
              <ol className="flex flex-col gap-y-s pt-2xs">
                {posts.slice(RECENT).map((post) => (
                  <PostRow key={post.slug} post={post} base={base} />
                ))}
              </ol>
            </details>
          ) : null}
        </Section>

        <Section id="agencies" label="Agencies + studios" color={color(1)}>
          <Columns>
            {AGENCIES.map((agency) => (
              <li key={agency.name}>
                <a href={agency.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {agency.name}
                </a>
              </li>
            ))}
          </Columns>
        </Section>

        <Section id="notable" label="Notable projects" color={color(2)}>
          <Columns>
            {NOTABLE.map((name) => (
              <li key={name}>{name}</li>
            ))}
            <li>and others</li>
          </Columns>
        </Section>

        <Section id="services" label="Services" color={color(3)}>
          <Columns>
            {SERVICES.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </Columns>
        </Section>

        {/* In the takeover it is Contact, and only the form: the email and
            socials move to the footer, as icons. Elsewhere the links, as
            before. */}
        <Section id="contact" label={colored ? "Contact" : "Let’s talk"} color={color(4)}>
          {colored ? (
            <ContactForm color={PALETTE[4]} />
          ) : (
            <Columns>
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
            </Columns>
          )}
        </Section>
      </div>
      {colored ? <V5Footer /> : null}
    </div>
  );
}
