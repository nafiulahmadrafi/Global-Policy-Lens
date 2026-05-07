import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Section } from '../services/geminiService';
import { ImpactAnalysis, OverallScorecard } from '../services/claudeService';

interface PolicyContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  country: { label: string; value: string } | null;
  setCountry: (country: { label: string; value: string } | null) => void;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  analysisCache: Record<string, any>;
  setAnalysisCache: (cache: Record<string, any>) => void;
  impactCache: Record<string, ImpactAnalysis>;
  setImpactCache: (cache: Record<string, ImpactAnalysis>) => void;
  summary: OverallScorecard | null;
  setSummary: (summary: OverallScorecard | null) => void;
  reset: () => void;
}

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export function PolicyProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [country, setCountry] = useState<{ label: string; value: string } | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [analysisCache, setAnalysisCache] = useState<Record<string, any>>({});
  const [impactCache, setImpactCache] = useState<Record<string, ImpactAnalysis>>({});
  const [summary, setSummary] = useState<OverallScorecard | null>(null);

  const reset = () => {
    setFile(null);
    setCountry(null);
    setSections([]);
    setAnalysisCache({});
    setImpactCache({});
    setSummary(null);
  };

  return (
    <PolicyContext.Provider value={{
      file, setFile,
      country, setCountry,
      sections, setSections,
      analysisCache, setAnalysisCache,
      impactCache, setImpactCache,
      summary, setSummary,
      reset
    }}>
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicy() {
  const context = useContext(PolicyContext);
  if (context === undefined) {
    throw new Error('usePolicy must be used within a PolicyProvider');
  }
  return context;
}
