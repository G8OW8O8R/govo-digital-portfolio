import { useEffect, useRef, type ComponentType } from "react";

export type ProcessStep = {
  title: string;
  subtitle: string;
  body: string;
};

type Props = {
  steps: ProcessStep[];
  icons: ComponentType<{ className?: string }>[];
  stepLabel: string;
};

/**
 * Scroll-driven collaboration timeline.
 *
 * The rail fill and the per-node activation are written straight to CSS custom
 * properties inside a single rAF-throttled scroll handler, so scrolling never
 * triggers a React render. Cards carry a pointer-tracked spotlight written to
 * --mx/--my on pointermove (same rAF budget, one listener per card).
 */
export default function ProcessTimeline({ steps, icons, stepLabel }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Cached per-card rects, keyed by element. Populated on pointerenter and
  // invalidated on resize, so the frequent pointermove spotlight handler never
  // has to call getBoundingClientRect (a forced-layout hot path).
  const cardRects = useRef(new WeakMap<HTMLElement, DOMRect>());

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      wrap.style.setProperty("--rail", "1");
      wrap.querySelectorAll<HTMLElement>("[data-node]").forEach((n) => {
        n.dataset.active = "true";
      });
      return;
    }

    const nodes = Array.from(wrap.querySelectorAll<HTMLElement>("[data-node]"));
    let frame = 0;

    let lastRail = -1;

    // Geometry is measured on resize / element resize only. Measuring it inside
    // the scroll handler forced a layout read every scroll frame.
    let docTop = 0;
    let blockH = 0;
    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      docTop = rect.top + window.scrollY;
      blockH = rect.height;
    };

    const update = () => {
      const vh = window.innerHeight;
      const top = docTop - window.scrollY;
      // Starts when the block's top crosses 85% of the viewport and completes
      // once it has travelled roughly half its own height further up.
      const start = vh * 0.85;
      const span = Math.max(blockH * 0.45, vh * 0.22);
      const p = Math.min(1, Math.max(0, (start - top) / span));
      // Skip the style write when the value has not moved — avoids invalidating
      // the rail's paint on every idle frame.
      if (Math.abs(p - lastRail) > 0.0005) {
        lastRail = p;
        wrap.style.setProperty("--rail", p.toFixed(4));
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const active = p >= i / nodes.length;
          if ((node.dataset.active === "true") !== active) {
            node.dataset.active = active ? "true" : "false";
          }
        }
      }
    };

    // Update only in response to actual movement. The previous permanent rAF
    // loop forced a layout read on every frame while this section was nearby.
    const schedule = () => {
      if (frame || document.hidden) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    const onResize = () => {
      measure();
      schedule();
      // Card layout may have shifted too; drop cached spotlight rects.
      cardRects.current = new WeakMap();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    measure();
    update();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [steps.length]);

  const onCardPointerEnter = (e: React.PointerEvent<HTMLLIElement>) => {
    cardRects.current.set(e.currentTarget, e.currentTarget.getBoundingClientRect());
  };

  const onCardPointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    const el = e.currentTarget;
    let r = cardRects.current.get(el);
    if (!r) {
      r = el.getBoundingClientRect();
      cardRects.current.set(el, r);
    }
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={wrapRef} className="tl-wrap">
      {/* Rail with numbered nodes */}
      <div className="relative mb-5 hidden md:block" aria-hidden>
        <div className="tl-rail">
          <span className="tl-rail-fill" />
          <span className="tl-rail-comet" />
        </div>
        <div
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((step, i) => (
            <div key={step.title} className="flex justify-center">
              <span data-node data-active="false" className="tl-node">
                <span className="tl-node-ring" />
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ol
        className="grid grid-cols-1 gap-4 md:[grid-template-columns:repeat(var(--tl-cols),minmax(0,1fr))]"
        style={{ ["--tl-cols" as string]: steps.length }}
      >

        {steps.map((step, i) => {
          const Icon = icons[i] ?? icons[icons.length - 1];
          const num = String(i + 1).padStart(2, "0");
          return (
            <li
              key={step.title}
              onPointerEnter={onCardPointerEnter}
              onPointerMove={onCardPointerMove}
              className="tl-card reveal group flex flex-col gap-3 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-xl"
              data-shown="false"
              style={{
                transitionDelay: `${i * 130}ms`,
                ["--reveal-y" as string]: "34px",
              }}
              ref={(el) => {
                if (!el || el.dataset.observed === "true") return;
                el.dataset.observed = "true";
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                  el.dataset.shown = "true";
                  return;
                }
                const io = new IntersectionObserver(
                  (entries) => {
                    if (entries.some((en) => en.isIntersecting)) {
                      el.dataset.shown = "true";
                      io.disconnect();
                    }
                  },
                  { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
                );
                io.observe(el);
              }}
            >
              <span className="tl-card-glow" aria-hidden />
              <div className="tl-icon grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="relative min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                  {stepLabel} {num}
                </span>
                <h3 className="mt-1 font-display text-base leading-snug tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">
                  {step.subtitle}
                </p>
                <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-foreground/55">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
