import { useEffect, useRef, useState } from "react";

type SplitTextProps = {
  text: string;
  className?: string;
  /** ms between words */
  stagger?: number;
  delay?: number;
  /** class applied to each word's inner span (e.g. gradient text) */
  wordClassName?: string;
};

/**
 * Word-by-word mask reveal. Each word sits in an overflow-hidden line box and
 * slides up from below the baseline, so the type appears to be "typeset" rather
 * than faded in. Whitespace is preserved for correct wrapping.
 */
export default function SplitText({
  text,
  className = "",
  stagger = 45,
  delay = 0,
  wordClassName = "",
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
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
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className} data-shown={shown ? "true" : "false"}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="split-word">
            <span
              className={`split-word-inner ${wordClassName}`}
              style={{ transitionDelay: `${delay + i * stagger}ms` }}
            >
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
