import { useEffect, useRef } from "react";

type Star = {
  nx: number;
  ny: number;
  z: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  spike: number;
};

type Shooting = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

const GLOW_SPRITE_SIZE = 128;
// Keep the animated texture close to 720p regardless of monitor resolution.
// CSS scales it back to the viewport; the stars and glow remain the same size
// in CSS pixels, while 4K/retina screens no longer multiply GPU fill cost.
const MAX_CANVAS_PIXELS = 1_050_000;

function getCanvasDpr(width: number, height: number) {
  const nativeDpr = Math.min(window.devicePixelRatio || 1, 1.25);
  const pixelBudgetDpr = Math.sqrt(MAX_CANVAS_PIXELS / Math.max(1, width * height));
  return Math.min(nativeDpr, pixelBudgetDpr);
}

function createGlowSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = GLOW_SPRITE_SIZE;
  canvas.height = GLOW_SPRITE_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const center = GLOW_SPRITE_SIZE / 2;
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, "rgba(200,220,255,0.55)");
  gradient.addColorStop(1, "rgba(200,220,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GLOW_SPRITE_SIZE, GLOW_SPRITE_SIZE);
  return canvas;
}

export default function InteractiveStars() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.className = "starfield-canvas fixed inset-0 h-full w-full [contain:strict] [transform:translateZ(0)]";
    canvas.style.touchAction = "none";
    host.appendChild(canvas);

    const canRenderOffThread = typeof canvas.transferControlToOffscreen === "function";
    if (canRenderOffThread) {
      const worker = new Worker(new URL("../workers/stars.worker.ts", import.meta.url), { type: "module" });
      const offscreen = canvas.transferControlToOffscreen();
      worker.postMessage({ type: "init", canvas: offscreen }, [offscreen]);

      const resize = () => {
        const rect = host.getBoundingClientRect();
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;
        worker.postMessage({
          type: "resize",
          viewW,
          viewH,
          fieldW: rect.width,
          fieldH: rect.height,
          docX: rect.left + window.scrollX,
          docY: rect.top + window.scrollY,
          dpr: getCanvasDpr(viewW, viewH),
        });
      };
      let scrollFrame = 0;
      let pointerFrame = 0;
      let scrollRelease = 0;
      let scrolling = false;
      let pointerX = 0;
      let pointerY = 0;
      const scroll = () => {
        if (!scrolling) {
          scrolling = true;
          worker.postMessage({ type: "quality", low: true });
        }
        window.clearTimeout(scrollRelease);
        scrollRelease = window.setTimeout(() => {
          scrolling = false;
          worker.postMessage({ type: "scroll", x: window.scrollX, y: window.scrollY });
          worker.postMessage({ type: "quality", low: false });
        }, 100);

        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;
          worker.postMessage({ type: "scroll", x: window.scrollX, y: window.scrollY });
        });
      };
      const pointer = (event: PointerEvent) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(() => {
          pointerFrame = 0;
          worker.postMessage({ type: "pointer", x: pointerX, y: pointerY, active: true });
        });
      };
      const leave = () => worker.postMessage({ type: "pointer", x: -9999, y: -9999, active: false });
      const shoot = (event: PointerEvent) => worker.postMessage({ type: "shoot", x: event.clientX, y: event.clientY });
      const visibility = () => worker.postMessage({ type: "active", active: !document.hidden });
      resize();
      scroll();
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("scroll", scroll, { passive: true });
      window.addEventListener("pointermove", pointer, { passive: true });
      window.addEventListener("pointerdown", shoot, { passive: true });
      document.addEventListener("pointerleave", leave);
      window.addEventListener("blur", leave);
      document.addEventListener("visibilitychange", visibility);

      return () => {
        if (scrollFrame) cancelAnimationFrame(scrollFrame);
        if (pointerFrame) cancelAnimationFrame(pointerFrame);
        window.clearTimeout(scrollRelease);
        observer.disconnect();
        worker.terminate();
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", scroll);
        window.removeEventListener("pointermove", pointer);
        window.removeEventListener("pointerdown", shoot);
        document.removeEventListener("pointerleave", leave);
        window.removeEventListener("blur", leave);
        document.removeEventListener("visibilitychange", visibility);
        canvas.remove();
      };
    }
    // `desynchronized` lets the browser skip a compositing sync point for this
    // canvas — same pixels, less main-thread waiting.
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const glowSprite = createGlowSprite();
    if (!glowSprite) return;

    // This ambient field does not benefit visually from a full retina backing
    // store, while every extra DPR step multiplies its per-frame pixel upload.
    let dpr = getCanvasDpr(window.innerWidth, window.innerHeight);
    // Field size = the page area the stars belong to (host element).
    let width = 0;
    let height = 0;
    // Canvas backing store = viewport only. Previously the canvas was as tall as
    // the whole page, which on long routes meant a multi-viewport GPU texture
    // being re-uploaded every frame — the main cause of jank in production.
    let viewW = 0;
    let viewH = 0;
    let stars: Star[] = [];
    let shootings: Shooting[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const target = { x: 0, y: 0 };
    const parallax = { x: 0, y: 0 };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function createStar(): Star {
      const z = 0.3 + Math.random() * 0.7;
      return {
        nx: Math.random(),
        ny: Math.random(),
        z,
        r: (Math.random() * 1.1 + 0.3) * z,
        baseAlpha: 0.35 + Math.random() * 0.65,
        twinkleSpeed: 0.4 + Math.random() * 1.6,
        twinklePhase: Math.random() * Math.PI * 2,
        spike: Math.random() < 0.18 ? 0.6 + Math.random() * 0.4 : 0,
      };
    }

    function syncStarCount() {
      const area = width * height;
      const count = Math.min(420, Math.max(140, Math.floor(area / 6000)));
      if (stars.length < count) {
        stars = [...stars, ...new Array(count - stars.length).fill(0).map(createStar)];
      } else if (stars.length > count) {
        stars = stars.slice(0, count);
      }
    }

    // Host origin cached in *document* space. Viewport-space offsets are derived
    // from window.scrollX/Y inside the render loop, so a scroll event never has
    // to call getBoundingClientRect (that read forces a synchronous layout and
    // was a direct source of scroll stutter).
    let docX = 0;
    let docY = 0;
    let offsetX = 0;
    let offsetY = 0;
    function syncRect() {
      const rect = host!.getBoundingClientRect();
      docX = rect.left + window.scrollX;
      docY = rect.top + window.scrollY;
      offsetX = rect.left;
      offsetY = rect.top;
      return rect;
    }
    function syncOffsets() {
      offsetX = docX - window.scrollX;
      offsetY = docY - window.scrollY;
    }

    function resize() {
      const rect = syncRect();
      width = rect.width;
      height = rect.height;
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      dpr = getCanvasDpr(viewW, viewH);
      const bw = Math.floor(viewW * dpr);
      const bh = Math.floor(viewH * dpr);
      if (canvas!.width !== bw || canvas!.height !== bh) {
        canvas!.width = bw;
        canvas!.height = bh;
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      syncStarCount();
    }

    function onPointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      target.x = (viewW ? e.clientX / viewW : 0.5) * 2 - 1;
      target.y = (viewH ? e.clientY / viewH : 0.5) * 2 - 1;
    }
    function onPointerLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      target.x = 0;
      target.y = 0;
    }
    function onClick(e: PointerEvent) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 4;
      shootings.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 30,
      });
    }

    // Draw batching: star cores and diffraction spikes are grouped into a fixed
    // number of alpha buckets, so a frame issues ~2 * BUCKETS fill/stroke calls
    // instead of two per star. The bucket step (1/48) is below the 8-bit alpha
    // resolution of the compositor, so the rendered result is unchanged.
    const BUCKETS = 48;
    const coreBuckets: number[][] = Array.from({ length: BUCKETS }, () => []);
    const spikeBuckets: number[][] = Array.from({ length: BUCKETS }, () => []);

    const BAND_PAD = 120;

    function collectStar(s: Star, t: number) {
      // Star position in page space, then translated into viewport space.
      const px = s.nx * width - parallax.x * 30 * s.z + offsetX;
      const py = s.ny * height - parallax.y * 30 * s.z + offsetY;
      if (py < -BAND_PAD || py > viewH + BAND_PAD) return;

      let boost = 0;
      if (mouse.active) {
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const range = 160;
        const distSq = dx * dx + dy * dy;
        if (distSq < range * range) {
          boost = (1 - Math.sqrt(distSq) / range) * 0.9;
        }
      }

      const twinkle = 0.5 + 0.5 * Math.sin(t * 0.001 * s.twinkleSpeed + s.twinklePhase);
      const alpha = Math.min(1, s.baseAlpha * (0.55 + twinkle * 0.65) + boost);
      const radius = s.r * (1 + boost * 1.6);
      const glowRadius = radius * 6;

      // Pre-rendered soft glow sprite — much faster than per-star gradients.
      ctx!.globalAlpha = alpha * 0.55;
      ctx!.drawImage(glowSprite!, px - glowRadius, py - glowRadius, glowRadius * 2, glowRadius * 2);

      const bucket = Math.min(BUCKETS - 1, (alpha * BUCKETS) | 0);
      const core = coreBuckets[bucket];
      core.push(px, py, radius);

      if (s.spike > 0 || boost > 0.4) {
        const spikeLen = radius * (6 + boost * 10) * (s.spike || 0.6);
        const spikeBucket = Math.min(BUCKETS - 1, (alpha * 0.6 * BUCKETS) | 0);
        spikeBuckets[spikeBucket].push(px, py, spikeLen);
      }
    }

    function flushStars() {
      ctx!.globalAlpha = 1;

      for (let b = 0; b < BUCKETS; b++) {
        const list = coreBuckets[b];
        if (list.length === 0) continue;
        ctx!.fillStyle = `rgba(255,255,255,${((b + 0.5) / BUCKETS).toFixed(3)})`;
        ctx!.beginPath();
        for (let i = 0; i < list.length; i += 3) {
          const x = list[i];
          const y = list[i + 1];
          const r = list[i + 2];
          ctx!.moveTo(x + r, y);
          ctx!.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx!.fill();
        list.length = 0;
      }

      ctx!.lineWidth = 0.6;
      for (let b = 0; b < BUCKETS; b++) {
        const list = spikeBuckets[b];
        if (list.length === 0) continue;
        ctx!.strokeStyle = `rgba(220,235,255,${((b + 0.5) / BUCKETS).toFixed(3)})`;
        ctx!.beginPath();
        for (let i = 0; i < list.length; i += 3) {
          const x = list[i];
          const y = list[i + 1];
          const len = list[i + 2];
          ctx!.moveTo(x - len, y);
          ctx!.lineTo(x + len, y);
          ctx!.moveTo(x, y - len);
          ctx!.lineTo(x, y + len);
        }
        ctx!.stroke();
        list.length = 0;
      }
    }

    function drawShooting(s: Shooting) {
      const a = 1 - s.life / s.maxLife;
      const tailX = s.x - s.vx * 6;
      const tailY = s.y - s.vy * 6;

      ctx!.strokeStyle = `rgba(255,255,255,${a})`;
      ctx!.lineWidth = 1.6;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(tailX, tailY);
      ctx!.lineTo(s.x, s.y);
      ctx!.stroke();

      ctx!.fillStyle = `rgba(255,255,255,${a})`;
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, 1.6, 0, Math.PI * 2);
      ctx!.fill();
    }

    let raf = 0;
    let lastT = 0;
    function renderOnce(t: number) {
      syncOffsets();
      ctx!.clearRect(0, 0, viewW, viewH);
      for (const s of stars) collectStar(s, t);
      flushStars();
    }

    function frame(t: number) {
      // Render on every animation frame: the field is positioned relative to the
      // page, so skipping frames makes it visibly step while scrolling.
      // Frame-rate independent motion: one "step" equals a 60fps frame, so the
      // animation keeps the same speed whether the device renders at 30 or 144fps.
      const step = lastT ? Math.min(3, (t - lastT) / 16.667) : 1;
      lastT = t;

      const ease = 1 - Math.pow(1 - 0.05, step);
      parallax.x += (target.x - parallax.x) * ease;
      parallax.y += (target.y - parallax.y) * ease;

      renderOnce(t);

      for (let i = shootings.length - 1; i >= 0; i--) {
        const sh = shootings[i];
        sh.x += sh.vx * step;
        sh.y += sh.vy * step;
        sh.life += step;
        drawShooting(sh);
        if (sh.life >= sh.maxLife) shootings.splice(i, 1);
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });
    // No scroll listener: offsets are derived from window.scrollX/Y in the frame.
    window.addEventListener("resize", resize);
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    // Never burn frames while the tab is in the background or while the star
    // field itself is scrolled out of the viewport (nothing would be drawn).
    let onScreen = true;
    function start() {
      if (!raf && !prefersReduced && !document.hidden && onScreen) {
        lastT = 0;
        raf = requestAnimationFrame(frame);
      }
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            onScreen = entry.isIntersecting;
            if (onScreen) start();
            else {
              stop();
              ctx!.clearRect(0, 0, viewW, viewH);
            }
          }
        },
        { rootMargin: "100px 0px" },
      );
      io.observe(host);
    }

    if (!prefersReduced) {
      start();
    } else {
      renderOnce(0);
    }

    return () => {
      stop();
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onClick);
      
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.remove();
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden className="pointer-events-none absolute inset-0" />
  );
}
