import { EMAIL, SOCIAL } from "@/lib/site";

/** Drawn at 24 on a 24 grid, stroked in the current colour, so they take the
    text's colour and weight rather than each brand's. */
const ICONS: Record<string, React.ReactNode> = {
  Email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </>
  ),
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M8 10.5V17M8 7.25v.01M12 17v-6.5M12 13.5c0-1.7 1.1-3 2.75-3S17 11.5 17 13.25V17" />
    </>
  ),
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.25 6.75v.01" />
    </>
  ),
};

const LINKS = [{ label: "Email", href: `mailto:${EMAIL}` }, ...SOCIAL];

/**
 * v5's takeover ends on this: her email and socials as icons on the left,
 * the copyright and the site credit on the right. Stacks on a phone.
 */
export function V5Footer() {
  return (
    <footer className="text-fine flex flex-col gap-y-s px-[6vw] py-l md:flex-row md:items-center md:justify-between lg:px-[4%]">
      <ul className="-ml-[0.6rem] flex">
        {LINKS.map(({ label, href }) => {
          const external = href.startsWith("http");
          return (
            <li key={label}>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="min-h-tap min-w-tap inline-flex items-center justify-center opacity-80 hover:opacity-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[label]}
                </svg>
              </a>
            </li>
          );
        })}
      </ul>

      <p className="flex flex-wrap gap-x-m">
        <span>© 2026 Charlotte Kelly</span>
        <span>Site by Pablo</span>
      </p>
    </footer>
  );
}
