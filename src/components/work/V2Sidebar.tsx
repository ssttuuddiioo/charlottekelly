import Image from "next/image";
import Link from "next/link";
import { MailingList } from "@/components/landing/MailingList";
import { BIO_SHORT } from "@/lib/site";

/**
 * v2's sidebar: everything about her, held beside every project so the case
 * study never has to carry any of it. From its mock, top to bottom — the
 * print, the one-line bio, services, the ways on, the sign-up.
 *
 * A sidebar only in the three-column layout (2xl), on the far right, pinned
 * at the viewport's height with the four groups spread down it; if a short
 * window cannot fit them, it scrolls on its own rather than being cut off.
 * Narrower than that it is a blue block at the foot of the project. Either
 * way it comes last, which is where it sits in the document too.
 */

/**
 * The mock's four, read across its two columns. Three are sections of the
 * landing, reached from any page; Work is the index of projects, which is on
 * every page, so it stays on this one.
 */
const MORE = [
  { label: "About", hash: "#about" },
  { label: "Contact", hash: "#contact" },
  { label: "Work", hash: "#projects", here: true },
  { label: "Recent", hash: "#recently" },
];

/** Hers, from the mock — the whole practice, where a project's own services
    are only what that job needed. */
const SERVICES = [
  "Verbal identity + guidelines",
  "brand narrative",
  "positioning",
  "web copy",
  "naming",
  "concepting",
  "scripts",
  "packaging",
  "UX",
  "social + editorial",
];

const LABEL = "text-alt-blue-soft text-[clamp(1rem,0.85rem+0.4vw,1.25rem)] leading-[1.2]";
const LIST = "text-[clamp(1.125rem,0.9rem+0.6vw,1.4375rem)] leading-[1.15]";
const LINK = `${LIST} min-h-tap inline-flex items-center no-underline decoration-current hover:underline`;

export function V2Sidebar({ base, className = "" }: { base: string; className?: string }) {
  return (
    <aside
      aria-label="About Charlotte Kelly"
      className={`bg-alt-blue text-alt-paper flex flex-col gap-2xl px-[6vw] py-2xl lg:px-[4vw] 2xl:sticky 2xl:top-0 2xl:h-dvh 2xl:justify-between 2xl:gap-l 2xl:overflow-y-auto 2xl:[scrollbar-width:none] 2xl:[&::-webkit-scrollbar]:hidden 2xl:px-[3vw] 2xl:py-l ${className}`}
    >
      <div>
        {/* The print doubles as the way home: it is the one mark on the page
            that stands for her. */}
        <Link
          href={base}
          aria-label="Charlotte Kelly — home"
          className="block w-[37%] max-w-[12rem]"
        >
          <Image
            src="/tile.png"
            alt=""
            width={543}
            height={714}
            sizes="(min-width: 40rem) 12rem, 37vw"
            className="h-auto w-full"
          />
        </Link>

        <p className="pt-l text-[clamp(1.25rem,0.9rem+0.9vw,1.625rem)] leading-[1.25]">
          {BIO_SHORT}
        </p>
      </div>

      <div>
        <h2 className={LABEL}>Services</h2>
        {/* Non-breaking before each dot: lines end on one, as in the mock,
            and never start with one. */}
        <p className={`${LIST} pt-2xs`}>{SERVICES.join("\u00a0· ")}</p>
      </div>

      <nav aria-labelledby="see-more">
        <h2 id="see-more" className={LABEL}>
          See more
        </h2>
        {/* Two columns sized to their words, not split down the middle, so
            the second sits a short step from the first as in the mock. */}
        <ul className="grid grid-cols-[repeat(2,max-content)] gap-x-xl pt-3xs">
          {MORE.map((item) => (
            <li key={item.label}>
              <Link href={item.here ? item.hash : `${base}${item.hash}`} className={LINK}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <MailingList variant="sidebar" />
    </aside>
  );
}
