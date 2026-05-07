# PolicyLens AI — Polished Upgrades

## What changed from Google AI Build output

### server.ts — Claude System Prompts (MAJOR UPGRADE)
- Claude now plays THREE expert roles simultaneously:
  1. Country Specialist (field experience, cultural/institutional knowledge)
  2. World Bank / UN Standards Assessor (global benchmarking)
  3. Behavioral Economics & Implementation Analyst (real-data stress test)
- World Bank API integrated server-side: fetches live GDP, unemployment, poverty, GINI, life expectancy, literacy before every analysis
- REST Countries API integrated: auto-fetches country metadata
- Scores now grounded in real economic data (poor country = lower economic feasibility for expensive policy)
- Problems now require exact failure mechanism + affected clause
- Recommendations now require specific suggested clause rewrites
- New fields: overallSectionScore, globalStandingNote, policyGaps
- Executive summary now includes: verdict (READY/NEEDS REVISION/NOT RECOMMENDED), immediateActions, 7 dimensions (added environmental + social)
- Model upgraded to claude-opus-4-5 for deeper reasoning

### src/services/geminiService.ts (UPGRADED)
- Model upgraded to gemini-2.5-pro for PDF extraction, gemini-2.5-flash for research
- Section extraction now captures policyArea + pageRef
- Research prompt now requests: specific law article numbers, named ILO/UN convention clauses, performance notes on global comparisons, policyGaps field
- Country comparisons now include similar-income AND top-performer countries

### src/services/claudeService.ts (UPGRADED)
- Added fetchCountryIntelligence() — called once per analysis, passed to all subsequent Claude calls
- Added 7 dimensions (was 5, now includes environmental + social)
- Added verdict + verdictReason + immediateActions to OverallScorecard
- Added overallSectionScore to ImpactAnalysis
- Problem type now includes affectedClause + severity levels (critical/high/medium/low)
- Recommendation type now includes currentText + suggestedChange + priority

## What to do next (remaining pages)
- [ ] Public Feed page (Firebase Firestore)
- [ ] Login/Signup (Firebase Auth)
- [ ] User Dashboard (history, usage limits)
- [ ] Methodology page
- [ ] Free tier usage limiter (3 analyses/month)
