const EMAIL = "hello@charlottekelly.com";

/**
 * The project page's footer, taken from the mock: one line, three parts, on
 * the same cream ground as the page.
 *
 * Deliberately NOT the landing's SiteFooter, which is the full blue four-column
 * lockup. A case study ends quietly and hands you back to the work; the big
 * footer belongs to the landing. See the note in the handoff if the two should
 * be unified instead.
 */
export function ProjectFooter() {
  return (
    <footer className="text-alt-ink px-[6vw] pt-2xl pb-l text-fine md:px-[2.5vw]">
      {/* Three-column grid rather than justify-between: it keeps the colophon
          optically centred on the page regardless of how wide the two outer
          items run. Stacks on a phone, where three across would crush. */}
      <div className="grid gap-y-xs text-center md:grid-cols-3 md:items-center">
        <ul className="flex justify-center gap-m md:justify-start">
          <li>
            <a href={`mailto:${EMAIL}`} className="min-h-tap inline-flex items-center no-underline hover:underline">
              Contact
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/kellycharlotte/"
              className="min-h-tap inline-flex items-center no-underline hover:underline"
            >
              Linkedin
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/charlottekellycopy/"
              className="min-h-tap inline-flex items-center no-underline hover:underline"
            >
              Instagram
            </a>
          </li>
        </ul>

        <p>
          <span aria-hidden="true">©</span> Charlotte Kelly, est. 2015
        </p>

        <p className="md:text-right">San Diego, California</p>
      </div>
    </footer>
  );
}
