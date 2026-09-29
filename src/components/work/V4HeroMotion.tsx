"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** How much faster than the page the hero's name rises: it has half a screen
    to clear, and should be gone well before the list has arrived. */
const RISE = 1.6;

/** The most scroll, in px, a letter can wait before it starts to rise, and
    its speed as a range of multiples of RISE. Each letter gets its own wait
    and speed, so the name comes apart sporadically — some letters away early
    and fast, others hanging on — rather than as a block. The speeds lean
    fast: a letter both late and slow would still be crossing the edge once
    the amber had gone, cream on cream, and the crossing would not be seen. */
const SPREAD = 180;
const SPEED_MIN = 0.9;
const SPEED_MAX = 1.4;

/** A fixed scatter in [0, 1) for letter `i`, the same on every visit, so a
    deep link resolves to the same arrangement a scroll would have. */
const scatter = (i: number, salt: number) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** The amber's fade, as fractions of the hero's height scrolled: it holds for
    the first fifth, while the first letters go, then is cream by the time the
    list is a fifth of the way down the screen. */
const FADE_FROM = 0.2;
const FADE_TO = 0.8;

/** How quickly the motion catches up with the scroll, per second. Lower
    trails further behind and glides longer after the scroll stops. */
const FOLLOW = 7;

/** How quickly a letter in the blue column catches up with its rope. A touch
    of give, so it lands rather than stops. */
const LAND = 12;

/** Moves `from` toward `to` by the share of the gap that `rate` closes in
    `dt` seconds, independent of frame rate. */
const approach = (from: number, to: number, rate: number, dt: number) => {
  const next = from + (to - from) * (1 - Math.exp(-rate * dt));
  return Math.abs(to - next) < 0.1 ? to : next;
};

