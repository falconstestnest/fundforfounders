import type { LeadRow } from "@/lib/supabase";

export type ScoreFactor = { label: string; points: number; reason: string };

export type LeadScores = {
  engagement: { score: number; factors: ScoreFactor[] };
  completeness: { score: number; factors: ScoreFactor[]; missing: string[] };
  urgency: { score: number; factors: ScoreFactor[] };
  strategic: { score: number; factors: ScoreFactor[] };
  priorityRecommendation: {
    level: "Low" | "Normal" | "High" | "Urgent";
    factors: ScoreFactor[];
  };
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function details(lead: LeadRow): Record<string, unknown> {
  if (lead.details && typeof lead.details === "object") {
    return lead.details as Record<string, unknown>;
  }
  return {};
}

export function computeLeadScores(lead: LeadRow): LeadScores {
  const d = details(lead);
  const missing: string[] = [];
  const completeFactors: ScoreFactor[] = [];

  const fields: Array<[string, unknown]> = [
    ["Full name", lead.full_name],
    ["Email", lead.email],
    ["Mobile", lead.mobile],
    ["Country", lead.country],
    ["City", lead.city],
    ["Organisation", lead.organisation],
    ["LinkedIn", lead.linkedin],
  ];

  let completePts = 0;
  for (const [label, val] of fields) {
    const ok = typeof val === "string" ? val.trim().length > 0 : Boolean(val);
    if (ok) {
      completePts += 10;
      completeFactors.push({
        label,
        points: 10,
        reason: "Present",
      });
    } else {
      missing.push(label);
      completeFactors.push({ label, points: 0, reason: "Missing" });
    }
  }

  // Type-specific completeness
  if (
    lead.stakeholder_type === "Founder" ||
    lead.stakeholder_type === "Startup Team Member"
  ) {
    for (const [key, label] of [
      ["startupName", "Startup name"],
      ["businessSummary", "Business summary"],
      ["problem", "Problem"],
      ["stage", "Stage"],
      ["sector", "Sector"],
    ] as const) {
      const v = d[key] ?? (lead as Record<string, unknown>).startup_name;
      if (v && String(v).trim()) {
        completePts += 6;
        completeFactors.push({ label, points: 6, reason: "Present" });
      } else {
        missing.push(label);
        completeFactors.push({ label, points: 0, reason: "Missing" });
      }
    }
  }

  const completeness = {
    score: clamp(completePts),
    factors: completeFactors,
    missing,
  };

  // Engagement — activity + pipeline position
  const engagementFactors: ScoreFactor[] = [];
  let eng = 20;
  engagementFactors.push({
    label: "Base",
    points: 20,
    reason: "Registered interest",
  });

  const statusBoost: Record<string, number> = {
    New: 5,
    Reviewed: 15,
    Qualified: 30,
    Contacted: 40,
    "Meeting Scheduled": 55,
    Active: 70,
    Nurture: 25,
  };
  const sb = statusBoost[lead.status] ?? 0;
  eng += sb;
  engagementFactors.push({
    label: "Pipeline stage",
    points: sb,
    reason: lead.status,
  });

  if (lead.priority === "High" || lead.priority === "Urgent") {
    eng += 10;
    engagementFactors.push({
      label: "Priority flag",
      points: 10,
      reason: lead.priority,
    });
  }

  const last =
    (lead as { last_activity_at?: string }).last_activity_at ||
    lead.updated_at ||
    lead.created_at;
  const days = Math.floor(
    (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 3) {
    eng += 15;
    engagementFactors.push({
      label: "Recent activity",
      points: 15,
      reason: `Active within ${days}d`,
    });
  } else if (days <= 14) {
    eng += 5;
    engagementFactors.push({
      label: "Recent activity",
      points: 5,
      reason: `Active within ${days}d`,
    });
  } else {
    engagementFactors.push({
      label: "Recent activity",
      points: 0,
      reason: `Quiet ${days}d`,
    });
  }

  // Urgency
  const urgencyFactors: ScoreFactor[] = [];
  let urg = 10;
  if (lead.status === "New") {
    urg += 25;
    urgencyFactors.push({
      label: "Unreviewed",
      points: 25,
      reason: "Still New",
    });
  }
  if (lead.priority === "Urgent") {
    urg += 40;
    urgencyFactors.push({
      label: "Marked urgent",
      points: 40,
      reason: "Priority = Urgent",
    });
  } else if (lead.priority === "High") {
    urg += 25;
    urgencyFactors.push({
      label: "Marked high",
      points: 25,
      reason: "Priority = High",
    });
  }
  const followUp = (lead as { follow_up_at?: string | null }).follow_up_at;
  if (followUp && new Date(followUp).getTime() < Date.now()) {
    urg += 30;
    urgencyFactors.push({
      label: "Overdue follow-up",
      points: 30,
      reason: "follow_up_at in the past",
    });
  }
  if (days >= 14 && !["Active", "Archived", "Not Relevant"].includes(lead.status)) {
    urg += 15;
    urgencyFactors.push({
      label: "Dormant open lead",
      points: 15,
      reason: `No activity ${days}d`,
    });
  }
  if (!lead.internal_owner) {
    urg += 10;
    urgencyFactors.push({
      label: "Unassigned",
      points: 10,
      reason: "No owner",
    });
  }

  // Strategic relevance by stakeholder type
  const strategicFactors: ScoreFactor[] = [];
  let strat = 20;
  const typeBoost: Record<string, number> = {
    "Limited Partner": 35,
    "Family Office": 35,
    "Fund of Funds": 40,
    "Venture Capital Fund": 30,
    "International Investor": 28,
    "Government Agency": 25,
    "Public Institution": 22,
    Founder: 20,
    "Angel Investor": 18,
    HNI: 18,
  };
  const tb = typeBoost[lead.stakeholder_type] ?? 12;
  strat += tb;
  strategicFactors.push({
    label: "Stakeholder type",
    points: tb,
    reason: lead.stakeholder_type,
  });

  if (lead.country && /india|singapore|uae|uk|united states|usa/i.test(lead.country)) {
    strat += 8;
    strategicFactors.push({
      label: "Priority geography",
      points: 8,
      reason: lead.country,
    });
  }

  // Priority recommendation from combined signals
  const composite =
    clamp(eng) * 0.25 +
    completeness.score * 0.2 +
    clamp(urg) * 0.3 +
    clamp(strat) * 0.25;

  let level: "Low" | "Normal" | "High" | "Urgent" = "Normal";
  const recFactors: ScoreFactor[] = [
    {
      label: "Composite",
      points: Math.round(composite),
      reason: "0.25 eng + 0.2 complete + 0.3 urgency + 0.25 strategic",
    },
  ];
  if (composite >= 75 || lead.priority === "Urgent" || urg >= 70) {
    level = "Urgent";
    recFactors.push({
      label: "Threshold",
      points: 0,
      reason: "Composite ≥ 75 or high urgency",
    });
  } else if (composite >= 55) {
    level = "High";
    recFactors.push({
      label: "Threshold",
      points: 0,
      reason: "Composite ≥ 55",
    });
  } else if (composite < 30) {
    level = "Low";
    recFactors.push({
      label: "Threshold",
      points: 0,
      reason: "Composite < 30",
    });
  }

  return {
    engagement: { score: clamp(eng), factors: engagementFactors },
    completeness,
    urgency: { score: clamp(urg), factors: urgencyFactors },
    strategic: { score: clamp(strat), factors: strategicFactors },
    priorityRecommendation: { level, factors: recFactors },
  };
}
