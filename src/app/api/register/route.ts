import { NextResponse, type NextRequest } from "next/server";
import { sendRegistrationEmails } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { parseRegistrationPayload } from "@/lib/registration-schema";

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

  const data = {
    ...parsed.data!,
    fullName: sanitiseText(parsed.data!.fullName),
    email: sanitiseText(parsed.data!.email).toLowerCase(),
    mobile: sanitiseText(parsed.data!.mobile),
    country: sanitiseText(parsed.data!.country),
    city: sanitiseText(parsed.data!.city),
  };

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
    redirect: isFounder ? "/application-received" : "/thank-you",
  });
}
