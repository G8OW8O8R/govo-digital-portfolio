import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import type { ShowcaseItem } from "@/components/ProjectShowcase";

/** Resolves a CSS custom property (any color space, incl. oklch — which
 * getComputedStyle now returns verbatim, and which THREE.Color can't parse) to a
 * THREE.Color by letting a 2D canvas do the color-space conversion via pixel readback.
 * Keeps the 3D scene in sync with the theme without duplicating color math. */
function resolveCssColor(varName: string, fallback: [number, number, number]): THREE.Color {
  if (typeof document === "undefined") return new THREE.Color(...fallback);
  try {
    const probe = document.createElement("span");
    probe.style.color = `var(${varName})`;
    document.body.appendChild(probe);
    const cssValue = getComputedStyle(probe).color;
    document.body.removeChild(probe);

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Color(...fallback);
    ctx.fillStyle = cssValue;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return new THREE.Color(r / 255, g / 255, b / 255);
  } catch {
    return new THREE.Color(...fallback);
  }
}

const TWO_PI = Math.PI * 2;

type RippleUniforms = {
  mouse: { value: THREE.Vector3 };
  strength: { value: number };
  radius: { value: number };
};

/** Injects a cursor-reactive bulge into a material's vertex shader: vertices near
 * `uRippleMouse` (a shared world-space point, updated from real pointer hits) push
 * outward, falling off with distance — the "liquid" hover distortion from the
 * reference. `mode: "normal"` bulges along the surface normal (used for the curved
 * cards); `mode: "up"` bumps straight up (used for the flat floor grid, which has
 * no meaningful normal attribute of its own). */
