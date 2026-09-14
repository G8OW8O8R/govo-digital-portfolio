import { useEffect } from "react";

/**
 * Keeps paint-heavy ambient CSS effects from competing with scrolling. The
 * page remains visually identical; gradients simply hold their current frame
 * for the few milliseconds in which the browser is moving the viewport.
 */
export default function PerformanceGovernor() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let release = 0;
    const observed = new WeakSet<Element>();
    const animatedSelector = [
      ".animate-marquee",
      ".animate-aurora",
      ".animate-orbit",
      ".animate-float-y",
      ".animate-pulse-ring",
      ".text-shimmer",
      ".text-wave-gradient",
    ].join(",");

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) delete (entry.target as HTMLElement).dataset.animationPaused;
          else (entry.target as HTMLElement).dataset.animationPaused = "true";
        }
      },
      { rootMargin: "160px 0px" },
    );

    const observeAnimations = (container: ParentNode) => {
      const elements: Element[] = [];
      if (container instanceof Element && container.matches(animatedSelector)) elements.push(container);
      elements.push(...container.querySelectorAll(animatedSelector));
      for (const element of elements) {
        if (observed.has(element)) continue;
        observed.add(element);
        visibilityObserver.observe(element);
      }
    };

    observeAnimations(document);
    const mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element) observeAnimations(node);
        }
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const markScrolling = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          root.dataset.scrolling = "true";
        });
      }
      window.clearTimeout(release);
      release = window.setTimeout(() => {
        delete root.dataset.scrolling;
      }, 120);
    };

    window.addEventListener("scroll", markScrolling, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(release);
      window.removeEventListener("scroll", markScrolling);
      mutationObserver.disconnect();
      visibilityObserver.disconnect();
      delete root.dataset.scrolling;
    };
  }, []);

  return null;
}