/** Aggregation helpers for the private GOVO analytics dashboard. */

export type SessionRow = {
  session_id: string;
  visitor_id: string;
  started_at: string;
  ended_at: string;
  landing_page: string;
  exit_page: string | null;
  referrer: string | null;
  source: string;
  medium: string | null;
  campaign: string | null;
  device_type: string;
  viewport_width: number | null;
  browser_family: string | null;
  operating_system: string | null;
  is_returning: boolean;
  pageviews_count: number;
  events_count: number;
  active_seconds: number;
  max_scroll: number;
};

export type PageviewRow = {
  session_id: string;
  visitor_id: string;
  path: string;
  page_title: string | null;
  viewed_at: string;
};

export type EventRow = {
  session_id: string;
  visitor_id: string;
  event_name: string;
  path: string | null;
  project_slug: string | null;
  metadata: unknown;
  created_at: string;
};

export type Dataset = {
  sessions: SessionRow[];
  pageviews: PageviewRow[];
  events: EventRow[];
};

export type Filters = {
  source: string | null;
  device: string | null;
  project: string | null;
  campaign: string | null;
};

export const CONTACT_EVENTS = [
  "contact_open",
  "contact_email_click",
  "contact_phone_click",
  "contact_form_start",
  "contact_form_submit",
];

/* ---------------------------------------------------------------- */

export function applyFilters(data: Dataset, f: Filters): Dataset {
  let sessions = data.sessions;
  if (f.source) sessions = sessions.filter((s) => s.source === f.source);
  if (f.device) sessions = sessions.filter((s) => s.device_type === f.device);
  if (f.campaign) sessions = sessions.filter((s) => (s.campaign ?? "—") === f.campaign);
  if (f.project) {
    const withProject = new Set(
      data.events.filter((e) => e.project_slug === f.project).map((e) => e.session_id),
    );
    sessions = sessions.filter((s) => withProject.has(s.session_id));
  }
  const ids = new Set(sessions.map((s) => s.session_id));
  return {
    sessions,
    pageviews: data.pageviews.filter((p) => ids.has(p.session_id)),
    events: data.events.filter((e) => ids.has(e.session_id)),
  };
}

function count(events: EventRow[], name: string) {
  return events.filter((e) => e.event_name === name).length;
}

export function kpis(d: Dataset) {
  const sessions = d.sessions.length;
  const views = d.pageviews.length;
  const visitors = new Set(d.sessions.map((s) => s.visitor_id)).size;
  const contactSessions = new Set(
    d.events.filter((e) => CONTACT_EVENTS.includes(e.event_name)).map((e) => e.session_id),
  ).size;
  const active = d.sessions.reduce((a, s) => a + (s.active_seconds || 0), 0);
  const scroll = d.sessions.filter((s) => s.max_scroll > 0);
  return {
    sessions,
    views,
    visitors,
    projectOpens: count(d.events, "project_open"),
    demoClicks: count(d.events, "demo_click"),
    contactOpens: count(d.events, "contact_open"),
    contactSessions,
    formSubmits: count(d.events, "contact_form_submit"),
    viewsPerSession: sessions ? views / sessions : 0,
    avgActive: sessions ? Math.round(active / sessions) : 0,
    avgScroll: scroll.length
      ? Math.round(scroll.reduce((a, s) => a + s.max_scroll, 0) / scroll.length)
      : 0,
    returning: d.sessions.filter((s) => s.is_returning).length,
    fresh: d.sessions.filter((s) => !s.is_returning).length,
  };
}

export function pct(part: number, total: number) {
  if (!total) return 0;
  return (part / total) * 100;
}

export function fmtPct(value: number, digits = 1) {
  return `${value.toFixed(digits).replace(".", ",")}%`;
}

export function fmtDuration(seconds: number) {
  if (!seconds) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
}

/* ---------------------------------------------------------------- */

export type SeriesPoint = { label: string; key: string; views: number; sessions: number; conversions: number };

export function buildSeries(
  d: Dataset,
  from: Date,
  to: Date,
  granularity: "hour" | "day" | "week",
): SeriesPoint[] {
  const buckets = new Map<string, SeriesPoint>();
  const keyOf = (date: Date) => {
    if (granularity === "hour") return date.toISOString().slice(0, 13);
    if (granularity === "week") {
      const d0 = new Date(date);
      d0.setDate(d0.getDate() - ((d0.getDay() + 6) % 7));
      return d0.toISOString().slice(0, 10);
    }
    return date.toISOString().slice(0, 10);
  };
  const labelOf = (key: string) =>
    granularity === "hour" ? `${key.slice(11, 13)}:00` : key.slice(5);

  const cursor = new Date(from);
  while (cursor <= to) {
    const key = keyOf(cursor);
    if (!buckets.has(key)) buckets.set(key, { key, label: labelOf(key), views: 0, sessions: 0, conversions: 0 });
    if (granularity === "hour") cursor.setHours(cursor.getHours() + 1);
    else if (granularity === "week") cursor.setDate(cursor.getDate() + 7);
    else cursor.setDate(cursor.getDate() + 1);
  }

  const bump = (iso: string, field: "views" | "sessions" | "conversions") => {
    const key = keyOf(new Date(iso));
    const bucket = buckets.get(key);
    if (bucket) bucket[field] += 1;
  };
  d.pageviews.forEach((p) => bump(p.viewed_at, "views"));
  d.sessions.forEach((s) => bump(s.started_at, "sessions"));
  d.events
    .filter((e) => CONTACT_EVENTS.includes(e.event_name) || e.event_name === "demo_click")
    .forEach((e) => bump(e.created_at, "conversions"));

  return [...buckets.values()];
}

