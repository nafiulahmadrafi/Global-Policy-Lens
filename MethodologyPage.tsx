import { ShieldCheck, Database, Brain, AlertCircle, CheckCircle2, Globe, Zap } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">PolicyLens<span className="text-blue-600">AI</span></span>
          </a>
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Home</a>
            <a href="/" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">Start Analyzing</a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6">
            <Zap className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Transparency Report</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-4">How PolicyLens AI Works</h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Full transparency on our AI pipeline, data sources, scoring methodology, and known limitations.
          </p>
        </div>

        {/* AI Pipeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">AI Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Stage 1 — Gemini 2.5 Pro</h3>
                  <p className="text-xs text-slate-500">Google DeepMind</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  "PDF ingestion and section extraction",
                  "Structured section identification with policy area tagging",
                  "Google Search grounding for domestic law retrieval",
                  "International standards matching (ILO, UN, WHO)",
                  "Global comparative analysis across peer countries",
                  "Policy gap identification vs. best practices",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Stage 2 — Claude Opus 4.5</h3>
                  <p className="text-xs text-slate-400">Anthropic</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                {[
                  "Country specialist reasoning (CPD/BIGD/UN-level analysis)",
                  "World Bank governance indicators interpretation",
                  "Hofstede cultural dimensions application",
                  "Corruption risk vector identification",
                  "9-dimension scoring with evidence-based rationale",
                  "Executive verdict: READY / REVISION / NOT RECOMMENDED",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Data Sources</h2>
          <div className="space-y-4">
            {[
              {
                name: "World Bank Open Data API",
                url: "https://data.worldbank.org",
                badge: "Live API",
                color: "bg-emerald-50 border-emerald-100",
                badgeColor: "bg-emerald-100 text-emerald-700",
                indicators: "GDP per capita, unemployment, poverty rate, GINI, literacy, school enrollment, internet penetration, urban population, life expectancy + 6 governance indicators (Government Effectiveness, Rule of Law, Regulatory Quality, Political Stability, Voice & Accountability, Control of Corruption)"
              },
              {
                name: "Transparency International CPI 2023",
                url: "https://www.transparency.org/en/cpi",
                badge: "Hardcoded 2023",
                color: "bg-blue-50 border-blue-100",
                badgeColor: "bg-blue-100 text-blue-700",
                indicators: "Corruption Perception Index scores and country rankings for 80+ countries. Updated annually from official TI reports."
              },
              {
                name: "Hofstede Insights Cultural Dimensions",
                url: "https://www.hofstede-insights.com",
                badge: "Static Dataset",
                color: "bg-purple-50 border-purple-100",
                badgeColor: "bg-purple-100 text-purple-700",
                indicators: "Power Distance (PDI), Individualism (IDV), Masculinity (MAS), Uncertainty Avoidance (UAI), Long-Term Orientation (LTO), Indulgence (IND) for 35+ countries."
              },
              {
                name: "REST Countries API",
                url: "https://restcountries.com",
                badge: "Live API",
                color: "bg-amber-50 border-amber-100",
                badgeColor: "bg-amber-100 text-amber-700",
                indicators: "Country metadata: capital, region, subregion, languages, population, currencies, area, bordering countries."
              },
              {
                name: "Google Search Grounding (via Gemini)",
                url: "https://ai.google.dev",
                badge: "Live Search",
                color: "bg-red-50 border-red-100",
                badgeColor: "bg-red-100 text-red-700",
                indicators: "Real-time retrieval of domestic laws, recent amendments, ILO convention texts, WHO guidelines, OECD benchmarks, and country-specific legislative databases."
              },
            ].map((source, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${source.color}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <h3 className="font-bold text-slate-900">{source.name}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${source.badgeColor}`}>{source.badge}</span>
                </div>
                <p className="text-sm text-slate-600 ml-8">{source.indicators}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scoring Methodology */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Scoring Methodology</h2>
          <p className="text-slate-600 mb-6">Each policy section is scored across 9 dimensions on a 0–100 scale. Scores are not generated arbitrarily — they are grounded in country-specific data passed to Claude before analysis begins.</p>
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-4 font-bold text-slate-900">Dimension</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-900">Data Input</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-900">What It Measures</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ["Cultural Fit", "Hofstede PDI, IDV, UAI", "How well the policy aligns with societal norms, hierarchy, and behavior patterns"],
                  ["Economic", "GDP/capita, GINI, poverty rate", "Financial feasibility given real economic conditions"],
                  ["Legal", "Domestic law retrieval (Gemini)", "Conflicts or alignment with existing legislation"],
                  ["Human Rights", "UN framework matching", "Compliance with international human rights standards"],
                  ["Environmental", "Policy content + SDG alignment", "Ecological sustainability and SDG 13/15 compliance"],
                  ["Social", "School enrollment, literacy", "Impact on social equity and human development"],
                  ["Governance", "WB governance indicators", "Implementation realism given institutional capacity"],
                  ["Corruption Risk", "TI CPI + WB control score", "Likelihood of corruption distorting policy outcomes"],
                  ["Future-Proof", "Trend analysis + 10-20yr projection", "Long-term resilience to demographic/technological shifts"],
                ].map(([dim, input, desc], i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{dim}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">{input}</td>
                    <td className="px-6 py-4 text-slate-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { range: "80–100", label: "Strong", color: "bg-emerald-50 border-emerald-200 text-emerald-800", desc: "Policy meets or exceeds international standards for this dimension" },
              { range: "50–79", label: "Moderate", color: "bg-amber-50 border-amber-200 text-amber-800", desc: "Significant gaps exist; revision recommended before implementation" },
              { range: "0–49", label: "Critical", color: "bg-red-50 border-red-200 text-red-800", desc: "Major structural or contextual failures; not ready for implementation" },
            ].map((r, i) => (
              <div key={i} className={`p-4 rounded-xl border ${r.color}`}>
                <div className="text-xl font-bold mb-1">{r.range}</div>
                <div className="font-bold text-sm mb-2">{r.label}</div>
                <p className="text-xs opacity-80">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Known Limitations</h2>
          <div className="space-y-4">
            {[
              ["AI Reasoning is Probabilistic", "Claude and Gemini are large language models. Scores and assessments represent best-effort reasoning, not legal opinions. Do not use as sole input for policy decisions."],
              ["World Bank Data Lag", "World Bank indicators are typically 1–2 years behind. GDP or governance scores may not reflect very recent political changes."],
              ["Hofstede Data Coverage", "Cultural dimensions are only available for ~35 countries. For uncovered countries, cultural analysis relies solely on AI reasoning."],
              ["PDF Extraction Limits", "Heavily formatted, scanned, or non-Latin script PDFs may not parse accurately. Best results with machine-readable PDFs."],
              ["No Legal Advice", "PolicyLens AI is a research and analysis tool. Outputs do not constitute legal advice and should not replace qualified legal counsel."],
            ].map(([title, desc], i) => (
              <div key={i} className="p-5 rounded-xl bg-amber-50 border border-amber-100 flex gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                  <p className="text-sm text-slate-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Standards & Compliance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { badge: "WCAG 2.1", desc: "Web Content Accessibility Guidelines Level AA" },
              { badge: "GDPR Ready", desc: "No personal data stored without consent" },
              { badge: "MIT License", desc: "Open source codebase, free to fork and audit" },
              { badge: "UN AI for Good", desc: "Aligned with UN principles for responsible AI" },
            ].map((c, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl mb-4">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="font-bold text-slate-900 mb-1">{c.badge}</div>
                <p className="text-xs text-slate-500">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About builder */}
        <section className="p-8 rounded-2xl bg-slate-900 text-white">
          <h2 className="text-xl font-bold mb-4">About the Builder</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            PolicyLens AI was built by <strong className="text-white">Ahmad Rafi</strong>, Founder & Director of Insights Bangladesh, NagorikBD, and Talk Bangladesh — with professional AI governance deployments across 1 division and 356 upazilas in Bangladesh, and international collaborators across Australia, Italy, and beyond.
          </p>
          <p className="text-slate-400 text-xs">
            The tool reflects years of applied AI fact-checking and civic technology work, designed to make rigorous policy intelligence accessible to researchers, NGOs, and policymakers worldwide.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">© 2026 PolicyLens AI. All rights reserved.</p>
          <p className="text-[10px] text-slate-300">
            Built by <span className="text-slate-400 font-semibold">Ahmad Rafi</span> — Founder &amp; Director, Insights Bangladesh · NagorikBD · Talk Bangladesh · AI Governance, 1 Division 356 Upazilas
          </p>
        </div>
      </footer>
    </div>
  );
}
