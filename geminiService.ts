import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface Section {
  id: string;
  title: string;
  content: string;
  pageRef?: string;
  policyArea?: string;
}

export interface AnalysisResult {
  sections: Section[];
}

export interface ComparativeAnalysis {
  relatedLaws: string;
  internationalStandards: string;
  globalComparisons: Array<{ country: string; description: string; score?: string }>;
  sources: string[];
  policyGaps: string;
}

export async function analyzePolicy(file: File, country: string): Promise<AnalysisResult> {
  const base64Data = await fileToBase64(file);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      { inlineData: { mimeType: "application/pdf", data: base64Data } },
      {
        text: `You are a senior policy analyst. Analyze this policy document targeted at ${country}.

Your job:
1. Identify every distinct section, chapter, article, or clause as a separate block.
2. For each block, extract a concise ID, a clear descriptive title, and a detailed summary of what that section actually mandates, proposes, or establishes.
3. Identify the policy area (e.g., "Labor Rights", "Environmental Regulation", "Data Privacy", "Healthcare", "Education").
4. Note the page or article reference if visible.

Be thorough — do not skip minor sections. Each section should be self-contained enough for independent analysis.

Return valid JSON only — no markdown, no backticks.`,
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                pageRef: { type: Type.STRING },
                policyArea: { type: Type.STRING },
              },
              required: ["id", "title", "content"],
            },
          },
        },
        required: ["sections"],
      },
    },
  });

  const jsonStr = response.text || '{"sections":[]}';
  return JSON.parse(jsonStr) as AnalysisResult;
}

export async function researchSection(
  sectionTitle: string,
  sectionContent: string,
  country: string,
  policyArea?: string
): Promise<ComparativeAnalysis> {
  // ── Step 1: Google Search দিয়ে raw research (JSON schema ছাড়া) ──
  const searchResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `You are a policy research specialist. Research this policy section.

COUNTRY: ${country}
POLICY AREA: ${policyArea ?? "General Policy"}
SECTION TITLE: ${sectionTitle}
SECTION CONTENT: ${sectionContent}

Using Google Search, find:
1. Specific existing laws or acts in ${country} that govern this topic (name them precisely).
2. Specific international frameworks that apply (name articles/clauses).
3. How 3 countries handle this policy area — pick similar income-level countries AND top performers.
4. Critical gaps vs international best practice.
5. Source URLs used.

Write your findings clearly and structured.`,
      },
    ],
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const rawResearch = searchResponse.text || "";

  // ── Step 2: Structure the research into JSON (schema enforce করা) ──
  const structureResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `Convert this research into structured JSON. Return valid JSON only — no markdown, no backticks.

RESEARCH TEXT:
${rawResearch}

Required JSON structure:
{
  "relatedLaws": "specific laws in the country",
  "internationalStandards": "specific international frameworks",
  "globalComparisons": [
    { "country": "name", "description": "how they handle it", "score": "optional rating" }
  ],
  "policyGaps": "what is missing vs international best practice",
  "sources": ["url1", "url2"]
}`,
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          relatedLaws: { type: Type.STRING },
          internationalStandards: { type: Type.STRING },
          globalComparisons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                country: { type: Type.STRING },
                description: { type: Type.STRING },
                score: { type: Type.STRING },
              },
              required: ["country", "description"],
            },
          },
          policyGaps: { type: Type.STRING },
          sources: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["relatedLaws", "internationalStandards", "globalComparisons", "policyGaps", "sources"],
      },
    },
  });

  const jsonStr = structureResponse.text || "{}";
  return JSON.parse(jsonStr) as ComparativeAnalysis;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
  });
}
