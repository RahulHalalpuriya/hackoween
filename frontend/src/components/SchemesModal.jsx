import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { X, FileText, ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SchemesModal({ onClose }) {
  const { t } = useTranslation();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      try {
        setLoading(true);
        const res = await axios.get('/api/schemes');
        if (res.data.success) {
          setSchemes(res.data.schemes);
        }
      } catch (err) {
        console.warn('Error loading schemes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl my-auto animate-fade-in text-white max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t('navbar.schemes')} (Kisan Welfare)</h2>
              <p className="text-xs text-slate-400">Subsidies, direct cash benefits, and crop insurance schemes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schemes List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-colors text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                    {scheme.title}
                  </h3>
                  <p className="text-[11px] text-blue-300 font-medium">{scheme.titleHi}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                  {scheme.statusBadge}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-blue-100 font-semibold">
                💰 Benefit: {scheme.benefit}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <p><strong>Eligibility:</strong> {scheme.eligibility}</p>
                <p><strong>Required Docs:</strong> {scheme.docsRequired?.join(', ')}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Your Farm Profile Matches Eligibility
                </span>
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
