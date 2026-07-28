import { Resend } from "resend";
import { siteConfig } from "./config";
import {
  HIGH_PRIORITY_TYPES,
  type StakeholderType,
} from "./registration-schema";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(data: Record<string, string | undefined | boolean | null>) {
  return Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#73766F;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:6px 0;color:#111311;">${escapeHtml(String(v))}</td></tr>`,
    )
    .join("");
}

export type RegistrationPayload = Record<string, unknown> & {
  fullName: string;
  email: string;
  mobile: string;
  country: string;
  city: string;
  stakeholderType: StakeholderType;
  organisation?: string;
  designation?: string;
  linkedin?: string;
  howHeard?: string;
  message?: string;
  consent?: boolean;
  pitchDeckFileName?: string;
  pitchDeckFilename?: string;
};

export async function sendRegistrationEmails(data: RegistrationPayload) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email delivery");
    return { sent: false as const, reason: "missing_api_key" as const };
  }

  const isHighPriority = HIGH_PRIORITY_TYPES.includes(data.stakeholderType);
  const subjectPrefix = isHighPriority ? "[Priority] " : "";

  const detailMap: Record<string, string | boolean | undefined> = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      key === "consent" ||
      key === "websiteHoneypot" ||
      key === "pitchDeck" ||
      value === undefined ||
      value === null ||
      value === ""
    ) {
      continue;
    }
    if (typeof value === "boolean" || typeof value === "string") {
      detailMap[key] = value;
    } else if (typeof value === "number") {
      detailMap[key] = String(value);
    }
  }

  const internalHtml = `
    <div style="font-family:Georgia,serif;max-width:560px;color:#111311;">
      <p style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#506B5B;">New registration</p>
      <h1 style="font-size:22px;font-weight:500;">${escapeHtml(data.stakeholderType)} — ${escapeHtml(data.fullName)}</h1>
      <table style="font-size:14px;border-collapse:collapse;">${rows(detailMap)}</table>
    </div>
  `;

  const firstName = data.fullName.split(" ")[0] || data.fullName;
  const userHtml = `
    <div style="font-family:Georgia,serif;max-width:560px;color:#111311;line-height:1.6;">
      <p style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#506B5B;">FundForFounders</p>
      <h1 style="font-size:24px;font-weight:500;line-height:1.2;">Thank you, ${escapeHtml(firstName)}.</h1>
      <p>We received your registration as <strong>${escapeHtml(data.stakeholderType)}</strong>.</p>
      <p>We will share relevant launch updates, applications and partnership opportunities as FundForFounders takes shape.</p>
      <p style="color:#73766F;font-size:14px;">This is not an offer to invest or a commitment of capital. Submission does not guarantee selection, partnership or investment.</p>
      <p style="margin-top:32px;font-size:14px;">— The FundForFounders team</p>
    </div>
  `;

  const results = await Promise.allSettled([
    resend.emails.send({
      from: siteConfig.fromEmail,
      to: siteConfig.internalEmail,
      replyTo: data.email,
      subject: `${subjectPrefix}FFF registration: ${data.stakeholderType} — ${data.fullName}`,
      html: internalHtml,
    }),
    resend.emails.send({
      from: siteConfig.fromEmail,
      to: data.email,
      subject: "We received your FundForFounders registration",
      html: userHtml,
    }),
  ]);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length) {
    console.error("Email delivery issues", failed);
  }

  return { sent: true as const, partial: failed.length > 0 };
}

export async function sendContactEmails(data: {
  fullName: string;
  email: string;
  organisation?: string;
  message: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email delivery");
    return { sent: false as const };
  }

  await Promise.allSettled([
    resend.emails.send({
      from: siteConfig.fromEmail,
      to: siteConfig.internalEmail,
      replyTo: data.email,
      subject: `FFF contact: ${data.fullName}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;">
          <h1 style="font-size:20px;">Contact form</h1>
          <p><strong>${escapeHtml(data.fullName)}</strong> (${escapeHtml(data.email)})</p>
          ${data.organisation ? `<p>Organisation: ${escapeHtml(data.organisation)}</p>` : ""}
          <p style="white-space:pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
      `,
    }),
    resend.emails.send({
      from: siteConfig.fromEmail,
      to: data.email,
      subject: "We received your message — FundForFounders",
      html: `
        <div style="font-family:Georgia,serif;max-width:560px;line-height:1.6;">
          <p>Thank you for writing to FundForFounders.</p>
          <p>We will respond if a follow-up is appropriate.</p>
          <p style="color:#73766F;font-size:14px;">— The FundForFounders team</p>
        </div>
      `,
    }),
  ]);

  return { sent: true as const };
}
