import { SOCIAL } from "@/lib/site";

/**
 * v1's footer, on the landing and under every case study (and under a blog
 * post, whichever version it is read in): one line, three parts, cream on
 * the site's blue. Her accounts as icons on the left, the colophon in the
 * middle, the credit on the right.
 *
 * The blue is its own, so it reads the same at the foot of the landing,
 * which is blue behind it anyway, and of a cream case study.
 */
export function ProjectFooter() {
  return (
    <footer className="bg-alt-blue text-alt-paper px-[6vw] pt-2xl pb-l text-fine md:px-[2.5vw]">
      {/* Three-column grid rather than justify-between: it keeps the colophon
          optically centred on the page regardless of how wide the two outer
          items run. Stacks on a phone, where three across would crush. */}
      <div className="grid gap-y-xs text-center md:grid-cols-3 md:items-center">
        <ul className="flex justify-center gap-xs md:justify-start">
          {SOCIAL.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                aria-label={item.label}
                className="min-h-tap min-w-tap inline-flex items-center justify-center opacity-90 transition-opacity hover:opacity-100 md:justify-start"
              >
                {ICONS[item.label]}
              </a>
            </li>
          ))}
        </ul>

        <p>
          <span aria-hidden="true">©</span> Charlotte Kelly
        </p>

        <p className="md:text-right">Site by ssttuuddiioo</p>
      </div>
    </footer>
  );
}

/** Line icons at the type's size, drawn in its colour. */
const icon = {
  "aria-hidden": true,
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS: Record<(typeof SOCIAL)[number]["label"], React.ReactNode> = {
  LinkedIn: (
    <svg {...icon}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10.5V16M8 7.75v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3" />
    </svg>
  ),
  Instagram: (
    <svg {...icon}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.25 6.75v.01" />
    </svg>
  ),
};
