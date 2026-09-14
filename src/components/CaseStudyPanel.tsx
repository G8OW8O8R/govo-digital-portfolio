import type { LucideIcon } from "lucide-react";
import { Calendar, FlaskConical, Layers, ShoppingBag, Smartphone, Target, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type CaseFact = { label: string; items: string[] };
export type CaseFocus = { title: string; body: string };

export type CaseData = {
  facts: CaseFact[];
  focusTitle: string;
  focus: CaseFocus[];
};

const FACT_ICONS: LucideIcon[] = [User, Layers, Target, Calendar];
const FOCUS_ICONS: LucideIcon[] = [FlaskConical, ShoppingBag, Zap, Smartphone];

export default function CaseStudyPanel({ data, compact }: { data: CaseData; compact?: boolean }) {
  if (compact) {
    return (
      <div className="border-t border-border/40 pt-5">
        {/* Focus */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
              {data.focusTitle}
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>

          <div className="space-y-2">
            {data.focus.map((f, i) => {
              const Icon = FOCUS_ICONS[i % FOCUS_ICONS.length];
              return (
                <div
                  key={f.title}
                  className="group/focus flex items-start gap-3 rounded-xl border border-border/40 bg-background/30 p-3 transition duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-background/50"
                >
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70 transition duration-500 group-hover/focus:text-primary" />
                  <div className="min-w-0">
                    <span className="block text-[12px] font-medium leading-tight text-foreground/90">
                      {f.title}
                    </span>
                    <p className="mt-0.5 text-[11px] leading-snug text-foreground/50">{f.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Facts strip */}
      <div className="grid grid-cols-1 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
        {data.facts.map((fact, i) => {
          const Icon = FACT_ICONS[i % FACT_ICONS.length];
          return (
            <div
              key={fact.label}
              className="group/fact px-1 py-4 sm:px-6 sm:py-2 sm:[&:not(:nth-child(2n+1))]:border-l sm:[&:not(:nth-child(2n+1))]:border-border/50 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-border/50 lg:[&:nth-child(3)]:border-l"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-primary/80 transition duration-500 group-hover/fact:text-primary" />
                <span className="text-[15px] text-foreground/90">{fact.label}</span>
              </div>
              <ul className="mt-3 space-y-1 pl-7 text-[13px] leading-relaxed text-foreground/45">
                {fact.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Focus */}
      <h4 className="mt-10 font-display text-2xl tracking-tight text-foreground/95">{data.focusTitle}</h4>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.focus.map((f, i) => {
          const Icon = FOCUS_ICONS[i % FOCUS_ICONS.length];
          return (
            <div
              key={f.title}
              className="group/focus rounded-2xl border border-border/60 bg-background/40 p-5 backdrop-blur-xl transition duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-1 hover:border-primary/40 hover:bg-background/60 hover:shadow-glow"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-primary/80 transition duration-500 group-hover/focus:text-primary" />
                <span className="text-[15px] leading-snug text-foreground/90">{f.title}</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-foreground/45">{f.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
