import { NextResponse, type NextRequest } from "next/server";
import { sendContactEmails } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, sanitiseText } from "@/lib/validation";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limited = rateLimit(`contact:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please wait and try again." },
      { status: 429 },
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

  if (
    body &&
    typeof body === "object" &&
    "website" in body &&
    typeof (body as { website?: unknown }).website === "string" &&
    (body as { website: string }).website.trim().length > 0
  ) {
    return NextResponse.json({ ok: true });
  }

  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (b.consent === true || b.consent === "true" || b.consent === "on") {
      b.consent = true;
    }
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form fields." },
      { status: 400 },
    );
  }

  const data = {
    fullName: sanitiseText(parsed.data.fullName),
    email: sanitiseText(parsed.data.email).toLowerCase(),
    organisation: parsed.data.organisation
      ? sanitiseText(parsed.data.organisation)
      : undefined,
    message: sanitiseText(parsed.data.message),
  };

  try {
    await sendContactEmails(data);
  } catch (err) {
    console.error("Contact email failed", err);
  }

  return NextResponse.json({ ok: true });
}
