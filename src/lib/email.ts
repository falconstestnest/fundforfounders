import { Resend } from "resend";
import { siteConfig } from "./config";
import type { RegistrationInput } from "./validation";
import { HIGH_PRIORITY_TYPES } from "./stakeholders";

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

export async function sendRegistrationEmails(data: RegistrationInput) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email delivery");
    return { sent: false as const, reason: "missing_api_key" as const };
  }

  const isHighPriority = HIGH_PRIORITY_TYPES.includes(data.stakeholderType);
  const subjectPrefix = isHighPriority ? "[Priority] " : "";

  const detailMap: Record<string, string | boolean | undefined> = {
    Name: data.fullName,
    Email: data.email,
    Phone: data.phone,
    Country: data.country,
    City: data.city,
    Organisation: data.organisation,
    Designation: data.designation,
    LinkedIn: data.linkedin,
    "Stakeholder type": data.stakeholderType,
    "How heard": data.howHeard,
    Message: data.message,
    "Startup name": data.startupName,
    Website: data.websiteUrl,
    Sector: data.sector,
    Stage: data.stage,
    "Year founded": data.yearFounded,
    "Team size": data.teamSize,
    "Business summary": data.businessSummary,
    Problem: data.problem,
    Traction: data.traction,
    "Revenue range": data.revenueRange,
    "Funding required": data.fundingRequired,
    "Previous funding": data.previousFunding,
    "Pitch competition": data.pitchCompetition,
    "Podcast interest": data.podcastInterest,
    "Cheque size": data.chequeSize,
    "Preferred stage": data.preferredStage,
    "Preferred sectors": data.preferredSectors,
    "Preferred geography": data.preferredGeography,
    "Past investments": data.pastInvestments,
    "Pitch panels": data.pitchPanels,
    "Co-investment": data.coInvestment,
    "Organisation type": data.organisationType,
    "Commitment range": data.commitmentRange,
    "Emerging manager": data.emergingManager,
    "Fund name": data.fundName,
    "Fund size": data.fundSize,
    "Fund vintage": data.fundVintage,
    "Deal flow": data.dealFlow,
    Institution: data.institution,
    Department: data.department,
    Jurisdiction: data.jurisdiction,
    "Area of interest": data.areaOfInterest,
    "Partnership interest": data.partnershipInterest,
    Mandate: data.mandate,
    "Min commitment": data.minCommitment,
    "Max commitment": data.maxCommitment,
    Source: data.source,
  };

  const internalHtml = `
    <div style="font-family:Georgia,serif;max-width:560px;color:#111311;">
      <p style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#506B5B;">New registration</p>
      <h1 style="font-size:22px;font-weight:500;">${escapeHtml(data.stakeholderType)} — ${escapeHtml(data.fullName)}</h1>
      <table style="font-size:14px;border-collapse:collapse;">${rows(detailMap)}</table>
    </div>
  `;

  const userHtml = `
    <div style="font-family:Georgia,serif;max-width:560px;color:#111311;line-height:1.6;">
      <p style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#506B5B;">FundForFounders</p>
      <h1 style="font-size:24px;font-weight:500;line-height:1.2;">Thank you, ${escapeHtml(data.fullName.split(" ")[0] || data.fullName)}.</h1>
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
