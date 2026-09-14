import { useEffect, useRef, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
};

/**
 * Pointer-driven 3D tilt with a specular sheen.
 * Values are eased frame-by-frame (critically damped lerp) and written to CSS
 * custom properties, so React never re-renders during the interaction and the
 * browser only has to composite a transform.
 */
export default function TiltCard({ children, className = "", max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: 0, y: 0, on: 0 };
    const current = { x: 0, y: 0, on: 0 };
    let raf = 0;
    let idle = 0;
    let rect: DOMRect | null = null;

    const updateRect = () => {
      rect = el.getBoundingClientRect();
    };

    const onMove = (e: PointerEvent) => {
      if (!rect) updateRect();
      const r = rect!;
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      target.on = 1;
    };
    
    const onEnter = () => {
      updateRect();
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      target.on = 0;
      rect = null;
    };

    const frame = () => {
      const k = 0.12;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.on += (target.on - current.on) * k;

      el.style.setProperty("--tilt-x", `${(-current.y * max).toFixed(3)}deg`);
      el.style.setProperty("--tilt-y", `${(current.x * max).toFixed(3)}deg`);
      el.style.setProperty("--sheen-x", `${(50 + current.x * 45).toFixed(2)}%`);
      el.style.setProperty("--sheen-y", `${(50 + current.y * 45).toFixed(2)}%`);
      el.style.setProperty("--sheen-o", current.on.toFixed(3));

      const settled =
        Math.abs(target.x - current.x) < 0.001 &&
        Math.abs(target.y - current.y) < 0.001 &&
        Math.abs(target.on - current.on) < 0.001;

      if (settled && ++idle > 8) {
        raf = 0;
        return;
      }
      if (!settled) idle = 0;
      raf = requestAnimationFrame(frame);
    };

    const kick = (e: PointerEvent) => {
      onMove(e);
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const release = () => {
      onLeave();
      if (!raf) raf = requestAnimationFrame(frame);
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", kick);
    el.addEventListener("pointerleave", release);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", kick);
      el.removeEventListener("pointerleave", release);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt-card ${className}`}>
      {children}
    </div>
  );
}
