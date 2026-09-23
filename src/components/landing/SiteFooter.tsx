import Image from "next/image";
import { PROJECTS } from "./projects";

const SITE = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Work", href: "#" },
  { label: "Contact", href: "#" },
];

const ELSEWHERE = [
  { label: "Email", href: "mailto:hello@charlottekelly.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

const EMAIL = "hello@charlottekelly.com";

// Dimming is done with opacity, so every value here has been checked against
// the blue: 90% = 5.59:1, 80% = 4.75:1, 55% = 3.04:1 (fails AA at this size).
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-fine pb-2xs tracking-wider uppercase opacity-80">{children}</h3>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="min-h-tap inline-flex items-center text-[0.95rem] no-underline opacity-90 transition-opacity hover:opacity-100"
    >
      {children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-alt-blue text-alt-paper px-[6vw] pt-3xl pb-l md:px-[8vw]">
      {/* The email leads. It is the one thing on the page that has to be easy
          to find, and the footer is where people go looking for it. */}
      <a
        href={`mailto:${EMAIL}`}
        // min-h-tap matters here despite the size: at the small end of the
        // clamp the line box is only ~28px tall, under the 44px floor.
        className="min-h-tap inline-flex items-center text-[clamp(1.5rem,1.15rem+1.45vw,2.5rem)] leading-[1.15] font-medium no-underline"
      >
        {EMAIL}
      </a>

      <div className="grid gap-x-l gap-y-2xl pt-3xl md:grid-cols-4">
        <nav aria-labelledby="footer-site">
          <ColumnHeading>
            <span id="footer-site">Site</span>
          </ColumnHeading>
          <ul className="flex flex-col">
            {SITE.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-work" className="md:col-span-2">
          <ColumnHeading>
            <span id="footer-work">Selected work</span>
          </ColumnHeading>
          {/* A grid rather than CSS columns: the links are 44px tap targets,
              and column-fill would break them across the gutter. */}
          <ul className="grid grid-cols-1 gap-x-l sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <li key={project.slug}>
                <FooterLink href="#">{project.title}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-elsewhere">
          <ColumnHeading>
            <span id="footer-elsewhere">Elsewhere</span>
          </ColumnHeading>
          <ul className="flex flex-col">
            {ELSEWHERE.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-m pt-3xl">
        {/* Decorative, so it carries no alt text and is hidden from the
            accessibility tree. */}
        <Image
          src="/tile.png"
          alt=""
          aria-hidden="true"
          width={543}
          height={714}
          sizes="(min-width: 48rem) 240px, 40vw"
          className="h-auto w-[40vw] max-w-[240px]"
        />
        <p className="text-fine pb-2xs opacity-80">
          © {new Date().getFullYear()} Charlotte Kelly
        </p>
      </div>
    </footer>
  );
}
