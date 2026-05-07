import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  FileUp, 
  Globe, 
  Search, 
  ShieldCheck, 
  LayoutDashboard, 
  ChevronRight, 
  FileText, 
  Users, 
  LineChart, 
  Gavel, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

// ── Animated Hero: cycles through 4 real analysis frames ──
const ANALYSIS_FRAMES = [
  {
    label: "Extracting sections",
    icon: FileText,
    color: "bg-blue-600",
    badge: "Step 1 of 4",
    title: "Document Parsed",
    subtitle: "7 policy sections identified",
    items: ["Preamble & Definitions", "Labour Rights Framework", "Enforcement Mechanisms", "Penalty Clauses"],
  },
  {
    label: "Researching local laws",
    icon: Search,
    color: "bg-violet-600",
    badge: "Step 2 of 4",
    title: "Gemini Grounding",
    subtitle: "14 domestic laws matched",
    items: ["Industrial Relations Ordinance 1969", "Bangladesh Labour Act 2006", "ILO Convention C-087", "UDHR Article 23"],
  },
  {
    label: "Running impact analysis",
    icon: ShieldCheck,
    color: "bg-emerald-600",
    badge: "Step 3 of 4",
    title: "Claude Scoring",
    subtitle: "5-dimension audit complete",
    items: ["Cultural Fit: 72/100 ✓", "Economic: 58/100 ⚠", "Legal Risk: 81/100 ✓", "Future-Proof: 64/100 ⚠"],
  },
  {
    label: "Report ready",
    icon: LayoutDashboard,
    color: "bg-slate-900",
    badge: "Complete",
    title: "Impact Score: 88",
    subtitle: "High compatibility with local norms",
    items: ["3 critical risks flagged", "2 legislative conflicts found", "5 global comparisons made", "PDF export ready"],
  },
];

function AnimatedHeroMock() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f + 1) % ANALYSIS_FRAMES.length), 2800);
    return () => clearInterval(t);
  }, []);
  const current = ANALYSIS_FRAMES[frame];
  const Icon = current.icon;

  return (
    <div className="bg-slate-50 rounded-[40px] p-4 border border-slate-100 shadow-2xl relative z-10">
      <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
        {/* Chrome */}
        <div className="h-11 border-b border-slate-50 px-5 flex items-center justify-between">
          <div className="flex gap-2" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-amber-300" />
            <div className="w-3 h-3 rounded-full bg-emerald-300" />
          </div>
          <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            REPORT: LABOUR_REFORM_BD
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex" aria-hidden="true">
          {ANALYSIS_FRAMES.map((_, i) => (
            <div key={i} className={`flex-1 h-1 transition-all duration-700 ${i <= frame ? 'bg-blue-600' : 'bg-slate-100'}`} />
          ))}
        </div>
        <div className="p-7">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{current.badge}</span>
            <AnimatePresence mode="wait">
              <motion.span key={current.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="text-xs text-slate-400 font-medium">
                {current.label}…
              </motion.span>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={frame} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-11 h-11 rounded-2xl ${current.color} flex items-center justify-center`} aria-hidden="true">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{current.title}</h4>
                  <p className="text-xs text-slate-400">{current.subtitle}</p>
                </div>
              </div>
              <div className="space-y-2">
                {current.items.map((item, i) => (
                  <motion.div key={item} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" aria-hidden="true" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Live Step Tracker — exported so Upload.tsx can use it ──
export function AnalysisStepTracker({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: "Extracting sections", icon: FileText },
    { label: "Researching local laws", icon: Search },
    { label: "Running impact analysis", icon: ShieldCheck },
    { label: "Generating report", icon: LayoutDashboard },
  ];
  return (
    <div className="w-full space-y-3" role="status" aria-label={`Analysis step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]?.label ?? 'complete'}`}>
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        const Icon = step.icon;
        return (
          <div key={step.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${active ? 'bg-blue-50 border border-blue-200' : done ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-transparent'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : active ? 'bg-blue-600' : 'bg-slate-200'}`} aria-hidden="true">
              {done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Icon className={`w-3.5 h-3.5 ${active ? 'text-white animate-pulse' : 'text-slate-400'}`} />}
            </div>
            <span className={`text-sm font-medium ${active ? 'text-blue-700' : done ? 'text-emerald-700' : 'text-slate-400'}`}>
              {step.label}{active && <span className="ml-1 animate-pulse" aria-hidden="true">…</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Toast system ──
export function ToastContainer({ toasts, onDismiss }: { toasts: Toast[], onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-3 w-80" role="region" aria-label="Notifications" aria-live="polite">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border text-sm font-medium ${t.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : t.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}
            role="alert"
          >
            <span className="flex-1">{t.message}</span>
            <button onClick={() => onDismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity" aria-label="Dismiss notification">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export interface Toast {
  id: string;
  message: string;
  type: 'error' | 'success' | 'info';
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };
  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));
  return { toasts, add, dismiss };
}

