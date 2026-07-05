"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";

const GSAP_SRC = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js";
const ST_SRC =
  "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js";

/** Inject a CDN script once, resolving when it has loaded. */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject());
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.addEventListener("load", () => {
      el.dataset.loaded = "1";
      resolve();
    });
    el.addEventListener("error", () => reject());
    document.head.appendChild(el);
  });
}

/**
 * GSAP-driven, scroll-led storytelling for the landing page. Loaded from the
 * CDN. All targets are marked with data-attributes in the markup; the initial
 * "hidden" state lives in CSS under `.js-anim` (added before paint by the
 * inline script in the layout) so there is no flash — and if GSAP fails to
 * load, or the user prefers reduced motion, everything stays fully visible.
 */
export function ScrollChoreography() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Reduced motion: reveal everything immediately, do nothing else.
    if (reduce) {
      root.classList.remove("js-anim");
      return;
    }

    let ctx: any;
    let cancelled = false;
    // Safety net: if the CDN is slow/blocked, reveal content anyway.
    const failSafe = window.setTimeout(() => root.classList.remove("js-anim"), 2500);

    (async () => {
      try {
        await loadScript(GSAP_SRC);
        await loadScript(ST_SRC);
      } catch {
        root.classList.remove("js-anim");
        window.clearTimeout(failSafe);
        return;
      }
      if (cancelled) return;
      window.clearTimeout(failSafe);

      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      if (!gsap || !ScrollTrigger) {
        root.classList.remove("js-anim");
        return;
      }
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // 1 — Draw the gold ornament linework via stroke-dashoffset.
        gsap.utils
          .toArray("[data-draw-svg]")
          .forEach((svg: SVGSVGElement) => {
          const paths = svg.querySelectorAll<SVGPathElement>("[data-draw]");
          paths.forEach((p: SVGPathElement) => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          });
          const onLoad = svg.hasAttribute("data-draw-load");
          gsap
            .timeline({
              defaults: { ease: "none" },
              delay: onLoad ? 0.2 : 0,
              scrollTrigger: onLoad
                ? undefined
                : { trigger: svg, start: "top 88%" },
            })
            .to(svg, { opacity: 1, duration: 0.4 }, 0)
            .to(
              paths,
              {
                strokeDashoffset: 0,
                duration: onLoad ? 2.8 : 1.8,
                stagger: 0.12,
              },
              0,
            );
        });

        // 2 — Hero typography: staggered rise-into-focus reveal (fromTo).
        gsap.fromTo(
          "[data-hero-reveal]",
          { yPercent: 60, opacity: 0, filter: "blur(12px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.15,
          },
        );

        // 3 — Hero showcase card settles in with depth (the card keeps its
        // own -2deg tilt; this wrapper just eases the entrance).
        gsap.fromTo(
          "[data-hero-card]",
          { y: 64, opacity: 0, scale: 0.92, rotate: -6 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.4,
          },
        );

        // 4 — Section copy reveals as it scrolls into view.
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 86%",
          onEnter: (batch: Element[]) =>
            gsap.fromTo(
              batch,
              { y: 48, opacity: 0, filter: "blur(8px)" },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.12,
                overwrite: true,
              },
            ),
        });

        // 5 — Cards rise + settle.
        ScrollTrigger.batch("[data-card]", {
          start: "top 85%",
          onEnter: (batch: Element[]) =>
            gsap.fromTo(
              batch,
              { y: 60, opacity: 0, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.14,
                overwrite: true,
              },
            ),
        });

        // 6 — Chips / step coins pop in.
        ScrollTrigger.batch("[data-pop]", {
          start: "top 90%",
          onEnter: (batch: Element[]) =>
            gsap.fromTo(
              batch,
              { scale: 0.5, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.8)",
                stagger: 0.05,
                overwrite: true,
              },
            ),
        });

        // 7 — The how-it-works connector line draws itself left→right.
        gsap.utils.toArray("[data-connector]").forEach((el: HTMLElement) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              duration: 1.2,
              ease: "power2.inOut",
              scrollTrigger: { trigger: el, start: "top 82%" },
            },
          );
        });
      });

      // Re-measure once web fonts settle (avoids mis-placed triggers).
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
      ctx?.revert();
    };
  }, []);

  return null;
}
