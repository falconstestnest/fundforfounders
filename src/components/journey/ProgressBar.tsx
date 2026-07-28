"use client";

export function ProgressBar({
  step,
  total,
  label,
}: {
  step: number;
  total: number;
  label?: string;
}) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-stone">
        <span>
          Step {step + 1} of {total}
          {label ? ` · ${label}` : ""}
        </span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label="Application progress"
      >
        <div
          className="h-full rounded-full bg-forest transition-[width] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
