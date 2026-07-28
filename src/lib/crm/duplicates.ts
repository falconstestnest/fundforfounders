import type { LeadRow } from "@/lib/supabase";

export type DuplicateMatch = {
  lead: LeadRow;
  reasons: string[];
  score: number;
};

function norm(s: string | null | undefined): string {
  return (s || "").trim().toLowerCase();
}

function digits(s: string | null | undefined): string {
  return (s || "").replace(/\D/g, "");
}

function domainFromUrl(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const u = url.startsWith("http") ? url : `https://${url}`;
    return new URL(u).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return norm(url);
  }
}

function linkedinSlug(url: string | null | undefined): string {
  const n = norm(url);
  const m = n.match(/linkedin\.com\/in\/([^/?#]+)/);
  return m?.[1] || n;
}

/**
 * Flag possible duplicates — never auto-merge.
 */
export function findDuplicates(
  lead: LeadRow,
  pool: LeadRow[],
): DuplicateMatch[] {
  const out: DuplicateMatch[] = [];
  const email = norm(lead.email);
  const mobile = digits(lead.mobile);
  const org = norm(lead.organisation);
  const startup = norm(
    (lead as { startup_name?: string }).startup_name ||
      (lead.details as { startupName?: string } | null)?.startupName,
  );
  const site = domainFromUrl(
    (lead as { website?: string }).website ||
      (lead.details as { website?: string; websiteUrl?: string } | null)
        ?.website ||
      (lead.details as { websiteUrl?: string } | null)?.websiteUrl,
  );
  const li = linkedinSlug(lead.linkedin);

  for (const other of pool) {
    if (other.id === lead.id) continue;
    const reasons: string[] = [];
    let score = 0;

    if (email && email === norm(other.email)) {
      reasons.push("Same email");
      score += 50;
    }
    const om = digits(other.mobile);
    if (mobile && om && mobile.length >= 8 && mobile === om) {
      reasons.push("Same mobile");
      score += 40;
    }
    if (org && org.length >= 3 && org === norm(other.organisation)) {
      reasons.push("Same organisation");
      score += 20;
    }
    const oStartup = norm(
      (other as { startup_name?: string }).startup_name ||
        (other.details as { startupName?: string } | null)?.startupName,
    );
    if (startup && oStartup && startup === oStartup) {
      reasons.push("Same startup name");
      score += 35;
    }
    const oSite = domainFromUrl(
      (other as { website?: string }).website ||
        (other.details as { website?: string } | null)?.website ||
        (other.details as { websiteUrl?: string } | null)?.websiteUrl,
    );
    if (site && oSite && site === oSite) {
      reasons.push("Same website domain");
      score += 30;
    }
    if (li && li.length > 2 && li === linkedinSlug(other.linkedin)) {
      reasons.push("Same LinkedIn");
      score += 45;
    }

    if (reasons.length) {
      out.push({ lead: other, reasons, score });
    }
  }

  return out.sort((a, b) => b.score - a.score);
}
