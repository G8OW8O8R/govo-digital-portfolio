type Star = {
  nx: number;
  ny: number;
  z: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  spike: number;
  twinkleCache: number;
};

type Shooting = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

type InitMessage = { type: "init"; canvas: OffscreenCanvas };
type ResizeMessage = {
  type: "resize";
  viewW: number;
  viewH: number;
  fieldW: number;
  fieldH: number;
  docX: number;
  docY: number;
  dpr: number;
};
type PointerMessage = { type: "pointer"; x: number; y: number; active: boolean };
type ScrollMessage = { type: "scroll"; x: number; y: number };
type ShootMessage = { type: "shoot"; x: number; y: number };
type ActiveMessage = { type: "active"; active: boolean };
type QualityMessage = { type: "quality"; low: boolean };
type WorkerMessage = InitMessage | ResizeMessage | PointerMessage | ScrollMessage | ShootMessage | ActiveMessage | QualityMessage;

const SPRITE_SIZE = 128;
const BUCKETS = 32;
const BAND_PAD = 120;

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
let glowSprite: OffscreenCanvas | null = null;
let stars: Star[] = [];
let shootings: Shooting[] = [];
let fieldW = 0;
let fieldH = 0;
let viewW = 0;
let viewH = 0;
let docX = 0;
let docY = 0;
let viewportScrollX = 0;
let viewportScrollY = 0;
let active = true;
let frameId = 0;
let lastT = 0;
let canvasDpr = 1;
let lowQuality = false;

const mouse = { x: -9999, y: -9999, active: false };
const target = { x: 0, y: 0 };
const parallax = { x: 0, y: 0 };
const coreBuckets: number[][] = Array.from({ length: BUCKETS }, () => []);
const spikeBuckets: number[][] = Array.from({ length: BUCKETS }, () => []);

function createSprite() {
  const sprite = new OffscreenCanvas(SPRITE_SIZE, SPRITE_SIZE);
  const spriteCtx = sprite.getContext("2d");
  if (!spriteCtx) return null;
  const center = SPRITE_SIZE / 2;
  const gradient = spriteCtx.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, "rgba(200,220,255,0.55)");
  gradient.addColorStop(1, "rgba(200,220,255,0)");
  spriteCtx.fillStyle = gradient;
  spriteCtx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return sprite;
}

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
    twinkleCache: 0.5,
  };
}

function syncStarCount() {
  const count = Math.min(420, Math.max(140, Math.floor((fieldW * fieldH) / 6000)));
  while (stars.length < count) stars.push(createStar());
  if (stars.length > count) stars.length = count;
}

function collectStar(star: Star, time: number) {
  if (!ctx || !glowSprite) return;
  const x = star.nx * fieldW - parallax.x * 30 * star.z + docX - viewportScrollX;
  const y = star.ny * fieldH - parallax.y * 30 * star.z + docY - viewportScrollY;
  if (y < -BAND_PAD || y > viewH + BAND_PAD) return;

  let boost = 0;
  if (mouse.active && !lowQuality) {
    const dx = x - mouse.x;
    const dy = y - mouse.y;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq < 25_600) boost = (1 - Math.sqrt(distanceSq) / 160) * 0.9;
  }

  const twinkle = lowQuality
    ? star.twinkleCache
    : 0.5 + 0.5 * Math.sin(time * 0.001 * star.twinkleSpeed + star.twinklePhase);
  if (!lowQuality) star.twinkleCache = twinkle;
  const alpha = Math.min(1, star.baseAlpha * (0.55 + twinkle * 0.65) + boost);
  const radius = star.r * (1 + boost * 1.6);
  if (!lowQuality) {
    const glowRadius = radius * 6;
    ctx.globalAlpha = alpha * 0.55;
    ctx.drawImage(glowSprite, x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
  }

  const bucket = Math.min(BUCKETS - 1, (alpha * BUCKETS) | 0);
  coreBuckets[bucket].push(x, y, radius);
  if (star.spike > 0 || boost > 0.4) {
    const spikeLength = radius * (6 + boost * 10) * (star.spike || 0.6);
    const spikeBucket = Math.min(BUCKETS - 1, (alpha * 0.6 * BUCKETS) | 0);
    spikeBuckets[spikeBucket].push(x, y, spikeLength);
  }
}

