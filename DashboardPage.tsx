import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { usePolicy } from '../context/PolicyContext';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { country, summary, sections, impactCache } = usePolicy();

  if (!summary || !country) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">No report found</h1>
          <button 
            onClick={() => navigate('/upload')}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg"
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 sm:p-12">
      <button 
        onClick={() => navigate('/upload')}
        className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
      >
        <X className="w-4 h-4" /> Exit Report
      </button>
      <Dashboard 
        country={country.label}
        summary={summary}
        sections={sections}
        analyses={impactCache}
      />
    </div>
  );
}
