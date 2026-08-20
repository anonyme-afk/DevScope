import React from 'react';
import { t } from '../i18n';
import { Github, Search, Key, History, Download, X } from 'lucide-react';
import { DeveloperIntelligence, AnalysisHistoryItem } from '../types';

interface NavbarProps {
  currentAnalysis: DeveloperIntelligence | null;
  history: AnalysisHistoryItem[];
  onSelectHistory: (username: string) => void;
  onOpenExportModal: () => void;
  onReset: () => void;
  onSettingsClick?: () => void;
  rateLimit?: { limit: number; remaining: number; reset: number } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAnalysis,
  history,
  onSelectHistory,
  onOpenExportModal,
  onReset,
  onSettingsClick,
  rateLimit,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <Github className="h-5 w-5 text-zinc-50" />
            <Search className="h-3.5 w-3.5 text-blue-200 absolute -bottom-1 -right-1" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-tight text-white">
                DevScope
              </span>
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-blue-300">
                PRO INTEL
              </span>
            </div>
            <p className="hidden text-xs text-zinc-400 sm:block">
              Audit & Extraction Algorithmique de Profils
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* History dropdown if items exist */}
          {history.length > 0 && (
            <div className="relative group">
              <button
                id="btn-history-dropdown"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
              >
                <History className="h-3.5 w-3.5 text-zinc-400" />
                <span className="hidden sm:inline">{t('nav.history')}</span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.2 font-mono text-[10px] text-blue-400">
                  {history.length}
                </span>
              </button>
              <div className="absolute right-0 mt-1 hidden w-64 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl group-hover:block z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Analyses Récentes
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 mt-1">
                  {history.map((item) => (
                    <button
                      key={item.username}
                      onClick={() => onSelectHistory(item.username)}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={item.avatar_url}
                          alt={item.username}
                          className="h-5 w-5 rounded-full ring-1 ring-zinc-700"
                        />
                        <span className="font-mono font-medium text-zinc-200 truncate">
                          @{item.username}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-blue-400">
                        {item.overallScore}/100
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Export Report button (if analysis exists) */}
          {currentAnalysis && (
            <button
              id="btn-export-dossier"
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 transition-all hover:bg-blue-500/20 hover:border-blue-500/50"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exporter Dossier</span>
            </button>
          )}

          {/* Close / Reset button */}
          {currentAnalysis && (
            <button
              id="btn-close-analysis"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            >
              <X className="h-3.5 w-3.5" />
              <span>Fermer le profil</span>
            </button>
          )}

          {/* GitHub Source Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
