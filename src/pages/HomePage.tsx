import { Link, useNavigate } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, Smile, Briefcase, Layers, AtSign, Workflow, Newspaper } from "lucide-react";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import avatarUrl from "@/assets/avatar.webp";
import { usePauseOffscreen } from "@/hooks/usePauseOffscreen";
import ProtectedImage from "@/components/ProtectedImage";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { SERVICES, SERVICE_KEYS, SERVICE_SLUGS } from "@/content/services";


const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));



const CARD_DEFS = [
  { key: "me" as const, page: "about" as const, icon: Smile, color: "text-amber-400" },
  { key: "projects" as const, page: "projects" as const, icon: Briefcase, color: "text-emerald-400" },
  { key: "skills" as const, page: "skills" as const, icon: Layers, color: "text-violet-400" },
  { key: "process" as const, page: "process" as const, icon: Workflow, color: "text-pink-400" },
  { key: "contact" as const, page: "contact" as const, icon: AtSign, color: "text-sky-400" },
  { key: "blog" as const, page: "blog" as const, icon: Newspaper, color: "text-rose-400" },
];


const MARQUEE = [
  "React", "TypeScript", "Tailwind", "GSAP", "Vite",
  "UI Design", "E-commerce", "Motion UI", "Vercel", "Shopify",
];

