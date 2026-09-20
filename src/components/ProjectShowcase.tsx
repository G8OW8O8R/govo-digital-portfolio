import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ImagePlus, Loader2, Pencil, Trash2, X } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import CaseStudyPanel, { type CaseData } from "@/components/CaseStudyPanel";
import ProjectShowcase3D, { useSupports3DGallery } from "@/components/ProjectShowcase3D";
import Reveal from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { saveProjectContent, saveProjectGallery, uploadProjectImage } from "@/lib/project-content.server";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function getVideoEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** True only for a logged-in user with the `admin` role — reuses the same
 * auth/role system that already gates the /stats dashboard, so there's no
 * second login flow. Regular visitors never see a session here, so this
 * resolves to false for them almost instantly. */
function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) return;
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!cancelled) setIsAdmin(!!data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return isAdmin;
}

type EditForm = { name: string; subtitle: string; blurb: string; tags: string };
const editInputClass =
  "w-full rounded-lg border border-primary/40 bg-background/60 px-3 py-2 text-foreground outline-none focus:border-primary";

export type ShowcaseItem = {
  id: string;
  imageSrc: string;
  name: string;
  subtitle: string;
  blurb: string;
  tags: readonly string[];
  demoUrl: string;
  isConcept?: boolean;
  casePanel?: CaseData;
  gallery?: readonly string[];
  video?: string;
};

type Labels = {
  liveDemo: string;
  caseStudy: string;
  conceptProject: string;
  close: string;
  dragHint: string;
  viewProject: string;
};

/** Pointer-follow tilt + label are done via direct DOM mutation (refs), never React state,
 * so hovering a card doesn't trigger a re-render on every mousemove. */
function ShowcaseCard({
  item,
  onOpen,
  viewLabel,
}: {
  item: ShowcaseItem;
  onOpen: () => void;
  viewLabel: string;
}) {
  const [hover, setHover] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const fine = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches,
  );

  const placeLabel = () => {
    if (!labelRef.current) return;
    labelRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) translate(-50%, -150%)`;
  };

  useEffect(() => {
    if (hover) placeLabel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover]);

  const handleEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!fine.current) return;
    posRef.current = { x: e.clientX, y: e.clientY };
    setHover(true);
  };

  const handleLeave = () => {
    setHover(false);
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!fine.current) return;
    posRef.current = { x: e.clientX, y: e.clientY };
    placeLabel();
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1200px) rotateX(${py * -5}deg) rotateY(${px * 5}deg)`;
    }
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onOpen}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border bg-card text-left transition-[transform,border-color,box-shadow] duration-300 ease-out will-change-transform hover:border-primary/40 hover:shadow-glow"
    >
      <img
        src={item.imageSrc}
        alt={item.name}
        className="h-full w-full object-cover transition duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent opacity-95" />
      <div className="absolute inset-x-5 bottom-5">
        <h3 className="font-display text-2xl leading-tight tracking-tight text-foreground transition duration-300 group-hover:text-primary md:text-3xl">
          {item.name}
        </h3>
        <p className="mt-1.5 text-sm text-foreground/60">{item.subtitle}</p>
      </div>

      {hover && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={labelRef}
              className="pointer-events-none fixed left-0 top-0 z-[60] rounded-full border border-foreground/15 bg-background/70 px-3 py-1 font-mono text-[10px] font-medium tracking-[0.04em] text-foreground/75 backdrop-blur-md"
            >
              {viewLabel}
            </div>,
            document.body,
          )
        : null}
    </button>
  );
}

