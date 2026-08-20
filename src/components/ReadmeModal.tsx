import React, { useState } from 'react';
import { X, FileText, Copy, Check, ExternalLink, Code2, Sparkles } from 'lucide-react';
import { ProjectAnalysis } from '../types';

interface ReadmeModalProps {
  project: ProjectAnalysis | null;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  if (!project) return null;

  const content = project.rawReadmeSnippet || '# Aucun README disponible pour ce dépôt.';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[85vh] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="flex items-center gap-3 truncate">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base font-bold text-white truncate">
                  {project.repoName}
                </h3>
                <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-blue-400">
                  README.md
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate">{project.repoFullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-xs">
              <button
                onClick={() => setViewMode('formatted')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  viewMode === 'formatted'
                    ? 'bg-blue-500/20 text-blue-300 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Aperçu
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-blue-500/20 text-blue-300 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Source Brute
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copié' : 'Copier'}</span>
            </button>

            {/* GitHub Link */}
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Ouvrir sur GitHub"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* AI Digest Summary Callout */}
        <div className="bg-blue-950/30 border-b border-blue-500/20 px-6 py-3 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300">
            <strong className="text-blue-300">Synthèse heuristique extraite : </strong>
            {project.summary}
          </div>
        </div>

        {/* Modal Body / Markdown content */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950/60 font-sans">
          {viewMode === 'raw' ? (
            <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap break-words leading-relaxed p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
              {content}
            </pre>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none space-y-4 text-zinc-200 leading-relaxed font-sans">
              <div className="whitespace-pre-wrap font-mono text-xs sm:text-sm bg-zinc-900/90 border border-zinc-800/80 p-5 rounded-xl text-zinc-200">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-6 py-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-mono">Langage : {project.language}</span>
            <span>•</span>
            <span className="font-mono">{project.stars.toLocaleString()} étoiles</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
