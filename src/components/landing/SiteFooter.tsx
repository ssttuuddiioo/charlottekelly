import { EMAIL, NAV, SOCIAL } from "@/lib/site";

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