function flushStars() {
  if (!ctx) return;
  ctx.globalAlpha = 1;
  for (let bucket = 0; bucket < BUCKETS; bucket++) {
    const list = coreBuckets[bucket];
    if (!list.length) continue;
    ctx.fillStyle = `rgba(255,255,255,${((bucket + 0.5) / BUCKETS).toFixed(3)})`;
    ctx.beginPath();
    for (let index = 0; index < list.length; index += 3) {
      const x = list[index];
      const y = list[index + 1];
      const radius = list[index + 2];
      ctx.moveTo(x + radius, y);
      ctx.arc(x, y, radius, 0, Math.PI * 2);
    }
    ctx.fill();
    list.length = 0;
  }

  ctx.lineWidth = 0.6;
  for (let bucket = 0; bucket < BUCKETS; bucket++) {
    const list = spikeBuckets[bucket];
    if (!list.length) continue;
    ctx.strokeStyle = `rgba(220,235,255,${((bucket + 0.5) / BUCKETS).toFixed(3)})`;
    ctx.beginPath();
    for (let index = 0; index < list.length; index += 3) {
      const x = list[index];
      const y = list[index + 1];
      const length = list[index + 2];
      ctx.moveTo(x - length, y);
      ctx.lineTo(x + length, y);
      ctx.moveTo(x, y - length);
      ctx.lineTo(x, y + length);
    }
    ctx.stroke();
    list.length = 0;
  }
}

function drawShooting(shooting: Shooting) {
  if (!ctx) return;
  const alpha = 1 - shooting.life / shooting.maxLife;
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(shooting.x - shooting.vx * 6, shooting.y - shooting.vy * 6);
  ctx.lineTo(shooting.x, shooting.y);
  ctx.stroke();
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.beginPath();
  ctx.arc(shooting.x, shooting.y, 1.6, 0, Math.PI * 2);
  ctx.fill();
}

function frame(time: number) {
  if (!active || !ctx) {
    frameId = 0;
    return;
  }
  const step = lastT ? Math.min(3, (time - lastT) / 16.667) : 1;
  lastT = time;
  const ease = 1 - Math.pow(0.95, step);
  parallax.x += (target.x - parallax.x) * ease;
  parallax.y += (target.y - parallax.y) * ease;
  // Resetting the backing store is considerably cheaper than compositing a
  // translucent clear across a fullscreen canvas on high-resolution displays.
  ctx.clearRect(0, 0, viewW, viewH);
  for (const star of stars) collectStar(star, time);
  flushStars();
  for (let index = shootings.length - 1; index >= 0; index--) {
    const shooting = shootings[index];
    shooting.x += shooting.vx * step;
    shooting.y += shooting.vy * step;
    shooting.life += step;
    drawShooting(shooting);
    if (shooting.life >= shooting.maxLife) shootings.splice(index, 1);
  }
  frameId = requestAnimationFrame(frame);
}

function start() {
  if (!frameId && active && ctx) {
    lastT = 0;
    frameId = requestAnimationFrame(frame);
  }
}

function stop() {
  if (frameId) cancelAnimationFrame(frameId);
  frameId = 0;
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;
  if (message.type === "init") {
    canvas = message.canvas;
    ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    glowSprite = createSprite();
    start();
    return;
  }
  if (message.type === "resize") {
    viewW = message.viewW;
    viewH = message.viewH;
    fieldW = message.fieldW;
    fieldH = message.fieldH;
    docX = message.docX;
    docY = message.docY;
    canvasDpr = message.dpr;
    if (canvas) {
      const backingWidth = Math.max(1, Math.floor(viewW * canvasDpr));
      const backingHeight = Math.max(1, Math.floor(viewH * canvasDpr));
      if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
        canvas.width = backingWidth;
        canvas.height = backingHeight;
      }
      ctx?.setTransform(canvasDpr, 0, 0, canvasDpr, 0, 0);
    }
    syncStarCount();
    return;
  }
  if (message.type === "scroll") {
    viewportScrollX = message.x;
    viewportScrollY = message.y;
    return;
  }
  if (message.type === "pointer") {
    mouse.x = message.x;
    mouse.y = message.y;
    mouse.active = message.active;
    target.x = message.active && viewW ? (message.x / viewW) * 2 - 1 : 0;
    target.y = message.active && viewH ? (message.y / viewH) * 2 - 1 : 0;
    return;
  }
  if (message.type === "quality") {
    lowQuality = message.low;
    if (!message.low) start();
    return;
  }
  if (message.type === "shoot") {
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 4;
    shootings.push({
      x: message.x,
      y: message.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 60 + Math.random() * 30,
    });
    return;
  }
  active = message.active;
  if (active) start();
  else stop();
};