/** Eases a 0–1 progress in and out, so the fade neither starts nor ends with a jolt. */
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Everything v4's hero does on scroll. Renders nothing; works on the hero and
 * the blue column the server rendered, found by their data attributes.
 *
 * 1. The hero stays put. It is pinned to the top of the window, and the list
 *    scrolls up over it, rather than the whole page going up in one piece.
 *    The pin is set here, not in CSS: without JavaScript, or with reduced
 *    motion, an amber block pinned under the list for good would be wrong,
 *    so there it just scrolls away as a first screen.
 *
 * 2. The name rises out over the top of the window, faster than the page,
 *    each letter on its own wait and at its own speed.
 *
 * 3. The amber fades out as the list comes up, leaving the cream ground the
 *    list sits on. Once it is gone and the name with it, the hero is hidden,
 *    so it paints nothing for the rest of the page.
 *
 * 4. From lg, a pulley at the top edge. Each letter in the hero is tied to
 *    the same letter in the blue column, which starts hanging just above the
 *    edge, out of sight. As a hero letter goes out over the edge its twin
 *    comes down by the same distance, and settles at its own place in the
 *    column's name. Below lg the blue block is above the hero, so there is
 *    no edge to run a rope over, and the column's name just sits in place.
 *
 * 5. With the pulley, the rest of the blue column waits for the name. It
 *    starts blank, and once every letter has landed its blocks fade up one
 *    after another, top to bottom; if the name is pulled back out, they go
 *    again. This takes over from V3Motion's entrance for those blocks, whose
 *    tweens are killed here; the name's own link keeps that entrance, as
 *    does a block marked data-stay (v5's tile), which shows from the start.
 *
 * None of it is tied to the scroll position directly. It follows a smoothed
 * copy of it, eased toward the real one every frame, so a notched wheel
 * glides rather than steps and the motion settles after the scroll has
 * stopped. The ticker only runs while there is still ground to make up.
 *
 * Where everything ends up is still worked out from where the list is, not
 * from state, so a deep link that lands halfway down the page finds it all
 * already in place: the first frame, and any after a resize, jump straight
 * there. The movement is the CSS `translate` property, which composes with
 * the `transform` that centres each letter in its slot.
 */
export function V4HeroMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 64rem)" },
      (context) => {
        const { motion, wide } = context.conditions as { motion: boolean; wide: boolean };
        const hero = document.querySelector<HTMLElement>("[data-hero]");
        const ground = hero?.querySelector<HTMLElement>("[data-hero-ground]");
        const list = document.querySelector<HTMLElement>("main ol");
        if (!motion || !hero || !ground || !list) return;

        const from = gsap.utils.toArray<HTMLElement>(".site-mark__slot", hero);
        const side = wide ? gsap.utils.toArray<HTMLElement>("[data-about] .site-mark__slot") : [];
        const to = side.length === from.length ? side : [];

        const waits = from.map((_, i) => scatter(i, 1) * SPREAD);
        const speeds = from.map((_, i) => RISE * gsap.utils.interpolate(SPEED_MIN, SPEED_MAX, scatter(i, 2)));
        const rises = from.map(() => 0);
        const drops = to.map(() => 0);

        // Made outside the matchMedia context, so leaving lg does not revert
        // the blocks to the hidden state they were in when this started;
        // the cleanup below shows them instead.
        const aside = document.querySelector<HTMLElement>("[data-about]");
        const blocks =
          to.length && aside
            ? [...aside.children].filter((el) => !el.querySelector(".site-mark") && !el.matches("[data-stay]"))
            : [];
        let reveal: gsap.core.Timeline | undefined;
        context.ignore(() => {
          if (!blocks.length) return;
          gsap.killTweensOf(blocks);
          gsap.set(blocks, { opacity: 0, y: 16 });
          reveal = gsap
            .timeline({ paused: true })
            .to(blocks, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12 });
        });
        let scrolled = 0;
        let jump = true;
        let running = false;

        hero.style.position = "sticky";
        hero.style.top = "0";

        const tick = (_time: number, deltaMs: number) => {
          const dt = Math.min(deltaMs, 100) / 1000;

          // All reads first. What is read back includes the translates set
          // last frame, so they are taken off again to get each letter's
          // own place.
          const height = hero.offsetHeight;
          const target = height - list.getBoundingClientRect().top;
          const heroTops = to.length ? from.map((slot, i) => slot.getBoundingClientRect().top + rises[i]) : [];
          const rests = to.map((slot, i) => slot.getBoundingClientRect().bottom - drops[i]);

          scrolled = jump ? target : approach(scrolled, target, FOLLOW, dt);
          from.forEach((_, i) => {
            rises[i] = Math.max(0, scrolled - waits[i]) * speeds[i];
          });
          const fade = smooth(gsap.utils.clamp(0, 1, (scrolled / height - FADE_FROM) / (FADE_TO - FADE_FROM)));

          let settled = scrolled === target;
          to.forEach((_, i) => {
            const over = Math.max(0, rises[i] - heroTops[i]);
            const rope = Math.min(0, over - rests[i]);
            drops[i] = jump ? rope : approach(drops[i], rope, LAND, dt);
            if (drops[i] !== rope) settled = false;
          });
          jump = false;

          from.forEach((slot, i) => (slot.style.translate = `0 ${-rises[i]}px`));
          to.forEach((slot, i) => (slot.style.translate = `0 ${drops[i]}px`));
          ground.style.opacity = String(1 - fade);
          hero.style.visibility = fade === 1 && Math.min(...rises) > height ? "hidden" : "";

          if (reveal) {
            if (drops.every((drop) => drop === 0)) reveal.play();
            else reveal.reverse();
          }

          if (settled) stop();
        };

        const start = () => {
          if (running) return;
          running = true;
          gsap.ticker.add(tick);
        };
        const stop = () => {
          running = false;
          gsap.ticker.remove(tick);
        };
        const resize = () => {
          jump = true;
          start();
        };

        tick(0, 0);
        document.fonts.ready.then(resize);
        window.addEventListener("scroll", start, { passive: true });
        window.addEventListener("resize", resize);

        return () => {
          stop();
          window.removeEventListener("scroll", start);
          window.removeEventListener("resize", resize);
          for (const prop of ["position", "top", "visibility"]) hero.style.removeProperty(prop);
          ground.style.removeProperty("opacity");
          [...from, ...to].forEach((slot) => slot.style.removeProperty("translate"));
          reveal?.kill();
          if (blocks.length) gsap.set(blocks, { clearProps: "opacity,transform" });
        };
      },
    );

    return () => mm.revert();
  });

  return null;
}