/* ---------------------------------------------------------------- */

export function funnel(d: Dataset) {
  const sessions = d.sessions.length;
  const projectsPage = new Set(
    d.pageviews.filter((p) => p.path.startsWith("/projects")).map((p) => p.session_id),
  ).size;
  const opened = new Set(
    d.events.filter((e) => e.event_name === "project_open").map((e) => e.session_id),
  ).size;
  const demo = new Set(d.events.filter((e) => e.event_name === "demo_click").map((e) => e.session_id)).size;
  const contact = new Set(
    d.events.filter((e) => CONTACT_EVENTS.includes(e.event_name)).map((e) => e.session_id),
  ).size;
  return [
    { label: "Wejście", value: sessions },
    { label: "Projekty", value: projectsPage },
    { label: "Otwarcie projektu", value: opened },
    { label: "Demo", value: demo },
    { label: "Kontakt", value: contact },
  ];
}

/* ---------------------------------------------------------------- */

export type ProjectStat = {
  slug: string;
  name: string;
  views: number;
  sessions: number;
  demo: number;
  contact: number;
  ctr: number;
};

function metaValue(metadata: unknown, key: string): string | null {
  if (metadata && typeof metadata === "object" && key in (metadata as Record<string, unknown>)) {
    const v = (metadata as Record<string, unknown>)[key];
    return typeof v === "string" ? v : null;
  }
  return null;
}

export function projectStats(d: Dataset): ProjectStat[] {
  const map = new Map<string, ProjectStat & { sessionIds: Set<string> }>();
  const ensure = (slug: string, name?: string | null) => {
    let entry = map.get(slug);
    if (!entry) {
      entry = {
        slug,
        name: name ?? slug.toUpperCase(),
        views: 0,
        sessions: 0,
        demo: 0,
        contact: 0,
        ctr: 0,
        sessionIds: new Set(),
      };
      map.set(slug, entry);
    }
    if (name) entry.name = name;
    return entry;
  };

  const projectEvents = d.events
    .filter((e) => e.project_slug)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  for (const e of projectEvents) {
    const entry = ensure(e.project_slug!, metaValue(e.metadata, "project_name"));
    if (e.event_name === "project_open") {
      entry.views += 1;
      entry.sessionIds.add(e.session_id);
    }
    if (e.event_name === "demo_click") {
      entry.demo += 1;
      entry.sessionIds.add(e.session_id);
    }
  }

  // Attribution: contact action counted for the last project seen in the same session.
  const bySession = new Map<string, EventRow[]>();
  for (const e of d.events) {
    const list = bySession.get(e.session_id) ?? [];
    list.push(e);
    bySession.set(e.session_id, list);
  }
  for (const list of bySession.values()) {
    const ordered = [...list].sort((a, b) => a.created_at.localeCompare(b.created_at));
    let lastProject: { slug: string; name: string | null } | null = null;
    const credited = new Set<string>();
    for (const e of ordered) {
      if (e.project_slug && (e.event_name === "project_open" || e.event_name === "demo_click")) {
        lastProject = { slug: e.project_slug, name: metaValue(e.metadata, "project_name") };
      }
      if (CONTACT_EVENTS.includes(e.event_name) && lastProject && !credited.has(lastProject.slug)) {
        credited.add(lastProject.slug);
        ensure(lastProject.slug, lastProject.name).contact += 1;
      }
    }
  }

  return [...map.values()]
    .map(({ sessionIds, ...rest }) => ({
      ...rest,
      sessions: sessionIds.size,
      ctr: rest.views ? (rest.demo / rest.views) * 100 : 0,
    }))
    .sort((a, b) => b.views - a.views);
}

/* ---------------------------------------------------------------- */

export type Bucket = { label: string; count: number; sessions?: number };

