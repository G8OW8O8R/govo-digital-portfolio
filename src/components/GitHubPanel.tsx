import { useEffect, useMemo, useState } from "react";
import { Github, Star, GitFork, ArrowUpRight } from "lucide-react";

type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
};

type GhRepo = {
  id: number;
  name: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
};

type Contribution = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ContribResponse = {
  total: Record<string, number>;
  contributions: Contribution[];
};

const USERNAME = "G8OW8O8R";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
};

// Violet palette to match our theme
const LEVEL_COLORS = [
  "oklch(0.22 0.02 280)", // 0 - empty
  "oklch(0.40 0.10 300)", // 1
  "oklch(0.55 0.15 300)", // 2
  "oklch(0.68 0.18 300)", // 3
  "oklch(0.80 0.20 300)", // 4
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GitHubPanel() {
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [contrib, setContrib] = useState<ContribResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [u, r, c] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`).then((x) => x.json()),
          fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=10`).then((x) => x.json()),
          fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).then((x) => x.json()),
        ]);
        if (!alive) return;
        if (u?.login) setUser(u);
        if (Array.isArray(r)) setRepos(r.filter((x: GhRepo) => !x.fork).slice(0, 3));
        if (c?.contributions) setContrib(c);
      } catch {
        /* swallow */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Build a 53-week × 7-day grid ending today
  const weeks = useMemo(() => {
    if (!contrib) return [];
    const map = new Map<string, Contribution>();
    for (const c of contrib.contributions) map.set(c.date, c);

    const today = new Date();
    // Align end to Saturday (GitHub week ends Sat)
    const end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay()));

    const totalDays = 53 * 7;
    const start = new Date(end);
    start.setDate(end.getDate() - (totalDays - 1));

    const grid: Contribution[][] = [];
    for (let w = 0; w < 53; w++) {
      const col: Contribution[] = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(start);
        day.setDate(start.getDate() + w * 7 + d);
        const key = day.toISOString().slice(0, 10);
        col.push(map.get(key) ?? { date: key, count: 0, level: 0 });
      }
      grid.push(col);
    }
    return grid;
  }, [contrib]);

  const totalCount = useMemo(() => {
    if (!contrib) return 0;
    return contrib.contributions.reduce((s, c) => s + c.count, 0);
  }, [contrib]);

  // Month label positions
  const monthMarkers = useMemo(() => {
    const marks: { idx: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((col, i) => {
      const m = new Date(col[0].date).getMonth();
      if (m !== lastMonth) {
        marks.push({ idx: i, label: MONTH_LABELS[m] });
        lastMonth = m;
      }
    });
    return marks;
  }, [weeks]);

  return (
    <a
      href={user?.html_url ?? `https://github.com/${USERNAME}`}
      target="_blank"
      rel="noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:border-primary/50 hover:shadow-glow"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-pink-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {user ? (
            <img
              src={user.avatar_url}
              alt={user.login}
              className="h-10 w-10 rounded-xl border border-border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60">
              <Github className="h-4 w-4 text-foreground/70" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-medium text-foreground">
              {user?.name ?? "GOVO DIGITAL"}
            </h3>
            <ArrowUpRight className="h-3.5 w-3.5 text-foreground/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>
          <p className="truncate text-[11px] text-foreground/50">@{user?.login ?? USERNAME}</p>
        </div>
        <div className="text-right">
          <div className="font-display text-lg leading-none text-foreground">
            {loading ? "—" : totalCount}
          </div>
          <div className="mt-0.5 text-[9px] uppercase tracking-wider text-foreground/40">
            contributions
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="mt-5 rounded-xl border border-border/60 bg-background/40 p-3">
        {loading ? (
          <div className="h-[110px] animate-pulse rounded-md bg-foreground/5" />
        ) : (
          <div className="overflow-hidden">
            {/* Month labels */}
            <div className="relative mb-1 h-3 text-[9px] text-foreground/40">
              {monthMarkers.map((m, i) => (
                <span
                  key={`${m.idx}-${m.label}`}
                  className={`absolute ${i % 2 === 1 ? "hidden sm:inline" : ""}`}
                  style={{ left: `${(m.idx / 53) * 100}%` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex w-full gap-[2px]">
              {weeks.map((col, wi) => (
                <div key={wi} className="flex flex-1 flex-col gap-[2px]">
                  {col.map((day, di) => (
                    <div
                      key={di}
                      title={`${day.date}: ${day.count} contributions`}
                      className="aspect-square w-full rounded-[2px] transition-transform duration-300 hover:scale-150"
                      style={{
                        background: LEVEL_COLORS[day.level],
                        animationDelay: `${(wi * 7 + di) * 2}ms`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="mt-2 flex items-center justify-end gap-1 text-[9px] text-foreground/40">
              <span>less</span>
              {LEVEL_COLORS.map((c, i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-[2px]"
                  style={{ background: c }}
                />
              ))}
              <span>more</span>
            </div>
          </div>
        )}
      </div>

      {/* Recent repos (compact) */}
      {repos.length > 0 && (
        <div className="mt-4 space-y-1">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between gap-2 rounded-lg px-1 py-1 text-[11px] text-foreground/60"
            >
              <div className="flex min-w-0 items-center gap-2">
                {repo.language && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: LANG_COLORS[repo.language] ?? "#888" }}
                  />
                )}
                <span className="truncate">{repo.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-foreground/40">
                {repo.stargazers_count > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5" />
                    {repo.stargazers_count}
                  </span>
                )}
                {repo.forks_count > 0 && (
                  <span className="flex items-center gap-0.5">
                    <GitFork className="h-2.5 w-2.5" />
                    {repo.forks_count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </a>
  );
}
