"use client";

import { useId, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The print developing in the wash.
 *
 * A cyanotype does not fade in. It comes up out of blank paper in patches:
 * pale and flat at first, then deepening unevenly until the ground is solid.
 * Three things run together to get that, all on one timeline.
 */

/**
 * 1. The dissolve, as an SVG filter.
 *
 * feTurbulence gives a noise field; feFuncA thresholds it into an alpha mask;
 * feComposite `in` multiplies that mask into the image. Sweeping `intercept`
 * moves the threshold across the noise, so the image emerges grain-first.
 *
 * SLOPE sets how hard that threshold is. The noise measures out at mean 0.50,
 * SD 0.12, so a slope of 6 makes the transition band (1/6) about 1.4 SD wide:
 * patches are distinct enough to read as blotches, soft enough to read as
 * liquid rather than as a wipe. Slope 3 blurs the band across the whole
 * distribution and the print just fades; slope 20 gives a hard dissolve edge,
 * which is a wipe, not chemistry.
 */
const SLOPE = 6;

/**
 * Coverage does not track `intercept` linearly. The noise is near-Gaussian, so
 * sweeping the threshold at a constant rate spends most of its time out in the
 * tails, where a handful of pixels are changing and nothing visible happens —
 * the first cut of this held blank for 400ms, did all its work between 0.7s
 * and 1.6s, then sat at a standstill for two seconds. Easing the sweep only
 * made it worse, because it squared an S-curve that was already there.
 *
 * So the tween drives *coverage* — mean mask alpha, 0 to 1 — and this table
 * maps it back to the threshold, one entry per tenth. The easing on the tween
 * is then the easing you actually see.
 *
 * Regenerate it if SLOPE or the turbulence changes: render the feTurbulence
 * alone to a canvas, read back the alpha histogram, and for each tenth solve
 * for the intercept where mean(clamp(SLOPE * a + intercept)) hits it.
 */
const COVERAGE_TO_INTERCEPT = [
  -5.5, -3.47, -3.13, -2.89, -2.68, -2.49, -2.29, -2.08, -1.84, -1.5, 0.45,
];

const interceptFor = (coverage: number) => {
  const x = gsap.utils.clamp(0, 1, coverage) * (COVERAGE_TO_INTERCEPT.length - 1);
  const i = Math.min(Math.floor(x), COVERAGE_TO_INTERCEPT.length - 2);
  return gsap.utils.interpolate(
    COVERAGE_TO_INTERCEPT[i],
    COVERAGE_TO_INTERCEPT[i + 1],
    x - i,
  );
};

/**
 * Blotch scale, in CSS px of the rendered tile (the filter region is in user
 * units, and the tile is 150-200px wide). ~0.03 puts the coarse mottling
 * around 30px; three octaves carry it down to paper grain. The two axes
 * differ so the patches pull slightly horizontally, the way liquid does.
 */
const BASE_FREQUENCY = "0.031 0.046";
const OCTAVES = 3;
const SEED = 11;

/**
 * 2. The wash bias.
 *
 * A gradient mask held at partial alpha up top, so the bottom of the print
 * develops ahead of the rest instead of the grain arriving everywhere at
 * once. Animating the stop rather than the mask position means the end state
 * is uniform black — a no-op — so the mask can be dropped at the end without
 * anything jumping.
 */
const WASH_MASK =
  "linear-gradient(to top, rgb(0 0 0) 0%, rgb(0 0 0 / var(--wash)) 100%)";
const WASH_START = 0.3;

/**
 * 3. The tonal shift.
 *
 * Sensitised paper is yellow-green and low contrast before the wash takes;
 * the pigment only comes up as it clears. Start pale and desaturated, end at
 * identity. The function list has to match at both ends for GSAP to
 * interpolate it as a filter rather than swap it.
 */
const TONE_START = "sepia(0.55) saturate(0.35) brightness(1.22) contrast(0.78)";
const TONE_END = "sepia(0) saturate(1) brightness(1) contrast(1)";

export function DevelopingTile({ className }: { className?: string }) {
  // useId is React-generated and contains characters that are not valid in a
  // url(#...) reference, so strip it down to a usable id.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const filterId = `develop-${uid}`;

  const scope = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const threshold = useRef<SVGFEFuncAElement>(null);

  useGSAP(
    () => {
      const el = plate.current;
      const fn = threshold.current;
      if (!el || !fn) return;

      const img = el.querySelector("img");
      const mm = gsap.matchMedia();

      // Reduced motion gets the developed print, which is the default markup,
      // so there is nothing to undo. Same for no JS: unlike the name lockup,
      // this one is not hidden in CSS. The tile sits well below the fold, so
      // setting the undeveloped state here — in a layout effect, before paint
      // — is early enough, and failing to run leaves the tile visible rather
      // than blank.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(el, {
          filter: `url(#${filterId})`,
          maskImage: WASH_MASK,
          WebkitMaskImage: WASH_MASK,
          "--wash": WASH_START,
        });
        if (img) gsap.set(img, { filter: TONE_START });

        // Coverage is a plain number tweened through a proxy, then mapped to
        // the threshold, which is a filter attribute rather than a style and
        // so has to be written out per frame.
        const dev = { coverage: 0 };
        fn.setAttribute("intercept", String(interceptFor(0)));

        const tl = gsap
          .timeline({ paused: true })
          .to(
            dev,
            {
              coverage: 1,
              duration: 2.6,
              // Read as coverage, not as threshold: a short latent beat, a
              // brisk middle, a soft landing. A tray, not a dimmer.
              ease: "power1.inOut",
              onUpdate: () =>
                fn.setAttribute("intercept", String(interceptFor(dev.coverage))),
            },
            0,
          )
          // The bias equalises before the dissolve finishes, so the last of
          // the development is even across the print.
          .to(el, { "--wash": 1, duration: 2.2, ease: "power1.inOut" }, 0)
          // Lags the dissolve and outlasts it: the patches arrive pale, and
          // the colour is still coming up in them as the grain settles.
          .to(img, { filter: TONE_END, duration: 2.6, ease: "power1.inOut" }, 0.25)
          // Both the filter and the mask are no-ops by now, so dropping them
          // costs nothing visually and takes the per-frame turbulence off the
          // compositor for the rest of the page's life.
          .set(el, {
            filter: "none",
            maskImage: "none",
            WebkitMaskImage: "none",
            clearProps: "--wash",
          })
          .set(img, { clearProps: "filter" });

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            // Developing an image that has not decoded yet would spend the
            // animation on an empty box. Lazy loading starts well before the
            // trigger, so this almost always passes straight through.
            if (img && !img.complete) {
              const go = () => tl.play();
              img.addEventListener("load", go, { once: true });
              img.addEventListener("error", go, { once: true });
            } else {
              tl.play();
            }
          },
        });

        return () => {
          st.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {/* Zero-sized rather than display:none — a filter referenced out of a
          hidden subtree is unreliable in Safari. */}
      <svg
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      >
        <defs>
          {/* sRGB, not the linearRGB default: the mask is composited against
              the image's own colour, and converting in and out of linear
              light shifts the orange. */}
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={BASE_FREQUENCY}
              numOctaves={OCTAVES}
              seed={SEED}
              result="grain"
            />
            <feComponentTransfer in="grain" result="wash">
              {/* Rendered fully developed. JS sets the undeveloped value
                  before paint; anything that stops it running leaves the
                  print on the page rather than blank. */}
              <feFuncA
                ref={threshold}
                type="linear"
                slope={SLOPE}
                intercept={COVERAGE_TO_INTERCEPT[COVERAGE_TO_INTERCEPT.length - 1]}
              />
            </feComponentTransfer>
            {/* `in` keeps only the part of the image the mask's alpha passes. */}
            <feComposite in="SourceGraphic" in2="wash" operator="in" />
          </filter>
        </defs>
      </svg>

      <div ref={plate}>
        {/* Decorative, so no alt text and hidden from the accessibility tree. */}
        <Image
          src="/tile.png"
          alt=""
          aria-hidden="true"
          width={543}
          height={714}
          sizes="(min-width: 48rem) 200px, 150px"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
