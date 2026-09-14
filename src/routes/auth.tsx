import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Panel — GOVO DIGITAL" },
      { name: "description", content: "Private sign-in for the GOVO DIGITAL analytics panel." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Panel — GOVO DIGITAL" },
      { property: "og:description", content: "Private sign-in for the GOVO DIGITAL analytics panel." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/stats" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/stats" });
        else setMsg("Sprawdź skrzynkę e-mail i potwierdź konto.");
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Coś poszło nie tak.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <form
        onSubmit={submit}
        className="animate-fade-up w-full max-w-sm rounded-3xl border border-border bg-card/60 p-7 shadow-soft backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/50">
          <Lock className="h-3.5 w-3.5" />
          Private area
        </div>
        <h1 className="mt-3 font-display text-3xl tracking-tight">
          {mode === "login" ? "Zaloguj się" : "Utwórz konto"}
        </h1>
        <p className="mt-2 text-sm text-foreground/55">
          Panel statystyk odwiedzin — tylko dla właściciela strony.
        </p>

        <label className="mt-6 block text-xs font-medium text-foreground/60">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60"
        />

        <label className="mt-4 block text-xs font-medium text-foreground/60">Hasło</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60"
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:shadow-glow disabled:opacity-60"
        >
          {busy ? "…" : mode === "login" ? "Wejdź" : "Zarejestruj"}
        </button>

        {msg && <p className="mt-4 text-center text-xs text-foreground/60">{msg}</p>}

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMsg(null);
          }}
          className="mt-4 w-full text-center text-xs text-foreground/45 underline-offset-4 hover:text-foreground/70 hover:underline"
        >
          {mode === "login" ? "Nie masz konta? Utwórz je" : "Masz już konto? Zaloguj się"}
        </button>
      </form>
    </main>
  );
}