export default function ProjectShowcase({
  items,
  labels,
  lang,
}: {
  items: ShowcaseItem[];
  labels: Labels;
  lang: "pl" | "en";
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const use3D = useSupports3DGallery();
  const isAdmin = useIsAdmin();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({ name: "", subtitle: "", blurb: "", tags: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [localOverrides, setLocalOverrides] = useState<Record<string, Partial<ShowcaseItem>>>({});
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState<string | null>(null);
  const [videoInput, setVideoInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAt = (i: number) => {
    const item = items[i];
    void trackEvent("project_open", { projectSlug: item.id, metadata: { project_name: item.name }, once: true });
    setActiveIndex(i);
  };
  const close = () => setActiveIndex(null);
  const step = (dir: 1 | -1) => {
    setActiveIndex((cur) => (cur === null ? cur : (cur + dir + items.length) % items.length));
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setEditing(false);
    setSaveMsg(null);
    setGalleryMsg(null);
  }, [activeIndex]);

  const activeRaw = activeIndex !== null ? items[activeIndex] : null;
  const active = activeRaw ? { ...activeRaw, ...localOverrides[activeRaw.id] } : null;

  useEffect(() => {
    setVideoInput(active?.video ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const startEdit = () => {
    if (!active) return;
    setForm({ name: active.name, subtitle: active.subtitle, blurb: active.blurb, tags: active.tags.join(", ") });
    setSaveMsg(null);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = async () => {
    if (!active) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const patch = { name: form.name.trim(), subtitle: form.subtitle.trim(), blurb: form.blurb.trim(), tags };
      await saveProjectContent({ data: { slug: active.id, lang, ...patch } });
      setLocalOverrides((prev) => ({ ...prev, [active.id]: { ...prev[active.id], ...patch } }));
      setEditing(false);
      setSaveMsg("Zapisano — publicznie widoczne po zakończeniu wdrożenia (ok. 1–2 min).");
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Nie udało się zapisać.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddImage = async (file: File) => {
    if (!active) return;
    if (file.size > 4.5 * 1024 * 1024) {
      setGalleryMsg("Plik jest za duży (maks. ok. 4 MB).");
      return;
    }
    setGalleryBusy(true);
    setGalleryMsg(null);
    try {
      const contentBase64 = await fileToBase64(file);
      const { url } = await uploadProjectImage({ data: { slug: active.id, mime: file.type, contentBase64 } });
      const nextGallery = [...(active.gallery ?? []), url];
      await saveProjectGallery({ data: { slug: active.id, gallery: nextGallery, video: active.video ?? "" } });
      setLocalOverrides((prev) => ({ ...prev, [active.id]: { ...prev[active.id], gallery: nextGallery } }));
      setGalleryMsg("Dodano zdjęcie — widoczne po zakończeniu wdrożenia (ok. 1–2 min).");
    } catch (err) {
      setGalleryMsg(err instanceof Error ? err.message : "Nie udało się dodać zdjęcia.");
    } finally {
      setGalleryBusy(false);
    }
  };

  const handleRemoveImage = async (url: string) => {
    if (!active) return;
    setGalleryBusy(true);
    setGalleryMsg(null);
    try {
      const nextGallery = (active.gallery ?? []).filter((g) => g !== url);
      await saveProjectGallery({ data: { slug: active.id, gallery: nextGallery, video: active.video ?? "" } });
      setLocalOverrides((prev) => ({ ...prev, [active.id]: { ...prev[active.id], gallery: nextGallery } }));
      setGalleryMsg("Usunięto zdjęcie.");
    } catch (err) {
      setGalleryMsg(err instanceof Error ? err.message : "Nie udało się usunąć zdjęcia.");
    } finally {
      setGalleryBusy(false);
    }
  };

  const handleSaveVideo = async () => {
    if (!active) return;
    setGalleryBusy(true);
    setGalleryMsg(null);
    try {
      const video = videoInput.trim();
      await saveProjectGallery({ data: { slug: active.id, gallery: [...(active.gallery ?? [])], video } });
      setLocalOverrides((prev) => ({ ...prev, [active.id]: { ...prev[active.id], video } }));
      setGalleryMsg("Zapisano wideo.");
    } catch (err) {
      setGalleryMsg(err instanceof Error ? err.message : "Nie udało się zapisać wideo.");
    } finally {
      setGalleryBusy(false);
    }
  };

  return (
    <>
      {use3D ? (
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
          <ProjectShowcase3D items={items} onOpenIndex={openAt} dragHint={labels.dragHint} />
        </div>
      ) : (
        <>
          <Carousel opts={{ dragFree: true, containScroll: "keepSnaps" }} className="px-1">
            <CarouselContent className="-ml-6">
              {items.map((item, i) => (
                <CarouselItem key={item.id} className="basis-[78%] pl-6 sm:basis-[52%] lg:basis-[34%]">
                  <ShowcaseCard item={item} onOpen={() => openAt(i)} viewLabel={labels.viewProject} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-6 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/35">
            <ArrowLeft className="h-3 w-3" />
            {labels.dragHint}
            <ArrowRight className="h-3 w-3" />
          </div>
        </>
      )}

      {active ? (
        <div
          className="fixed inset-0 z-50 flex bg-black/55 p-2.5 backdrop-blur-sm animate-in fade-in duration-300 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
        >
          <button
            type="button"
            onClick={close}
            className="fixed right-4 top-4 z-[70] inline-flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground/80 shadow-lg transition hover:text-primary md:right-7 md:top-7"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{labels.close}</span>
          </button>

          <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl">
            <div ref={scrollRef} className="h-full max-h-[calc(100dvh-1.25rem)] overflow-y-auto md:max-h-[calc(100dvh-3rem)]">
              <div className="grid grid-cols-1 gap-10 p-6 md:grid-cols-[300px_1fr] md:gap-14 md:p-12">
                {/* Left: identity column */}
                <div className="md:sticky md:top-12 md:self-start">
                  {editing ? (
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={cn(editInputClass, "font-display text-3xl leading-[1.05] tracking-tight md:text-4xl")}
                    />
                  ) : (
                    <Reveal distance={16}>
                      <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
                        {active.name}
                      </h2>
                    </Reveal>
                  )}

                  {editing ? (
                    <input
                      value={form.subtitle}
                      onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                      className={cn(editInputClass, "mt-4 text-sm")}
                    />
                  ) : (
                    <Reveal delay={90} distance={16}>
                      <p className="mt-4 text-sm leading-relaxed text-foreground/60">{active.subtitle}</p>
                    </Reveal>
                  )}

                  <Reveal delay={150} distance={16}>
                    <a
                      href={active.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        void trackEvent("demo_click", {
                          projectSlug: active.id,
                          metadata: { project_name: active.name, demo_url: active.demoUrl },
                        })
                      }
                      className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:shadow-glow"
                    >
                      {labels.liveDemo}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Reveal>

                  <Reveal delay={210} distance={16}>
                    <div className="mt-6 flex flex-wrap items-center gap-1.5">
                      {editing ? (
                        <input
                          value={form.tags}
                          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                          placeholder="tag1, tag2, tag3"
                          className={cn(editInputClass, "min-w-[180px] flex-1 font-mono text-[10px] uppercase")}
                        />
                      ) : (
                        <>
                          {active.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border/70 bg-foreground/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/50"
                            >
                              {tag}
                            </span>
                          ))}
                          {active.isConcept ? (
                            <span className="rounded-full border border-primary/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary/80">
                              {labels.conceptProject}
                            </span>
                          ) : null}
                        </>
                      )}
                    </div>
                  </Reveal>

                  {isAdmin ? (
                    <div className="mt-8 border-t border-border/50 pt-6">
                      {editing ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void saveEdit()}
                            disabled={saving}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition hover:shadow-glow disabled:opacity-60"
                          >
                            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                            Zapisz
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="rounded-full border border-border/70 px-3.5 py-1.5 text-xs text-foreground/60 transition hover:text-foreground"
                          >
                            Anuluj
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startEdit}
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/40 transition hover:text-primary"
                        >
                          <Pencil className="h-3 w-3" />
                          Edytuj treść
                        </button>
                      )}
                      {saveMsg ? <p className="mt-2 text-[11px] leading-relaxed text-foreground/50">{saveMsg}</p> : null}
                    </div>
                  ) : null}
                </div>

                {/* Right: media & content */}
                <div>
                  <Reveal distance={28}>
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={active.imageSrc}
                        alt={active.name}
                        className="w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </Reveal>

                  <Reveal delay={100} distance={28}>
                    <div
                      className="relative z-10 mx-3 -mt-8 overflow-hidden rounded-2xl border border-white/25 bg-white/10 px-5 py-8 text-center backdrop-blur-2xl backdrop-saturate-150 sm:px-8 sm:py-10 md:mx-8 md:-mt-16 md:rounded-[2rem] md:px-14 md:py-16"
                      style={{
                        boxShadow:
                          "inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 1px rgba(0,0,0,0.2), inset 0 0 40px rgba(255,255,255,0.05), 0 24px 60px -16px rgba(0,0,0,0.65)",
                      }}
                    >
                      {/* Specular highlight sweep — the "liquid" part of liquid glass: a soft
                          diagonal sheen sitting above the genuinely see-through blurred pane. */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.1) 100%)",
                        }}
                      />
                      {editing ? (
                        <textarea
                          value={form.blurb}
                          onChange={(e) => setForm((f) => ({ ...f, blurb: e.target.value }))}
                          rows={5}
                          className="relative w-full resize-none rounded-xl border border-white/25 bg-white/10 p-4 text-center font-display text-xl font-semibold uppercase leading-snug tracking-tight text-white outline-none backdrop-blur-md focus:border-white/50"
                        />
                      ) : (
                        <p className="relative whitespace-pre-line font-display text-lg font-semibold uppercase leading-[1.2] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-2xl md:text-3xl lg:text-[2.75rem]">
                          {active.blurb}
                        </p>
                      )}
                    </div>
                  </Reveal>

                  {active.gallery?.length || active.video || isAdmin ? (
                    <Reveal delay={90} distance={24}>
                      <div className="mt-10">
                        {active.gallery?.length ? (
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {active.gallery.map((src) => (
                              <div key={src} className="group relative overflow-hidden rounded-xl border border-border/50">
                                <a href={src} target="_blank" rel="noreferrer">
                                  <img
                                    src={src}
                                    alt=""
                                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                                    loading="lazy"
                                  />
                                </a>
                                {isAdmin ? (
                                  <button
                                    type="button"
                                    onClick={() => void handleRemoveImage(src)}
                                    disabled={galleryBusy}
                                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80 disabled:opacity-40"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {active.video ? (
                          <div className={cn("overflow-hidden rounded-2xl", active.gallery?.length ? "mt-4" : "")}>
                            {getVideoEmbedUrl(active.video) ? (
                              <div className="aspect-video w-full">
                                <iframe
                                  src={getVideoEmbedUrl(active.video)!}
                                  title={active.name}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="h-full w-full"
                                />
                              </div>
                            ) : (
                              <video src={active.video} controls className="w-full" />
                            )}
                          </div>
                        ) : null}

                        {isAdmin ? (
                          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void handleAddImage(file);
                                e.target.value = "";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={galleryBusy}
                              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/60 transition hover:text-primary disabled:opacity-50"
                            >
                              {galleryBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImagePlus className="h-3 w-3" />}
                              Dodaj zdjęcie
                            </button>
                            <div className="flex min-w-[220px] flex-1 items-center gap-2">
                              <input
                                value={videoInput}
                                onChange={(e) => setVideoInput(e.target.value)}
                                placeholder="Link do wideo (YouTube, Vimeo, .mp4)"
                                className={cn(editInputClass, "flex-1 text-xs")}
                              />
                              <button
                                type="button"
                                onClick={() => void handleSaveVideo()}
                                disabled={galleryBusy}
                                className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:shadow-glow disabled:opacity-60"
                              >
                                Zapisz
                              </button>
                            </div>
                          </div>
                        ) : null}
                        {galleryMsg ? <p className="mt-2 text-[11px] leading-relaxed text-foreground/50">{galleryMsg}</p> : null}
                      </div>
                    </Reveal>
                  ) : null}

                  {active.casePanel ? (
                    <Reveal delay={80} distance={24}>
                      <div className="mt-10">
                        <CaseStudyPanel data={active.casePanel} />
                      </div>
                    </Reveal>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
