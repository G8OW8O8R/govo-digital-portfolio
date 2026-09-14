import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FilterX,
  FolderOpen,
  Home,
  Info,
  LogOut,
  Mail,
  MonitorSmartphone,
  MousePointerClick,
  RefreshCw,
  Send,
  Settings,
  Signpost,
  Target,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { isOwnerExcluded, setOwnerExcluded } from "@/lib/analytics";
import { BarList, Donut, FunnelChart, LineChart } from "@/components/stats/charts";
import { UtmBuilder } from "@/components/stats/UtmBuilder";
import {
  applyFilters,
  buildSeries,
  campaignStats,
  downloadCsv,
  fmtDuration,
  fmtPct,
  funnel,
  kpis,
  projectStats,
  recentSessions,
  scrollDepth,
  sourceQuality,
  tally,
  topPages,
  viewportBuckets,
  CONTACT_EVENTS,
  type Dataset,
  type EventRow,
  type Filters,
  type PageviewRow,
  type ProjectStat,
  type SessionRow,
} from "@/lib/stats-aggregate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/stats")({
  head: () => ({
    meta: [
      { title: "Statystyki — GOVO DIGITAL" },
      { name: "description", content: "Prywatny panel analityczny GOVO DIGITAL." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Statystyki — GOVO DIGITAL" },
      { property: "og:description", content: "Prywatny panel analityczny." },
    ],
  }),
  component: StatsPage,
});

/* ------------------------------------------------------------------ */

const RANGES = [
  { key: "today", label: "Dzisiaj" },
  { key: "7", label: "7 dni" },
  { key: "30", label: "30 dni" },
  { key: "90", label: "90 dni" },
  { key: "custom", label: "Własny zakres" },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

const NAV = [
  { key: "overview", label: "Przegląd", icon: Home },
  { key: "projects", label: "Projekty", icon: FolderOpen },
  { key: "traffic", label: "Ruch", icon: Activity },
  { key: "conversions", label: "Konwersje", icon: Target },
  { key: "sources", label: "Źródła", icon: Signpost },
  { key: "contact", label: "Kontakt", icon: Mail },
  { key: "campaigns", label: "Kampanie", icon: Send },
  { key: "tech", label: "Technologia", icon: MonitorSmartphone },
  { key: "settings", label: "Ustawienia", icon: Settings },
] as const;

type NavKey = (typeof NAV)[number]["key"];

function resolveRange(key: RangeKey, custom: { from: string; to: string }) {
  const to = new Date();
  const from = new Date();
  if (key === "today") from.setHours(0, 0, 0, 0);
  else if (key === "custom") {
    const f = custom.from ? new Date(`${custom.from}T00:00:00`) : new Date(Date.now() - 6 * 86400000);
    const t = custom.to ? new Date(`${custom.to}T23:59:59`) : new Date();
    return { from: f, to: t };
  } else from.setTime(Date.now() - (Number(key) - 1) * 86400000), from.setHours(0, 0, 0, 0);
  return { from, to };
}

function granularityFor(key: RangeKey, from: Date, to: Date): "hour" | "day" | "week" {
  if (key === "today") return "hour";
  const days = (to.getTime() - from.getTime()) / 86400000;
  if (days <= 1) return "hour";
  if (days > 70) return "week";
  return "day";
}

/* ------------------------------------------------------------------ */

function StatsPage() {
  const navigate = useNavigate();
  const [section, setSection] = useState<NavKey>("overview");
  const [navOpen, setNavOpen] = useState(true);
  const [rangeKey, setRangeKey] = useState<RangeKey>("30");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [filters, setFilters] = useState<Filters>({ source: null, device: null, project: null, campaign: null });
  const [metric, setMetric] = useState<"views" | "sessions" | "conversions">("views");
  const [projectSort, setProjectSort] = useState<"views" | "demo" | "contact" | "ctr">("views");
  const [raw, setRaw] = useState<Dataset | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownerOff, setOwnerOff] = useState(false);
  const [openSession, setOpenSession] = useState<string | null>(null);

  useEffect(() => setOwnerOff(isOwnerExcluded()), []);

  const { from, to } = useMemo(() => resolveRange(rangeKey, custom), [rangeKey, custom]);
  const span = to.getTime() - from.getTime();
  const prevFrom = new Date(from.getTime() - span);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const sinceIso = prevFrom.toISOString();
    const untilIso = to.toISOString();
    const [s, p, e] = await Promise.all([
      supabase
        .from("analytics_sessions")
        .select(
          "session_id, visitor_id, started_at, ended_at, landing_page, exit_page, referrer, source, medium, campaign, device_type, viewport_width, browser_family, operating_system, is_returning, pageviews_count, events_count, active_seconds, max_scroll",
        )
        .gte("started_at", sinceIso)
        .lte("started_at", untilIso)
        .order("started_at", { ascending: false })
        .limit(20000),
      supabase
        .from("analytics_pageviews")
        .select("session_id, visitor_id, path, page_title, viewed_at")
        .gte("viewed_at", sinceIso)
        .lte("viewed_at", untilIso)
        .limit(50000),
      supabase
        .from("analytics_events")
        .select("session_id, visitor_id, event_name, path, project_slug, metadata, created_at")
        .gte("created_at", sinceIso)
        .lte("created_at", untilIso)
        .limit(50000),
    ]);
    if (s.error || p.error || e.error) {
      setError(true);
      setRaw({ sessions: [], pageviews: [], events: [] });
    } else {
      setRaw({
        sessions: (s.data ?? []) as SessionRow[],
        pageviews: (p.data ?? []) as PageviewRow[],
        events: (e.data ?? []) as EventRow[],
      });
    }
    setLoading(false);
  }, [prevFrom.getTime(), to.getTime()]);

  useEffect(() => {
    void load();
  }, [load]);

  // Lightweight refresh keeps "aktywni teraz" current.
  useEffect(() => {
    const id = setInterval(() => void load(), 60000);
    return () => clearInterval(id);
  }, [load]);

  const slice = useCallback(
    (start: Date, end: Date): Dataset => {
      if (!raw) return { sessions: [], pageviews: [], events: [] };
      const inRange = (iso: string) => {
        const t = new Date(iso).getTime();
        return t >= start.getTime() && t <= end.getTime();
      };
      const sessions = raw.sessions.filter((x) => inRange(x.started_at));
      const ids = new Set(sessions.map((x) => x.session_id));
      return {
        sessions,
        pageviews: raw.pageviews.filter((x) => inRange(x.viewed_at) && ids.has(x.session_id)),
        events: raw.events.filter((x) => inRange(x.created_at) && ids.has(x.session_id)),
      };
    },
    [raw],
  );

  const current = useMemo(() => applyFilters(slice(from, to), filters), [slice, from, to, filters]);
  const previous = useMemo(
    () => applyFilters(slice(prevFrom, from), filters),
    [slice, prevFrom, from, filters],
  );

  const k = useMemo(() => kpis(current), [current]);
  const kPrev = useMemo(() => kpis(previous), [previous]);
  const series = useMemo(
    () => buildSeries(current, from, to, granularityFor(rangeKey, from, to)),
    [current, from, to, rangeKey],
  );
  const steps = useMemo(() => funnel(current), [current]);
  const projects = useMemo(() => {
    const list = projectStats(current);
    const sorted = [...list];
    sorted.sort((a, b) => b[projectSort] - a[projectSort]);
    return sorted;
  }, [current, projectSort]);
  const pages = useMemo(() => topPages(current), [current]);
  const sources = useMemo(() => sourceQuality(current), [current]);
  const landing = useMemo(() => tally(current.sessions.map((s) => s.landing_page)), [current]);
  const exits = useMemo(() => tally(current.sessions.map((s) => s.exit_page)), [current]);
  const devices = useMemo(() => tally(current.sessions.map((s) => s.device_type)), [current]);
  const browsers = useMemo(() => tally(current.sessions.map((s) => s.browser_family)), [current]);
  const systems = useMemo(() => tally(current.sessions.map((s) => s.operating_system)), [current]);
  const viewports = useMemo(() => viewportBuckets(current), [current]);
  const campaigns = useMemo(() => campaignStats(current), [current]);
  const recent = useMemo(() => recentSessions(current), [current]);
  const scroll = useMemo(() => scrollDepth(current, "/"), [current]);
  const activeNow = useMemo(
    () =>
      current.sessions.filter((s) => Date.now() - new Date(s.ended_at).getTime() < 5 * 60 * 1000).length,
    [current],
  );

  const contactBreakdown = useMemo(() => {
    const c = (name: string) => current.events.filter((e) => e.event_name === name).length;
    return [
      { label: "Strona kontaktowa", count: c("contact_open") },
      { label: "E-mail", count: c("contact_email_click") },
      { label: "Telefon", count: c("contact_phone_click") },
      { label: "Formularz (start)", count: c("contact_form_start") },
      { label: "Formularz (wysłany)", count: c("contact_form_submit") },
    ];
  }, [current]);

  const conversionRate = k.sessions ? (k.formSubmits / k.sessions) * 100 : 0;
  const conversionRatePrev = kPrev.sessions ? (kPrev.formSubmits / kPrev.sessions) * 100 : 0;

  const allSources = useMemo(
    () => [...new Set((raw?.sessions ?? []).map((s) => s.source))].sort(),
    [raw],
  );
  const allCampaigns = useMemo(
    () => [...new Set((raw?.sessions ?? []).map((s) => s.campaign).filter(Boolean))] as string[],
    [raw],
  );
  const allProjects = useMemo(
    () => [...new Set((raw?.events ?? []).map((e) => e.project_slug).filter(Boolean))] as string[],
    [raw],
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const exportCsv = (kind: "sessions" | "pageviews" | "events" | "projects") => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (kind === "sessions") downloadCsv(`govo-sesje-${stamp}.csv`, current.sessions);
    if (kind === "pageviews") downloadCsv(`govo-odslony-${stamp}.csv`, current.pageviews);
    if (kind === "events")
      downloadCsv(
        `govo-zdarzenia-${stamp}.csv`,
        current.events.map((e) => ({ ...e, metadata: JSON.stringify(e.metadata) })),
      );
    if (kind === "projects") downloadCsv(`govo-projekty-${stamp}.csv`, projects);
  };

  const hasData = current.sessions.length > 0;
  const rangeNote = rangeKey === "today" ? "vs. wczoraj" : "vs. poprzedni okres";

  /* ----------------------------- sections ----------------------------- */

  const trafficChart = (
    <Panel>
      <PanelHead title="Ruch w czasie">
        <Segmented
          value={metric}
          onChange={setMetric}
          options={[
            ["views", "Odsłony"],
            ["sessions", "Sesje"],
            ["conversions", "Konwersje"],
          ]}
        />
      </PanelHead>
      {series.some((p) => p.views || p.sessions || p.conversions) ? (
        <>
          <LineChart series={series} keys={["views", "sessions", "conversions"]} />
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-4 sm:grid-cols-4">
            <MiniStat label="Łącznie odsłon" value={String(k.views)} delta={delta(k.views, kPrev.views)} />
            <MiniStat label="Łącznie sesji" value={String(k.sessions)} delta={delta(k.sessions, kPrev.sessions)} />
            <MiniStat
              label="Śr. czas aktywności"
              value={fmtDuration(k.avgActive)}
              delta={delta(k.avgActive, kPrev.avgActive)}
            />
            <MiniStat
              label="Współczynnik konwersji"
              value={fmtPct(conversionRate, 2)}
              delta={delta(conversionRate, conversionRatePrev)}
            />
          </div>
        </>
      ) : (
        <Empty />
      )}
    </Panel>
  );

  const funnelPanel = (
    <Panel>
      <PanelHead title="Ścieżka do kontaktu" />
      {hasData ? (
        <>
          <FunnelChart steps={steps} />
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
            <MiniStat label="Współczynnik konwersji" value={fmtPct(conversionRate, 2)} delta={delta(conversionRate, conversionRatePrev)} />
            <MiniStat label="Śr. głębokość scrolla" value={`${k.avgScroll}%`} delta={delta(k.avgScroll, kPrev.avgScroll)} />
          </div>
        </>
      ) : (
        <Empty />
      )}
    </Panel>
  );

  const projectsPanel = (
    <Panel>
      <PanelHead title="Popularność projektów">
        <Segmented
          value={projectSort}
          onChange={setProjectSort}
          options={[
            ["views", "Odsłony"],
            ["demo", "Demo"],
            ["contact", "Kontakt"],
            ["ctr", "CTR"],
          ]}
        />
      </PanelHead>
      {projects.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-xs">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-foreground/35">
                <th className="pb-2 font-normal">Projekt</th>
                <th className="pb-2 font-normal">Udział</th>
                <th className="pb-2 text-right font-normal">Odsłony</th>
                <th className="pb-2 text-right font-normal">Sesje</th>
                <th className="pb-2 text-right font-normal">Demo</th>
                <th className="pb-2 text-right font-normal">Kontakt</th>
                <th className="pb-2 text-right font-normal">CTR</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p: ProjectStat) => {
                const max = Math.max(1, ...projects.map((x) => x.views));
                return (
                  <tr key={p.slug} className="border-t border-border/60">
                    <td className="py-2.5 pr-4 text-foreground/85">{p.name}</td>
                    <td className="py-2.5 pr-4">
                      <span className="block h-1.5 w-24 overflow-hidden rounded-full bg-border/50">
                        <span
                          className="block h-full rounded-full"
                          style={{
                            width: `${(p.views / max) * 100}%`,
                            background: "linear-gradient(90deg, oklch(0.66 0.16 275), oklch(0.74 0.17 320))",
                          }}
                        />
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono">{p.views}</td>
                    <td className="py-2.5 text-right font-mono text-foreground/55">{p.sessions}</td>
                    <td className="py-2.5 text-right font-mono">{p.demo}</td>
                    <td className="py-2.5 text-right font-mono text-foreground/55">{p.contact}</td>
                    <td className="py-2.5 text-right font-mono text-primary/85">{fmtPct(p.ctr, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty />
      )}
    </Panel>
  );

  const pagesPanel = (
    <Panel>
      <PanelHead title="Najczęściej odwiedzane podstrony" />
      <BarList
        items={pages.slice(0, 8).map((p) => ({ label: p.label, count: p.count }))}
        showShare
        total={k.views}
      />
    </Panel>
  );

  const sourcesPanel = (
    <Panel>
      <PanelHead title="Źródła ruchu" />
      <BarList items={sources.slice(0, 8).map((s) => ({ label: s.source, count: s.sessions }))} showShare total={k.sessions} />
    </Panel>
  );

  const campaignsPanel = (
    <Panel>
      <PanelHead title="Kampanie" />
      <p className="mt-1.5 max-w-lg text-[11px] leading-relaxed text-foreground/40">
        Śledź skuteczność kampanii dzięki parametrom UTM. Dodaj np. ?utm_source=linkedin&utm_medium=cpc&utm_campaign=portfolio
      </p>
      {campaigns.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-xs">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-foreground/35">
                <th className="pb-2 font-normal">Kampania</th>
                <th className="pb-2 font-normal">Źródło</th>
                <th className="pb-2 text-right font-normal">Sesje</th>
                <th className="pb-2 text-right font-normal">Konwersje</th>
                <th className="pb-2 text-right font-normal">Współcz. konwersji</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={`${c.source}-${c.campaign}`} className="border-t border-border/60">
                  <td className="py-2.5 pr-4 text-foreground/85">{c.campaign}</td>
                  <td className="py-2.5 pr-4 text-foreground/55">{c.source}</td>
                  <td className="py-2.5 text-right font-mono">{c.sessions}</td>
                  <td className="py-2.5 text-right font-mono text-foreground/55">{c.contact}</td>
                  <td className="py-2.5 text-right font-mono text-primary/85">{fmtPct(c.rate, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty text="Brak ruchu oznaczonego UTM." />
      )}
      <UtmBuilder />
    </Panel>
  );

  const recentPanel = (
    <Panel>
      <PanelHead title="Ostatnie sesje" />
      {recent.length ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-xs">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-foreground/35">
                <th className="pb-2 font-normal">Czas</th>
                <th className="pb-2 font-normal">Źródło</th>
                <th className="pb-2 font-normal">Urządzenie</th>
                <th className="pb-2 font-normal">Ścieżka</th>
                <th className="pb-2 text-right font-normal">Strony</th>
                <th className="pb-2 text-right font-normal">Czas</th>
                <th className="pb-2 text-right font-normal">Konwersja</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(({ session, timeline, duration }) => {
                const open = openSession === session.session_id;
                const converted = timeline.some((t) =>
                  CONTACT_EVENTS.some((e) => t.label.startsWith(e)),
                );
                return (
                  <Fragment key={session.session_id}>
                    <tr
                      onClick={() => setOpenSession(open ? null : session.session_id)}
                      className="cursor-pointer border-t border-border/60 transition hover:bg-foreground/[0.03]"
                    >
                      <td className="py-2.5 pr-4 font-mono text-foreground/60">
                        {new Date(session.started_at).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2.5 pr-4 text-foreground/80">
                        {session.source}
                        {session.medium ? ` / ${session.medium}` : ""}
                      </td>
                      <td className="py-2.5 pr-4 capitalize text-foreground/55">{session.device_type}</td>
                      <td className="max-w-[220px] truncate py-2.5 pr-4 text-foreground/45">
                        {timeline
                          .slice(0, 4)
                          .map((i) => i.label)
                          .join(" → ")}
                      </td>
                      <td className="py-2.5 text-right font-mono text-foreground/70">{session.pageviews_count}</td>
                      <td className="py-2.5 text-right font-mono text-foreground/55">{fmtDuration(duration)}</td>
                      <td className="py-2.5 text-right">
                        <span className={cn("font-mono", converted ? "text-primary" : "text-foreground/25")}>
                          {converted ? "✓" : "—"}
                        </span>
                      </td>
                    </tr>
                    {open && (
                      <tr className="border-t border-border/40">
                        <td colSpan={7} className="p-0">
                          <div className="m-2 rounded-xl border border-border/70 bg-background/40 p-4">
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-foreground/55">
                              <span>Źródło: {session.source}</span>
                              {session.campaign && <span>Kampania: {session.campaign}</span>}
                              <span>
                                {session.browser_family} · {session.operating_system} · {session.viewport_width}px
                              </span>
                              <span>{session.is_returning ? "Powracający" : "Nowy"}</span>
                              <span>Scroll: {session.max_scroll}%</span>
                            </div>
                            <ol className="mt-3 space-y-1.5">
                              {timeline.map((item, i) => (
                                <li key={`${item.at}-${i}`} className="flex items-center gap-3 text-[11px]">
                                  <span className="font-mono text-foreground/35">
                                    {new Date(item.at).toLocaleTimeString("pl-PL", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    })}
                                  </span>
                                  <span
                                    className={cn(
                                      "h-1.5 w-1.5 rounded-sm",
                                      item.kind === "event" ? "bg-primary/70" : "bg-foreground/25",
                                    )}
                                  />
                                  <span className={item.kind === "event" ? "text-primary/80" : "text-foreground/70"}>
                                    {item.label}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty />
      )}
    </Panel>
  );

  const devicesPanel = (
    <Panel>
      <PanelHead title="Urządzenia" />
      <Donut items={devices.slice(0, 4)} />
    </Panel>
  );

  const returningPanel = (
    <Panel>
      <PanelHead title="Nowi / powracający" />
      <Donut
        items={[
          { label: "Nowi użytkownicy", count: k.fresh },
          { label: "Powracający", count: k.returning },
        ]}
      />
    </Panel>
  );

  const contactPanel = (
    <Panel>
      <PanelHead title="Kontakt — wydarzenia" />
      <ul className="mt-4 space-y-2.5">
        {contactBreakdown.map((row) => (
          <li key={row.label} className="flex items-center gap-3 text-xs">
            <Mail className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="flex-1 truncate text-foreground/70">{row.label}</span>
            <span className="font-mono text-foreground/85">{row.count}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );

  const techPanel = (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel>
        <PanelHead title="Przeglądarki" />
        <BarList items={browsers.slice(0, 6)} showShare total={k.sessions} />
      </Panel>
      <Panel>
        <PanelHead title="System operacyjny" />
        <BarList items={systems.slice(0, 6)} showShare total={k.sessions} />
      </Panel>
      <Panel>
        <PanelHead title="Szerokość okna" />
        <BarList items={viewports.slice(0, 6)} showShare total={k.sessions} />
      </Panel>
      {devicesPanel}
    </div>
  );

  const kpiRow = (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">
      <Kpi label="Unikalne sesje" value={k.sessions} prev={kPrev.sessions} note={rangeNote} icon={Users} />
      <Kpi label="Odsłony" value={k.views} prev={kPrev.views} note={rangeNote} icon={Eye} />
      <Kpi label="Otwarcia projektów" value={k.projectOpens} prev={kPrev.projectOpens} note={rangeNote} icon={FolderOpen} />
      <Kpi label="Kliknięcia demo" value={k.demoClicks} prev={kPrev.demoClicks} note={rangeNote} icon={MousePointerClick} />
      <Kpi label="Przejścia do kontaktu" value={k.contactOpens} prev={kPrev.contactOpens} note={rangeNote} icon={Send} />
      <Kpi label="Wysłane formularze" value={k.formSubmits} prev={kPrev.formSubmits} note={rangeNote} icon={Target} />
    </section>
  );

  const content = () => {
    switch (section) {
      case "projects":
        return (
          <>
            {projectsPanel}
            <div className="grid gap-4 lg:grid-cols-2">
              {pagesPanel}
              <Panel>
                <PanelHead title="Jak daleko przewijają stronę główną" />
                {scroll.total ? (
                  <BarList
                    items={scroll.milestones.map((m) => ({ label: `${m.milestone}%`, count: m.count }))}
                    showShare
                    total={scroll.total}
                  />
                ) : (
                  <Empty />
                )}
              </Panel>
            </div>
          </>
        );
      case "traffic":
        return (
          <>
            {trafficChart}
            <div className="grid gap-4 lg:grid-cols-2">
              {pagesPanel}
              <Panel>
                <PanelHead title="Pierwsza strona wizyty" />
                <BarList items={landing.slice(0, 8)} showShare total={k.sessions} />
              </Panel>
              <Panel>
                <PanelHead title="Ostatnia strona wizyty" />
                <BarList items={exits.slice(0, 8)} showShare total={k.sessions} />
              </Panel>
              {returningPanel}
            </div>
          </>
        );
      case "conversions":
        return (
          <>
            {funnelPanel}
            <div className="grid gap-4 lg:grid-cols-2">
              {contactPanel}
              {campaignsPanel}
            </div>
          </>
        );
      case "sources":
        return (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              {sourcesPanel}
              <Panel>
                <PanelHead title="Jakość źródeł" />
                {sources.length ? (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[420px] border-collapse text-xs">
                      <thead>
                        <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-foreground/35">
                          <th className="pb-2 font-normal">Źródło</th>
                          <th className="pb-2 text-right font-normal">Sesje</th>
                          <th className="pb-2 text-right font-normal">Projekty</th>
                          <th className="pb-2 text-right font-normal">Demo</th>
                          <th className="pb-2 text-right font-normal">Kontakt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sources.map((s) => (
                          <tr key={s.source} className="border-t border-border/60">
                            <td className="py-2.5 pr-4 text-foreground/85">{s.source}</td>
                            <td className="py-2.5 text-right font-mono">{s.sessions}</td>
                            <td className="py-2.5 text-right font-mono text-foreground/55">{s.projectOpens}</td>
                            <td className="py-2.5 text-right font-mono text-foreground/55">{s.demo}</td>
                            <td className="py-2.5 text-right font-mono text-primary/85">{s.contact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <Empty />
                )}
              </Panel>
            </div>
            {recentPanel}
          </>
        );
      case "contact":
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            {contactPanel}
            {funnelPanel}
          </div>
        );
      case "campaigns":
        return campaignsPanel;
      case "tech":
        return techPanel;
      case "settings":
        return (
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel>
              <PanelHead title="Śledzenie tego urządzenia" />
              <p className="mt-2 text-xs leading-relaxed text-foreground/55">
                Wyklucz swoje wizyty, aby nie zaburzały statystyk.
              </p>
              <button
                onClick={() => {
                  const next = !ownerOff;
                  setOwnerExcluded(next);
                  setOwnerOff(next);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs text-foreground/75 transition hover:border-primary/50 hover:text-foreground"
              >
                {ownerOff ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {ownerOff ? "Włącz ponownie śledzenie" : "Wyklucz moje urządzenie"}
              </button>
            </Panel>
            <Panel>
              <PanelHead title="Eksport danych" />
              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  [
                    ["sessions", "Sesje"],
                    ["pageviews", "Odsłony"],
                    ["events", "Zdarzenia"],
                    ["projects", "Projekty"],
                  ] as const
                ).map(([kind, label]) => (
                  <button
                    key={kind}
                    onClick={() => exportCsv(kind)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[11px] text-foreground/60 transition hover:border-primary/40 hover:text-foreground"
                  >
                    <Download className="h-3 w-3" />
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-5 flex items-start gap-1.5 text-[11px] leading-relaxed text-foreground/35">
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                Dane anonimowe — bez adresów IP i danych osobowych. Konwersje liczone na podstawie zdarzeń:{" "}
                {CONTACT_EVENTS.join(", ")}.
              </p>
            </Panel>
          </div>
        );
      default:
        return (
          <>
            {kpiRow}
            <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
              {trafficChart}
              {funnelPanel}
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {projectsPanel}
              {pagesPanel}
              {sourcesPanel}
            </div>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              <Panel>
                <PanelHead title="Pierwsza strona wizyty" />
                <BarList items={landing.slice(0, 5)} showShare total={k.sessions} />
              </Panel>
              <Panel>
                <PanelHead title="Ostatnia strona wizyty" />
                <BarList items={exits.slice(0, 5)} showShare total={k.sessions} />
              </Panel>
              {devicesPanel}
              {returningPanel}
            </div>
            <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
              {campaignsPanel}
              {recentPanel}
            </div>
          </>
        );
    }
  };

  /* ------------------------------- render ------------------------------ */

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/70 bg-card/30 transition-[width] duration-300 md:flex",
          navOpen ? "w-[188px]" : "w-[68px]",
        )}
      >
        <div className="flex h-[70px] items-center gap-2 px-4">
          <img src="/favicon.png" alt="GOVO" className="h-8 w-8 rounded-lg" />
          {navOpen && (
            <span className="font-display text-sm tracking-tight">GOVO</span>
          )}
        </div>

        <nav className="mt-2 flex flex-1 flex-col gap-1 px-2">
          {NAV.map((item) => {
            const active = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                title={item.label}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-foreground/50 hover:bg-foreground/[0.04] hover:text-foreground/85",
                  !navOpen && "justify-center px-0",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-primary" />
                )}
                <item.icon className="h-4 w-4 shrink-0" />
                {navOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-3">
          {navOpen && (
            <div className="mb-2 rounded-xl border border-border/70 bg-background/40 px-3 py-2.5">
              <p className="text-[11px] text-foreground/70">GOVO Digital</p>
              <p className="text-[10px] text-foreground/35">Agencja interaktywna</p>
            </div>
          )}
          <button
            onClick={() => setNavOpen((v) => !v)}
            className="flex w-full items-center justify-center rounded-lg py-2 text-foreground/35 transition hover:text-foreground/70"
            aria-label={navOpen ? "Zwiń menu" : "Rozwiń menu"}
          >
            {navOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/40">
              Private dashboard
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-[2.6rem]">
              Statystyki odwiedzin
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-foreground/50">
              <span>
                {from.toLocaleDateString("pl-PL")} — {to.toLocaleDateString("pl-PL")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-primary/85">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Aktywnych teraz: {activeNow}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <GhostButton onClick={() => void load()}>
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Odśwież
            </GhostButton>
            <GhostButton
              onClick={() => {
                const next = !ownerOff;
                setOwnerExcluded(next);
                setOwnerOff(next);
              }}
            >
              {ownerOff ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              {ownerOff ? "Włącz śledzenie tego urządzenia" : "Śledzenie tego urządzenia"}
            </GhostButton>
            <GhostButton onClick={() => void signOut()}>
              <LogOut className="h-3.5 w-3.5" />
              Wyloguj
            </GhostButton>
          </div>
        </header>

        {/* mobile nav */}
        <div className="mt-5 -mx-4 flex gap-1.5 overflow-x-auto px-4 md:hidden">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-[11px] transition",
                section === item.key
                  ? "border-primary/40 bg-primary/12 text-primary"
                  : "border-border/70 text-foreground/55",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-6 text-sm text-foreground/70">
            Brak dostępu do statystyk dla tego konta. Konto musi mieć rolę administratora.
          </div>
        )}

        {!error && (
          <>
            {/* Filters */}
            <section className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-border/70 bg-card/30 p-2.5">
              <div className="flex items-center gap-1">
                {RANGES.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setRangeKey(r.key)}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs transition",
                      rangeKey === r.key
                        ? "bg-primary/15 text-primary"
                        : "text-foreground/50 hover:text-foreground",
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {rangeKey === "custom" && (
                <div className="flex items-center gap-2">
                  <DateInput value={custom.from} onChange={(v) => setCustom((c) => ({ ...c, from: v }))} />
                  <span className="text-xs text-foreground/40">—</span>
                  <DateInput value={custom.to} onChange={(v) => setCustom((c) => ({ ...c, to: v }))} />
                </div>
              )}

              <span className="mx-1 hidden h-6 w-px bg-border/70 lg:block" />

              <FilterSelect
                label="Źródło"
                value={filters.source}
                options={allSources}
                onChange={(v) => setFilters((f) => ({ ...f, source: v }))}
              />
              <FilterSelect
                label="Urządzenie"
                value={filters.device}
                options={["desktop", "mobile", "tablet"]}
                onChange={(v) => setFilters((f) => ({ ...f, device: v }))}
              />
              <FilterSelect
                label="Projekt"
                value={filters.project}
                options={allProjects}
                onChange={(v) => setFilters((f) => ({ ...f, project: v }))}
              />
              <FilterSelect
                label="Kampania"
                value={filters.campaign}
                options={allCampaigns}
                onChange={(v) => setFilters((f) => ({ ...f, campaign: v }))}
              />
              <button
                onClick={() => setFilters({ source: null, device: null, project: null, campaign: null })}
                className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-foreground/40 transition hover:text-foreground"
              >
                <FilterX className="h-3 w-3" />
                Wyczyść filtry
              </button>
            </section>

            <div className="mt-4 flex flex-col gap-4 pb-12">{content()}</div>
          </>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UI primitives — GOVO styling                                        */
/* ------------------------------------------------------------------ */

function delta(value: number, prev: number): number | null {
  if (!prev) return null;
  return ((value - prev) / prev) * 100;
}

function DeltaTag({ value, note }: { value: number | null; note?: string }) {
  if (value === null) return note ? <span className="text-[10px] text-foreground/30">{note}</span> : null;
  const up = value >= 0;
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px]">
      <span className={cn("font-mono", up ? "text-emerald-400/85" : "text-rose-400/85")}>
        {up ? "↑" : "↓"} {fmtPct(Math.abs(value), 1)}
      </span>
      {note && <span className="text-foreground/30">{note}</span>}
    </span>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-4 py-2 text-xs text-foreground/70 transition hover:border-primary/50 hover:text-foreground"
    >
      {children}
    </button>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-2xl border border-border/70 bg-card/30 p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

function PanelHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-sm font-medium text-foreground/85">{title}</h2>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<readonly [T, string]>;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-border/70 bg-background/40 p-0.5">
      {options.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "rounded-[10px] px-2.5 py-1 text-[11px] transition",
            value === key ? "bg-primary/18 text-primary" : "text-foreground/45 hover:text-foreground/80",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Kpi({
  label,
  value,
  prev,
  note,
  icon: Icon,
}: {
  label: string;
  value: number;
  prev: number;
  note?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/30 p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">{label}</p>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-[1.7rem] leading-none tracking-tight">
        {value.toLocaleString("pl-PL")}
      </p>
      <div className="mt-2.5">
        <DeltaTag value={delta(value, prev)} note={note} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, delta: d }: { label: string; value: string; delta: number | null }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/35">{label}</p>
      <p className="mt-1.5 font-display text-lg tracking-tight">{value}</p>
      <div className="mt-1">
        <DeltaTag value={d} />
      </div>
    </div>
  );
}

function Empty({ text = "Brak danych dla wybranego okresu." }: { text?: string }) {
  return <p className="mt-5 text-xs leading-relaxed text-foreground/35">{text}</p>;
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-border/70 bg-background/50 px-2.5 py-1.5 text-xs text-foreground/80 outline-none focus:border-primary/50"
    />
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  return (
    <label className="flex min-w-[130px] flex-col rounded-xl border border-border/70 bg-background/40 px-3 py-1.5">
      <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="-ml-0.5 bg-transparent text-xs text-foreground/80 outline-none"
      >
        <option value="">Wszystkie</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
