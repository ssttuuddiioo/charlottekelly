import { EMAIL, NAV, SOCIAL } from "@/lib/site";
import { MailingList } from "./MailingList";

/**
 * Footer laid out on a four-column grid taken from the reference: the wordmark
 * spans the first two columns, navigation sits at 52% and contact at 76%, with
 * the colophon anchoring the bottom edge. The sun print that used to sit in
 * this bottom row now runs alongside the bio instead — one deliberate use of
 * it on the page rather than two.
 *
 * Everything is set at full opacity. An earlier version dimmed the secondary
 * text and it fell below AA; here the hierarchy comes from size and position
 * instead, which costs nothing in contrast.
 *
 * Same ochre ground and black type as the slide-out menu, which carries the
 * same four links and the same contact block — the two are one piece of
 * furniture appearing in two places, so they should not be two colours. Black
 * on this ochre is 9.96:1.
 */
export function SiteFooter() {
  return (
    <footer id="contact" className="bg-alt-amber text-alt-ink font-display px-[6vw] pt-3xl pb-l md:px-[8vw]">
      <div className="grid gap-x-l gap-y-2xl md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2">
          {/* Inline flow, not flex: the label has to sit tight against the end
              of the LAST line. As a flex sibling it gets pushed out to the
              width of the longest line and drifts away from "Kelly". */}
          <h2 className="text-[clamp(2.5rem,1.5rem+4.5vw,4.5rem)] leading-[0.92] font-bold tracking-[-0.02em] uppercase">
            Charlotte
            <br />
            Kelly{" "}
            <span className="align-baseline text-[0.26em] font-medium tracking-[0.02em] whitespace-nowrap">
              (Copywriter)
            </span>
          </h2>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="min-h-tap inline-flex items-center text-[clamp(1.25rem,1rem+1.1vw,1.75rem)] leading-[1.15] font-bold tracking-[-0.01em] uppercase no-underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <ul className="flex flex-col">
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="min-h-tap inline-flex items-center text-[0.95rem] font-bold tracking-[0.02em] uppercase no-underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${EMAIL}`}
            // decoration-current because the base rule underlines links in the
            // cyanotype accent blue, which on this ochre is a third colour
            // doing nothing. The underline should just be the word's own.
            className="min-h-tap mt-l flex max-w-full items-start gap-[0.5em] text-[0.95rem] font-medium underline decoration-current underline-offset-[0.25em]"
          >
            <span aria-hidden="true" className="no-underline">
              ↳
            </span>
            <span className="[overflow-wrap:anywhere] min-w-0">{EMAIL}</span>
          </a>
        </div>
      </div>

      {/* Same four tracks as the block above, and the whole aside — heading,
          line and field — sits in the last two of them, starting on the nav's
          edge. Kept as one cell rather than split across the halves so the
          left side of the footer belongs to the wordmark alone; read across,
          the name is the whole of the left and everything addressed to you is
          the whole of the right.

          It sits between the lockup and the colophon because it is an aside,
          not an ask: the work and the ways to reach her come first, and this
          is the thing you may as well do on your way past. */}
      <div className="gap-x-l gap-y-l pt-3xl grid md:grid-cols-2 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-start-3">
          <h2 className="text-[clamp(1.25rem,1rem+1.1vw,1.75rem)] leading-[1.15] font-bold tracking-[-0.01em] uppercase">
            Not a newsletter
          </h2>
          {/* First person, where the bio a few sections up is third. The shift
              is the point — this is the one place on the page she speaks for
              herself, and the joke does not survive being reported.

              No reason given for why it is not a newsletter. An excuse here
              reads as unavailable, which is the opposite of what the rest of
              the page is for; the heading has already done the disowning, so
              the line just gets on with the offer. */}
          <p className="mt-2xs max-w-[38ch] text-[0.95rem] font-medium">
            Every once in a while, maybe, I’ll send a note about what I’m up
            to. Maybe.
          </p>

          {/* The gap the two cells used to get from the grid, now that they
              are one. */}
          <div className="mt-l">
            <MailingList />
          </div>
        </div>
      </div>

      <div className="grid items-end gap-x-l gap-y-l pt-3xl md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-start-4">
          <p className="text-fine font-bold tracking-[0.02em] uppercase">
            © {new Date().getFullYear()} Charlotte Kelly
          </p>
        </div>
      </div>
    </footer>
  );
}
