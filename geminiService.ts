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

Return valid JSON only.`,
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
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        text: `You are a policy research specialist with access to Google Search. Research this policy section thoroughly.

COUNTRY: ${country}
POLICY AREA: ${policyArea ?? "General Policy"}
SECTION TITLE: ${sectionTitle}
SECTION CONTENT: ${sectionContent}

Using Google Search, find and return:

1. RELATED DOMESTIC LAWS: Specific existing laws, acts, or regulations in ${country} that govern or overlap with this section topic. Name them precisely (e.g., "Labour Act 2006, Section 14").

2. INTERNATIONAL STANDARDS: Specific international frameworks that apply (e.g., ILO Convention No. 87, UN SDG Goal 8, WHO Framework Convention). Name specific articles or clauses where possible.

3. GLOBAL COMPARISONS: How 3 countries handle this specific policy area — pick countries that are both similar to ${country} (same income level or region) AND top-performers globally. Include a brief performance note.

4. POLICY GAPS: Based on research, what critical elements are missing from this section compared to international best practice?

5. SOURCES: URLs of sources used.

Return valid JSON only.`,
      },
    ],
    config: {
      tools: [{ googleSearch: {} }],
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

  const jsonStr = response.text || "{}";
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
