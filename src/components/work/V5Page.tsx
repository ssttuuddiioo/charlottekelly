import { V2Landing } from "@/components/work/V2Landing";
import { LINK, V3Page } from "@/components/work/V3Page";
import { V4Hero } from "@/components/work/V4Page";
import { V5Tile } from "@/components/work/V5Tile";
import { V5Takeover } from "@/components/work/V5Takeover";
import { BIO } from "@/lib/site";

/**
 * v5: v4, with three differences.
 *
 * The rows' thumbnails are 4:3 and about a third bigger (see THUMBS in
 * V3Page).
 *
 * An open project leads with its first paragraph, above the big image
 * rather than under it.
 *
 * The blue column holds only the name, her bio and Learn more. Learn more
 * spreads the blue over the whole window and sets the rest of her about on
 * it — v2's landing, less the bio the column already has: posts and lists —
 * until Close sends it back into the column (V5Takeover). In the middle of
 * the blue, her print, the orange tile: it is there from the
 * first screen, before the name and the bio, and a click on it scrolls down
 * to the list (V5Tile).
 */
export function V5Page({ base, open }: { base: string; open?: string }) {
  return (
    <V3Page
      base={base}
      open={open}
      hero={<V4Hero />}
      thumb="wide"
      lead
      about={
        <>
          {/* The paragraphs as one block, so the entrance motion brings the
              bio in as one piece. */}
          <div className="pt-2xl">
            {BIO.map((paragraph, i) => (
              <p key={i} className={i ? "mt-[0.9em]" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
          <V5Takeover label="Learn more" className="pt-xs" triggerClassName={LINK}>
            <V2Landing base={base} bio={false} />
          </V5Takeover>
          {/* From lg, centred on the whole column both ways: the column is
              sticky, so it is what inset-0 measures against, at the window's
              height. It can land on the bio, so the box lets clicks through
              to Learn more and only the tile takes them. Stacked on a phone,
              where the blue is only as tall as its content, it is a band of
              its own under Learn more. data-stay keeps it out of the blocks
              V4HeroMotion holds back until the name lands. */}
          <div
            data-stay
            className="flex flex-1 items-center justify-center py-2xl lg:pointer-events-none lg:absolute lg:inset-0 lg:py-0 lg:[&>*]:pointer-events-auto"
          >
            <V5Tile className="w-[clamp(4.5rem,7vw,7.5rem)]" />
          </div>
        </>
      }
    />
  );
}
