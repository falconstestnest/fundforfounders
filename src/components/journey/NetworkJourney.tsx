"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { StakeholderType } from "@/lib/registration-schema";
import {
  ROLE_CHOICES,
  clearDraft,
  loadDraft,
  partnerCopy,
  saveDraft,
  trackForType,
  type JourneyTrack,
} from "@/lib/journey";
import { ProgressBar } from "./ProgressBar";
import { JourneyChoice, JourneyField } from "./JourneyField";

type Props = { initialType?: string };

type Data = Record<string, string | boolean | undefined>;

const FOUNDER_STEPS = [
  "Intent",
  "You",
  "Company",
  "Stage",
  "Traction",
  "Ask",
  "Review",
] as const;

const PARTNER_STEPS = ["Context", "You", "Fit", "Review"] as const;

const EXTRA_TYPES: StakeholderType[] = [
  "Startup Team Member",
  "HNI",
  "International Investor",
  "Public Institution",
  "Incubator",
  "Accelerator",
  "University",
  "Mentor",
  "Service Provider",
  "Other",
];

function isType(t?: string): t is StakeholderType {
  return (
    ROLE_CHOICES.some((r) => r.type === t) ||
    EXTRA_TYPES.includes(t as StakeholderType)
  );
}

function emailOk(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function NetworkJourney({ initialType }: Props) {
  const router = useRouter();
  const [type, setType] = useState<StakeholderType | null>(
    isType(initialType) ? initialType : null,
  );
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [autosaved, setAutosaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const track: JourneyTrack | null = type ? trackForType(type) : null;
  const isFounder = track === "founder";
  const steps = isFounder ? FOUNDER_STEPS : PARTNER_STEPS;
  const total = steps.length;

  // Restore draft after mount (client-only storage)
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      const draft = loadDraft();
      if (draft && (!initialType || draft.stakeholderType === initialType)) {
        setType(draft.stakeholderType);
        setStep(Math.min(Math.max(0, draft.step), 20));
        setData(draft.data as Data);
      } else if (isType(initialType)) {
        setType(initialType);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [initialType]);

  // Autosave
  useEffect(() => {
    if (!hydrated || !type) return;
    const t = window.setTimeout(() => {
      saveDraft({
        version: 1,
        stakeholderType: type,
        step,
        updatedAt: new Date().toISOString(),
        data,
      });
      setAutosaved(true);
      window.setTimeout(() => setAutosaved(false), 1500);
    }, 400);
    return () => window.clearTimeout(t);
  }, [type, step, data, hydrated]);

  const set = useCallback((key: string, value: string | boolean) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  const str = (k: string) => String(data[k] ?? "");

  function validateStep(): boolean {
    const e: Record<string, string> = {};
    if (!type) return false;

    if (isFounder) {
      if (step === 1) {
        if (str("fullName").trim().length < 2)
          e.fullName = "Your name, please.";
        if (!emailOk(str("email")))
          e.email = "A valid email helps us reach you.";
        if (str("mobile").replace(/\D/g, "").length < 8)
          e.mobile = "Include a working mobile number.";
        if (str("city").trim().length < 2) e.city = "Which city are you in?";
        if (str("country").trim().length < 2) e.country = "Which country?";
      }
      if (step === 2) {
        if (str("startupName").trim().length < 2)
          e.startupName = "What is the company called?";
        if (str("problem").trim().length < 20)
          e.problem = "In a few sentences — what problem are you solving?";
      }
      if (step === 3) {
        if (!str("stage")) e.stage = "Select a stage.";
        if (!str("sector")) e.sector = "Select a sector.";
      }
      if (step === 4) {
        if (str("businessSummary").trim().length < 30)
          e.businessSummary = "Give us a bit more on what you are building.";
      }
      if (step === 6) {
        if (data.consent !== true)
          e.consent = "Please accept the privacy notice to continue.";
      }
    } else {
      if (step === 1) {
        if (str("fullName").trim().length < 2)
          e.fullName = "Your name, please.";
        if (!emailOk(str("email")))
          e.email = "A valid work email is preferred.";
        if (str("mobile").replace(/\D/g, "").length < 8)
          e.mobile = "Include a mobile number.";
        if (str("city").trim().length < 2) e.city = "Which city?";
        if (str("country").trim().length < 2) e.country = "Which country?";
      }
      if (step === 2) {
        if (track === "vc" && str("fundName").trim().length < 2)
          e.fundName = "Fund name helps us brief the right people.";
        if (track === "government" && str("institution").trim().length < 2)
          e.institution = "Institution name is required.";
      }
      if (step === 3) {
        if (data.consent !== true)
          e.consent = "Please accept the privacy notice to continue.";
      }
    }

    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(first)?.focus();
      return false;
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, total - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!type || !validateStep()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const payload = {
        ...data,
        stakeholderType: type,
        websiteHoneypot: "",
        consent: data.consent === true,
      };
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await res.json()) as {
        ok: boolean;
        error?: string;
        redirect?: string;
        fields?: Record<string, string>;
      };
      if (!res.ok || !result.ok) {
        if (result.fields) setErrors(result.fields);
        setServerError(
          result.error || "Something went wrong. Please try again.",
        );
        return;
      }
      clearDraft();
      router.push(
        result.redirect ||
          (isFounder ? "/application-received" : "/thank-you"),
      );
    } catch {
      setServerError("Network error. Your progress is saved on this device.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="journey-shell" aria-busy="true">
        <div className="h-2 w-24 animate-pulse rounded bg-border" />
        <div className="mt-6 h-8 w-3/4 max-w-xs animate-pulse rounded bg-border" />
        <div className="mt-4 h-4 w-full max-w-sm animate-pulse rounded bg-border" />
      </div>
    );
  }

  // Role select
  if (!type) {
    const capital = ROLE_CHOICES.filter((r) => r.group === "capital");
    const institution = ROLE_CHOICES.filter((r) => r.group === "institution");
    const ecosystem = ROLE_CHOICES.filter((r) => r.group === "ecosystem");
    const founder = ROLE_CHOICES.filter((r) => r.group === "founder");

    return (
      <div className="journey-shell">
        <p className="eyebrow">Start here</p>
        <h1 className="mt-3 text-[1.625rem] font-medium leading-tight tracking-tight text-ink sm:text-3xl">
          How do you want to show up?
        </h1>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-stone">
          One path at a time. We only ask what matters for your seat — and save
          progress as you go.
        </p>

        <div className="mt-8 space-y-8">
          <RoleGroup
            label="Founders"
            roles={founder}
            onPick={(t) => {
              setType(t);
              setStep(0);
              setData({});
              setErrors({});
            }}
          />
          <RoleGroup
            label="Capital partners"
            roles={capital}
            onPick={(t) => {
              setType(t);
              setStep(0);
              setData({});
              setErrors({});
            }}
          />
          <RoleGroup
            label="Institutions"
            roles={institution}
            onPick={(t) => {
              setType(t);
              setStep(0);
              setData({});
              setErrors({});
            }}
          />
          <RoleGroup
            label="Ecosystem"
            roles={ecosystem}
            onPick={(t) => {
              setType(t);
              setStep(0);
              setData({});
              setErrors({});
            }}
          />
        </div>

        <p className="mt-8 text-xs leading-relaxed text-stone">
          Not a mass waitlist. A structured introduction to a founder-first
          network under formation.
        </p>
      </div>
    );
  }

  const copy = partnerCopy(type);

  return (
    <div className="journey-shell">
      <div className="mb-2 flex items-center justify-between gap-3">
        <button
          type="button"
          className="focus-ring min-h-11 rounded px-1 text-sm font-medium text-stone"
          onClick={() => {
            if (step === 0) {
              setType(null);
              clearDraft();
            } else back();
          }}
        >
          ← Back
        </button>
        {autosaved && (
          <span className="text-xs text-forest" aria-live="polite">
            Saved
          </span>
        )}
      </div>

      <ProgressBar step={step} total={total} label={steps[step]} />

      {isFounder ? (
        <FounderSteps
          step={step}
          data={data}
          str={str}
          set={set}
          errors={errors}
          type={type}
        />
      ) : (
        <PartnerSteps
          step={step}
          data={data}
          str={str}
          set={set}
          errors={errors}
          type={type}
          track={track!}
          copy={copy}
        />
      )}

      {serverError && (
        <p className="alert-in mt-4 text-sm text-error" role="alert">
          {serverError}
        </p>
      )}

      <div className="journey-actions sticky bottom-0 -mx-1 mt-8 flex gap-3 border-t border-border bg-ivory/95 px-1 pt-4 backdrop-blur-md pb-[max(1rem,env(safe-area-inset-bottom))]">
        {step < total - 1 ? (
          <button
            type="button"
            className="btn-primary focus-ring min-h-12 flex-1 text-base sm:text-sm"
            onClick={next}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            className={`btn-primary focus-ring min-h-12 flex-1 text-base sm:text-sm ${submitting ? "is-loading" : ""}`}
            disabled={submitting}
            onClick={submit}
          >
            {submitting ? (
              <>
                <span className="btn-spinner" aria-hidden />
                Submitting…
              </>
            ) : isFounder ? (
              "Submit application"
            ) : (
              "Submit interest"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function RoleGroup({
  label,
  roles,
  onPick,
}: {
  label: string;
  roles: (typeof ROLE_CHOICES)[number][];
  onPick: (t: StakeholderType) => void;
}) {
  if (!roles.length) return null;
  return (
    <div>
      <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-stone">
        {label}
      </p>
      <div className="flex flex-col gap-2.5">
        {roles.map((r) => (
          <JourneyChoice
            key={r.type}
            title={r.title}
            subtitle={r.subtitle}
            onClick={() => onPick(r.type)}
          />
        ))}
      </div>
    </div>
  );
}

function CheckRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-h-12 items-start gap-3 py-1 text-sm leading-snug text-ink">
      <input
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 accent-forest"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}

function FounderSteps({
  step,
  data,
  str,
  set,
  errors,
  type,
}: {
  step: number;
  data: Data;
  str: (k: string) => string;
  set: (k: string, v: string | boolean) => void;
  errors: Record<string, string>;
  type: StakeholderType;
}) {
  if (step === 0) {
    return (
      <div>
        <h2 className="text-[1.375rem] font-medium leading-snug tracking-tight text-ink sm:text-2xl">
          Building something the world needs?
        </h2>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">
          This is not a bulk form. A few focused questions — so we understand
          you as a founder, not as a row in a spreadsheet.
        </p>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">
          About five minutes. Progress saves on this device automatically.
        </p>
        <p className="mt-6 text-sm text-ink">
          Applying as <strong className="font-medium">{type}</strong>.
        </p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
          First, who are you?
        </h2>
        <p className="mb-6 mt-2 text-sm text-stone">
          So we can reach you personally.
        </p>
        <JourneyField label="Full name" error={errors.fullName} htmlFor="fullName">
          <input
            id="fullName"
            className="input-field"
            autoComplete="name"
            value={str("fullName")}
            onChange={(e) => set("fullName", e.target.value)}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
        </JourneyField>
        <JourneyField label="Email" error={errors.email} htmlFor="email">
          <input
            id="email"
            type="email"
            inputMode="email"
            className="input-field"
            autoComplete="email"
            value={str("email")}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
        </JourneyField>
        <JourneyField label="Mobile" error={errors.mobile} htmlFor="mobile">
          <input
            id="mobile"
            type="tel"
            inputMode="tel"
            className="input-field"
            autoComplete="tel"
            value={str("mobile")}
            onChange={(e) => set("mobile", e.target.value)}
            aria-invalid={!!errors.mobile}
          />
        </JourneyField>
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
          <JourneyField label="City" error={errors.city} htmlFor="city">
            <input
              id="city"
              className="input-field"
              autoComplete="address-level2"
              value={str("city")}
              onChange={(e) => set("city", e.target.value)}
              aria-invalid={!!errors.city}
            />
          </JourneyField>
          <JourneyField label="Country" error={errors.country} htmlFor="country">
            <input
              id="country"
              className="input-field"
              autoComplete="country-name"
              value={str("country")}
              onChange={(e) => set("country", e.target.value)}
              aria-invalid={!!errors.country}
            />
          </JourneyField>
        </div>
        <JourneyField
          label="LinkedIn (optional)"
          htmlFor="linkedin"
          hint="Helps us understand your background."
        >
          <input
            id="linkedin"
            className="input-field"
            inputMode="url"
            autoComplete="url"
            placeholder="https://linkedin.com/in/…"
            value={str("linkedin")}
            onChange={(e) => set("linkedin", e.target.value)}
          />
        </JourneyField>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
          What are you building?
        </h2>
        <p className="mb-6 mt-2 text-sm text-stone">
          Start with the human problem — not the pitch deck.
        </p>
        <JourneyField
          label="Company name"
          error={errors.startupName}
          htmlFor="startupName"
        >
          <input
            id="startupName"
            className="input-field"
            value={str("startupName")}
            onChange={(e) => set("startupName", e.target.value)}
            aria-invalid={!!errors.startupName}
          />
        </JourneyField>
        <JourneyField
          label="What problem are you solving?"
          error={errors.problem}
          htmlFor="problem"
          hint="Plain language. Who hurts today, and why?"
        >
          <textarea
            id="problem"
            rows={4}
            className="input-field min-h-[7rem] resize-y"
            value={str("problem")}
            onChange={(e) => set("problem", e.target.value)}
            aria-invalid={!!errors.problem}
          />
        </JourneyField>
        <JourneyField label="Website (optional)" htmlFor="website">
          <input
            id="website"
            className="input-field"
            inputMode="url"
            placeholder="https://"
            value={str("website")}
            onChange={(e) => set("website", e.target.value)}
          />
        </JourneyField>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div>
        <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
          Where are you now?
        </h2>
        <p className="mb-6 mt-2 text-sm text-stone">
          Stage and category — keep it simple.
        </p>
        <p className="mb-3 text-sm font-medium text-ink">Stage</p>
        <div className="mb-6 flex flex-col gap-2">
          {["Idea", "Pre-seed", "Seed", "Series A+", "Other"].map((s) => (
            <JourneyChoice
              key={s}
              title={s}
              selected={str("stage") === s}
              onClick={() => set("stage", s)}
            />
          ))}
          {errors.stage && (
            <p className="text-sm text-error" role="alert">
              {errors.stage}
            </p>
          )}
        </div>
        <JourneyField label="Sector" error={errors.sector} htmlFor="sector">
          <select
            id="sector"
            className="input-field"
            value={str("sector")}
            onChange={(e) => set("sector", e.target.value)}
            aria-invalid={!!errors.sector}
          >
            <option value="">Select…</option>
            {[
              "Technology / AI",
              "Consumer",
              "Healthcare",
              "Climate",
              "Fintech",
              "Agriculture",
              "Education",
              "Logistics",
              "Manufacturing",
              "Other",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </JourneyField>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div>
        <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
          Traction and clarity
        </h2>
        <p className="mb-6 mt-2 text-sm text-stone">
          What exists today? Customers, revenue, pilots, waitlists — or honest
          early stage.
        </p>
        <JourneyField
          label="In one paragraph, what are you building?"
          error={errors.businessSummary}
          htmlFor="businessSummary"
        >
          <textarea
            id="businessSummary"
            rows={4}
            className="input-field min-h-[7rem] resize-y"
            value={str("businessSummary")}
            onChange={(e) => set("businessSummary", e.target.value)}
            aria-invalid={!!errors.businessSummary}
          />
        </JourneyField>
        <JourneyField label="Current traction (optional)" htmlFor="traction">
          <textarea
            id="traction"
            rows={3}
            className="input-field min-h-[5rem] resize-y"
            placeholder="Users, revenue, LOIs, pilots…"
            value={str("traction")}
            onChange={(e) => set("traction", e.target.value)}
          />
        </JourneyField>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div>
        <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
          How can we help?
        </h2>
        <p className="mb-6 mt-2 text-sm text-stone">
          Optional. Helps us route your application.
        </p>
        <JourneyField
          label="Funding you are raising (optional)"
          htmlFor="fundingRequired"
        >
          <input
            id="fundingRequired"
            className="input-field"
            placeholder="e.g. $300k pre-seed"
            value={str("fundingRequired")}
            onChange={(e) => set("fundingRequired", e.target.value)}
          />
        </JourneyField>
        <CheckRow
          checked={data.interestedInPitchCompetition === true}
          onChange={(v) => set("interestedInPitchCompetition", v)}
        >
          Interested in pitch competitions
        </CheckRow>
        <CheckRow
          checked={data.interestedInPodcast === true}
          onChange={(v) => set("interestedInPodcast", v)}
        >
          Open to the podcast
        </CheckRow>
      </div>
    );
  }

  // Review
  return (
    <div>
      <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
        Ready to submit?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone">
        A human will read this. Submission does not guarantee selection or
        investment.
      </p>
      <dl className="mt-6 space-y-3 rounded-xl border border-border bg-paper p-4 text-sm">
        <div>
          <dt className="text-stone">Name</dt>
          <dd className="font-medium text-ink">{str("fullName")}</dd>
        </div>
        <div>
          <dt className="text-stone">Company</dt>
          <dd className="font-medium text-ink">{str("startupName")}</dd>
        </div>
        <div>
          <dt className="text-stone">Stage · Sector</dt>
          <dd className="font-medium text-ink">
            {str("stage")} · {str("sector")}
          </dd>
        </div>
        <div>
          <dt className="text-stone">Location</dt>
          <dd className="font-medium text-ink">
            {str("city")}, {str("country")}
          </dd>
        </div>
      </dl>
      <label className="mt-6 flex min-h-12 items-start gap-3 text-sm leading-snug text-stone">
        <input
          id="consent"
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 accent-forest"
          checked={data.consent === true}
          onChange={(e) => set("consent", e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="/privacy" className="text-forest underline">
            Privacy Policy
          </a>{" "}
          and understand FundForFounders is under development.
        </span>
      </label>
      {errors.consent && (
        <p className="mt-2 text-sm text-error" role="alert">
          {errors.consent}
        </p>
      )}
    </div>
  );
}

function PartnerSteps({
  step,
  data,
  str,
  set,
  errors,
  type,
  track,
  copy,
}: {
  step: number;
  data: Data;
  str: (k: string) => string;
  set: (k: string, v: string | boolean) => void;
  errors: Record<string, string>;
  type: StakeholderType;
  track: JourneyTrack;
  copy: { greeting: string; promise: string; reviewNote: string };
}) {
  if (step === 0) {
    return (
      <div>
        <p className="eyebrow">Partnership interest</p>
        <h2 className="mt-3 text-[1.375rem] font-medium leading-snug tracking-tight text-ink sm:text-2xl">
          {copy.greeting}
        </h2>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">
          {copy.promise}
        </p>
        <p className="mt-6 text-sm text-ink">
          Path: <strong className="font-medium">{type}</strong>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-stone">
          Three short steps. Your answers stay confidential and shape how we
          follow up — if at all.
        </p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
          How should we address you?
        </h2>
        <p className="mb-6 mt-2 text-sm text-stone">
          Institutional introductions stay confidential.
        </p>
        <JourneyField label="Full name" error={errors.fullName} htmlFor="fullName">
          <input
            id="fullName"
            className="input-field"
            autoComplete="name"
            value={str("fullName")}
            onChange={(e) => set("fullName", e.target.value)}
            aria-invalid={!!errors.fullName}
          />
        </JourneyField>
        <JourneyField label="Work email" error={errors.email} htmlFor="email">
          <input
            id="email"
            type="email"
            inputMode="email"
            className="input-field"
            autoComplete="email"
            value={str("email")}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
        </JourneyField>
        <JourneyField label="Mobile" error={errors.mobile} htmlFor="mobile">
          <input
            id="mobile"
            type="tel"
            inputMode="tel"
            className="input-field"
            autoComplete="tel"
            value={str("mobile")}
            onChange={(e) => set("mobile", e.target.value)}
            aria-invalid={!!errors.mobile}
          />
        </JourneyField>
        <JourneyField
          label={
            track === "vc"
              ? "Firm (if different from fund)"
              : track === "government"
                ? "Role / designation (optional)"
                : "Organisation"
          }
          htmlFor="organisation"
        >
          <input
            id="organisation"
            className="input-field"
            autoComplete="organization"
            value={str("organisation")}
            onChange={(e) => set("organisation", e.target.value)}
          />
        </JourneyField>
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
          <JourneyField label="City" error={errors.city} htmlFor="city">
            <input
              id="city"
              className="input-field"
              autoComplete="address-level2"
              value={str("city")}
              onChange={(e) => set("city", e.target.value)}
              aria-invalid={!!errors.city}
            />
          </JourneyField>
          <JourneyField label="Country" error={errors.country} htmlFor="country">
            <input
              id="country"
              className="input-field"
              autoComplete="country-name"
              value={str("country")}
              onChange={(e) => set("country", e.target.value)}
              aria-invalid={!!errors.country}
            />
          </JourneyField>
        </div>
        <JourneyField label="LinkedIn (optional)" htmlFor="linkedin">
          <input
            id="linkedin"
            className="input-field"
            inputMode="url"
            value={str("linkedin")}
            onChange={(e) => set("linkedin", e.target.value)}
          />
        </JourneyField>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
          How do you partner?
        </h2>
        <p className="mb-6 mt-2 text-sm text-stone">
          Only the questions that fit your seat.
        </p>

        {track === "angel" && (
          <>
            <JourneyField label="Typical cheque size" htmlFor="chequeSize">
              <input
                id="chequeSize"
                className="input-field"
                placeholder="e.g. $25k – $100k"
                value={str("chequeSize")}
                onChange={(e) => set("chequeSize", e.target.value)}
              />
            </JourneyField>
            <JourneyField label="Preferred stages" htmlFor="preferredStage">
              <input
                id="preferredStage"
                className="input-field"
                placeholder="Pre-seed, seed…"
                value={str("preferredStage")}
                onChange={(e) => set("preferredStage", e.target.value)}
              />
            </JourneyField>
            <JourneyField
              label="Sectors of interest"
              htmlFor="preferredSectors"
            >
              <input
                id="preferredSectors"
                className="input-field"
                value={str("preferredSectors")}
                onChange={(e) => set("preferredSectors", e.target.value)}
              />
            </JourneyField>
            <JourneyField
              label="Geography (optional)"
              htmlFor="preferredGeography"
            >
              <input
                id="preferredGeography"
                className="input-field"
                placeholder="India, MENA, global…"
                value={str("preferredGeography")}
                onChange={(e) => set("preferredGeography", e.target.value)}
              />
            </JourneyField>
            <CheckRow
              checked={data.interestedInCoInvest === true}
              onChange={(v) => set("interestedInCoInvest", v)}
            >
              Open to co-investments
            </CheckRow>
            <CheckRow
              checked={data.interestedInPitchPanels === true}
              onChange={(v) => set("interestedInPitchPanels", v)}
            >
              Willing to join pitch panels
            </CheckRow>
          </>
        )}

        {track === "vc" && (
          <>
            <JourneyField
              label="Fund name"
              error={errors.fundName}
              htmlFor="fundName"
            >
              <input
                id="fundName"
                className="input-field"
                value={str("fundName")}
                onChange={(e) => set("fundName", e.target.value)}
                aria-invalid={!!errors.fundName}
              />
            </JourneyField>
            <JourneyField label="Fund size range" htmlFor="fundSizeRange">
              <input
                id="fundSizeRange"
                className="input-field"
                placeholder="e.g. $20–50M"
                value={str("fundSizeRange")}
                onChange={(e) => set("fundSizeRange", e.target.value)}
              />
            </JourneyField>
            <JourneyField label="Typical cheque" htmlFor="typicalCheque">
              <input
                id="typicalCheque"
                className="input-field"
                value={str("typicalCheque")}
                onChange={(e) => set("typicalCheque", e.target.value)}
              />
            </JourneyField>
            <JourneyField label="Stages" htmlFor="investmentStages">
              <input
                id="investmentStages"
                className="input-field"
                placeholder="Pre-seed, seed, Series A…"
                value={str("investmentStages")}
                onChange={(e) => set("investmentStages", e.target.value)}
              />
            </JourneyField>
            <JourneyField label="Geographies" htmlFor="geographies">
              <input
                id="geographies"
                className="input-field"
                value={str("geographies")}
                onChange={(e) => set("geographies", e.target.value)}
              />
            </JourneyField>
            <CheckRow
              checked={data.coInvestmentInterest === true}
              onChange={(v) => set("coInvestmentInterest", v)}
            >
              Co-investment interest
            </CheckRow>
            <CheckRow
              checked={data.dealFlowPartnership === true}
              onChange={(v) => set("dealFlowPartnership", v)}
            >
              Deal-flow partnership
            </CheckRow>
          </>
        )}

        {track === "lp" && (
          <>
            <JourneyField
              label="Typical fund commitment range"
              htmlFor="commitmentRange"
              hint="Indicative only — not a commitment."
            >
              <input
                id="commitmentRange"
                className="input-field"
                placeholder="e.g. $1–5M"
                value={str("commitmentRange")}
                onChange={(e) => set("commitmentRange", e.target.value)}
              />
            </JourneyField>
            <JourneyField
              label="Preferred fund stages"
              htmlFor="preferredFundStages"
            >
              <input
                id="preferredFundStages"
                className="input-field"
                placeholder="Emerging managers, Fund I/II…"
                value={str("preferredFundStages")}
                onChange={(e) => set("preferredFundStages", e.target.value)}
              />
            </JourneyField>
            <JourneyField
              label="Geographic mandate"
              htmlFor="geographicMandate"
            >
              <input
                id="geographicMandate"
                className="input-field"
                value={str("geographicMandate")}
                onChange={(e) => set("geographicMandate", e.target.value)}
              />
            </JourneyField>
            <JourneyField label="Sector interests" htmlFor="sectorInterests">
              <input
                id="sectorInterests"
                className="input-field"
                value={str("sectorInterests")}
                onChange={(e) => set("sectorInterests", e.target.value)}
              />
            </JourneyField>
            <CheckRow
              checked={data.emergingManagerInterest === true}
              onChange={(v) => set("emergingManagerInterest", v)}
            >
              Interest in emerging managers
            </CheckRow>
            <CheckRow
              checked={data.coInvestmentInterest === true}
              onChange={(v) => set("coInvestmentInterest", v)}
            >
              Co-investment interest alongside funds
            </CheckRow>
          </>
        )}

        {track === "fo" && (
          <>
            <JourneyField
              label="Typical capital range per opportunity"
              htmlFor="capitalRange"
              hint="Direct or fund — indicative only."
            >
              <input
                id="capitalRange"
                className="input-field"
                placeholder="e.g. $250k – $2M"
                value={str("capitalRange")}
                onChange={(e) => set("capitalRange", e.target.value)}
              />
            </JourneyField>
            <JourneyField
              label="How you prefer to participate"
              htmlFor="preferredFundStages"
              hint="Direct company, funds, or both."
            >
              <input
                id="preferredFundStages"
                className="input-field"
                placeholder="Direct, funds, co-invest…"
                value={str("preferredFundStages")}
                onChange={(e) => set("preferredFundStages", e.target.value)}
              />
            </JourneyField>
            <JourneyField
              label="Geographic focus"
              htmlFor="geographicMandate"
            >
              <input
                id="geographicMandate"
                className="input-field"
                value={str("geographicMandate")}
                onChange={(e) => set("geographicMandate", e.target.value)}
              />
            </JourneyField>
            <JourneyField label="Sector interests" htmlFor="sectorInterests">
              <input
                id="sectorInterests"
                className="input-field"
                value={str("sectorInterests")}
                onChange={(e) => set("sectorInterests", e.target.value)}
              />
            </JourneyField>
            <CheckRow
              checked={data.emergingManagerInterest === true}
              onChange={(v) => set("emergingManagerInterest", v)}
            >
              Open to emerging managers
            </CheckRow>
            <CheckRow
              checked={data.coInvestmentInterest === true}
              onChange={(v) => set("coInvestmentInterest", v)}
            >
              Interested in co-invest alongside the network
            </CheckRow>
          </>
        )}

        {track === "fof" && (
          <>
            <JourneyField label="Mandate overview" htmlFor="mandate">
              <input
                id="mandate"
                className="input-field"
                placeholder="Geography, strategy, ticket…"
                value={str("mandate")}
                onChange={(e) => set("mandate", e.target.value)}
              />
            </JourneyField>
            <JourneyField
              label="Preferred fund stage"
              htmlFor="preferredFundStage"
            >
              <input
                id="preferredFundStage"
                className="input-field"
                placeholder="Fund I, II, growth…"
                value={str("preferredFundStage")}
                onChange={(e) => set("preferredFundStage", e.target.value)}
              />
            </JourneyField>
            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
              <JourneyField label="Min commitment" htmlFor="minCommitment">
                <input
                  id="minCommitment"
                  className="input-field"
                  value={str("minCommitment")}
                  onChange={(e) => set("minCommitment", e.target.value)}
                />
              </JourneyField>
              <JourneyField label="Max commitment" htmlFor="maxCommitment">
                <input
                  id="maxCommitment"
                  className="input-field"
                  value={str("maxCommitment")}
                  onChange={(e) => set("maxCommitment", e.target.value)}
                />
              </JourneyField>
            </div>
            <JourneyField
              label="Geographic preference"
              htmlFor="geographicPreference"
            >
              <input
                id="geographicPreference"
                className="input-field"
                value={str("geographicPreference")}
                onChange={(e) => set("geographicPreference", e.target.value)}
              />
            </JourneyField>
            <CheckRow
              checked={data.emergingManagerInterest === true}
              onChange={(v) => set("emergingManagerInterest", v)}
            >
              Emerging manager interest
            </CheckRow>
          </>
        )}

        {track === "government" && (
          <>
            <JourneyField
              label="Institution"
              error={errors.institution}
              htmlFor="institution"
            >
              <input
                id="institution"
                className="input-field"
                value={str("institution")}
                onChange={(e) => set("institution", e.target.value)}
                aria-invalid={!!errors.institution}
              />
            </JourneyField>
            <JourneyField label="Department" htmlFor="department">
              <input
                id="department"
                className="input-field"
                value={str("department")}
                onChange={(e) => set("department", e.target.value)}
              />
            </JourneyField>
            <JourneyField label="Designation" htmlFor="designation">
              <input
                id="designation"
                className="input-field"
                value={str("designation")}
                onChange={(e) => set("designation", e.target.value)}
              />
            </JourneyField>
            <JourneyField label="Jurisdiction" htmlFor="jurisdiction">
              <input
                id="jurisdiction"
                className="input-field"
                value={str("jurisdiction")}
                onChange={(e) => set("jurisdiction", e.target.value)}
              />
            </JourneyField>
            <JourneyField
              label="What partnership interests you?"
              htmlFor="areaOfInterest"
              hint="Programmes, events, founder support, policy dialogue…"
            >
              <textarea
                id="areaOfInterest"
                rows={3}
                className="input-field min-h-[5rem] resize-y"
                value={str("areaOfInterest")}
                onChange={(e) => set("areaOfInterest", e.target.value)}
              />
            </JourneyField>
            <CheckRow
              checked={data.partnershipInterest === true}
              onChange={(v) => set("partnershipInterest", v)}
            >
              Formal partnership exploration
            </CheckRow>
            <CheckRow
              checked={data.eventInterest === true}
              onChange={(v) => set("eventInterest", v)}
            >
              Event or programme collaboration
            </CheckRow>
          </>
        )}

        {track === "corporate" && (
          <>
            <JourneyField
              label="Innovation mandate"
              htmlFor="partnershipInterest"
              hint="What problems or categories are you exploring?"
            >
              <textarea
                id="partnershipInterest"
                rows={4}
                className="input-field min-h-[7rem] resize-y"
                value={str("partnershipInterest")}
                onChange={(e) => set("partnershipInterest", e.target.value)}
              />
            </JourneyField>
            <CheckRow
              checked={data.referralInterest === true}
              onChange={(v) => set("referralInterest", v)}
            >
              Open to startup partnerships / pilots
            </CheckRow>
            <CheckRow
              checked={data.eventCollaboration === true}
              onChange={(v) => set("eventCollaboration", v)}
            >
              Interest in events or demo days
            </CheckRow>
          </>
        )}

        {(track === "ecosystem" || track === "media" || track === "other") && (
          <>
            <JourneyField
              label="How would you like to participate?"
              htmlFor="message"
              hint="Mandate, programmes, coverage, or referral interest."
            >
              <textarea
                id="message"
                rows={4}
                className="input-field min-h-[7rem] resize-y"
                value={str("message")}
                onChange={(e) => set("message", e.target.value)}
              />
            </JourneyField>
            {track === "ecosystem" && (
              <>
                <CheckRow
                  checked={data.referralInterest === true}
                  onChange={(v) => set("referralInterest", v)}
                >
                  Interested in referring founders
                </CheckRow>
                <CheckRow
                  checked={data.eventCollaboration === true}
                  onChange={(v) => set("eventCollaboration", v)}
                >
                  Event collaboration
                </CheckRow>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  // Review
  return (
    <div>
      <h2 className="text-[1.25rem] font-medium tracking-tight text-ink sm:text-[1.375rem]">
        Confirm your interest
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-stone">{copy.reviewNote}</p>
      <p className="mt-2 text-sm text-stone">
        Not an offer, solicitation, or commitment to invest.
      </p>
      <dl className="mt-6 space-y-3 rounded-xl border border-border bg-paper p-4 text-sm">
        <div>
          <dt className="text-stone">Name</dt>
          <dd className="font-medium text-ink">{str("fullName")}</dd>
        </div>
        <div>
          <dt className="text-stone">Path</dt>
          <dd className="font-medium text-ink">{type}</dd>
        </div>
        <div>
          <dt className="text-stone">Organisation</dt>
          <dd className="font-medium text-ink">
            {str("organisation") ||
              str("fundName") ||
              str("institution") ||
              "—"}
          </dd>
        </div>
        <div>
          <dt className="text-stone">Location</dt>
          <dd className="font-medium text-ink">
            {str("city")}, {str("country")}
          </dd>
        </div>
      </dl>
      <label className="mt-6 flex min-h-12 items-start gap-3 text-sm leading-snug text-stone">
        <input
          id="consent"
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 accent-forest"
          checked={data.consent === true}
          onChange={(e) => set("consent", e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <a href="/privacy" className="text-forest underline">
            Privacy Policy
          </a>
          . This is not investment advice or a solicitation.
        </span>
      </label>
      {errors.consent && (
        <p className="mt-2 text-sm text-error" role="alert">
          {errors.consent}
        </p>
      )}
    </div>
  );
}
