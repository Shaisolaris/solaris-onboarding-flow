"use client";

import { useEffect, useState } from "react";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type Teammate = { email: string; role: "admin" | "editor" | "viewer" };

const INTEGRATIONS = [
  { id: "slack", name: "Slack", emoji: "💬", description: "Post updates to channels" },
  { id: "github", name: "GitHub", emoji: "🐙", description: "Link issues and pull requests" },
  { id: "linear", name: "Linear", emoji: "📐", description: "Sync tickets bidirectionally" },
  { id: "google", name: "Google Workspace", emoji: "📧", description: "SSO and calendar sync" },
  { id: "notion", name: "Notion", emoji: "📝", description: "Embed docs and pages" },
  { id: "stripe", name: "Stripe", emoji: "💳", description: "Import payment data" },
];

const STEP_LABELS = ["Company", "Team", "Integrations", "Preferences", "Launch"];

export default function OnboardingFlow() {
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [animating, setAnimating] = useState(false);

  // Step 1 — Company
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState<"1-10" | "11-50" | "51-200" | "200+">("11-50");
  const [industry, setIndustry] = useState("SaaS");
  const [role, setRole] = useState("Founder");

  // Step 2 — Team
  const [teammates, setTeammates] = useState<Teammate[]>([
    { email: "", role: "editor" },
    { email: "", role: "editor" },
  ]);

  // Step 3 — Integrations
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    slack: true,
    github: true,
  });

  // Step 4 — Preferences
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notifications, setNotifications] = useState({
    product: true,
    weekly: true,
    marketing: false,
  });
  const [timezone, setTimezone] = useState("America/New_York");

  useEffect(() => {
    const saved = localStorage.getItem("solaris-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("solaris-theme", next ? "dark" : "light");
  };

  const goNext = () => {
    if (step >= 6) return;
    setAnimating(true);
    setTimeout(() => {
      setStep(((step + 1) as Step));
      setAnimating(false);
    }, 180);
  };

  const goBack = () => {
    if (step <= 1) return;
    setAnimating(true);
    setTimeout(() => {
      setStep(((step - 1) as Step));
      setAnimating(false);
    }, 180);
  };

  const canAdvance = () => {
    if (step === 1) return companyName.trim().length > 1;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return true;
    if (step === 5) return true;
    return false;
  };

  const updateTeammate = (i: number, patch: Partial<Teammate>) => {
    setTeammates((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  };

  const addTeammate = () => {
    setTeammates((prev) => [...prev, { email: "", role: "editor" }]);
  };

  const removeTeammate = (i: number) => {
    setTeammates((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-600 text-lg font-bold text-white shadow-lg shadow-violet-500/30">
            S
          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold">Solaris</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Setting up your workspace
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleDark}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          aria-label="Toggle dark mode"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </header>

      {step < 6 && (
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span>
              Step {step} of 5 · {STEP_LABELS[step - 1]}
            </span>
            <span>{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <div className="mt-3 hidden items-center justify-between sm:flex">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const active = n === step;
              const done = n < step;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition ${
                      done
                        ? "bg-indigo-500 text-white"
                        : active
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                    }`}
                  >
                    {done ? "✓" : n}
                  </div>
                  <span
                    className={`text-xs ${
                      active || done
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <section
        className={`flex flex-col gap-6 transition-all duration-200 ${
          animating ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        {step === 1 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="text-4xl">👋</div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Tell us about your company
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              We&apos;ll tailor the workspace and defaults to match.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel>Company name</FieldLabel>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Robotics"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
              <div>
                <FieldLabel>Team size</FieldLabel>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value as typeof companySize)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="1-10">1–10</option>
                  <option value="11-50">11–50</option>
                  <option value="51-200">51–200</option>
                  <option value="200+">200+</option>
                </select>
              </div>
              <div>
                <FieldLabel>Industry</FieldLabel>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option>SaaS</option>
                  <option>E-commerce</option>
                  <option>Healthcare</option>
                  <option>Financial Services</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Your role</FieldLabel>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option>Founder</option>
                  <option>Engineering Lead</option>
                  <option>Product Manager</option>
                  <option>Operations</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="text-4xl">👥</div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Invite your team
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Add up to 5 teammates now or skip and do it later.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {teammates.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="email"
                    value={t.email}
                    onChange={(e) => updateTeammate(i, { email: e.target.value })}
                    placeholder="teammate@company.com"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  />
                  <select
                    value={t.role}
                    onChange={(e) =>
                      updateTeammate(i, { role: e.target.value as Teammate["role"] })
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeTeammate(i)}
                    className="rounded-xl px-2 text-slate-400 hover:text-rose-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {teammates.length < 5 && (
                <button
                  type="button"
                  onClick={addTeammate}
                  className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400"
                >
                  + Add teammate
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="text-4xl">🔌</div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Connect your tools
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Pick the integrations you want to enable. You can change this anytime.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {INTEGRATIONS.map((i) => {
                const on = enabled[i.id] ?? false;
                return (
                  <button
                    key={i.id}
                    type="button"
                    onClick={() => setEnabled((prev) => ({ ...prev, [i.id]: !prev[i.id] }))}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      on
                        ? "border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl shadow-sm dark:bg-slate-900">
                        {i.emoji}
                      </span>
                      <div>
                        <div className="font-semibold">{i.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {i.description}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`relative h-6 w-11 rounded-full transition ${
                        on ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition ${
                          on ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="text-4xl">⚙️</div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Your preferences
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              A few defaults to get you started. Everything is changeable later.
            </p>
            <div className="mt-6 flex flex-col gap-6">
              <div>
                <FieldLabel>Default theme</FieldLabel>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${
                        theme === t
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 ring-2 ring-indigo-500/20 dark:text-indigo-300"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <FieldLabel>Timezone</FieldLabel>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option>America/New_York</option>
                  <option>America/Chicago</option>
                  <option>America/Los_Angeles</option>
                  <option>Europe/London</option>
                  <option>Europe/Berlin</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              <div>
                <FieldLabel>Notifications</FieldLabel>
                <div className="mt-2 flex flex-col gap-2">
                  <Checkbox
                    checked={notifications.product}
                    onChange={(v) => setNotifications({ ...notifications, product: v })}
                    label="Product updates"
                    description="New features, changelog, and release notes"
                  />
                  <Checkbox
                    checked={notifications.weekly}
                    onChange={(v) => setNotifications({ ...notifications, weekly: v })}
                    label="Weekly digest"
                    description="Summary of team activity every Monday"
                  />
                  <Checkbox
                    checked={notifications.marketing}
                    onChange={(v) => setNotifications({ ...notifications, marketing: v })}
                    label="Marketing"
                    description="Occasional product tips and customer stories"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="text-4xl">🚀</div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to launch
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Review your setup. You can change anything from your workspace settings.
            </p>
            <div className="mt-6 space-y-4 text-sm">
              <ReviewRow label="Company">
                {companyName || "(not set)"} · {industry} · {companySize} people
              </ReviewRow>
              <ReviewRow label="Your role">{role}</ReviewRow>
              <ReviewRow label="Teammates invited">
                {teammates.filter((t) => t.email).length || "None yet"}
              </ReviewRow>
              <ReviewRow label="Integrations">
                {Object.entries(enabled)
                  .filter(([, v]) => v)
                  .map(([k]) => INTEGRATIONS.find((i) => i.id === k)?.name)
                  .filter(Boolean)
                  .join(" · ") || "None"}
              </ReviewRow>
              <ReviewRow label="Theme">{theme}</ReviewRow>
              <ReviewRow label="Timezone">{timezone}</ReviewRow>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900 sm:px-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-5xl dark:bg-emerald-500/10">
              ✨
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome to Solaris, {companyName || "friend"}!
            </h1>
            <p className="max-w-md text-slate-600 dark:text-slate-400">
              Your workspace is ready. We&apos;ve sent an invite to the team and set up your integrations.
            </p>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              Run onboarding again
            </button>
          </div>
        )}
      </section>

      {step < 6 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
          >
            {step === 5 ? "Launch workspace →" : "Continue →"}
          </button>
        </div>
      )}

      <footer className="mt-16 text-center text-xs text-slate-400">
        Demo product — client-side only, nothing is actually sent. © {new Date().getFullYear()} Solaris.
      </footer>
    </main>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {children}
    </span>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-indigo-600"
      />
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{description}</div>
      </div>
    </label>
  );
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-right font-medium text-slate-900 dark:text-white">{children}</span>
    </div>
  );
}
