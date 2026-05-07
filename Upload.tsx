import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileUp,
  FileText,
  Globe,
  CheckCircle2,
  ChevronRight,
  X,
  AlertCircle,
  Search,
  Scale,
  ShieldCheck,
  LayoutDashboard,
  Loader2,
  Clock
} from 'lucide-react';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useDropzone } from 'react-dropzone';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import { usePolicy } from '../context/PolicyContext';
import { analyzePolicy, researchSection, type Section } from '../services/geminiService';
import { getImpactAnalysis, getExecutiveSummary } from '../services/claudeService';
import { ToastContainer, useToasts } from '../components/LandingPage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CountryOption = { label: string; value: string };

// ── Analysis step tracker shown while loading ──
const LOADING_STEPS = [
  { label: "Extracting sections", icon: FileText },
  { label: "Researching local laws", icon: Search },
  { label: "Running impact analysis", icon: ShieldCheck },
  { label: "Generating report", icon: LayoutDashboard },
];

function LiveStepTracker({ step, timedOut }: { step: number; timedOut: boolean }) {
  return (
    <div className="w-full space-y-2" role="status" aria-live="polite" aria-label={timedOut ? 'Still working on your analysis' : `Step ${step + 1} of ${LOADING_STEPS.length}`}>
      {timedOut && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl text-sm font-medium mb-4">
          <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Still working — complex documents can take up to 60 seconds…
        </div>
      )}
      {LOADING_STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        const Icon = s.icon;
        return (
          <div key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${active ? 'bg-blue-50 border border-blue-200' : done ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-transparent'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : active ? 'bg-blue-600' : 'bg-slate-200'}`} aria-hidden="true">
              {done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className={`w-3.5 h-3.5 ${active ? 'text-white animate-pulse' : 'text-slate-400'}`} />}
            </div>
            <span className={`text-sm font-medium ${active ? 'text-blue-700' : done ? 'text-emerald-700' : 'text-slate-400'}`}>
              {s.label}{active && <span className="ml-1 animate-pulse" aria-hidden="true">…</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Upload() {
  const navigate = useNavigate();
  const {
    file, setFile,
    country, setCountry,
    sections, setSections,
    analysisCache, setAnalysisCache,
    impactCache, setImpactCache,
    setSummary,
    reset
  } = usePolicy();

  const { toasts, add: addToast, dismiss } = useToasts();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [impactingId, setImpactingId] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const options = useMemo(() => countryList().getData(), []);

  // Advance step counter while loading
  useEffect(() => {
    if (!loading) { setLoadingStep(0); setTimedOut(false); return; }
    let step = 0;
    const stepTimer = setInterval(() => {
      step = Math.min(step + 1, LOADING_STEPS.length - 1);
      setLoadingStep(step);
    }, 4000);
    const timeoutTimer = setTimeout(() => setTimedOut(true), 45000);
    return () => { clearInterval(stepTimer); clearTimeout(timeoutTimer); };
  }, [loading]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setSections([]);
      setAnalysisCache({});
      setImpactCache({});
      setSummary(null);
    }
  }, [setFile, setSections, setAnalysisCache, setImpactCache, setSummary]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    reset();
  };

  const handleAnalyze = async () => {
    if (!file || !country) return;
    setLoading(true);
    try {
      const result = await analyzePolicy(file, country.label);
      setSections(result.sections);
    } catch (err) {
      console.error(err);
      addToast('Failed to analyze the document. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeepResearch = async (section: Section) => {
    if (!country || analysisCache[section.id]) return;
    setAnalyzingId(section.id);
    try {
      const res = await researchSection(section.title, section.content, country.label);
      setAnalysisCache({ ...analysisCache, [section.id]: res });
    } catch (err) {
      console.error(err);
      addToast(`Research failed for "${section.title}". Try again.`, 'error');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleImpactAnalysis = async (section: Section) => {
    if (!country || impactCache[section.id]) return;
    const research = analysisCache[section.id];
    if (!research) return;
    setImpactingId(section.id);
    try {
      const res = await getImpactAnalysis(section, country.label, research);
      setImpactCache({ ...impactCache, [section.id]: res });
    } catch (err) {
      console.error(err);
      addToast('Impact analysis failed. Please try again.', 'error');
    } finally {
      setImpactingId(null);
    }
  };

  const handleFinalizeReport = async () => {
    if (!country) return;
    const analyses = Object.values(impactCache);
    if (analyses.length === 0) return;
    setGeneratingSummary(true);
    try {
      const res = await getExecutiveSummary(country.label, analyses);
      setSummary(res);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate executive summary. Please try again.', 'error');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const isFormValid = !!file && !!country;
  const analysisCount = Object.keys(impactCache).length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-slate-100 selection:text-slate-900 flex flex-col items-center p-4 sm:p-6 sm:p-12">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      {/* Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex items-center justify-between mb-12 sm:mb-16"
      >
        <button className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')} aria-label="Go to home page">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200" aria-hidden="true">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">PolicyLens<span className="text-blue-600">AI</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-Agent Intelligence</p>
          </div>
        </button>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex -space-x-2" aria-hidden="true">
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center"><span className="text-[8px] font-bold text-slate-400">G</span></div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center"><span className="text-[8px] font-bold text-slate-400">C</span></div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Grounding Active</span>
        </div>
      </motion.header>

      <main className="w-full max-w-4xl flex flex-col">
        {/* Upload card */}
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-10 mb-12">
          <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">Policy Analyzer</h2>
            <p className="text-slate-500 text-sm">Upload your document and select the relevant jurisdiction to begin analysis.</p>
          </motion.header>

          <div className="space-y-8">
            {/* File dropzone — accessible */}
            <section className="flex flex-col space-y-3">
              <label id="dropzone-label" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Document Upload</label>
              <div
                {...getRootProps()}
                role="button"
                tabIndex={0}
                aria-labelledby="dropzone-label"
                aria-describedby="dropzone-hint"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') (e.target as HTMLElement).click(); }}
                className={cn(
                  "relative group cursor-pointer transition-all duration-300",
                  "border-2 border-dashed rounded-2xl h-44 flex flex-col items-center justify-center text-center p-4",
                  isDragActive ? "border-slate-400 bg-slate-100" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white",
                  file ? "border-slate-900/10 bg-slate-50/50" : ""
                )}
              >
                <input {...getInputProps()} aria-label="Upload PDF file" />
                <div className="flex flex-col items-center justify-center">
                  <div className={cn("w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 transition-colors duration-300", file ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600")} aria-hidden="true">
                    {file ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  {file ? (
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium text-slate-900 truncate max-w-[220px] sm:max-w-[280px]">{file.name}</p>
                      <button onClick={removeFile} className="mt-2 text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors" aria-label={`Remove file: ${file.name}`}>
                        <X className="w-3 h-3" aria-hidden="true" /> Remove file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-slate-600">{isDragActive ? "Drop the PDF here" : "Click to upload or drag and drop"}</p>
                      <p id="dropzone-hint" className="text-xs text-slate-400 mt-1">PDF documents only (max. 20MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Country selector */}
            <section className="flex flex-col space-y-3">
              <label htmlFor="jurisdiction-select" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Jurisdiction</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-slate-400 group-focus-within:text-slate-900 transition-colors" aria-hidden="true">
                  <Globe className="w-5 h-5 pointer-events-none" />
                </div>
                <Select
                  inputId="jurisdiction-select"
                  options={options}
                  value={country}
                  onChange={(val) => setCountry(val as CountryOption)}
                  placeholder="Search for a country..."
                  classNamePrefix="select"
                  aria-label="Select jurisdiction country"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: '12px',
                      paddingLeft: '32px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      borderColor: state.isFocused ? '#0F172A' : '#E2E8F0',
                      boxShadow: 'none',
                      backgroundColor: '#F8FAFC',
                    }),
                  }}
                />
              </div>
            </section>

            {/* Loading state — live step tracker instead of spinner */}
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <LiveStepTracker step={loadingStep} timedOut={timedOut} />
                </motion.div>
              )}
            </AnimatePresence>

            {isFormValid && !loading && (
              <div className="pt-4 text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white rounded-xl py-4 font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  aria-label={loading ? 'Analyzing document, please wait' : 'Analyze policy document'}
                >
                  <span>Analyze Policy</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        {sections.length > 0 && (
          <div className="w-full space-y-6 pb-28">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
              <h3 className="text-xl font-bold text-slate-900">Extracted Insights</h3>
              <span className="text-xs font-bold text-slate-400 bg-white border px-3 py-1 rounded-full" aria-live="polite">{sections.length} Sections Found</span>
            </div>

            <div className="flex flex-col gap-6">
              {sections.map((section, index) => {
                const research = analysisCache[section.id];
                const isResearching = analyzingId === section.id;
                const impact = impactCache[section.id];

                return (
                  <motion.article
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm"
                    aria-label={`Policy section: ${section.title}`}
                  >
                    <div className="mb-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded mb-2 inline-block">{section.id}</span>
                      <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">{section.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{section.content}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {!research && (
                        <button
                          onClick={() => handleDeepResearch(section)}
                          disabled={isResearching}
                          className="flex items-center gap-2 text-xs font-bold uppercase px-4 py-2 rounded-full border text-blue-600 hover:bg-slate-50 disabled:opacity-50"
                          aria-label={isResearching ? `Researching ${section.title}` : `Compare ${section.title} with global laws`}
                        >
                          {isResearching ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> : <Search className="w-3 h-3" aria-hidden="true" />}
                          {isResearching ? "Researching…" : "Compare with Global Laws"}
                        </button>
                      )}
                      {research && !impact && (
                        <button
                          onClick={() => handleImpactAnalysis(section)}
                          disabled={impactingId === section.id}
                          className="flex items-center gap-2 text-xs font-bold uppercase px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          aria-label={impactingId === section.id ? `Analyzing impact for ${section.title}` : `Run Claude impact analysis for ${section.title}`}
                        >
                          {impactingId === section.id ? <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" /> : <ShieldCheck className="w-3 h-3" aria-hidden="true" />}
                          {impactingId === section.id ? "Analyzing Impact…" : "Claude: Impact Analysis"}
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {research && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-6 border-t">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-2"><Scale className="w-3 h-3" aria-hidden="true" /> Domestic Legislation</h5>
                                <p className="text-xs text-slate-600 italic">"{research.relatedLaws}"</p>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-2"><ShieldCheck className="w-3 h-3" aria-hidden="true" /> Global Standards</h5>
                                <p className="text-xs text-slate-600 italic">"{research.internationalStandards}"</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h5 className="text-[10px] font-bold uppercase text-slate-400">Global Context</h5>
                              {research.globalComparisons.map((c, i) => (
                                <div key={i} className="text-xs p-3 rounded-lg border flex gap-3">
                                  <span className="font-bold text-slate-300" aria-hidden="true">{i + 1}</span>
                                  <div><p className="font-bold">{c.country}</p><p className="text-slate-500">{c.description}</p></div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {impact && (
                            <div className="p-5 sm:p-6 bg-blue-900 text-white rounded-2xl" role="region" aria-label="Claude Strategic Impact Analysis">
                              <div className="text-[10px] font-bold text-blue-300 mb-4 uppercase tracking-widest">Claude Strategic Impact</div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div><h6 className="text-[10px] font-bold text-blue-200 mb-1">Cultural</h6><p className="text-xs opacity-90">{impact.culturalFit}</p></div>
                                <div><h6 className="text-[10px] font-bold text-blue-200 mb-1">Economic</h6><p className="text-xs opacity-90">{impact.economicFeasibility}</p></div>
                                <div><h6 className="text-[10px] font-bold text-blue-200 mb-1">Future</h6><p className="text-xs opacity-90">{impact.futureProofing}</p></div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </div>

            {analysisCount > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
                <button
                  onClick={handleFinalizeReport}
                  disabled={generatingSummary}
                  className="w-full bg-blue-600 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between hover:bg-blue-700 transition-all font-bold disabled:opacity-70"
                  aria-label={generatingSummary ? 'Generating final report, please wait' : `Finalize report — ${analysisCount} section${analysisCount !== 1 ? 's' : ''} analyzed`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/50 p-2 rounded-lg" aria-hidden="true">
                      {generatingSummary ? <Loader2 className="w-4 h-4 animate-spin" /> : <LayoutDashboard className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm mb-0.5 leading-none">Finalize Report</p>
                      <p className="text-[10px] text-blue-200">{analysisCount} analyzed</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
