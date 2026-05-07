import { useState } from 'react';
import { ShieldCheck, Filter, TrendingUp, Globe, Users, ArrowRight } from 'lucide-react';

const DUMMY_FEED = [
  { country: "Bangladesh", flag: "🇧🇩", policy: "Labour Reform Act 2024", score: 6.2, scoreLabel: "Moderate", scoreType: "warn", date: "Apr 2026", analyst: "AR", analystName: "Ahmad Rafi", finding1: "3 critical implementation gaps found", finding2: "Weak enforcement mechanism — no independent tribunal" },
  { country: "Kenya", flag: "🇰🇪", policy: "Education Policy 2023", score: 7.8, scoreLabel: "Good", scoreType: "good", date: "Mar 2026", analyst: "JM", analystName: "James Mwangi", finding1: "Strong framework, robust teacher incentives", finding2: "Funding gap — 34% shortfall vs. GDP requirement" },
  { country: "India", flag: "🇮🇳", policy: "Digital Data Protection Bill", score: 5.9, scoreLabel: "Risk", scoreType: "risk", date: "Mar 2026", analyst: "RK", analystName: "Ritu Kapoor", finding1: "Conflicts with 2 existing constitutional rights", finding2: "Surveillance risk: Section 17 exemption is overbroad" },
  { country: "Pakistan", flag: "🇵🇰", policy: "National Health Insurance 2025", score: 6.8, scoreLabel: "Moderate", scoreType: "warn", date: "Feb 2026", analyst: "FM", analystName: "Farhan Malik", finding1: "Coverage design is equitable — SDG 3.8 aligned", finding2: "Implementation risk CRITICAL — governance score low" },
  { country: "Ghana", flag: "🇬🇭", policy: "Digital Economy Policy", score: 7.1, scoreLabel: "Good", scoreType: "good", date: "Feb 2026", analyst: "AA", analystName: "Ama Asante", finding1: "Strong infrastructure targets, realistic timeline", finding2: "Rural inclusion gap — 60% uncovered" },
  { country: "Vietnam", flag: "🇻🇳", policy: "Green Energy Transition Plan", score: 8.1, scoreLabel: "Strong", scoreType: "good", date: "Jan 2026", analyst: "TN", analystName: "Trần Ngọc", finding1: "Globally competitive renewable targets", finding2: "Coal phase-out timeline misaligned with ILO just transition" },
];

const REGIONS = ["All Regions", "South Asia", "Africa", "Southeast Asia", "Europe"];

function scoreClasses(type: string) {
  if (type === "good") return "bg-emerald-100 text-emerald-700";
  if (type === "risk") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

function ScoreBar({ score, type }: { score: number; type: string }) {
  const pct = (score / 10) * 100;
  const color = type === "good" ? "bg-emerald-500" : type === "risk" ? "bg-red-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-2 mt-3">
      <div
        className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={`Score: ${score} out of 10`}
      >
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-500 tabular-nums">{score}/10</span>
    </div>
  );
}

export default function PublicFeed() {
  const [activeRegion, setActiveRegion] = useState("All Regions");

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2" aria-label="PolicyLens AI — go to home">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center" aria-hidden="true">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">PolicyLens<span className="text-blue-600">AI</span></span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Home</a>
            <a href="/methodology" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Methodology</a>
            <a href="/upload" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">Start Analyzing</a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">Policy Intelligence Community</h1>
          <p className="text-base sm:text-lg text-slate-500">Analysis published by analysts worldwide. Open to everyone — read, learn, and contribute.</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Globe, label: "Countries Analyzed", value: "47" },
            { icon: TrendingUp, label: "Reports Published", value: "312" },
            { icon: Users, label: "Active Analysts", value: "89" },
          ].map((stat, i) => (
            <div key={i} className="p-4 sm:p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <stat.icon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100" role="group" aria-label="Filter reports by region">
          <Filter className="w-4 h-4 text-slate-400" aria-hidden="true" />
          <span className="text-sm font-medium text-slate-500 mr-1">Filter:</span>
          {REGIONS.map(f => (
            <button
              key={f}
              onClick={() => setActiveRegion(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${activeRegion === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white'}`}
              aria-pressed={activeRegion === f}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Feed — open to everyone, no blur */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {DUMMY_FEED.map((item, i) => (
            <article key={i} className="p-5 sm:p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all bg-white flex flex-col" aria-label={`${item.policy} — ${item.country}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">{item.flag}</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{item.country}</div>
                    <div className="text-[10px] text-slate-400">{item.date}</div>
                  </div>
                </div>
                {/* Score — color + text label (WCAG 1.4.1) */}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${scoreClasses(item.scoreType)}`} aria-label={`Score: ${item.score} out of 10 — ${item.scoreLabel}`}>
                  {item.score}/10 · {item.scoreLabel}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 mb-3 leading-snug">{item.policy}</h3>

              {/* Score bar with aria */}
              <ScoreBar score={item.score} type={item.scoreType} />

              <ul className="space-y-2 mt-4 mb-5 flex-1">
                {[item.finding1, item.finding2].map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Submitted by — pulls from analyst profile */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white" aria-hidden="true">{item.analyst}</div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{item.analystName}</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">Verified Analyst</p>
                  </div>
                </div>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1" aria-label={`View full report for ${item.policy}`}>
                  View Report <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 p-8 sm:p-12 bg-slate-900 rounded-[40px] text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Publish Your Own Analysis</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm">Analyze a policy, contribute to the community, and build your public analyst profile.</p>
          <a href="/upload" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all">
            Start Analyzing Free <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">© 2026 PolicyLens AI. All rights reserved.</p>
          <p className="text-[10px] text-slate-300 text-center">
            Built by <span className="text-slate-400 font-semibold">Ahmad Rafi</span> — Founder &amp; Director, Insights Bangladesh · NagorikBD · Talk Bangladesh · AI Governance, 1 Division 356 Upazilas
          </p>
        </div>
      </footer>
    </div>
  );
}
