import { useEffect, useRef } from "react";

/**
 * Hairline reading-progress rail. Updated from a passive scroll listener that
 * only schedules one rAF write per frame, and animated with scaleX so it never
 * triggers layout.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    // Document height is measured only when it can actually change (resize or a
    // real DOM size change). Reading scrollHeight inside the scroll handler
    // forced a synchronous layout on every scroll frame.
    let max = 0;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };

    const update = () => {
      raf = 0;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--scroll-progress", p.toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-px bg-transparent">
      <div
        ref={ref}
        className="scroll-rail h-px w-full bg-gradient-to-r from-primary/0 via-primary to-primary/40"
      />
    </div>
  );
}
