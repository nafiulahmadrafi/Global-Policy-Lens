import { Section, ComparativeAnalysis } from "./geminiService";

export interface ImpactAnalysis {
  culturalFit: string;
  economicFeasibility: string;
  legalConflicts: string;
  humanRightsGovernance: string;
  futureProofing: string;
  politicalFeasibility: string;
  corruptionRisk: string;
  scores: {
    cultural: number;
    economic: number;
    legal: number;
    humanRights: number;
    future: number;
    environmental: number;
    social: number;
    governance: number;
    corruption: number;
  };
  overallSectionScore: number;
  implementationRisk: "critical" | "high" | "medium" | "low";
  globalStandingNote: string;
  criticalHighlights: {
    problems: Array<{
      issue: string;
      severity: "critical" | "high" | "medium" | "low";
      whyItFails: string;
      affectedClause: string;
      corruptionVector: string | null;
    }>;
    strongPoints: Array<{
      point: string;
      why: string;
      globalBenchmark: string;
    }>;
    recommendations: Array<{
      what: string;
      currentText: string;
      suggestedChange: string;
      priority: "immediate" | "short-term" | "long-term";
      expectedImpact: string;
    }>;
  };
}

export interface OverallScorecard {
  policyTitle: string;
  summary: string;
  keyRisk: string;
  principalAdvantage: string;
  corruptionVulnerability: string;
  culturalBarriers: string;
  immediateActions: string[];
  comparativeNote: string;
  overallScores: {
    cultural: number;
    economic: number;
    legal: number;
    humanRights: number;
    future: number;
    environmental: number;
    social: number;
    governance: number;
    corruption: number;
  };
  overallPolicyScore: number;
  verdict: "READY_FOR_IMPLEMENTATION" | "NEEDS_MAJOR_REVISION" | "NEEDS_MINOR_REVISION" | "NOT_RECOMMENDED";
  verdictReason: string;
}

export interface CountryIntelligence {
  meta: Record<string, unknown> | null;
  worldBank: Record<string, number | null>;
  cpi: { score: number | null; rank: number | null; trend: string };
  hofstede: Record<string, number> | null;
  profile: string;
}

export async function fetchCountryIntelligence(country: string): Promise<CountryIntelligence> {
  const res = await fetch("/api/country-intelligence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country }),
  });
  if (!res.ok) throw new Error("Failed to fetch country intelligence");
  return res.json();
}

export async function getImpactAnalysis(
  section: Section,
  country: string,
  research: ComparativeAnalysis,
  countryIntelligence?: CountryIntelligence
): Promise<ImpactAnalysis> {
  const res = await fetch("/api/analyze-impact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ section, country, research, countryIntelligence }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Impact analysis failed");
  }
  return res.json();
}

export async function getExecutiveSummary(
  country: string,
  analyses: ImpactAnalysis[],
  countryIntelligence?: CountryIntelligence
): Promise<OverallScorecard> {
  const res = await fetch("/api/executive-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country, analyses, countryIntelligence }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Summary generation failed");
  }
  return res.json();
}