function applyRippleShader(material: THREE.Material, uniforms: RippleUniforms, mode: "normal" | "up") {
  // Without a distinct cache key, three.js may reuse a program compiled for another
  // material that looks the same on paper (same map/roughness/etc.) but was compiled
  // *before* this onBeforeCompile ran — silently dropping the injected code.
  material.customProgramCacheKey = () => `ripple-${mode}`;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uRippleMouse = uniforms.mouse;
    shader.uniforms.uRippleStrength = uniforms.strength;
    shader.uniforms.uRippleRadius = uniforms.radius;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform vec3 uRippleMouse;
        uniform float uRippleStrength;
        uniform float uRippleRadius;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        {
          vec3 rippleWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
          float rippleDist = distance(rippleWorldPos, uRippleMouse);
          float rippleInfluence = exp(-(rippleDist * rippleDist) / (uRippleRadius * uRippleRadius)) * uRippleStrength;
          ${mode === "normal" ? "transformed += normal * rippleInfluence * 0.55;" : "transformed.y += rippleInfluence * 0.7;"}
        }`,
      );
  };
  material.needsUpdate = true;
}

/** Eases the shared ripple strength toward its target (1 while hovering a card, 0
 * otherwise) once per frame — smooth fade in/out instead of a hard on/off snap. */
function RippleAnimator({
  strength,
  target,
}: {
  strength: { value: number };
  target: React.MutableRefObject<number>;
}) {
  useFrame((_state, delta) => {
    const ease = 1 - Math.pow(0.001, delta);
    strength.value += (target.current - strength.value) * ease;
  });
  return null;
}

/** A soft radial dark blob used as a cheap "contact shadow" under the ring,
 * grounding the cards against the floor grid instead of them looking like they float. */
function useContactShadowTexture(): THREE.Texture {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Texture();
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(0,0,0,0.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

/** Bakes rounded corners into a loaded texture by re-drawing it onto a clipped
 * canvas — the corners become transparent, which alphaTest then discards, so a
 * plain curved cylinder segment reads as a rounded card (matching the reference)
 * without needing custom rounded-rect geometry. */
function useRoundedTexture(source: THREE.Texture, radius = 0.07): THREE.Texture {
  return useMemo(() => {
    const img = source.image as HTMLImageElement | undefined;
    if (!img || !img.width || !img.height) return source;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return source;
    const r = Math.min(img.width, img.height) * radius;
    const w = img.width;
    const h = img.height;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);
}

/** Drag-to-spin the whole ring, with inertia after release.
 * Pointer listeners are native (not React state) so a drag never triggers a re-render.
 *
 * Rotation is split into a `target` (what the drag/momentum wants) and a `current`
 * (what's actually rendered), which continuously eases toward the target every frame
 * — frame-rate independent, so it feels the same at 60fps or 144fps. That's what gives
 * the silky, slightly-trailing feel of the reference (built with GSAP there; here it's
 * a plain exponential-decay lerp) instead of the render rigidly matching the mouse 1:1.
 *
 * Also reports which card is currently front-and-center, purely from the rotation
 * angle (no DOM/3D projection needed). */
function RotatingRig({
  baseAngles,
  onFrontIndexChange,
  children,
}: {
  baseAngles: number[];
  onFrontIndexChange: (i: number) => void;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef(0);
  const current = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastFront = useRef(-1);
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "none";
    el.style.cursor = "grab";

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      velocity.current = 0;
      el.style.cursor = "grabbing";
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      // Lower sensitivity than a 1:1 drag — a heavier, "more premium" ring takes
      // more travel to spin, the way a large physical object would.
      const delta = dx * 0.0032;
      target.current += delta;
      velocity.current = delta;
    };
    const onUp = (e: PointerEvent) => {
      dragging.current = false;
      el.style.cursor = "grab";
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [gl]);

  useFrame((_state, delta) => {
    if (!dragging.current) {
      if (Math.abs(velocity.current) > 0.00002) {
        target.current += velocity.current;
        // Frame-rate independent: velocity keeps ~18% of itself after a full real
        // second, regardless of refresh rate — a long, weighty coast rather than a
        // quick flick-and-stop.
        velocity.current *= Math.pow(0.18, delta);
      } else {
        velocity.current = 0;
      }
    }

    // Frame-rate independent ease: current always closes ~the same fraction of the
    // remaining gap per second, regardless of the actual frame rate. A smaller base
    // here means more lag/weight; this is intentionally slower than a snappy UI ease.
    const ease = 1 - Math.pow(0.0012, delta);
    current.current += (target.current - current.current) * ease;
    if (group.current) group.current.rotation.y = current.current;

    const norm = ((-current.current % TWO_PI) + TWO_PI) % TWO_PI;
    let best = 0;
    let bestDiff = Infinity;
    for (let i = 0; i < baseAngles.length; i++) {
      const raw = Math.abs(baseAngles[i] - norm);
      const diff = Math.min(raw, TWO_PI - raw);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = i;
      }
    }
    if (best !== lastFront.current) {
      lastFront.current = best;
      onFrontIndexChange(best);
    }
  });

  return <group ref={group}>{children}</group>;
}

function Card3D({
  item,
  angle,
  ringRadius,
  curveRadius,
  thetaLength,
  cardHeight,
  onOpen,
  ripple,
  rippleTarget,
}: {
  item: ShowcaseItem;
  angle: number;
  ringRadius: number;
  curveRadius: number;
  thetaLength: number;
  cardHeight: number;
  onOpen: () => void;
  ripple: RippleUniforms;
  rippleTarget: React.MutableRefObject<number>;
}) {
  const baseTexture = useTexture(item.imageSrc);
  const texture = useRoundedTexture(baseTexture);
  const downPos = useRef<{ x: number; y: number } | null>(null);

  // The cylinder's visible surface sits `curveRadius` away from its own axis, so the
  // axis itself is placed closer to the center — that way the outward-facing surface
  // (what the camera actually sees) lands exactly on the `ringRadius` circle.
  const axisRadius = ringRadius - curveRadius;
  const x = Math.sin(angle) * axisRadius;
  const z = Math.cos(angle) * axisRadius;

  return (
    <mesh
      position={[x, 0, z]}
      rotation={[0, angle, 0]}
      onPointerDown={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        downPos.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const start = downPos.current;
        downPos.current = null;
        if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 6) onOpen();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
        rippleTarget.current = 0;
      }}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        // Without stopPropagation, the ray keeps going and dispatches this same event
        // to every card behind this one too — including ones clear across the ring —
        // and whichever handler ran last would win, teleporting the ripple's mouse
        // point to a totally different card's surface.
        e.stopPropagation();
        ripple.mouse.value.copy(e.point);
        rippleTarget.current = 1;
      }}
    >
      <cylinderGeometry args={[curveRadius, curveRadius, cardHeight, 32, 1, true, -thetaLength / 2, thetaLength]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.45}
        metalness={0.08}
        transparent
        alphaTest={0.5}
        ref={(mat: THREE.MeshStandardMaterial | null) => {
          if (mat && !mat.userData.rippleApplied) {
            applyRippleShader(mat, ripple, "normal");
            mat.userData.rippleApplied = true;
          }
        }}
      />
    </mesh>
  );
}

function Scene({
  items,
  onOpenIndex,
  baseAngles,
  onFrontIndexChange,
}: {
  items: ShowcaseItem[];
  onOpenIndex: (i: number) => void;
  baseAngles: number[];
  onFrontIndexChange: (i: number) => void;
}) {
  const colors = useMemo(
    () => ({
      primary: resolveCssColor("--primary", [0.66, 0.55, 0.98]),
      bg: resolveCssColor("--background", [0.04, 0.04, 0.06]),
      gridLine: new THREE.Color(0.4, 0.4, 0.46),
      gridFaint: new THREE.Color(0.14, 0.14, 0.17),
    }),
    [],
  );

  const n = items.length;
  // Landscape cards (measured ~1.42:1 off the reference's front-facing card),
  // with a gentle intrinsic bend (~30°, also measured off that same face-on card —
  // the dramatic "banana" look on its side cards is mostly rotation/perspective,
  // not the card's own curve). Bend tightness (curveRadius) and ring spacing
  // (ringRadius) are independent knobs so cards don't collide around the ring.
  const cardWidth = 3.4;
  const cardHeight = cardWidth / 1.42;
  const thetaLength = 0.52; // ~30°
  const curveRadius = cardWidth / thetaLength;
  const ringRadius = 7.6;
  const shadowTexture = useContactShadowTexture();

  const ripple: RippleUniforms = useMemo(
    () => ({
      mouse: { value: new THREE.Vector3(0, -100, 0) },
      strength: { value: 0 },
      radius: { value: 1.6 },
    }),
    [],
  );
  const rippleTarget = useRef(0);

  return (
    <>
      {/* No scene background — the canvas stays transparent so the page's own
          starfield shows through behind the cards, instead of a separate flat panel. */}
      <fog attach="fog" args={[colors.bg, 10, 20]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />
      <directionalLight position={[-4, -2, -4]} intensity={0.3} color={colors.primary} />
      <RippleAnimator strength={ripple.strength} target={rippleTarget} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.74, 0]}>
        <planeGeometry args={[ringRadius * 2.4, ringRadius * 1.5]} />
        <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} />
      </mesh>
      <gridHelper
        args={[70, 70, colors.gridLine, colors.gridFaint]}
        position={[0, -1.75, 0]}
        ref={(g: THREE.GridHelper | null) => {
          const material = g?.material as THREE.Material | undefined;
          if (material) {
            material.transparent = true;
            material.opacity = 0.6;
            if (!material.userData.rippleApplied) {
              applyRippleShader(material, ripple, "up");
              material.userData.rippleApplied = true;
            }
          }
        }}
      />
      <Suspense fallback={null}>
        <RotatingRig baseAngles={baseAngles} onFrontIndexChange={onFrontIndexChange}>
          {items.map((item, i) => (
            <Card3D
              key={item.id}
              item={item}
              angle={baseAngles[i]}
              ringRadius={ringRadius}
              curveRadius={curveRadius}
              thetaLength={thetaLength}
              cardHeight={cardHeight}
              onOpen={() => onOpenIndex(i)}
              ripple={ripple}
              rippleTarget={rippleTarget}
            />
          ))}
        </RotatingRig>
      </Suspense>
    </>
  );
}

/** True only once we've confirmed (client-side) that 3D is worth turning on:
 * capable viewport, WebGL available, motion not disabled. Defaults to false so
 * SSR/first paint always match (no hydration mismatch) and progressively upgrades. */
export function useSupports3DGallery() {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.innerWidth >= 768;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
    setSupported(!reduced && wide && webgl);
  }, []);
  return supported;
}

export default function ProjectShowcase3D({
  items,
  onOpenIndex,
  dragHint,
}: {
  items: ShowcaseItem[];
  onOpenIndex: (i: number) => void;
  dragHint: string;
}) {
  const [frontIndex, setFrontIndex] = useState(0);
  const baseAngles = useMemo(() => items.map((_, i) => (i / items.length) * TWO_PI), [items]);
  const front = items[frontIndex];

  return (
    <div className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.1, 12.3], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene items={items} onOpenIndex={onOpenIndex} baseAngles={baseAngles} onFrontIndexChange={setFrontIndex} />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 bottom-16 text-center">
        <p className="font-display text-2xl tracking-tight text-foreground md:text-3xl">{front?.name}</p>
        <p className="mt-1 text-sm text-foreground/55">{front?.subtitle}</p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
        {dragHint}
      </div>
    </div>
  );
}
