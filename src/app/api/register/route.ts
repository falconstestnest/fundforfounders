import { NextResponse, type NextRequest } from "next/server";
import { sendRegistrationEmails } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { registrationSchema, sanitiseText } from "@/lib/validation";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function fieldErrorsFromZod(error: {
  flatten: () => {
    fieldErrors: Record<string, string[] | undefined>;
  };
}) {
  const flat = error.flatten();
  const fields: Record<string, string> = {};
  for (const [key, messages] of Object.entries(flat.fieldErrors)) {
    if (messages?.[0]) fields[key] = messages[0];
  }
  return fields;
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

  // Honeypot
  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    typeof (body as { website?: unknown }).website === "string" &&
    (body as { website: string }).website.trim().length > 0
  ) {
    return NextResponse.json({ ok: true, redirect: "/thank-you" });
  }

  // Coerce consent
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (b.consent === true || b.consent === "true" || b.consent === "on") {
      b.consent = true;
    }
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        fields: fieldErrorsFromZod(parsed.error),
      },
      { status: 400 },
    );
  }

  const data = {
    ...parsed.data,
    fullName: sanitiseText(parsed.data.fullName),
    email: sanitiseText(parsed.data.email).toLowerCase(),
    phone: sanitiseText(parsed.data.phone),
    country: sanitiseText(parsed.data.country),
    city: sanitiseText(parsed.data.city),
  };

  try {
    await sendRegistrationEmails(data);
  } catch (err) {
    console.error("Registration email failed", err);
    // Still accept the lead so users are not blocked if email provider blips
  }

  const isFounder =
    data.stakeholderType === "Founder" ||
    data.stakeholderType === "Startup Team Member";

  return NextResponse.json({
    ok: true,
    redirect: isFounder ? "/application-received" : "/thank-you",
  });
}
