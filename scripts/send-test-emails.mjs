/**
 * Send all FundForFounders email template tests.
 * Usage: node --env-file=.env.local scripts/send-test-emails.mjs
 */
import { Resend } from "resend";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Load .env.local if present
try {
  const envPath = resolve(root, ".env.local");
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim();
    }
  }
} catch {
  /* optional */
}

const TO = process.argv[2] || "jimmymanalelru@gmail.com";
const API_KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.RESEND_FROM_EMAIL ||
  "FundForFounders <hello@projects.jimmymanalel.com>";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://fundforfounders.vercel.app";

if (!API_KEY) {
  console.error("Missing RESEND_API_KEY");
  process.exit(1);
}

const B = {
  ivory: "#F3F3F2",
  paper: "#FFFFFF",
  ink: "#1B1916",
  forest: "#00A071",
  stone: "#928C86",
  muted: "#A8A39E",
  border: "#E4E3E0",
  warning: "#B06300",
  font: '-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif',
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout({ eyebrow, title, bodyHtml, cta, priority, preheader }) {
  const pre = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>`
    : "";
  const badge = priority
    ? `<span style="display:inline-block;margin-left:8px;padding:3px 8px;border-radius:3px;background:${B.warning};color:#fff;font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Priority</span>`
    : "";
  const ctaHtml = cta
    ? `<table cellpadding="0" cellspacing="0" style="margin:28px 0 8px;"><tr><td style="border-radius:4px;background:${B.forest};"><a href="${esc(cta.href)}" style="display:inline-block;padding:14px 22px;font-family:${B.font};font-size:14px;font-weight:500;color:#fff;text-decoration:none;">${esc(cta.label)}</a></td></tr></table>`
    : "";

  return `<!DOCTYPE html><html><body style="margin:0;background:${B.ivory};">
${pre}
<table width="100%" cellpadding="0" cellspacing="0" style="background:${B.ivory};"><tr><td align="center" style="padding:32px 16px 48px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${B.paper};border:1px solid ${B.border};">
<tr><td style="height:4px;background:${B.forest};font-size:0;">&nbsp;</td></tr>
<tr><td style="padding:28px 32px 0;font-family:${B.font};"><p style="margin:0;font-size:15px;font-weight:600;letter-spacing:-0.04em;color:${B.ink};">Fund<span style="color:${B.forest};">For</span>Founders</p></td></tr>
<tr><td style="padding:28px 32px 36px;font-family:${B.font};">
${eyebrow ? `<p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${B.forest};">${esc(eyebrow)}${badge}</p>` : ""}
<h1 style="margin:0 0 18px;font-size:26px;font-weight:500;line-height:1.15;letter-spacing:-0.035em;color:${B.ink};">${esc(title)}</h1>
<div style="font-size:15px;line-height:1.65;color:${B.ink};">${bodyHtml}</div>
${ctaHtml}
</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid ${B.border};background:${B.ivory};font-family:${B.font};">
<p style="margin:0 0 8px;font-size:12px;color:${B.stone};">Clear before the cheque. Committed after it.</p>
<p style="margin:0 0 12px;font-size:11px;line-height:1.55;color:${B.muted};">FundForFounders is currently under development. Nothing on this website constitutes an offer, solicitation, investment recommendation or commitment to invest.</p>
<p style="margin:0;font-size:11px;color:${B.muted};"><a href="${esc(SITE)}" style="color:${B.forest};text-decoration:none;">fundforfounders.vercel.app</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function p(t) {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${B.ink};">${t}</p>`;
}
function muted(t) {
  return `<p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:${B.stone};">${t}</p>`;
}
function table(rows) {
  return `<table cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;border-top:1px solid ${B.border};border-bottom:1px solid ${B.border};">${rows
    .map(
      ([l, v]) =>
        `<tr><td style="padding:8px 16px 8px 0;font-size:12px;color:${B.stone};vertical-align:top;">${esc(l)}</td><td style="padding:8px 0;font-size:13px;color:${B.ink};">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;
}

const templates = [
  {
    id: "user_registration_founder",
    name: "Founder registration confirmation",
    subject: "We received your founder application — FundForFounders",
    html: layout({
      preheader: "We received your founder application.",
      eyebrow: "Founder application",
      title: "Thank you, Jimmy.",
      bodyHtml:
        p("We received your application to join the FundForFounders early pipeline.") +
        p("Our team will review your submission carefully. If there is a fit for conversation, pitch pathways or future pipeline, we will be in touch.") +
        p("Submission does not guarantee selection or investment.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Founder</strong>"),
      cta: { label: "Read how we work with founders", href: `${SITE}/founders` },
    }),
  },
  {
    id: "user_registration_investor",
    name: "Investor network confirmation",
    subject: "You're on the investor network list — FundForFounders",
    html: layout({
      preheader: "You're on the investor network list.",
      eyebrow: "Investor network",
      title: "Welcome, Jimmy.",
      bodyHtml:
        p("You are on the FundForFounders investor network list.") +
        p("We will share relevant launch updates, pitch sessions and partnership opportunities as the network takes shape — subject to eligibility and documentation.") +
        p("This is not an offer to invest or a solicitation of capital.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Angel Investor</strong>"),
      cta: { label: "Explore the investor page", href: `${SITE}/investors` },
    }),
  },
  {
    id: "user_registration_lp",
    name: "LP / family office confirmation",
    subject: "LP interest received — FundForFounders",
    html: layout({
      preheader: "LP interest received.",
      eyebrow: "LP interest",
      title: "Thank you, Jimmy.",
      bodyHtml:
        p("We received your expression of LP / family office interest in FundForFounders.") +
        p("As the platform forms, we will share institutional updates appropriate to your mandate — never as an offer of securities until formally approved.") +
        p("Registration is not a commitment to invest or an allocation of fund interests.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Limited Partner</strong>"),
      cta: { label: "Read our investment thesis", href: `${SITE}/thesis` },
    }),
  },
  {
    id: "user_registration_vc",
    name: "VC partnership confirmation",
    subject: "Partnership interest received — FundForFounders",
    html: layout({
      preheader: "VC partnership interest received.",
      eyebrow: "Partnership interest",
      title: "Thank you, Jimmy.",
      bodyHtml:
        p("We received your Venture Capital Fund partnership interest.") +
        p("We will follow up on deal-flow collaboration, co-investment dialogue and regional founder access as the network launches.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Venture Capital Fund</strong>"),
      cta: { label: "For investors", href: `${SITE}/investors` },
    }),
  },
  {
    id: "user_registration_fof",
    name: "Fund of funds confirmation",
    subject: "Institutional interest received — FundForFounders",
    html: layout({
      preheader: "Institutional interest received.",
      eyebrow: "Institutional interest",
      title: "Thank you, Jimmy.",
      bodyHtml:
        p("We received your Fund of Funds institutional interest.") +
        p("We will share updates on manager formation, thesis and governance materials when they are ready for institutional review.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Fund of Funds</strong>"),
      cta: { label: "Read our thesis", href: `${SITE}/thesis` },
    }),
  },
  {
    id: "user_registration_government",
    name: "Institution / government confirmation",
    subject: "Institutional connection received — FundForFounders",
    html: layout({
      preheader: "Institutional connection received.",
      eyebrow: "Institutional connection",
      title: "Thank you, Jimmy.",
      bodyHtml:
        p("We received your government / public institution connection request.") +
        p("We welcome dialogue on ecosystem building, events and startup missions as FundForFounders develops.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Government Agency</strong>"),
      cta: { label: "Visit FundForFounders", href: SITE },
    }),
  },
  {
    id: "user_registration_ecosystem",
    name: "Ecosystem partner confirmation",
    subject: "Ecosystem partnership interest received — FundForFounders",
    html: layout({
      preheader: "Ecosystem partnership interest received.",
      eyebrow: "Ecosystem partnership",
      title: "Thank you, Jimmy.",
      bodyHtml:
        p("We received your interest in partnering as an ecosystem organisation.") +
        p("We will share relevant opportunities for referrals, events and regional collaboration.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Incubator</strong>"),
      cta: { label: "Join the network", href: `${SITE}/join` },
    }),
  },
  {
    id: "user_registration_media",
    name: "Media list confirmation",
    subject: "You're on the media list — FundForFounders",
    html: layout({
      preheader: "You're on the media list.",
      eyebrow: "Media list",
      title: "Thank you, Jimmy.",
      bodyHtml:
        p("You are on the FundForFounders media list.") +
        p("We will share press updates, podcast launches and story opportunities as they go live.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Media</strong>"),
      cta: { label: "Podcast page", href: `${SITE}/podcast` },
    }),
  },
  {
    id: "user_registration_generic",
    name: "General registration confirmation",
    subject: "We received your registration — FundForFounders",
    html: layout({
      preheader: "We received your registration.",
      eyebrow: "Registration",
      title: "Thank you, Jimmy.",
      bodyHtml:
        p("We received your registration with FundForFounders.") +
        p("We will share relevant launch updates based on how you asked to participate.") +
        muted("Registered as: <strong style=\"color:#1B1916;\">Other</strong>"),
      cta: { label: "Visit FundForFounders", href: SITE },
    }),
  },
  {
    id: "user_contact_received",
    name: "Contact form confirmation",
    subject: "We received your message — FundForFounders",
    html: layout({
      preheader: "We received your message.",
      eyebrow: "Contact",
      title: "Message received, Jimmy.",
      bodyHtml:
        p("Thank you for writing to FundForFounders. We have received your message and will respond if a follow-up is appropriate.") +
        muted("If your enquiry is urgent, you can also email us directly at the address in the footer."),
      cta: { label: "Visit the website", href: SITE },
    }),
  },
  {
    id: "internal_registration",
    name: "Internal: new registration",
    subject: "FFF registration: Founder — Jimmy Manalel",
    html: layout({
      preheader: "Founder — Jimmy Manalel",
      eyebrow: "New registration",
      title: "Founder",
      bodyHtml:
        p("A new registration was submitted on the website.") +
        table([
          ["Name", "Jimmy Manalel"],
          ["Email", TO],
          ["Mobile", "+91 90000 00000"],
          ["Country", "India"],
          ["City", "Kochi"],
          ["Organisation", "FundForFounders Demo"],
          ["Type", "Founder"],
          ["Stage", "Pre-seed"],
        ]) +
        muted("Reply directly to this email to respond to the lead."),
      cta: { label: "Open admin leads", href: `${SITE}/admin/leads` },
    }),
  },
  {
    id: "internal_registration_priority",
    name: "Internal: priority registration",
    subject: "[Priority] FFF registration: Limited Partner — Jimmy Manalel",
    html: layout({
      preheader: "Limited Partner — Jimmy Manalel",
      eyebrow: "New registration",
      title: "Limited Partner",
      priority: true,
      bodyHtml:
        p("A <strong>high-priority</strong> registration was submitted on the website.") +
        table([
          ["Name", "Jimmy Manalel"],
          ["Email", TO],
          ["Type", "Limited Partner"],
          ["Organisation", "FundForFounders Demo"],
          ["Priority", "High"],
        ]) +
        muted("Reply directly to this email to respond to the lead."),
      cta: { label: "Open admin leads", href: `${SITE}/admin/leads` },
    }),
  },
  {
    id: "internal_contact",
    name: "Internal: contact enquiry",
    subject: "FFF contact: Jimmy Manalel",
    html: layout({
      preheader: "Contact from Jimmy Manalel",
      eyebrow: "Contact form",
      title: "Jimmy Manalel",
      bodyHtml:
        p("A new contact form message was submitted.") +
        table([
          ["Name", "Jimmy Manalel"],
          ["Email", TO],
          ["Organisation", "FundForFounders Demo"],
          [
            "Message",
            "This is a design test of the contact form email templates. Safe to ignore.",
          ],
        ]),
      cta: { label: "Reply to sender", href: `mailto:${TO}` },
    }),
  },
];

const resend = new Resend(API_KEY);

console.log(`Sending ${templates.length} test emails to ${TO} from ${FROM}\n`);

const results = [];
for (const t of templates) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `[TEST] ${t.subject}`,
      html: t.html,
      tags: [
        { name: "category", value: "test" },
        { name: "template", value: t.id },
      ],
    });
    if (error) {
      console.log(`✗ ${t.id}: ${error.message || JSON.stringify(error)}`);
      results.push({ id: t.id, ok: false, error: error.message });
    } else {
      console.log(`✓ ${t.id} → ${data?.id || "sent"}`);
      results.push({ id: t.id, ok: true, resendId: data?.id });
    }
    // gentle rate limit
    await new Promise((r) => setTimeout(r, 400));
  } catch (e) {
    console.log(`✗ ${t.id}: ${e.message}`);
    results.push({ id: t.id, ok: false, error: e.message });
  }
}

const ok = results.filter((r) => r.ok).length;
console.log(`\nDone: ${ok}/${results.length} sent successfully.`);
if (ok < results.length) process.exitCode = 1;