export default function HomePage() {
  const { t, lang } = useI18n();
  const p = paths(lang);
  const marqueeRef = usePauseOffscreen<HTMLDivElement>();
  const rotating = t.rotating;
  const [wordIndex, setWordIndex] = useState(0);
  const [vision, setVision] = useState("");
  const portraitRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const goToContact = () => {
    if (vision.trim()) {
      try {
        sessionStorage.setItem("govo:contactMessage", vision.trim());
      } catch {}
    }
    navigate({ to: p.contact });
  };

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % rotating.length), 2600);
    return () => clearInterval(id);
  }, [rotating.length]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0, y: 0 });
  const portraitRectRef = useRef({ docCx: 0, docCy: 0, width: 1, height: 1 });
  const isVisible = useRef(true);

  useEffect(() => {
    const updatePortraitRect = () => {
      const el = portraitRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      portraitRectRef.current = {
        docCx: r.left + window.scrollX + r.width / 2,
        docCy: r.top + window.scrollY + r.height / 2,
        width: r.width,
        height: r.height,
      };
    };
    
    updatePortraitRect();
    window.addEventListener("resize", updatePortraitRect, { passive: true });

    const io = new IntersectionObserver((entries) => {
      isVisible.current = entries[0].isIntersecting;
    }, { rootMargin: "100px 0px" });
    if (portraitRef.current) io.observe(portraitRef.current);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    let raf = 0;
    let lastX = Number.NaN;
    let lastY = Number.NaN;
    let lastRx = Number.NaN;
    let lastRy = Number.NaN;
    
    const tick = () => {
      if (!isVisible.current) {
        raf = 0;
        return;
      }
      
      const { x, y } = mouseRef.current;
      let tiltSettled = true;
      
      if (spotRef.current && (x !== lastX || y !== lastY)) {
        spotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        lastX = x;
        lastY = y;
      }
      
      const el = portraitRef.current;
      if (el) {
        const { docCx, docCy, width, height } = portraitRectRef.current;
        const dx = (x - (docCx - window.scrollX)) / width;
        const dy = (y - (docCy - window.scrollY)) / height;
        const targetRx = Math.max(-12, Math.min(12, -dy * 18));
        const targetRy = Math.max(-12, Math.min(12, dx * 18));
        
        rotRef.current.x += (targetRx - rotRef.current.x) * 0.12;
        rotRef.current.y += (targetRy - rotRef.current.y) * 0.12;
        
        tiltSettled =
          Math.abs(targetRx - rotRef.current.x) < 0.02 &&
          Math.abs(targetRy - rotRef.current.y) < 0.02;
          
        const rx = Math.round(rotRef.current.x * 100) / 100;
        const ry = Math.round(rotRef.current.y * 100) / 100;
        
        if (rx !== lastRx || ry !== lastRy) {
          el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
          lastRx = rx;
          lastRy = ry;
        }
      }
      
      if (!tiltSettled) raf = requestAnimationFrame(tick);
      else raf = 0;
    };

    const onPointerFrame = (e: MouseEvent) => {
      onMove(e);
      if (!raf && isVisible.current) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onPointerFrame, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onPointerFrame);
      window.removeEventListener("resize", updatePortraitRect);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}>
        <InteractiveStars />
      </Suspense>

      <div
        ref={spotRef}
        className="spotlight pointer-events-none fixed -left-[300px] -top-[300px] z-[1] h-[600px] w-[600px] rounded-full will-change-transform"
        aria-hidden
      />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 pt-5 text-xs sm:px-6 sm:pt-6">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] text-foreground/60 sm:text-xs">
          <span className="relative inline-flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="truncate">{t.available}</span>
        </div>
        <LanguageSwitcher />
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-6 py-12 text-center">
        <div
          className="animate-fade-up"
          style={{ animationDelay: "40ms", perspective: "1000px" }}
        >
          <div
            ref={portraitRef}
            className="relative will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-6 -z-10 rounded-full bg-gradient-to-br from-primary/40 via-sky-500/20 to-pink-500/30 blur-3xl" />
            <ProtectedImage
              src={avatarUrl}
              ariaLabel="Owner of GOVO DIGITAL"
              eager
              className="h-44 w-44 rounded-full drop-shadow-[0_30px_60_rgba(160,120,255,0.35)] md:h-52 md:w-52 animate-float-y"
            />
          </div>
        </div>

        <p
          className="animate-fade-up mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50 sm:text-xs sm:tracking-[0.25em]"
          style={{ animationDelay: "120ms" }}
        >
          {t.greeting}
        </p>

        <h1
          className="animate-fade-up mt-4 font-display text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          style={{ animationDelay: "200ms" }}
        >
          <span className="block text-foreground">{t.headlineLead}</span>
          <span className="relative mt-1 block h-[1.1em] overflow-hidden">
            {rotating.map((w, i) => (
              <span
                key={w}
                aria-hidden={i !== wordIndex}
                className="absolute inset-x-0 italic text-shimmer"
                style={{
                  opacity: i === wordIndex ? 1 : 0,
                  transform: i === wordIndex ? "translateY(0)" : "translateY(28px)",
                  animationPlayState: i === wordIndex ? "running" : "paused",
                  transition:
                    "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {w}.
              </span>
            ))}
          </span>
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-md text-sm leading-relaxed text-foreground/60 md:text-base"
          style={{ animationDelay: "300ms" }}
        >
          {t.tagline}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            goToContact();
          }}
          className="animate-fade-up group mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-card/60 p-2 shadow-soft backdrop-blur-xl transition focus-within:border-primary/50 focus-within:shadow-glow sm:mt-10"
          style={{ animationDelay: "420ms" }}
        >
          <input
            type="text"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder={t.askPlaceholder}
            aria-label={t.askPlaceholder}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] placeholder:text-muted-foreground focus:outline-none sm:px-5 sm:py-2.5 sm:text-sm"
          />
          <button
            type="submit"
            aria-label="Contact"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-110 hover:shadow-glow active:scale-95 sm:h-10 sm:w-10"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <nav
          className="animate-fade-up mt-4 grid w-full max-w-xl grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-3 md:grid-cols-6 md:gap-3"
          style={{ animationDelay: "520ms" }}
        >
          {CARD_DEFS.map(({ key, page, icon: Icon, color }, i) => {
            const label = t.cards[key];
            const to = p[page];
            return (
              <Link
                key={label}
                to={to}
                onClick={() => void trackEvent("navigation_click", { metadata: { destination: to } })}
                className="group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-border bg-card/60 px-2 py-3.5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:from-primary/10 group-hover:to-pink-500/10 group-hover:opacity-100" />
                <Icon className={`h-5 w-5 ${color} transition group-hover:scale-125 group-hover:rotate-6`} />
                <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className="animate-fade-up mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-[11px] text-foreground/45"
          style={{ animationDelay: "600ms" }}
        >
          <Link to={p.services} className="transition hover:text-foreground/80">
            {lang === "pl" ? "Usługi" : "Services"}
          </Link>
          {SERVICE_KEYS.map((key) =>
            lang === "pl" ? (
              <Link
                key={key}
                to="/pl/uslugi/$slug"
                params={{ slug: SERVICE_SLUGS[key].pl }}
                className="transition hover:text-foreground/80"
              >
                · {SERVICES[key].pl.label}
              </Link>
            ) : (
              <Link
                key={key}
                to="/en/services/$slug"
                params={{ slug: SERVICE_SLUGS[key].en }}
                className="transition hover:text-foreground/80"
              >
                · {SERVICES[key].en.label}
              </Link>
            ),
          )}
          {lang === "pl" ? (
            <>
              <Link to="/pl/uslugi/cennik" className="transition hover:text-foreground/80">
                · Cennik
              </Link>
              <Link to={p.blog} className="transition hover:text-foreground/80">
                · Blog
              </Link>
              <Link
                to="/pl/strony-internetowe-warszawa"
                className="transition hover:text-foreground/80"
              >
                · Cała Polska
              </Link>
            </>
          ) : (
            <>
              <Link to="/en/services/pricing" className="transition hover:text-foreground/80">
                · Pricing
              </Link>
              <Link to={p.blog} className="transition hover:text-foreground/80">
                · Blog
              </Link>
            </>
          )}
        </div>


      </section>

      <div className="relative z-10 mt-4 mb-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div ref={marqueeRef} className="flex w-max animate-marquee gap-10 font-mono text-sm text-foreground/40">
          {[...MARQUEE, ...MARQUEE].map((s, i) => (
            <span key={i} className="flex items-center gap-10">
              {s}
              <span className="text-primary/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
