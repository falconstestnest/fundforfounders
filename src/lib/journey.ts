import type { StakeholderType } from "./registration-schema";

export type JourneyTrack =
  | "founder"
  | "angel"
  | "vc"
  | "lp"
  | "fo"
  | "fof"
  | "government"
  | "corporate"
  | "ecosystem"
  | "media"
  | "other";

export function trackForType(type: StakeholderType): JourneyTrack {
  switch (type) {
    case "Founder":
    case "Startup Team Member":
      return "founder";
    case "Angel Investor":
    case "HNI":
    case "International Investor":
      return "angel";
    case "Venture Capital Fund":
      return "vc";
    case "Limited Partner":
      return "lp";
    case "Family Office":
      return "fo";
    case "Fund of Funds":
      return "fof";
    case "Government Agency":
    case "Public Institution":
      return "government";
    case "Corporate Innovation Team":
      return "corporate";
    case "Incubator":
    case "Accelerator":
    case "University":
    case "Mentor":
    case "Ecosystem Partner":
    case "Service Provider":
      return "ecosystem";
    case "Media":
      return "media";
    default:
      return "other";
  }
}

export const ROLE_CHOICES: {
  type: StakeholderType;
  title: string;
  subtitle: string;
  track: JourneyTrack;
  group: "founder" | "capital" | "institution" | "ecosystem";
}[] = [
  {
    type: "Founder",
    title: "I'm a founder",
    subtitle: "A short conversation about what you're building",
    track: "founder",
    group: "founder",
  },
  {
    type: "Angel Investor",
    title: "Angel / HNI",
    subtitle: "Early cheques, co-invest, pitch panels",
    track: "angel",
    group: "capital",
  },
  {
    type: "Venture Capital Fund",
    title: "Venture capital fund",
    subtitle: "Deal flow, co-invest, regional access",
    track: "vc",
    group: "capital",
  },
  {
    type: "Limited Partner",
    title: "Limited partner",
    subtitle: "Institutional LP interest — not a commitment",
    track: "lp",
    group: "capital",
  },
  {
    type: "Family Office",
    title: "Family office",
    subtitle: "Direct and fund exposure, long horizon",
    track: "fo",
    group: "capital",
  },
  {
    type: "Fund of Funds",
    title: "Fund of funds",
    subtitle: "Emerging manager and platform dialogue",
    track: "fof",
    group: "capital",
  },
  {
    type: "Government Agency",
    title: "Government / public institution",
    subtitle: "Programmes, ecosystem, mission alignment",
    track: "government",
    group: "institution",
  },
  {
    type: "Corporate Innovation Team",
    title: "Corporate innovation",
    subtitle: "Partnership, pilots, founder access",
    track: "corporate",
    group: "institution",
  },
  {
    type: "Ecosystem Partner",
    title: "Ecosystem partner",
    subtitle: "Incubators, universities, mentors",
    track: "ecosystem",
    group: "ecosystem",
  },
  {
    type: "Media",
    title: "Media",
    subtitle: "Press and podcast list",
    track: "media",
    group: "ecosystem",
  },
];

export type JourneyDraft = {
  version: 1;
  stakeholderType: StakeholderType;
  step: number;
  updatedAt: string;
  data: Record<string, unknown>;
};

const STORAGE_KEY = "fff_journey_draft_v1";

export function loadDraft(): JourneyDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as JourneyDraft;
    if (d?.version !== 1) return null;
    return d;
  } catch {
    return null;
  }
}

export function saveDraft(draft: JourneyDraft): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }),
    );
  } catch {
    /* quota */
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function partnerCopy(type: StakeholderType): {
  greeting: string;
  promise: string;
  reviewNote: string;
} {
  switch (trackForType(type)) {
    case "angel":
      return {
        greeting: "Partners who back founders early.",
        promise:
          "We only share curated opportunities that match how you invest — never a generic newsletter.",
        reviewNote:
          "We treat angel interest as partnership dialogue, not a mailing list signup.",
      };
    case "vc":
      return {
        greeting: "Funds building the next generation of companies.",
        promise:
          "Tell us how you partner. We respond with regional deal flow and co-invest dialogue when it is real.",
        reviewNote:
          "Your fund profile helps us route introductions with intent — not volume.",
      };
    case "lp":
      return {
        greeting: "Capital that thinks in decades.",
        promise:
          "This is an expression of interest only — never an offer of securities or a commitment.",
        reviewNote:
          "LP interest is recorded carefully. No solicitation. No commitment implied.",
      };
    case "fo":
      return {
        greeting: "Family offices allocating with permanence.",
        promise:
          "Share how you look at direct and fund exposure. We respond only when the fit is serious.",
        reviewNote:
          "Family office dialogue stays confidential. No mass updates.",
      };
    case "fof":
      return {
        greeting: "Managers evaluating emerging platforms.",
        promise:
          "We share formation updates and thesis materials when they are ready for institutional review.",
        reviewNote:
          "FoF interest is treated as institutional diligence, not marketing.",
      };
    case "government":
      return {
        greeting: "Institutions enabling founders.",
        promise:
          "We welcome mission-aligned partnerships — programmes, events, and ecosystem building.",
        reviewNote:
          "Public-sector partnerships are coordinated with care and clarity.",
      };
    case "corporate":
      return {
        greeting: "Innovation teams looking outward.",
        promise:
          "Describe your mandate. We follow up on partnership and founder access where it fits.",
        reviewNote:
          "Corporate interest is matched to real founder and programme opportunities.",
      };
    default:
      return {
        greeting: "Join a serious network.",
        promise: "We will share only what is relevant to how you participate.",
        reviewNote: "Your path is recorded so we contact you with intent.",
      };
  }
}
