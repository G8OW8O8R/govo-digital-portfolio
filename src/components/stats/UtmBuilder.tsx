import { useMemo, useState } from "react";
import { Check, Copy, Link2, RotateCcw } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const PAGES = ["/", "/projects", "/skills", "/process", "/me", "/contact"];

const PRESETS: Array<{ label: string; source: string; medium: string }> = [
  { label: "LinkedIn", source: "linkedin", medium: "social" },
  { label: "OLX", source: "olx", medium: "listing" },
  { label: "Useme", source: "useme", medium: "listing" },
  { label: "E-mail", source: "outreach", medium: "email" },
  { label: "CV / PDF", source: "cv", medium: "document" },
  { label: "Instagram", source: "instagram", medium: "social" },
];

function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

const inputClass =
  "w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-foreground/90 outline-none transition-colors placeholder:text-foreground/30 focus:border-primary/50 focus:bg-background/60";

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-foreground/35">{label}</span>
      <input className={inputClass} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function UtmBuilder() {
  const [path, setPath] = useState("/");
  const [source, setSource] = useState("linkedin");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("portfolio");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    const base = siteConfig.siteUrl.replace(/\/$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const params = new URLSearchParams();
    if (slug(source)) params.set("utm_source", slug(source));
    if (slug(medium)) params.set("utm_medium", slug(medium));
    if (slug(campaign)) params.set("utm_campaign", slug(campaign));
    if (slug(content)) params.set("utm_content", slug(content));
    const qs = params.toString();
    return `${base}${cleanPath === "/" ? "/" : cleanPath}${qs ? `?${qs}` : ""}`;
  }, [path, source, medium, campaign, content]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mt-5 rounded-xl border border-border/60 bg-background/25 p-4">
      <div className="flex items-center gap-2">
        <Link2 className="h-3.5 w-3.5 text-primary/80" />
        <h4 className="text-xs font-medium tracking-tight text-foreground/85">Generator linków UTM</h4>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/40">
        Wygeneruj link, wyślij go klientowi — wejście pojawi się automatycznie w tabeli kampanii powyżej.
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setSource(p.source);
              setMedium(p.medium);
            }}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] transition-colors",
              slug(source) === p.source && slug(medium) === p.medium
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border/60 text-foreground/45 hover:border-primary/30 hover:text-foreground/75",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-[10px] uppercase tracking-[0.14em] text-foreground/35">Strona docelowa</span>
          <select className={inputClass} value={path} onChange={(e) => setPath(e.target.value)}>
            {PAGES.map((p) => (
              <option key={p} value={p} className="bg-background text-foreground">
                {p}
              </option>
            ))}
          </select>
        </label>
        <Field label="utm_source" value={source} onChange={setSource} placeholder="linkedin" />
        <Field label="utm_medium" value={medium} onChange={setMedium} placeholder="social" />
        <Field label="utm_campaign" value={campaign} onChange={setCampaign} placeholder="portfolio" />
        <Field label="utm_content (opcjonalnie)" value={content} onChange={setContent} placeholder="post-1" />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="flex-1 overflow-x-auto whitespace-nowrap rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-[11px] text-primary/85">
          {url}
        </code>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/15 px-3 py-2 text-[11px] text-primary transition-colors hover:bg-primary/25"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Skopiowano" : "Kopiuj"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPath("/");
              setSource("linkedin");
              setMedium("social");
              setCampaign("portfolio");
              setContent("");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-[11px] text-foreground/50 transition-colors hover:text-foreground/80"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
