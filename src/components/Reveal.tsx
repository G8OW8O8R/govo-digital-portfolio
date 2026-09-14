import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** ms delay applied once the element enters the viewport */
  delay?: number;
  /** distance travelled during the reveal, in px */
  distance?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Enters on scroll with a single composited transform + opacity + blur step.
 * One IntersectionObserver per element, disconnected right after it fires,
 * so nothing keeps observing after the reveal is done.
 */
export default function Reveal({
  children,
  delay = 0,
  distance = 18,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Once the entrance transition has finished the element is static, so the
  // compositor hint is released — keeping `will-change` alive on every revealed
  // block costs memory and slows later scrolling.
  useEffect(() => {
    if (!shown) return;
    const el = ref.current;
    if (!el) return;
    const timer = window.setTimeout(() => {
      el.style.willChange = "auto";
    }, delay + 1100);
    return () => window.clearTimeout(timer);
  }, [shown, delay]);

  return (
    <Tag
      ref={ref as never}
      data-shown={shown ? "true" : "false"}
      className={`reveal ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ["--reveal-y" as string]: `${distance}px`,
      }}
    >
      {children}
    </Tag>
  );
}