// ── Global Error Boundary ──
import React from 'react';
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
            <p className="text-slate-500 text-sm">An unexpected error occurred in this section. The rest of the app continues to work normally.</p>
            <button onClick={() => this.setState({ hasError: false })} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm">Try Again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Main LandingPage ──
export default function LandingPage({ onStart }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2" aria-label="PolicyLens AI — scroll to top">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center" aria-hidden="true">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">PolicyLens<span className="text-blue-600">AI</span></span>
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/methodology" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Methodology</a>
            <a href="/feed" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Community</a>
            <button onClick={onStart} className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors" aria-label="Log in">Login</button>
            <button onClick={onStart} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all">Start Analyzing Free</button>
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(o => !o)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div id="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden">
              <div className="px-6 py-4 space-y-2">
                <a href="/methodology" className="block text-sm font-medium text-slate-600 py-2 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Methodology</a>
                <a href="/feed" className="block text-sm font-medium text-slate-600 py-2 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>Community</a>
                <button onClick={() => { setMobileMenuOpen(false); onStart(); }} className="block text-sm font-medium text-slate-600 py-2 hover:text-slate-900 w-full text-left">Login</button>
                <button onClick={() => { setMobileMenuOpen(false); onStart(); }} className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm">Start Analyzing Free</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <Zap className="w-3 h-3 text-blue-600" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Multi-Model Audit v2.4</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Analyze Any Policy.<br />
              Understand <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Real Impact.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed max-w-xl">
              We leverage Gemini's global grounding and Claude 3.5's reasoning to audit policies for cultural fit, economic feasibility, and legal risks in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onStart} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-200">
                Start Analyzing Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <button onClick={scrollToHowItWorks} className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                See How It Works
              </button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mr-2">Powered by</span>
              {["World Bank Data", "UN SDG", "TI Index", "Hofstede Dimensions", "WCAG 2.1"].map(badge => (
                <span key={badge} className="text-[10px] font-bold text-slate-500 border border-slate-200 px-2 py-1 rounded-lg bg-slate-50">{badge}</span>
              ))}
            </div>
          </motion.div>

          {/* Animated mock — replaces static decoration */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
            <AnimatedHeroMock />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[100px]" aria-hidden="true" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-200/20 blur-[100px]" aria-hidden="true" />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">Methodology</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">From PDF to Strategic Intelligence</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 relative">
            {[
              { icon: FileUp, title: "Upload PDF", desc: "Drag & drop your policy document" },
              { icon: Globe, title: "Select Country", desc: "Choose the target jurisdiction" },
              { icon: Search, title: "Gemini Research", desc: "AI finds local laws & standards" },
              { icon: ShieldCheck, title: "Claude Analysis", desc: "Audit for feasibility & risks" },
              { icon: LayoutDashboard, title: "Get Report", desc: "Export full strategic dashboard" },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 text-center space-y-6 group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-slate-100 border border-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:-translate-y-2" aria-hidden="true">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed px-4">{step.desc}</p>
                </div>
                {idx < 4 && <div className="hidden md:block absolute top-8 left-full w-full h-px bg-slate-200 -translate-x-1/2 -z-10" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">Core Capabilities</h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">Advanced context mapping powered by multi-agent AI.</h3>
            </div>
            <button onClick={onStart} className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center gap-2 group" aria-label="Explore all features">
              Explore All Features
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: LineChart, title: "Section-Level Ratings", desc: "Each clause is automatically scored against 5 strategic dimensions." },
              { icon: Globe, title: "Domestic Law Grounding", desc: "Gemini finds specific local regulations to check for compliance." },
              { icon: Users, title: "Cultural Fit Analysis", desc: "Understanding how policies align with local social norms and behaviors." },
              { icon: AlertTriangle, title: "Risk Detection", desc: "Identifying critical fail points and legal friction pre-implementation." },
              { icon: Gavel, title: "Standard Benchmarking", desc: "Compare against UN, ILO, and international best practices." },
              { icon: Zap, title: "Future-Proof Scoring", desc: "Predicting how technological shifts affect policy longevity." },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 sm:p-10 rounded-[32px] border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors" aria-hidden="true">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{feature.title}</h4>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PUBLIC FEED — blur gate removed */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Latest Policy Audits</h3>
            <p className="text-slate-400">Public analysis from analysts worldwide — open to everyone.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: "Energy Reform Act 2026", country: "Estonia", status: "Critical Risks Found", statusType: "risk", score: 5.8 },
              { title: "Universal Basic Income Pilot", country: "South Korea", status: "High Feasibility", statusType: "good", score: 8.2 },
              { title: "AI Ethics Framework v4", country: "United Kingdom", status: "Strong Global Match", statusType: "good", score: 7.9 },
            ].map((feed, idx) => (
              <a href="/feed" key={idx}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm hover:bg-white/10 transition-all block"
                aria-label={`View report: ${feed.title} — ${feed.country}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold" aria-hidden="true">
                    {feed.country.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{feed.country}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Verified Analyst</p>
                  </div>
                  {/* Score with text label — WCAG 1.4.1 compliant */}
                  <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${feed.statusType === 'good' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}
                    aria-label={`Score: ${feed.score} out of 10 — ${feed.statusType === 'good' ? 'Good' : 'Risk'}`}>
                    {feed.score}/10 {feed.statusType === 'good' ? '↑' : '↓'}
                    <span className="ml-1">{feed.statusType === 'good' ? 'Good' : 'Risk'}</span>
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-4">{feed.title}</h4>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{feed.status}</span>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="/feed" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Browse Full Community Feed <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">Pricing</h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Scale your policy intelligence.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 sm:p-12 rounded-[40px] border border-slate-200">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Free Starter</h4>
                  <p className="text-slate-500 text-sm">For independent researchers</p>
                </div>
                <div className="text-3xl font-bold text-slate-900" aria-label="Free">$0</div>
              </div>
              <ul className="space-y-4 mb-12">
                {["5 Documents / Month", "Gemini Legal Research", "Basic Section Breakdown", "Standard Support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={onStart} className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">Get Started</button>
            </div>
            <div className="bg-slate-900 p-10 sm:p-12 rounded-[40px] border border-slate-800 shadow-2xl md:-translate-y-4">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 rounded text-[10px] font-bold text-white uppercase tracking-widest mb-3">Popular</div>
                  <h4 className="text-xl font-bold text-white mb-2">Professional Analyst</h4>
                  <p className="text-slate-400 text-sm">For policy firms and agencies</p>
                </div>
                <div className="text-3xl font-bold text-white" aria-label="$49 per month">$49<span className="text-sm font-normal text-slate-500">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-12">
                {["Unlimited Audits", "Full Audit Dashboards", "Claude 3.5 Sonnet Reasoning", "Executive Summary Generator", "PDF Export Capabilities", "API Access"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
              <button onClick={onStart} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">Join Pro Today</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 sm:py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center" aria-hidden="true"><ShieldCheck className="w-5 h-5 text-white" /></div>
              <span className="text-lg font-bold tracking-tight text-slate-900">PolicyLens<span className="text-blue-600">AI</span></span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">Advancing governance through multi-agent intelligence. Built for analysts who need precision research in record time.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6">Product</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                {["Features", "Integrations", "Pricing", "Changelog"].map(l => <li key={l}><a href="#" className="hover:text-slate-900 transition-colors">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                {["About", "Careers", "Privacy", "Terms"].map(l => <li key={l}><a href="#" className="hover:text-slate-900 transition-colors">{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 mb-6">Connect</h5>
              <div className="flex gap-4">
                {[{ icon: Zap, label: "Twitter / X" }, { icon: Users, label: "LinkedIn" }, { icon: BarChart3, label: "GitHub" }].map(({ icon: Icon, label }) => (
                  <button key={label} aria-label={label} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-100 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 POLICYLENS AI. ALL RIGHTS RESERVED.</p>
            <div className="flex flex-wrap items-center gap-3">
              {["WCAG 2.1", "GDPR", "MIT License", "Open Source"].map(badge => (
                <span key={badge} className="px-2 py-0.5 bg-slate-50 rounded border border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">{badge}</span>
              ))}
              <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span>SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <p className="text-[10px] text-slate-300 tracking-wide text-center">
              Built by <span className="text-slate-400 font-semibold">Ahmad Rafi</span> — Founder &amp; Director, Insights Bangladesh · NagorikBD · Talk Bangladesh · AI Governance, 1 Division 356 Upazilas
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
