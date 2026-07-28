"use client";

import {
  useMemo,
  useState,
  isValidElement,
  cloneElement,
  type ReactElement,
} from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  stakeholderTypes,
  getSchemaForType,
  type StakeholderType,
} from "@/lib/registration-schema";

type Props = {
  /** Preselect from URL ?type=Founder etc. */
  initialType?: string;
  /** Inline success vs redirect */
  onSuccessRedirect?: boolean;
};

function parseType(initialType?: string): StakeholderType | null {
  return stakeholderTypes.includes(initialType as StakeholderType)
    ? (initialType as StakeholderType)
    : null;
}

export default function RegistrationForm({
  initialType,
  onSuccessRedirect = true,
}: Props) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<StakeholderType | null>(
    () => parseType(initialType),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [pitchDeckName, setPitchDeckName] = useState("");

  const schema = useMemo(
    () => (selectedType ? getSchemaForType(selectedType) : null),
    [selectedType],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setFocus,
  } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: schema ? (zodResolver(schema as any) as any) : undefined,
    mode: "onTouched",
  });

  function focusFirstInvalid(fieldMap?: Record<string, string>) {
    const order = [
      "fullName",
      "email",
      "mobile",
      "country",
      "city",
      "startupName",
      "sector",
      "stage",
      "businessSummary",
      "problem",
      "fundName",
      "institution",
      "consent",
    ];
    const keys = fieldMap
      ? order.filter((k) => fieldMap[k])
      : order.filter((k) => errors[k as keyof typeof errors]);
    const first = keys[0];
    if (first) {
      try {
        setFocus(first as never);
      } catch {
        const el = document.getElementById(first);
        el?.focus();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = () => {
    focusFirstInvalid();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (!selectedType) return;
    setIsSubmitting(true);
    setServerError("");

    try {
      const payload = {
        ...data,
        stakeholderType: selectedType,
        pitchDeckFileName: pitchDeckName || undefined,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await res.json()) as {
        ok: boolean;
        error?: string;
        fields?: Record<string, string>;
        redirect?: string;
      };

      if (!res.ok || !result.ok) {
        if (result.fields) {
          for (const [key, message] of Object.entries(result.fields)) {
            setError(key as never, { message });
          }
          focusFirstInvalid(result.fields);
        }
        setServerError(
          result.error ||
            "We could not submit your application. Please try again.",
        );
        return;
      }

      if (onSuccessRedirect && result.redirect) {
        router.push(result.redirect);
        return;
      }

      setIsSuccess(true);
      reset();
      setPitchDeckName("");
    } catch {
      setServerError(
        "We could not submit your application. Your information may be saved on this device. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="success-panel mx-auto max-w-xl px-6 py-16 text-center">
        <div className="success-check mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest">
          <svg
            className="h-8 w-8 text-ivory"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-display mb-4 text-3xl text-ink">Thank you</h2>
        <p className="mb-8 text-lg leading-relaxed text-stone">
          We&apos;ve received your registration. You&apos;ll hear from us with
          relevant updates based on how you&apos;d like to participate.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setSelectedType(null);
          }}
          className="btn-ghost focus-ring text-forest"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {!selectedType ? (
        <div>
          <div className="mb-10 max-w-lg">
            <p className="eyebrow">Join the network</p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-ink md:text-3xl">
              How would you like to participate?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone md:text-base">
              Choose a category. Only the fields that matter for you will
              appear next.
            </p>
          </div>

          <div className="space-y-8">
            {(
              [
                {
                  label: "Build",
                  types: ["Founder", "Startup Team Member"] as const,
                },
                {
                  label: "Capital",
                  types: [
                    "Angel Investor",
                    "HNI",
                    "Limited Partner",
                    "Family Office",
                    "Venture Capital Fund",
                    "Fund of Funds",
                    "International Investor",
                  ] as const,
                },
                {
                  label: "Institutions & ecosystem",
                  types: [
                    "Government Agency",
                    "Public Institution",
                    "Incubator",
                    "Accelerator",
                    "University",
                    "Corporate Innovation Team",
                    "Mentor",
                    "Ecosystem Partner",
                    "Service Provider",
                  ] as const,
                },
                {
                  label: "Media & other",
                  types: ["Media", "Other"] as const,
                },
              ] as const
            ).map((group) => (
              <div key={group.label}>
                <p className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone">
                  {group.label}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {group.types.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className="stakeholder-type-btn focus-ring rounded border border-border bg-paper px-4 py-3.5 text-left"
                    >
                      <span className="block text-sm font-medium text-ink">
                        {type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="form-step-enter relative space-y-8 rounded border border-border bg-paper p-6 sm:p-8 md:p-10"
          noValidate
        >
          {/* Honeypot */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="websiteHoneypot">Website</label>
            <input
              type="text"
              id="websiteHoneypot"
              tabIndex={-1}
              autoComplete="off"
              {...register("websiteHoneypot")}
            />
          </div>

          <div className="flex items-center justify-between border-b border-border pb-6">
            <div>
              <p className="text-sm text-stone">Registering as</p>
              <p className="text-lg font-medium text-ink">{selectedType}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedType(null);
                reset();
                setPitchDeckName("");
                setServerError("");
              }}
              className="text-sm text-forest hover:underline focus-ring rounded"
            >
              Change
            </button>
          </div>

          <section className="space-y-5">
            <h3 className="font-display text-xl text-ink">About you</h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                name="fullName"
                label="Full name *"
                error={errMsg(errors, "fullName")}
              >
                <input
                  {...register("fullName")}
                  className={inputClass}
                  autoComplete="name"
                />
              </Field>

              <Field
                name="email"
                label="Email *"
                error={errMsg(errors, "email")}
              >
                <input
                  type="email"
                  {...register("email")}
                  className={inputClass}
                  autoComplete="email"
                />
              </Field>

              <Field
                name="mobile"
                label="Mobile number *"
                error={errMsg(errors, "mobile")}
              >
                <input
                  type="tel"
                  {...register("mobile")}
                  className={inputClass}
                  autoComplete="tel"
                />
              </Field>

              <Field
                name="country"
                label="Country *"
                error={errMsg(errors, "country")}
              >
                <input
                  {...register("country")}
                  className={inputClass}
                  autoComplete="country-name"
                />
              </Field>

              <Field label="City *" error={errMsg(errors, "city")}>
                <input
                  {...register("city")}
                  className={inputClass}
                  autoComplete="address-level2"
                  aria-invalid={!!errors.city}
                />
              </Field>

              <Field label="Organisation">
                <input
                  {...register("organisation")}
                  className={inputClass}
                  autoComplete="organization"
                />
              </Field>
            </div>

            <Field label="LinkedIn URL" error={errMsg(errors, "linkedin")}>
              <input
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/..."
                className={inputClass}
              />
            </Field>

            <Field label="How did you hear about FundForFounders?">
              <select {...register("howHeard")} className={inputClass} defaultValue="">
                <option value="">Select…</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Podcast">Podcast</option>
                <option value="Event">Event</option>
                <option value="Search">Search</option>
                <option value="Press">Press</option>
                <option value="Government / ecosystem partner">
                  Government / ecosystem partner
                </option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </section>

          {(selectedType === "Founder" ||
            selectedType === "Startup Team Member") && (
            <FounderFields
              register={register}
              errors={errors}
              pitchDeckName={pitchDeckName}
              onPitchDeck={(file) =>
                setPitchDeckName(file ? file.name : "")
              }
            />
          )}

          {(selectedType === "Angel Investor" ||
            selectedType === "HNI" ||
            selectedType === "International Investor") && (
            <InvestorFields register={register} />
          )}

          {(selectedType === "Limited Partner" ||
            selectedType === "Family Office") && (
            <LPFields register={register} />
          )}

          {selectedType === "Venture Capital Fund" && (
            <VCFields register={register} errors={errors} />
          )}

          {selectedType === "Fund of Funds" && (
            <FoFFields register={register} />
          )}

          {(selectedType === "Government Agency" ||
            selectedType === "Public Institution") && (
            <GovernmentFields register={register} errors={errors} />
          )}

          {(selectedType === "Incubator" ||
            selectedType === "Accelerator" ||
            selectedType === "University" ||
            selectedType === "Corporate Innovation Team" ||
            selectedType === "Mentor" ||
            selectedType === "Ecosystem Partner") && (
            <EcosystemFields register={register} />
          )}

          <section className="space-y-5 pt-4">
            <Field label="Anything else you’d like us to know?">
              <textarea
                {...register("message")}
                rows={4}
                className={inputClass}
              />
            </Field>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register("consent")}
                id="consent"
                className="mt-1 h-4 w-4 rounded border-border accent-forest"
              />
              <label
                htmlFor="consent"
                className="text-sm leading-relaxed text-stone"
              >
                I agree to the{" "}
                <a href="/privacy" className="text-forest underline">
                  Privacy Policy
                </a>{" "}
                and understand that FundForFounders is currently under
                development. Submission does not constitute an offer or
                commitment to invest.
              </label>
            </div>
            {errors.consent && (
              <p className="text-sm text-error">
                {errMsg(errors, "consent")}
              </p>
            )}
          </section>

          {serverError && (
            <div
              role="alert"
              className="alert-in rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error"
            >
              {serverError}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn-primary focus-ring w-full md:w-auto ${isSubmitting ? "is-loading" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner" aria-hidden />
                  Submitting…
                </>
              ) : (
                "Submit Registration"
              )}
            </button>
            <p className="mt-4 text-xs text-stone">
              Submission does not guarantee selection, partnership or
              investment.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

const inputClass = "input-field";

function errMsg(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>,
  key: string,
): string | undefined {
  const e = errors[key];
  if (!e) return undefined;
  return typeof e.message === "string" ? e.message : undefined;
}

function Field({
  label,
  error,
  name: nameProp,
  children,
}: {
  label: string;
  error?: string;
  name?: string;
  children: React.ReactNode;
}) {
  const childProps = isValidElement(children)
    ? (children.props as { name?: string; id?: string })
    : {};
  const id = nameProp || childProps.id || childProps.name;
  const errorId = id ? `${id}-error` : undefined;

  const control =
    isValidElement(children) && id
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          id,
          "aria-invalid": Boolean(error) || undefined,
          "aria-describedby": error && errorId ? errorId : undefined,
        })
      : children;

  return (
    <div className="field-wrap">
      <label className="label-field" htmlFor={id}>
        {label}
      </label>
      {control}
      <p
        id={errorId}
        className="field-error"
        role={error ? "alert" : undefined}
      >
        {error || "\u00a0"}
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Reg = UseFormRegister<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Errs = FieldErrors<any>;

function FounderFields({
  register,
  errors,
  pitchDeckName,
  onPitchDeck,
}: {
  register: Reg;
  errors: Errs;
  pitchDeckName: string;
  onPitchDeck: (file: File | null) => void;
}) {
  return (
    <section className="space-y-5 border-t border-border pt-8">
      <h3 className="font-display text-xl text-ink">About your startup</h3>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Startup name *" error={errMsg(errors, "startupName")}>
          <input {...register("startupName")} className={inputClass} />
        </Field>
        <Field label="Website" error={errMsg(errors, "website")}>
          <input
            {...register("website")}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
        <Field label="Sector *" error={errMsg(errors, "sector")}>
          <input {...register("sector")} className={inputClass} />
        </Field>
        <Field label="Stage *" error={errMsg(errors, "stage")}>
          <select {...register("stage")} className={inputClass} defaultValue="">
            <option value="">Select stage</option>
            <option value="Idea">Idea</option>
            <option value="Pre-seed">Pre-seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A+">Series A+</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Year founded">
          <input {...register("foundedYear")} className={inputClass} />
        </Field>
        <Field label="Team size">
          <input {...register("teamSize")} className={inputClass} />
        </Field>
      </div>

      <Field
        label="Business summary *"
        error={errMsg(errors, "businessSummary")}
      >
        <textarea
          {...register("businessSummary")}
          rows={3}
          className={inputClass}
        />
      </Field>

      <Field
        label="Problem you’re solving *"
        error={errMsg(errors, "problem")}
      >
        <textarea {...register("problem")} rows={3} className={inputClass} />
      </Field>

      <Field label="Current traction">
        <textarea {...register("traction")} rows={2} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Revenue range">
          <input {...register("revenueRange")} className={inputClass} />
        </Field>
        <Field label="Funding required">
          <input
            {...register("fundingRequired")}
            placeholder="e.g. $250k – $500k"
            className={inputClass}
          />
        </Field>
        <Field label="Previous funding">
          <input {...register("previousFunding")} className={inputClass} />
        </Field>
      </div>

      {/* Pitch deck — metadata only until storage is wired */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Pitch deck (PDF, max 15MB)
        </label>
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="block w-full text-sm text-stone file:mr-4 file:rounded-lg file:border-0 file:bg-forest file:px-4 file:py-2 file:text-sm file:font-medium file:text-ivory hover:file:bg-forest/90"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            if (file && file.size > 15 * 1024 * 1024) {
              onPitchDeck(null);
              e.target.value = "";
              alert("Please upload a PDF under 15MB.");
              return;
            }
            onPitchDeck(file);
          }}
        />
        {pitchDeckName && (
          <p className="mt-2 text-sm text-moss">Selected: {pitchDeckName}</p>
        )}
        <p className="mt-1.5 text-xs text-stone">
          File name is recorded with your application. Secure storage upload
          will be enabled shortly — you can also email your deck after
          registering.
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            {...register("interestedInPitchCompetition")}
            className="rounded accent-forest"
          />
          Interested in pitch competitions
        </label>
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            {...register("interestedInPodcast")}
            className="rounded accent-forest"
          />
          Interested in appearing on the podcast
        </label>
      </div>
    </section>
  );
}

function InvestorFields({ register }: { register: Reg }) {
  return (
    <section className="space-y-5 border-t border-border pt-8">
      <h3 className="font-display text-xl text-ink">Investment preferences</h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Typical cheque size">
          <input
            {...register("chequeSize")}
            placeholder="e.g. $25k – $100k"
            className={inputClass}
          />
        </Field>
        <Field label="Preferred stage">
          <input {...register("preferredStage")} className={inputClass} />
        </Field>
        <Field label="Preferred sectors">
          <input {...register("preferredSectors")} className={inputClass} />
        </Field>
        <Field label="Preferred geography">
          <input {...register("preferredGeography")} className={inputClass} />
        </Field>
      </div>
      <Field label="Past startup investments (optional)">
        <textarea
          {...register("pastInvestments")}
          rows={2}
          className={inputClass}
        />
      </Field>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            {...register("interestedInPitchPanels")}
            className="rounded accent-forest"
          />
          Interested in joining pitch panels
        </label>
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            {...register("interestedInCoInvest")}
            className="rounded accent-forest"
          />
          Open to co-investments
        </label>
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            {...register("interestedInPodcast")}
            className="rounded accent-forest"
          />
          Interested in the podcast
        </label>
      </div>
    </section>
  );
}

function LPFields({ register }: { register: Reg }) {
  return (
    <section className="space-y-5 border-t border-border pt-8">
      <h3 className="font-display text-xl text-ink">
        LP / Family Office details
      </h3>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Capital / AUM range (optional)">
          <input {...register("capitalRange")} className={inputClass} />
        </Field>
        <Field label="Typical commitment range">
          <input {...register("commitmentRange")} className={inputClass} />
        </Field>
        <Field label="Preferred fund stages">
          <input {...register("preferredFundStages")} className={inputClass} />
        </Field>
        <Field label="Geographic mandate">
          <input {...register("geographicMandate")} className={inputClass} />
        </Field>
        <Field label="Sector interests">
          <input {...register("sectorInterests")} className={inputClass} />
        </Field>
      </div>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("emergingManagerInterest")}
          className="rounded accent-forest"
        />
        Interested in emerging managers
      </label>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("coInvestmentInterest")}
          className="rounded accent-forest"
        />
        Co-investment interest
      </label>
    </section>
  );
}

function VCFields({ register, errors }: { register: Reg; errors: Errs }) {
  return (
    <section className="space-y-5 border-t border-border pt-8">
      <h3 className="font-display text-xl text-ink">Fund details</h3>
      <Field label="Fund name *" error={errMsg(errors, "fundName")}>
        <input {...register("fundName")} className={inputClass} />
      </Field>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Fund size range">
          <input {...register("fundSizeRange")} className={inputClass} />
        </Field>
        <Field label="Fund vintage">
          <input {...register("fundVintage")} className={inputClass} />
        </Field>
        <Field label="Investment stages">
          <input {...register("investmentStages")} className={inputClass} />
        </Field>
        <Field label="Typical cheque size">
          <input {...register("typicalCheque")} className={inputClass} />
        </Field>
        <Field label="Sectors">
          <input {...register("sectors")} className={inputClass} />
        </Field>
        <Field label="Geographies">
          <input {...register("geographies")} className={inputClass} />
        </Field>
        <Field label="Website">
          <input {...register("website")} className={inputClass} />
        </Field>
      </div>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("coInvestmentInterest")}
          className="rounded accent-forest"
        />
        Co-investment interest
      </label>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("dealFlowPartnership")}
          className="rounded accent-forest"
        />
        Interested in deal-flow partnership
      </label>
    </section>
  );
}

function FoFFields({ register }: { register: Reg }) {
  return (
    <section className="space-y-5 border-t border-border pt-8">
      <h3 className="font-display text-xl text-ink">Fund of Funds</h3>
      <Field label="Mandate">
        <input {...register("mandate")} className={inputClass} />
      </Field>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Preferred fund stage">
          <input {...register("preferredFundStage")} className={inputClass} />
        </Field>
        <Field label="Geographic preference">
          <input
            {...register("geographicPreference")}
            className={inputClass}
          />
        </Field>
        <Field label="Min commitment">
          <input {...register("minCommitment")} className={inputClass} />
        </Field>
        <Field label="Max commitment">
          <input {...register("maxCommitment")} className={inputClass} />
        </Field>
      </div>
      <Field label="Due diligence notes">
        <textarea
          {...register("dueDiligenceNotes")}
          rows={2}
          className={inputClass}
        />
      </Field>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("emergingManagerInterest")}
          className="rounded accent-forest"
        />
        Emerging manager interest
      </label>
    </section>
  );
}

function GovernmentFields({
  register,
  errors,
}: {
  register: Reg;
  errors: Errs;
}) {
  return (
    <section className="space-y-5 border-t border-border pt-8">
      <h3 className="font-display text-xl text-ink">Institution details</h3>
      <Field label="Institution *" error={errMsg(errors, "institution")}>
        <input {...register("institution")} className={inputClass} />
      </Field>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Department">
          <input {...register("department")} className={inputClass} />
        </Field>
        <Field label="Designation">
          <input {...register("designation")} className={inputClass} />
        </Field>
        <Field label="Jurisdiction">
          <input {...register("jurisdiction")} className={inputClass} />
        </Field>
        <Field label="Area of interest">
          <input {...register("areaOfInterest")} className={inputClass} />
        </Field>
      </div>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("partnershipInterest")}
          className="rounded accent-forest"
        />
        Partnership interest
      </label>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("eventInterest")}
          className="rounded accent-forest"
        />
        Event interest
      </label>
    </section>
  );
}

function EcosystemFields({ register }: { register: Reg }) {
  return (
    <section className="space-y-5 border-t border-border pt-8">
      <h3 className="font-display text-xl text-ink">Ecosystem partnership</h3>
      <Field label="How would you like to partner?">
        <textarea
          {...register("partnershipInterest")}
          rows={3}
          className={inputClass}
        />
      </Field>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("referralInterest")}
          className="rounded accent-forest"
        />
        Interested in referring startups
      </label>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          {...register("eventCollaboration")}
          className="rounded accent-forest"
        />
        Open to event collaboration
      </label>
    </section>
  );
}
