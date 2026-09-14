import { useEffect, useRef, useState } from "react";

export default function ReadingProgress({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
}) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastProgressRef = useRef(-1);

  useEffect(() => {
    const update = () => {
      const el = targetRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const articleHeight = el.scrollHeight;
      const scrolled = Math.max(0, -rect.top);
      const readable = articleHeight - viewportH;
      const next = readable > 0 ? Math.min(1, Math.max(0, scrolled / readable)) : 1;

      if (Math.abs(next - lastProgressRef.current) > 0.002) {
        lastProgressRef.current = next;
        setProgress(next);
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetRef]);

  const pct = Math.round(progress * 100);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px]"
      role="progressbar"
      aria-label="Postęp czytania"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div
        className="h-full origin-left transition-transform duration-100 ease-linear"
        style={{
          transform: `scaleX(${progress})`,
          background:
            "linear-gradient(90deg, oklch(0.82 0.16 220), oklch(0.78 0.18 300))",
          boxShadow:
            "0 0 14px 2px color-mix(in oklab, oklch(0.78 0.18 300) 45%, transparent)",
        }}
      />
    </div>
  );
}
