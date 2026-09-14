import { useEffect, useRef } from "react";

/**
 * Pauses CSS animations on an element while it is outside the viewport.
 * Purely a performance measure: an offscreen element is not visible, so
 * pausing its animation cannot change what the user sees, but it frees the
 * compositor from animating layers nobody is looking at.
 */
export function usePauseOffscreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
