import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Code2, Database, Terminal, Cpu } from 'lucide-react';

interface AnalysisLoaderProps {
  username: string;
}

const STAGES = [
  { id: 1, title: 'Extraction du profil GitHub', desc: 'Récupération des métadonnées, bio, followers et ancienneté', icon: Terminal },
  { id: 2, title: 'Scan des dépôts & langages', desc: 'Calcul des étoiles cumulées, forks, récence et vélocité', icon: Database },
  { id: 3, title: 'Extraction & parsing des READMEs', desc: 'Téléchargement et analyse sémantique des documentations projets', icon: Code2 },
  { id: 4, title: 'Synthèse cognitive heuristique', desc: 'Génération de l\'archétype, compétences radar, et guide d\'entretien', icon: Cpu },
];

const TELEMETRY_LOGS = [
  'Initialisation de la session d\'audit DevScope...',
  'Interrogation de api.github.com/users/:username',
  'Filtrage des dépôts sources (exclusion des forks passifs)',
  'Calcul de la répartition par octets de langages...',
  'Téléchargement des READMEs bruts (Markdown/AST)...',
  'Extraction des mots-clés d\'architecture et tech stack...',
  'Évaluation de la complexité algorithmique des dépôts...',
  'Modélisation du profil de développeur par moteur heuristique...',
  'Finalisation du dossier d\'ingénierie et recommandations...',
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ username }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    // Stage stepper interval
    const stageInterval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2800);

    // Telemetry log streamer
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev < TELEMETRY_LOGS.length - 1 ? prev + 1 : prev));
    }, 1400);

    return () => {
      clearInterval(stageInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      {/* Central Radar Pulse */}
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        <div className="absolute h-full w-full animate-ping rounded-full bg-cyan-500/20 opacity-75" />
        <div className="absolute h-20 w-20 animate-pulse rounded-full bg-indigo-500/30" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-xl shadow-cyan-500/30">
          <Sparkles className="h-8 w-8 text-white animate-spin" />
        </div>
      </div>

      {/* Target Developer info */}
      <h2 className="mt-6 text-2xl font-bold text-white">
        Audit approfondi en cours pour{' '}
        <span className="font-mono text-cyan-400">@{username}</span>
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Extraction des dépôts, digestion des READMEs et synthèse algorithmique...
      </p>

      {/* Step Progress List */}
      <div className="mt-8 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left shadow-2xl backdrop-blur-xl">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-4 rounded-xl p-3 transition-all ${
                isCurrent
                  ? 'border border-cyan-500/30 bg-cyan-950/30'
                  : isDone
                  ? 'bg-slate-950/40 opacity-80'
                  : 'opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                    {stage.id}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className={`text-sm font-semibold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                    {stage.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Terminal Log Stream */}
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-500">$</span>
          <span className="text-cyan-300 truncate">{TELEMETRY_LOGS[logIndex]}</span>
        </div>
        <span className="text-[11px] text-slate-500 shrink-0 ml-2">
          Étape {currentStageIndex + 1}/{STAGES.length}
        </span>
      </div>
    </div>
  );
};
