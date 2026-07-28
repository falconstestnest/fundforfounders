import { Resend } from "resend";
import { siteConfig } from "./config";
import type { StakeholderType } from "./registration-schema";
import {
  buildInternalContactEmail,
  buildInternalRegistrationEmail,
  buildUserContactEmail,
  buildUserRegistrationEmail,
  sampleRegistration,
  type RegistrationPayload,
} from "./emails/templates";
import { EMAIL_CATALOG } from "./emails/catalog";

export type { RegistrationPayload };

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function sendOne(
  resend: Resend,
  opts: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    tags?: { name: string; value: string }[];
  },
) {
  return resend.emails.send({
    from: siteConfig.fromEmail,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
    tags: opts.tags,
  });
}

export async function sendRegistrationEmails(data: RegistrationPayload) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email delivery");
    return { sent: false as const, reason: "missing_api_key" as const };
  }

  const user = buildUserRegistrationEmail(data);
  const internal = buildInternalRegistrationEmail(data);

  const results = await Promise.allSettled([
    sendOne(resend, {
      to: siteConfig.internalEmail,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: data.email,
      tags: [
        { name: "category", value: internal.id },
        { name: "stakeholder", value: data.stakeholderType.replace(/\s+/g, "_") },
      ],
    }),
    sendOne(resend, {
      to: data.email,
      subject: user.subject,
      html: user.html,
      text: user.text,
      tags: [
        { name: "category", value: user.id },
        { name: "stakeholder", value: data.stakeholderType.replace(/\s+/g, "_") },
      ],
    }),
  ]);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length) {
    console.error("Email delivery issues", failed);
  }

  // Log Resend errors from fulfilled rejections
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.error) {
      console.error("Resend API error", r.value.error);
    }
  }

  return { sent: true as const, partial: failed.length > 0, user, internal };
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

  const user = buildUserContactEmail(data);
  const internal = buildInternalContactEmail(data);

  await Promise.allSettled([
    sendOne(resend, {
      to: siteConfig.internalEmail,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: data.email,
      tags: [{ name: "category", value: internal.id }],
    }),
    sendOne(resend, {
      to: data.email,
      subject: user.subject,
      html: user.html,
      text: user.text,
      tags: [{ name: "category", value: user.id }],
    }),
  ]);

  return { sent: true as const, user, internal };
}

export type TestEmailResult = {
  id: string;
  name: string;
  subject: string;
  to: string;
  ok: boolean;
  resendId?: string;
  error?: string;
};

/**
 * Send one sample of every catalogued email template to a test inbox.
 */
export async function sendAllTestEmails(
  to: string,
): Promise<TestEmailResult[]> {
  const resend = getResend();
  if (!resend) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const results: TestEmailResult[] = [];

  const userTypes: StakeholderType[] = [
    "Founder",
    "Angel Investor",
    "Limited Partner",
    "Venture Capital Fund",
    "Fund of Funds",
    "Government Agency",
    "Incubator",
    "Media",
    "Other",
  ];

  // User registration templates (one per variant)
  for (const type of userTypes) {
    const data = sampleRegistration(type);
    data.email = to;
    const built = buildUserRegistrationEmail(data);
    const entry = EMAIL_CATALOG.find((c) => c.id === built.id);
    try {
      const { data: sent, error } = await sendOne(resend, {
        to,
        subject: `[TEST] ${built.subject}`,
        html: built.html,
        text: built.text,
        tags: [
          { name: "category", value: "test" },
          { name: "template", value: built.id },
        ],
      });
      results.push({
        id: built.id,
        name: entry?.name || built.id,
        subject: `[TEST] ${built.subject}`,
        to,
        ok: !error,
        resendId: sent?.id,
        error: error ? String(error.message || error) : undefined,
      });
    } catch (e) {
      results.push({
        id: built.id,
        name: entry?.name || built.id,
        subject: `[TEST] ${built.subject}`,
        to,
        ok: false,
        error: e instanceof Error ? e.message : "send failed",
      });
    }
  }

  // Internal registration (normal + priority)
  for (const type of ["Founder", "Limited Partner"] as StakeholderType[]) {
    const data = sampleRegistration(type);
    data.email = to;
    const built = buildInternalRegistrationEmail(data);
    const entry = EMAIL_CATALOG.find((c) => c.id === built.id);
    try {
      const { data: sent, error } = await sendOne(resend, {
        to,
        subject: `[TEST] ${built.subject}`,
        html: built.html,
        text: built.text,
        replyTo: to,
        tags: [
          { name: "category", value: "test" },
          { name: "template", value: built.id },
        ],
      });
      results.push({
        id: built.id,
        name: entry?.name || built.id,
        subject: `[TEST] ${built.subject}`,
        to,
        ok: !error,
        resendId: sent?.id,
        error: error ? String(error.message || error) : undefined,
      });
    } catch (e) {
      results.push({
        id: built.id,
        name: entry?.name || built.id,
        subject: `[TEST] ${built.subject}`,
        to,
        ok: false,
        error: e instanceof Error ? e.message : "send failed",
      });
    }
  }

  // Contact user + internal
  const contactData = {
    fullName: "Jimmy Manalel",
    email: to,
    organisation: "FundForFounders Demo",
    message:
      "This is a design test of the contact form email templates. Safe to ignore.",
  };

  for (const built of [
    buildUserContactEmail(contactData),
    buildInternalContactEmail(contactData),
  ]) {
    const entry = EMAIL_CATALOG.find((c) => c.id === built.id);
    try {
      const { data: sent, error } = await sendOne(resend, {
        to,
        subject: `[TEST] ${built.subject}`,
        html: built.html,
        text: built.text,
        tags: [
          { name: "category", value: "test" },
          { name: "template", value: built.id },
        ],
      });
      results.push({
        id: built.id,
        name: entry?.name || built.id,
        subject: `[TEST] ${built.subject}`,
        to,
        ok: !error,
        resendId: sent?.id,
        error: error ? String(error.message || error) : undefined,
      });
    } catch (e) {
      results.push({
        id: built.id,
        name: entry?.name || built.id,
        subject: `[TEST] ${built.subject}`,
        to,
        ok: false,
        error: e instanceof Error ? e.message : "send failed",
      });
    }
  }

  return results;
}

export { EMAIL_CATALOG };