export function tally(items: Array<string | null | undefined>, fallback = "—"): Bucket[] {
  const map = new Map<string, number>();
  for (const raw of items) {
    const key = raw && raw.length ? raw : fallback;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function topPages(d: Dataset): Array<Bucket & { sessions: number; avgActive: number }> {
  const map = new Map<string, { count: number; sessions: Set<string> }>();
  for (const p of d.pageviews) {
    const entry = map.get(p.path) ?? { count: 0, sessions: new Set<string>() };
    entry.count += 1;
    entry.sessions.add(p.session_id);
    map.set(p.path, entry);
  }
  const sessionActive = new Map(d.sessions.map((s) => [s.session_id, s.active_seconds] as const));
  return [...map.entries()]
    .map(([label, v]) => {
      const totals = [...v.sessions].map((id) => sessionActive.get(id) ?? 0);
      const avg = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
      return { label, count: v.count, sessions: v.sessions.size, avgActive: avg };
    })
    .sort((a, b) => b.count - a.count);
}

export type CampaignStat = {
  campaign: string;
  source: string;
  sessions: number;
  projectOpens: number;
  demo: number;
  contact: number;
  rate: number;
};

export function campaignStats(d: Dataset): CampaignStat[] {
  const withCampaign = d.sessions.filter((s) => s.campaign);
  const map = new Map<string, CampaignStat & { ids: Set<string> }>();
  for (const s of withCampaign) {
    const key = `${s.source}|${s.campaign}`;
    let entry = map.get(key);
    if (!entry) {
      entry = {
        campaign: s.campaign!,
        source: s.source,
        sessions: 0,
        projectOpens: 0,
        demo: 0,
        contact: 0,
        rate: 0,
        ids: new Set(),
      };
      map.set(key, entry);
    }
    entry.sessions += 1;
    entry.ids.add(s.session_id);
  }
  for (const entry of map.values()) {
    const events = d.events.filter((e) => entry.ids.has(e.session_id));
    entry.projectOpens = count(events, "project_open");
    entry.demo = count(events, "demo_click");
    entry.contact = new Set(
      events.filter((e) => CONTACT_EVENTS.includes(e.event_name)).map((e) => e.session_id),
    ).size;
    entry.rate = entry.sessions ? (entry.contact / entry.sessions) * 100 : 0;
  }
  return [...map.values()]
    .map(({ ids, ...rest }) => rest)
    .sort((a, b) => b.sessions - a.sessions);
}

export type SourceQuality = {
  source: string;
  sessions: number;
  projectOpens: number;
  demo: number;
  contact: number;
};

export function sourceQuality(d: Dataset): SourceQuality[] {
  const map = new Map<string, SourceQuality & { ids: Set<string> }>();
  for (const s of d.sessions) {
    let entry = map.get(s.source);
    if (!entry) {
      entry = { source: s.source, sessions: 0, projectOpens: 0, demo: 0, contact: 0, ids: new Set() };
      map.set(s.source, entry);
    }
    entry.sessions += 1;
    entry.ids.add(s.session_id);
  }
  for (const entry of map.values()) {
    const events = d.events.filter((e) => entry.ids.has(e.session_id));
    entry.projectOpens = count(events, "project_open");
    entry.demo = count(events, "demo_click");
    entry.contact = new Set(
      events.filter((e) => CONTACT_EVENTS.includes(e.event_name)).map((e) => e.session_id),
    ).size;
  }
  return [...map.values()].map(({ ids, ...rest }) => rest).sort((a, b) => b.sessions - a.sessions);
}

export type SessionTimelineItem = { at: string; label: string; kind: "page" | "event" };

export function recentSessions(d: Dataset, limit = 15) {
  const ordered = [...d.sessions].sort((a, b) => b.started_at.localeCompare(a.started_at)).slice(0, limit);
  return ordered.map((s) => {
    const timeline: SessionTimelineItem[] = [
      ...d.pageviews
        .filter((p) => p.session_id === s.session_id)
        .map((p) => ({ at: p.viewed_at, label: p.path, kind: "page" as const })),
      ...d.events
        .filter((e) => e.session_id === s.session_id && !e.event_name.startsWith("scroll_"))
        .map((e) => ({
          at: e.created_at,
          label: e.project_slug ? `${e.event_name} · ${e.project_slug}` : e.event_name,
          kind: "event" as const,
        })),
    ].sort((a, b) => a.at.localeCompare(b.at));
    const duration = Math.max(
      s.active_seconds,
      Math.round((new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000),
    );
    return { session: s, timeline, duration };
  });
}

export function viewportBuckets(d: Dataset): Bucket[] {
  const label = (w: number | null) => {
    if (!w) return "—";
    if (w < 431) return "360–430";
    if (w < 768) return "431–767";
    if (w <= 1024) return "768–1024";
    if (w < 1600) return "1280–1599";
    return "1600+";
  };
  return tally(d.sessions.map((s) => label(s.viewport_width)));
}

export function scrollDepth(d: Dataset, path = "/") {
  const sessionsOnPath = new Set(d.pageviews.filter((p) => p.path === path).map((p) => p.session_id));
  const total = sessionsOnPath.size;
  const reach = (m: number) =>
    new Set(
      d.events
        .filter((e) => e.event_name === `scroll_${m}` && e.path === path && sessionsOnPath.has(e.session_id))
        .map((e) => e.session_id),
    ).size;
  return { total, milestones: [25, 50, 75, 90].map((m) => ({ milestone: m, count: reach(m) })) };
}

/* ---------------------------------------------------------------- */

export function toCsv(rows: Array<Record<string, unknown>>): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]!);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(";"), ...rows.map((r) => headers.map((h) => escape(r[h])).join(";"))].join("\n");
}

export function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  const csv = toCsv(rows);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
