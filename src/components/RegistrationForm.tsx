"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HOW_HEARD,
  SECTORS,
  STAGES,
  STAKEHOLDER_TYPES,
  fieldGroupFor,
  type StakeholderType,
} from "@/lib/stakeholders";

type Props = {
  initialType?: string;
  compact?: boolean;
};

type FieldErrors = Record<string, string>;

export function RegistrationForm({ initialType, compact }: Props) {
  const router = useRouter();
  const parsedInitial = STAKEHOLDER_TYPES.includes(
    initialType as StakeholderType,
  )
    ? (initialType as StakeholderType)
    : "";

  const [stakeholderType, setStakeholderType] = useState<string>(parsedInitial);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<FieldErrors>({});

  const group = useMemo(
    () =>
      stakeholderType
        ? fieldGroupFor(stakeholderType as StakeholderType)
        : null,
    [stakeholderType],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setFields({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, unknown> = {};

    fd.forEach((value, key) => {
      if (typeof value === "string") payload[key] = value;
    });

    // Checkboxes
    payload.consent = fd.get("consent") === "on";
    payload.pitchCompetition = fd.get("pitchCompetition") === "on";
    payload.podcastInterest = fd.get("podcastInterest") === "on";
    payload.pitchPanels = fd.get("pitchPanels") === "on";
    payload.coInvestment = fd.get("coInvestment") === "on";
    payload.emergingManager = fd.get("emergingManager") === "on";
    payload.dealFlow = fd.get("dealFlow") === "on";
    payload.source = "website-join";

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        fields?: FieldErrors;
        redirect?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "We could not submit your application.");
        if (data.fields) setFields(data.fields);
        return;
      }

      setStatus("success");
      const isFounder =
        stakeholderType === "Founder" ||
        stakeholderType === "Startup Team Member";
      router.push(
        data.redirect ||
          (isFounder ? "/application-received" : "/thank-you"),
      );
    } catch {
      setStatus("error");
      setError(
        "We could not submit your application. Your information may be saved on this device. Please try again.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`relative space-y-6 ${compact ? "" : "rounded-3xl border border-border bg-paper p-6 sm:p-8 md:p-10"}`}
      noValidate
    >
      {/* Honeypot */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label className="label-field" htmlFor="stakeholderType">
          How would you like to participate? *
        </label>
        <select
          id="stakeholderType"
          name="stakeholderType"
          required
          className="input-field"
          value={stakeholderType}
          onChange={(e) => setStakeholderType(e.target.value)}
          aria-invalid={!!fields.stakeholderType}
        >
          <option value="">Select a category</option>
          {STAKEHOLDER_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {fields.stakeholderType && (
          <p className="mt-1 text-sm text-error">{fields.stakeholderType}</p>
        )}
      </div>

      {stakeholderType && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="fullName"
              label="Full name *"
              name="fullName"
              required
              error={fields.fullName}
              autoComplete="name"
            />
            <Field
              id="email"
              label="Email *"
              name="email"
              type="email"
              required
              error={fields.email}
              autoComplete="email"
            />
            <Field
              id="phone"
              label="Mobile number *"
              name="phone"
              type="tel"
              required
              error={fields.phone}
              autoComplete="tel"
            />
            <Field
              id="organisation"
              label="Organisation"
              name="organisation"
              error={fields.organisation}
              autoComplete="organization"
            />
            <Field
              id="country"
              label="Country *"
              name="country"
              required
              error={fields.country}
              autoComplete="country-name"
            />
            <Field
              id="city"
              label="City *"
              name="city"
              required
              error={fields.city}
              autoComplete="address-level2"
            />
            <Field
              id="designation"
              label="Designation / role"
              name="designation"
              error={fields.designation}
            />
            <Field
              id="linkedin"
              label="LinkedIn URL"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/..."
              error={fields.linkedin}
            />
          </div>

          {group === "founder" && (
            <fieldset className="space-y-5 rounded-2xl border border-border bg-ivory/50 p-5">
              <legend className="px-1 text-sm font-medium text-moss">
                Founder details
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="startupName"
                  label="Startup name"
                  name="startupName"
                />
                <Field
                  id="websiteUrl"
                  label="Website"
                  name="websiteUrl"
                  type="url"
                />
                <SelectField
                  id="sector"
                  label="Sector"
                  name="sector"
                  options={SECTORS}
                />
                <SelectField
                  id="stage"
                  label="Stage"
                  name="stage"
                  options={STAGES}
                />
                <Field id="yearFounded" label="Year founded" name="yearFounded" />
                <Field id="teamSize" label="Team size" name="teamSize" />
                <Field
                  id="fundingRequired"
                  label="Funding required"
                  name="fundingRequired"
                />
                <Field
                  id="previousFunding"
                  label="Previous funding"
                  name="previousFunding"
                />
              </div>
              <TextArea
                id="businessSummary"
                label="Business summary"
                name="businessSummary"
              />
              <TextArea id="problem" label="Problem being solved" name="problem" />
              <TextArea id="traction" label="Current traction" name="traction" />
              <Field
                id="revenueRange"
                label="Revenue range"
                name="revenueRange"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <Checkbox
                  id="pitchCompetition"
                  name="pitchCompetition"
                  label="Interested in pitch competitions"
                />
                <Checkbox
                  id="podcastInterest"
                  name="podcastInterest"
                  label="Interested in the podcast"
                />
              </div>
            </fieldset>
          )}

          {group === "investor" && (
            <fieldset className="space-y-5 rounded-2xl border border-border bg-ivory/50 p-5">
              <legend className="px-1 text-sm font-medium text-moss">
                Investor preferences
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="chequeSize"
                  label="Typical cheque size"
                  name="chequeSize"
                />
                <SelectField
                  id="preferredStage"
                  label="Preferred stage"
                  name="preferredStage"
                  options={STAGES}
                />
                <Field
                  id="preferredSectors"
                  label="Preferred sectors"
                  name="preferredSectors"
                />
                <Field
                  id="preferredGeography"
                  label="Preferred geography"
                  name="preferredGeography"
                />
              </div>
              <TextArea
                id="pastInvestments"
                label="Past startup investments (optional)"
                name="pastInvestments"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <Checkbox
                  id="pitchPanels"
                  name="pitchPanels"
                  label="Interested in pitch panels"
                />
                <Checkbox
                  id="coInvestment"
                  name="coInvestment"
                  label="Interested in co-investments"
                />
                <Checkbox
                  id="podcastInterest"
                  name="podcastInterest"
                  label="Interested in podcast"
                />
              </div>
            </fieldset>
          )}

          {group === "lp" && (
            <fieldset className="space-y-5 rounded-2xl border border-border bg-ivory/50 p-5">
              <legend className="px-1 text-sm font-medium text-moss">
                LP / family office
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="organisationType"
                  label="Organisation type"
                  name="organisationType"
                />
                <Field
                  id="commitmentRange"
                  label="Typical fund commitment range"
                  name="commitmentRange"
                />
                <Field
                  id="preferredGeography"
                  label="Geographic mandate"
                  name="preferredGeography"
                />
                <Field
                  id="preferredSectors"
                  label="Sector interests"
                  name="preferredSectors"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <Checkbox
                  id="emergingManager"
                  name="emergingManager"
                  label="Interest in emerging managers"
                />
                <Checkbox
                  id="coInvestment"
                  name="coInvestment"
                  label="Co-investment interest"
                />
              </div>
            </fieldset>
          )}

          {group === "vc" && (
            <fieldset className="space-y-5 rounded-2xl border border-border bg-ivory/50 p-5">
              <legend className="px-1 text-sm font-medium text-moss">
                Venture capital fund
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="fundName" label="Fund name" name="fundName" />
                <Field id="fundSize" label="Fund size range" name="fundSize" />
                <Field
                  id="fundVintage"
                  label="Current fund vintage"
                  name="fundVintage"
                />
                <Field
                  id="chequeSize"
                  label="Typical cheque size"
                  name="chequeSize"
                />
                <Field
                  id="preferredSectors"
                  label="Sectors"
                  name="preferredSectors"
                />
                <Field
                  id="preferredGeography"
                  label="Geographies"
                  name="preferredGeography"
                />
                <Field
                  id="websiteUrl"
                  label="Website"
                  name="websiteUrl"
                  type="url"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <Checkbox
                  id="coInvestment"
                  name="coInvestment"
                  label="Co-investment interest"
                />
                <Checkbox
                  id="dealFlow"
                  name="dealFlow"
                  label="Deal-flow partnership interest"
                />
              </div>
            </fieldset>
          )}

          {group === "fof" && (
            <fieldset className="space-y-5 rounded-2xl border border-border bg-ivory/50 p-5">
              <legend className="px-1 text-sm font-medium text-moss">
                Fund of funds
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="mandate" label="Mandate" name="mandate" />
                <Field
                  id="preferredStage"
                  label="Preferred fund stage"
                  name="preferredStage"
                />
                <Field
                  id="minCommitment"
                  label="Minimum commitment"
                  name="minCommitment"
                />
                <Field
                  id="maxCommitment"
                  label="Maximum commitment"
                  name="maxCommitment"
                />
                <Field
                  id="preferredGeography"
                  label="Geographic preference"
                  name="preferredGeography"
                />
              </div>
              <Checkbox
                id="emergingManager"
                name="emergingManager"
                label="Emerging manager interest"
              />
            </fieldset>
          )}

          {group === "government" && (
            <fieldset className="space-y-5 rounded-2xl border border-border bg-ivory/50 p-5">
              <legend className="px-1 text-sm font-medium text-moss">
                Institution details
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="institution" label="Institution" name="institution" />
                <Field id="department" label="Department" name="department" />
                <Field
                  id="jurisdiction"
                  label="Jurisdiction"
                  name="jurisdiction"
                />
                <Field
                  id="areaOfInterest"
                  label="Area of interest"
                  name="areaOfInterest"
                />
              </div>
              <TextArea
                id="partnershipInterest"
                label="Partnership or programme interest"
                name="partnershipInterest"
              />
            </fieldset>
          )}

          {group === "ecosystem" && (
            <fieldset className="space-y-5 rounded-2xl border border-border bg-ivory/50 p-5">
              <legend className="px-1 text-sm font-medium text-moss">
                Ecosystem partnership
              </legend>
              <TextArea
                id="partnershipInterest"
                label="How would you like to partner?"
                name="partnershipInterest"
              />
              <Field
                id="websiteUrl"
                label="Website"
                name="websiteUrl"
                type="url"
              />
            </fieldset>
          )}

          {group === "media" && (
            <fieldset className="space-y-5 rounded-2xl border border-border bg-ivory/50 p-5">
              <legend className="px-1 text-sm font-medium text-moss">
                Media
              </legend>
              <TextArea
                id="message"
                label="Coverage interest or outlet details"
                name="message"
              />
            </fieldset>
          )}

          <SelectField
            id="howHeard"
            label="How did you hear about FundForFounders?"
            name="howHeard"
            options={HOW_HEARD}
          />

          {(group === "common" || group === "founder" || !group) && (
            <TextArea
              id="message"
              label="Optional message"
              name="message"
              error={fields.message}
            />
          )}

          {group !== "founder" && group !== "common" && group !== "media" && (
            <TextArea
              id="message"
              label="Optional message"
              name="message"
              error={fields.message}
            />
          )}

          <label className="flex items-start gap-3 text-sm text-stone">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 h-4 w-4 rounded border-border accent-forest"
            />
            <span>
              I agree to the{" "}
              <a href="/privacy" className="text-forest underline">
                Privacy Policy
              </a>{" "}
              and consent to FundForFounders contacting me about launch updates
              and relevant opportunities. *
            </span>
          </label>
          {fields.consent && (
            <p className="text-sm text-error">{fields.consent}</p>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary focus-ring w-full sm:w-auto"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Submitting…" : "Submit registration"}
          </button>

          <p className="text-xs text-stone">
            Submission does not guarantee selection, partnership or investment.
            Nothing on this form is an offer to invest.
          </p>
        </>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  required,
  error,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label-field" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="input-field"
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}

function TextArea({
  id,
  label,
  name,
  error,
}: {
  id: string;
  label: string;
  name: string;
  error?: string;
}) {
  return (
    <div>
      <label className="label-field" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={4}
        className="input-field min-h-[7rem] resize-y"
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}

function SelectField({
  id,
  label,
  name,
  options,
}: {
  id: string;
  label: string;
  name: string;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="label-field" htmlFor={id}>
        {label}
      </label>
      <select id={id} name={name} className="input-field" defaultValue="">
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  id,
  name,
  label,
}: {
  id: string;
  name: string;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        id={id}
        name={name}
        className="h-4 w-4 rounded border-border accent-forest"
      />
      {label}
    </label>
  );
}
