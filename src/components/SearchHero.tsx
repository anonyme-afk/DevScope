import React, { useState } from 'react';
import { Search, Github, Terminal, ArrowRight, Layers, FileCode2, Cpu, Flame } from 'lucide-react';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
import { AnalysisHistoryItem } from '../types';

import { HelpCircle } from 'lucide-react';

interface SearchHeroProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  history: AnalysisHistoryItem[];
  errorMessage: string | null;
  onOpenMethodology?: () => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  onSearch,
  isLoading,
  history,
  errorMessage,
  onOpenMethodology,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isLoading) {
      onSearch(inputVal.trim());
    }
  };

  const handleSelectSample = (username: string) => {
    setInputVal(username);
    onSearch(username);
  };

  return (
    <section className="relative mx-auto max-w-5xl px-4 pt-12 pb-16 sm:px-6 lg:px-8">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 flex justify-center overflow-hidden">
        <div className="h-96 w-[600px] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      {/* Header Eyebrow & Title */}
      <div className="relative text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 px-3.5 py-1 text-xs font-medium text-blue-300 shadow-inner">
          <div className="relative flex h-4 w-4 items-center justify-center">
            <Github className="h-4 w-4 text-blue-400" />
            <Search className="h-2.5 w-2.5 text-blue-200 absolute -bottom-1 -right-1" />
          </div>
          <span>Moteur d'Audit GitHub & Extraction Heuristique</span>
        </div>
        
        {onOpenMethodology && (
          <button 
            onClick={onOpenMethodology}
            className="absolute -top-2 right-0 flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Comment ça marche ?
          </button>
        )}

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Révélez le véritable calibre d'un{' '}
          <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            développeur GitHub
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-300">
          Entrez un pseudo GitHub. Notre algorithme extrait tous ses projets, digère les READMEs, évalue l'architecture, calcule la matrice de compétences et génère un dossier d'ingénierie complet.
        </p>
      </div>

      {/* Main Search Terminal Box */}
      <div className="relative mt-10">
        <form
          onSubmit={handleSubmit}
          className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20"
        >
          <div className="flex items-center gap-3 px-3">
            <Terminal className="h-5 w-5 text-blue-400 shrink-0" />
            <span className="font-mono text-sm sm:text-base text-zinc-500 select-none hidden sm:inline">github.com/</span>
            <input
              type="text"
              id="input-github-username"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Taper un pseudo GitHub ici... (ex: torvalds)"
              disabled={isLoading}
              autoFocus
              className="w-full bg-transparent font-mono text-base sm:text-lg text-white placeholder-zinc-500 outline-none focus:ring-0 disabled:opacity-50 py-3"
            />
            <button
              type="submit"
              id="btn-submit-search"
              disabled={!inputVal.trim() || isLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Analyse...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Lancer l'audit</span>
                  <span className="sm:hidden">Analyser</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message alert */}
        {errorMessage && (
          <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-300">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-rose-500/20 p-1 text-rose-400">✕</div>
              <div className="space-y-1">
                <p className="font-semibold text-rose-200">Erreur lors de l'extraction</p>
                <p className="text-xs text-rose-300/90">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Sample Profiles Chips */}
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2.5">
            <Flame className="h-3.5 w-3.5 text-blue-400" />
            <span>Exemples de développeurs renommés à tester en 1 clic :</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROFILES.map((sample) => (
              <button
                key={sample.username}
                type="button"
                onClick={() => handleSelectSample(sample.username)}
                disabled={isLoading}
                title={sample.desc}
                className="group flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 font-mono text-xs text-zinc-300 transition-all hover:border-blue-500/40 hover:bg-zinc-800 hover:text-white"
              >
                <span className="text-blue-400">@</span>
                <span>{sample.username}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent History if present */}
        {history.length > 0 && (
          <div className="mx-auto mt-5 max-w-2xl border-t border-zinc-800/80 pt-4">
            <span className="text-xs font-medium text-zinc-500">Vos dernières recherches : </span>
            <div className="inline-flex flex-wrap gap-2 mt-1.5">
              {history.slice(0, 5).map((item) => (
                <button
                  key={item.username}
                  type="button"
                  onClick={() => onSearch(item.username)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-700 hover:text-blue-300"
                >
                  <img src={item.avatar_url} alt={item.username} className="h-3.5 w-3.5 rounded-full" />
                  <span>@{item.username}</span>
                  <span className="font-mono text-[10px] text-blue-400">({item.overallScore}/100)</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feature Pillar Badges */}
      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:border-zinc-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 mb-3">
            <FileCode2 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Extraction READMEs</h3>
          <p className="mt-1 text-xs text-zinc-400">
            Télécharge et analyse les READMEs de tous les projets pour synthétiser leurs fonctionnalités réelles.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:border-zinc-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 mb-3">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Cartographie d'Architecture</h3>
          <p className="mt-1 text-xs text-zinc-400">
            Détecte les patterns architecturaux (Microservices, Monolith, CLI, Data Pipelines, Design Systems).
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:border-zinc-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 mb-3">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Radar de Compétences</h3>
          <p className="mt-1 text-xs text-zinc-400">
            Évalue 8 axes techniques précis avec notation de complexité technique par projet (1 à 10).
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:border-zinc-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 mb-3">
            <Terminal className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Kit d'Entretien Sur-Mesure</h3>
          <p className="mt-1 text-xs text-zinc-400">
            Génère des questions d'entretien technique ciblées sur son vrai code et un message d'approche sur-mesure.
          </p>
        </div>
      </div>
    </section>
  );
};
