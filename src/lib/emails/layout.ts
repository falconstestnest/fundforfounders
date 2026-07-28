import { siteConfig } from "@/lib/config";
import { emailBrand as b } from "./brand";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

type LayoutOpts = {
  preheader?: string;
  eyebrow?: string;
  title: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  footerNote?: string;
  /** Show priority badge in header (internal emails) */
  priority?: boolean;
};

export function emailLayout(opts: LayoutOpts): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(opts.preheader)}</div>`
    : "";

  const cta = opts.cta
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
        <tr>
          <td style="border-radius:4px;background:${b.forest};">
            <a href="${escapeHtml(opts.cta.href)}"
               style="display:inline-block;padding:14px 22px;font-family:${b.font};font-size:14px;font-weight:500;color:${b.white};text-decoration:none;letter-spacing:-0.01em;">
              ${escapeHtml(opts.cta.label)}
            </a>
          </td>
        </tr>
      </table>`
    : "";

  const priorityBadge = opts.priority
    ? `<span style="display:inline-block;margin-left:8px;padding:3px 8px;border-radius:3px;background:${b.warning};color:${b.white};font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;">Priority</span>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${b.ivory};">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${b.ivory};">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${b.paper};border:1px solid ${b.border};">
          <!-- Accent bar -->
          <tr>
            <td style="height:4px;background:${b.forest};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 0;font-family:${b.font};">
              <p style="margin:0;font-size:15px;font-weight:600;letter-spacing:-0.04em;color:${b.ink};">
                Fund<span style="color:${b.forest};">For</span>Founders
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 32px 36px;font-family:${b.font};color:${b.ink};">
              ${
                opts.eyebrow
                  ? `<p style="margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${b.forest};">${escapeHtml(opts.eyebrow)}${priorityBadge}</p>`
                  : ""
              }
              <h1 style="margin:0 0 18px;font-size:26px;font-weight:500;line-height:1.15;letter-spacing:-0.035em;color:${b.ink};">
                ${escapeHtml(opts.title)}
              </h1>
              <div style="font-size:15px;line-height:1.65;color:${b.ink};">
                ${opts.bodyHtml}
              </div>
              ${cta}
              ${
                opts.footerNote
                  ? `<p style="margin:28px 0 0;font-size:13px;line-height:1.55;color:${b.stone};">${opts.footerNote}</p>`
                  : ""
              }
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${b.border};background:${b.ivory};font-family:${b.font};">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:${b.stone};">
                ${escapeHtml(siteConfig.brandPromise)}
              </p>
              <p style="margin:0 0 12px;font-size:11px;line-height:1.55;color:${b.muted};">
                ${escapeHtml(siteConfig.disclaimer)}
              </p>
              <p style="margin:0;font-size:11px;color:${b.muted};">
                <a href="${escapeHtml(siteConfig.url)}" style="color:${b.forest};text-decoration:none;">${escapeHtml(siteConfig.url.replace(/^https?:\/\//, ""))}</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(siteConfig.url)}/privacy" style="color:${b.stone};text-decoration:underline;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="mailto:${escapeHtml(siteConfig.email)}" style="color:${b.stone};text-decoration:underline;">${escapeHtml(siteConfig.email)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function detailTable(
  rows: Array<{ label: string; value: string | boolean | null | undefined }>,
): string {
  const cells = rows
    .filter((r) => r.value !== undefined && r.value !== null && r.value !== "")
    .map(
      (r) => `
      <tr>
        <td style="padding:8px 16px 8px 0;font-size:12px;color:${b.stone};vertical-align:top;white-space:nowrap;">${escapeHtml(r.label)}</td>
        <td style="padding:8px 0;font-size:13px;color:${b.ink};vertical-align:top;">${escapeHtml(String(r.value))}</td>
      </tr>`,
    )
    .join("");

  if (!cells) return "";
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0 4px;border-top:1px solid ${b.border};border-bottom:1px solid ${b.border};">
      ${cells}
    </table>`;
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${b.ink};">${text}</p>`;
}

export function mutedParagraph(text: string): string {
  return `<p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:${b.stone};">${text}</p>`;
}
