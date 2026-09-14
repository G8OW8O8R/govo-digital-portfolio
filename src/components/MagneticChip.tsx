import { useEffect, useRef, type ReactNode } from "react";

type MagneticChipProps = {
  children: ReactNode;
  className?: string;
  /** how far the chip may drift toward the cursor, in px */
  strength?: number;
};

/**
 * Magnetic hover: the chip drifts a few pixels toward the cursor and lets a
 * radial glow track the pointer. Eased on a rAF loop that parks itself when
 * idle; only CSS custom properties are touched, never React state.
 */
export default function MagneticChip({
  children,
  className = "",
  strength = 6,
}: MagneticChipProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: 0, y: 0, gx: 50, gy: 50, on: 0 };
    const cur = { x: 0, y: 0, gx: 50, gy: 50, on: 0 };
    let raf = 0;
    let idle = 0;
    let rect: DOMRect | null = null;

    const updateRect = () => {
      rect = el.getBoundingClientRect();
    };

    const frame = () => {
      const k = 0.16;
      let moving = false;
      for (const key of ["x", "y", "gx", "gy", "on"] as const) {
        const delta = target[key] - cur[key];
        if (Math.abs(delta) > 0.01) moving = true;
        cur[key] += delta * k;
      }

      el.style.setProperty("--mag-x", `${cur.x.toFixed(2)}px`);
      el.style.setProperty("--mag-y", `${cur.y.toFixed(2)}px`);
      el.style.setProperty("--mag-gx", `${cur.gx.toFixed(2)}%`);
      el.style.setProperty("--mag-gy", `${cur.gy.toFixed(2)}%`);
      el.style.setProperty("--mag-on", cur.on.toFixed(3));

      if (!moving && ++idle > 6) {
        raf = 0;
        return;
      }
      if (moving) idle = 0;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onEnter = () => {
      updateRect();
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) updateRect();
      const r = rect!;
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      target.x = nx * strength * 2;
      target.y = ny * strength * 2;
      target.gx = (nx + 0.5) * 100;
      target.gy = (ny + 0.5) * 100;
      target.on = 1;
      start();
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      target.on = 0;
      rect = null;
      start();
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}
