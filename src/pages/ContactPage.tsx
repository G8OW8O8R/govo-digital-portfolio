import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, Send, ArrowUpRight, ArrowRight, Lock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { lazy, Suspense } from "react";
const InteractiveStars = lazy(() => import("@/components/InteractiveStars"));
import GitHubPanel from "@/components/GitHubPanel";
import { CustomSelect } from "@/components/CustomSelect";
import { LanguageSwitcher, useI18n } from "@/i18n/I18nProvider";
import { paths } from "@/lib/i18n-routes";
import { trackEvent } from "@/lib/analytics";





export default function ContactPage() {
  const { t, lang } = useI18n();
  const p = paths(lang);
  const [sent, setSent] = useState(false);

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void trackEvent("contact_open", { once: true });
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("govo:contactMessage");
      if (stored) {
        setMessage(stored);
        sessionStorage.removeItem("govo:contactMessage");
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/govodigital@proton.me", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: (form.elements.namedItem("name") as HTMLInputElement).value,
          email: (form.elements.namedItem("email") as HTMLInputElement).value,
          projectType: (form.elements.namedItem("projectType") as HTMLSelectElement | null)?.value ?? "",
          message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
          _subject: "New message from GOVO DIGITAL",
          _template: "table",
          _captcha: "false",
        }),
      });
      if (res.ok) {
        void trackEvent("contact_form_submit");
        setSent(true);
        form.reset();
        setMessage("");
        setTimeout(() => setSent(false), 4000);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={null}><InteractiveStars /></Suspense>

      {/* Top nav */}
      <header className="relative z-20 mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-6 text-xs">
        <Link
          to={p.home}
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-mono text-foreground/70 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          {t.back}
        </Link>
        <LanguageSwitcher />
      </header>

      <section className="relative z-10 mx-auto w-full max-w-4xl px-6 py-14 md:py-20">
        {/* Heading */}
        <div className="mb-12 text-center md:mb-16">
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-foreground">{t.contactTitle1}</span>
            <span className="text-shimmer">{t.contactTitle2}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg whitespace-pre-line text-sm leading-relaxed text-foreground/60 md:text-base">
            {t.contactIntro}
          </p>
        </div>

        {/* Contact grid */}
        <div className="animate-fade-up grid grid-cols-1 gap-8 md:grid-cols-2" style={{ animationDelay: "80ms" }}>
          {/* Info column */}
          <div className="flex flex-col gap-6">
            {/* Email card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:border-primary/50 hover:shadow-glow">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-pink-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60">
                  <Mail className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground/70">{t.emailDirect}</h3>
                  <a
                    href="mailto:govodigital@proton.me"
                    onClick={() => void trackEvent("contact_email_click")}
                    className="mt-1 inline-flex items-center gap-1 text-base font-medium text-wave-gradient transition hover:brightness-110"
                  >
                    govodigital@proton.me
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                  </a>
                  <p className="mt-2 text-sm text-foreground/55">{t.emailReply}</p>
                </div>
              </div>
            </div>

            {/* Phone card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:border-primary/50 hover:shadow-glow">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-pink-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60">
                  <Phone className="h-4.5 w-4.5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground/80">{t.phone}</h3>
                  <p className="mt-1 text-base text-foreground">{t.phoneText}</p>
                </div>
              </div>
            </div>

            {/* GitHub panel */}
            <GitHubPanel />

            {/* Brief CTA */}
            <div className="animate-fade-up group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl transition hover:border-primary/50 hover:shadow-glow sm:p-8" style={{ animationDelay: "240ms" }}>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-pink-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground/80">{t.contactBriefCtaTitle}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{t.contactBriefCtaBody}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            <form
              onSubmit={handleSubmit}
              onFocus={() => void trackEvent("contact_form_start", { once: true })}
              className="relative flex h-full flex-col gap-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl transition focus-within:border-primary/40 focus-within:shadow-glow sm:p-8"
            >
              <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-pink-500/5 opacity-0 transition-opacity duration-500" />

              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground/50">
                  {t.formName}
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder={t.formNamePh}
                  required
                  className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground/50">
                  {t.formEmail}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={t.formEmailPh}
                  required
                  className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <CustomSelect
                name="projectType"
                label={t.formType}
                placeholder={t.formTypePh}
                options={t.formTypeOptions}
              />

              <div className="flex-1">
                <label htmlFor="message" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground/50">
                  {t.formMessage}
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.formMessagePh}
                  required
                  rows={5}
                  className="w-full resize-none rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <button
                type="submit"
                disabled={sending || sent}
                className="group mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:scale-[1.02] hover:shadow-[0_20px_60px_-20px_oklch(0.68_0.15_300/0.5)] active:scale-[0.97] disabled:opacity-70"
              >
                {sending || sent ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    {t.sent}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t.formCta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <p className="inline-flex items-center justify-center gap-1.5 text-center text-[11px] text-foreground/45">
                <Lock className="h-3 w-3" />
                {t.formNote}
              </p>

            </form>
          </div>
        </div>

        {/* Footer back link */}
        <div className="animate-fade-up mt-16 flex justify-center" style={{ animationDelay: "280ms" }}>
          <Link
            to={p.home}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2.5 text-sm text-foreground/80 backdrop-blur-xl transition hover:border-primary/50 hover:text-foreground hover:shadow-glow"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backHome}
          </Link>
        </div>
      </section>
    </main>
  );
}
