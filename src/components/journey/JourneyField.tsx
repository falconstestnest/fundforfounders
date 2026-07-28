"use client";

import type { ReactNode } from "react";

export function JourneyField({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  return (
    <div className="field-wrap mb-5">
      <label className="label-field !text-[0.9375rem] !mb-2" htmlFor={htmlFor}>
        {label}
      </label>
      {hint && (
        <p className="mb-2 text-sm leading-relaxed text-stone">{hint}</p>
      )}
      {children}
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

export function JourneyChoice({
  selected,
  title,
  subtitle,
  onClick,
}: {
  selected?: boolean;
  title: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`journey-choice focus-ring w-full rounded-xl border px-4 py-4 text-left ${
        selected
          ? "border-forest bg-forest/5"
          : "border-border bg-paper"
      }`}
    >
      <span className="block text-[1rem] font-medium tracking-tight text-ink">
        {title}
      </span>
      {subtitle && (
        <span className="mt-1 block text-sm leading-snug text-stone">
          {subtitle}
        </span>
      )}
    </button>
  );
}
