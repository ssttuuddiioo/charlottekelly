import Image from "next/image";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL = [{ label: "LinkedIn", href: "https://www.linkedin.com/" }];

const EMAIL = "hello@charlottekelly.com";

/**
 * Footer laid out on a four-column grid taken from the reference: the wordmark
 * spans the first two columns, navigation sits at 52% and contact at 76%, with
 * the print and the colophon anchoring the bottom edge.
 *
 * Everything is set at full opacity. The previous version dimmed the secondary
 * text and it fell below AA on this blue; here the hierarchy comes from size
 * and position instead, which costs nothing in contrast.
 */
export function SiteFooter() {
  return (
    <footer id="contact" className="bg-alt-blue text-alt-paper font-display px-[6vw] pt-3xl pb-l md:px-[8vw]">
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
            className="min-h-tap mt-l flex max-w-full items-start gap-[0.5em] text-[0.95rem] font-medium underline underline-offset-[0.25em]"
          >
            <span aria-hidden="true" className="no-underline">
              ↳
            </span>
            <span className="[overflow-wrap:anywhere] min-w-0">{EMAIL}</span>
          </a>
        </div>
      </div>

      <div className="grid items-end gap-x-l gap-y-l pt-3xl md:grid-cols-2 lg:grid-cols-4">
        {/* Decorative, so no alt text and hidden from the accessibility tree. */}
        <div className="md:col-span-2">
          <Image
            src="/tile.png"
            alt=""
            aria-hidden="true"
            width={543}
            height={714}
            sizes="(min-width: 48rem) 300px, 46vw"
            className="h-auto w-[46vw] max-w-[300px]"
          />
        </div>

        <div className="lg:col-start-4">
          <p className="text-fine font-bold tracking-[0.02em] uppercase">
            © {new Date().getFullYear()} Charlotte Kelly
          </p>
        </div>
      </div>
    </footer>
  );
}
