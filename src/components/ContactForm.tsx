"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      organisation: String(fd.get("organisation") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
      consent: fd.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Could not send your message.");
        return;
      }
      router.push("/thank-you?from=contact");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded border border-border bg-paper p-6 sm:p-8"
      noValidate
    >
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="fullName">
            Full name *
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            className="input-field"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-field"
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <label className="label-field" htmlFor="organisation">
          Organisation
        </label>
        <input
          id="organisation"
          name="organisation"
          className="input-field"
          autoComplete="organization"
        />
      </div>
      <div>
        <label className="label-field" htmlFor="message">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="input-field min-h-[8rem] resize-y"
        />
      </div>
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
          </a>
          .
        </span>
      </label>
      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn-primary focus-ring"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
