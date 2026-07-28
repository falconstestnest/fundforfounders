import { NextResponse, type NextRequest } from "next/server";
import { sendRegistrationEmails } from "@/lib/email";
import { insertLead } from "@/lib/leads";
import { rateLimit } from "@/lib/rate-limit";
import { parseRegistrationPayload } from "@/lib/registration-schema";
import { isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function sanitiseText(value: string): string {
  return value.replace(/[<>]/g, "").trim();
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limited = rateLimit(`register:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many attempts. Please wait a moment and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Extra honeypot keys (legacy / bots)
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (
      (typeof b.website_url === "string" && b.website_url.trim()) ||
      (typeof b.honeypot === "string" && b.honeypot.trim())
    ) {
      return NextResponse.json({ ok: true, redirect: "/thank-you" });
    }
  }

  const parsed = parseRegistrationPayload(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error,
        fields: parsed.fields,
      },
      { status: 400 },
    );
  }

  if (parsed.honeypot) {
    return NextResponse.json({ ok: true, redirect: "/thank-you" });
  }

  const raw = body as Record<string, unknown>;
  const pitchDeckFileName =
    typeof raw.pitchDeckFileName === "string"
      ? raw.pitchDeckFileName
      : typeof raw.pitchDeckFilename === "string"
        ? raw.pitchDeckFilename
        : undefined;

  const data = {
    ...parsed.data!,
    fullName: sanitiseText(parsed.data!.fullName),
    email: sanitiseText(parsed.data!.email).toLowerCase(),
    mobile: sanitiseText(parsed.data!.mobile),
    country: sanitiseText(parsed.data!.country),
    city: sanitiseText(parsed.data!.city),
    pitchDeckFileName,
  };

  // Persist to Supabase when configured
  const insert = await insertLead(data);
  if (!insert.ok && isSupabaseConfigured()) {
    // Hard fail only when Supabase is configured but insert fails
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not save your registration. Please try again in a moment.",
      },
      { status: 500 },
    );
  }

  try {
    await sendRegistrationEmails(data);
  } catch (err) {
    console.error("Registration email failed", err);
  }

  const isFounder =
    data.stakeholderType === "Founder" ||
    data.stakeholderType === "Startup Team Member";

  return NextResponse.json({
    ok: true,
    id: insert.ok ? insert.lead.id : undefined,
    redirect: isFounder ? "/application-received" : "/thank-you",
  });
}
