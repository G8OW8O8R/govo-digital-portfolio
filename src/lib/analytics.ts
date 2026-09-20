/**
 * GOVO DIGITAL — first-party, privacy-first analytics.
 *
 * No fingerprinting, no IPs, no personal data. Only two anonymous
 * first-party identifiers: visitor_id (localStorage) and session_id
 * (30 min inactivity window). All writes are fire-and-forget and never
 * block rendering or break the page.
 */
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/lib/site-config";

const VISITOR_KEY = "govo:visitorId";
const SESSION_KEY = "govo:session";
const OWNER_KEY = "govo_analytics_owner";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export const OWNER_FLAG_KEY = OWNER_KEY;

/* ------------------------------------------------------------------ */
/* Exclusions                                                          */
/* ------------------------------------------------------------------ */

const EXCLUDED_PATH_PREFIXES = ["/stats", "/auth", "/admin", "/dashboard", "/analytics"];

function isBot(): boolean {
  try {
    if ((navigator as { webdriver?: boolean }).webdriver) return true;
    return /bot|crawl|spider|slurp|headless|preview|lighthouse|pingdom|monitor/i.test(
      navigator.userAgent,
    );
  } catch {
    return false;
  }
}

export function isOwnerExcluded(): boolean {
  try {
    return localStorage.getItem(OWNER_KEY) === "true";
  } catch {
    return false;
  }
}

export function setOwnerExcluded(value: boolean) {
  try {
    if (value) localStorage.setItem(OWNER_KEY, "true");
    else localStorage.removeItem(OWNER_KEY);
  } catch {
    /* ignore */
  }
}

function excludedPath(path: string) {
  return EXCLUDED_PATH_PREFIXES.some((p) => path.startsWith(p));
}

function trackingDisabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const productionHost = new URL(siteConfig.siteUrl).hostname;
    if (window.location.hostname !== productionHost) return true;
  } catch {
    /* proceed if siteUrl is not a valid URL */
  }
  if (isOwnerExcluded()) return true;
  if (isBot()) return true;
  return false;
}

/* ------------------------------------------------------------------ */
/* Identifiers                                                         */
/* ------------------------------------------------------------------ */

function uuid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

function getVisitor(): { visitorId: string; isReturning: boolean } {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return { visitorId: existing, isReturning: true };
    const id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
    return { visitorId: id, isReturning: false };
  } catch {
    return { visitorId: "anon", isReturning: false };
  }
}

type StoredSession = { sid: string; last: number; views: number; events: number; active: number; scroll: number };

function readStored(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.sid) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(s: StoredSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Environment detection (coarse, non-fingerprinting)                  */
/* ------------------------------------------------------------------ */

function deviceType(): "mobile" | "tablet" | "desktop" {
  const w = window.innerWidth;
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua) || (w >= 640 && w < 1024 && /Mobi|Android/i.test(ua))) return "tablet";
  if (w < 640 || /Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

function browserFamily(): string {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Inne";
}

function operatingSystem(): string {
  const ua = navigator.userAgent;
  if (/Windows/.test(ua)) return "Windows";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Inne";
}

/* ------------------------------------------------------------------ */
/* Source normalization                                                */
/* ------------------------------------------------------------------ */

const SOURCE_MAP: Array<[RegExp, string]> = [
  [/google/i, "Google"],
  [/bing|duckduckgo|yahoo/i, "Wyszukiwarki"],
  [/linkedin|lnkd\.in/i, "LinkedIn"],
  [/olx/i, "OLX"],
  [/useme/i, "Useme"],
  [/facebook|fb\.com|fbclid/i, "Facebook"],
  [/instagram/i, "Instagram"],
  [/github/i, "GitHub"],
  [/pracuj\.pl/i, "Pracuj.pl"],
  [/theprotocol/i, "TheProtocol"],
  [/t\.co|twitter|x\.com/i, "X / Twitter"],
  [/outreach|mail|email/i, "Outreach"],
];

export function normalizeSource(raw: string | null | undefined): string {
  if (!raw) return "Bezpośrednio";
  const value = raw.trim();
  if (!value || value === "direct") return "Bezpośrednio";
  for (const [re, label] of SOURCE_MAP) if (re.test(value)) return label;
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function readUtm() {
  const p = new URLSearchParams(window.location.search);
  const source = p.get("utm_source");
  const medium = p.get("utm_medium");
  const campaign = p.get("utm_campaign");
  const referrer = document.referrer || null;
  const sameOrigin = referrer ? referrer.includes(window.location.hostname) : false;
  return {
    referrer: sameOrigin ? null : referrer,
    source: normalizeSource(source ?? (sameOrigin ? null : referrer)),
    medium: medium ?? (source ? null : referrer && !sameOrigin ? "referral" : null),
    campaign,
  };
}

/* ------------------------------------------------------------------ */
/* Session lifecycle                                                   */
/* ------------------------------------------------------------------ */

let state: StoredSession | null = null;
let visitorId = "anon";
let flushTimer: ReturnType<typeof setInterval> | null = null;
let activityHooked = false;
let lastActivity = Date.now();
let scrollFrame = 0;
let engagementDocHeight = 0;
let engagementScrollable = 0;

function touch() {
  lastActivity = Date.now();
}

async function ensureSession(path: string): Promise<StoredSession | null> {
  if (trackingDisabled()) return null;

  const visitor = getVisitor();
  visitorId = visitor.visitorId;

  const stored = readStored();
  const now = Date.now();
  if (stored && now - stored.last < SESSION_TIMEOUT_MS) {
    stored.last = now;
    writeStored(stored);
    state = stored;
    return state;
  }

  const fresh: StoredSession = { sid: uuid(), last: now, views: 0, events: 0, active: 0, scroll: 0 };
  writeStored(fresh);
  state = fresh;

  const utm = readUtm();
  try {
    await supabase.from("analytics_sessions").insert({
      session_id: fresh.sid,
      visitor_id: visitorId,
      landing_page: path,
      exit_page: path,
      referrer: utm.referrer,
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      device_type: deviceType(),
      viewport_width: window.innerWidth,
      browser_family: browserFamily(),
      operating_system: operatingSystem(),
      is_returning: visitor.isReturning,
    });
  } catch {
    /* analytics must never break the page */
  }
  return state;
}

async function patchSession(path?: string) {
  if (!state || trackingDisabled()) return;
  try {
    await supabase
      .from("analytics_sessions")
      .update({
        ended_at: new Date().toISOString(),
        ...(path ? { exit_page: path } : {}),
        pageviews_count: state.views,
        events_count: state.events,
        active_seconds: state.active,
        max_scroll: state.scroll,
      })
      .eq("session_id", state.sid);
  } catch {
    /* ignore */
  }
}

/* ------------------------------------------------------------------ */
/* Active time + scroll depth                                          */
/* ------------------------------------------------------------------ */

const scrollMilestones = new Set<string>();
let currentPath = "";

function hookEngagement() {
  if (activityHooked) return;
  activityHooked = true;

  // Clicks, keys, touch and scroll capture genuine activity without adding a
  // second global mousemove hot path alongside the visual pointer effects.
  for (const evt of ["pointerdown", "keydown", "scroll", "touchstart"]) {
    window.addEventListener(evt, touch, { passive: true });
  }

  const measureDocument = () => {
    engagementDocHeight = document.documentElement.scrollHeight;
    engagementScrollable = engagementDocHeight - window.innerHeight;
  };
  measureDocument();
  const resizeObserver = new ResizeObserver(measureDocument);
  resizeObserver.observe(document.documentElement);
  window.addEventListener("resize", measureDocument, { passive: true });

  flushTimer = setInterval(() => {
    if (!state) return;
    const active = document.visibilityState === "visible" && Date.now() - lastActivity < 30_000;
    if (active) {
      state.active += 5;
      state.last = Date.now();
      writeStored(state);
    }
  }, 5000);

  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void patchSession(currentPath);
  });
  window.addEventListener("pagehide", () => void patchSession(currentPath));
}

function onScroll() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(measureScroll);
}

function measureScroll() {
  scrollFrame = 0;
  if (!state) return;
  if (engagementScrollable <= 40 || engagementDocHeight <= 0) return;
  const pct = Math.min(100, Math.round(((window.scrollY + window.innerHeight) / engagementDocHeight) * 100));
  if (pct > state.scroll) state.scroll = pct;
  let crossedMilestone = false;
  for (const m of [25, 50, 75, 90]) {
    const key = `${currentPath}:${m}`;
    if (pct >= m && !scrollMilestones.has(key)) {
      scrollMilestones.add(key);
      crossedMilestone = true;
      void trackEvent(`scroll_${m}`);
    }
  }
  // Persist at meaningful thresholds instead of synchronously writing to
  // localStorage for nearly every pixel of a production scroll gesture.
  if (crossedMilestone) writeStored(state);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

let lastTrackedPath = "";
let inFlightPath = "";

/** Records one pageview. Safe to call on every route change. */
export async function trackPageView(path: string, title?: string) {
  if (trackingDisabled() || excludedPath(path)) return;
  if (path === lastTrackedPath || path === inFlightPath) return;
  inFlightPath = path;

  const session = await ensureSession(path);
  if (!session) return;
  hookEngagement();

  lastTrackedPath = path;
  currentPath = path;
  session.views += 1;
  session.last = Date.now();
  writeStored(session);

  try {
    await supabase.from("analytics_pageviews").insert({
      session_id: session.sid,
      visitor_id: visitorId,
      path,
      page_title: title ?? document.title,
      project_slug: null,
    });
  } catch {
    /* ignore */
  }
  void patchSession(path);
}

export type EventName =
  | "project_open"
  | "demo_click"
  | "contact_open"
  | "contact_email_click"
  | "contact_phone_click"
  | "contact_form_start"
  | "contact_form_submit"
  | "process_open"
  | "navigation_click"
  | "social_click"
  | "cv_download"
  | `scroll_${number}`;

const firedOnce = new Set<string>();

/** Records one meaningful event. Never stores user-entered content. */
export async function trackEvent(
  name: EventName | string,
  options: { projectSlug?: string | null; metadata?: Record<string, string>; once?: boolean } = {},
) {
  if (trackingDisabled()) return;
  const path = typeof window !== "undefined" ? window.location.pathname : null;
  if (path && excludedPath(path)) return;

  if (options.once) {
    const key = `${name}:${options.projectSlug ?? ""}:${path ?? ""}`;
    if (firedOnce.has(key)) return;
    firedOnce.add(key);
  }

  const session = state ?? (await ensureSession(path ?? "/"));
  if (!session) return;
  session.events += 1;
  session.last = Date.now();
  writeStored(session);

  try {
    await supabase.from("analytics_events").insert({
      session_id: session.sid,
      visitor_id: visitorId,
      event_name: name,
      path,
      project_slug: options.projectSlug ?? null,
      metadata: options.metadata ?? {},
    });
  } catch {
    /* ignore */
  }
}

export function stopEngagementTimers() {
  if (flushTimer) clearInterval(flushTimer);
  flushTimer = null;
}
