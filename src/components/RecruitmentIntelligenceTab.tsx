import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Layers,
  HeartHandshake,
  Mail,
  Copy,
  Check,
  Send,
  Briefcase,
  Target,
  FileCode,
} from 'lucide-react';
import { DeveloperIntelligence } from '../types';

interface RecruitmentIntelligenceTabProps {
  intelligence: DeveloperIntelligence;
}

export const RecruitmentIntelligenceTab: React.FC<RecruitmentIntelligenceTabProps> = ({
  intelligence,
}) => {
  const { interviewGuide, personalizedOutreachMessage, user, seniorityEstimation, archetype } =
    intelligence;

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [outreachAngle, setOutreachAngle] = useState<'tech' | 'leadership' | 'opensource'>('tech');

  const handleCopyEmail = () => {
    const fullText = `Objet : ${personalizedOutreachMessage.subject}\n\n${personalizedOutreachMessage.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Role Fit & Seniority */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-sky-600 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                <Briefcase className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Évaluation de Recrutement & Adéquation</h3>
              <p className="text-xs text-zinc-400">
                Guide calibré pour Tech Recruiters, Engineering Managers et CTOs
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-xs font-semibold text-sky-300">
              Niveau : {seniorityEstimation}
            </span>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-mono text-xs font-semibold text-blue-300">
              {archetype}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Tailored Technical Interview Questions */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Questions d'Entretien Technique Ciblées
            </h3>
            <p className="text-xs text-zinc-400">
              Générées spécifiquement à partir de ses projets réels et architectures analysées
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {interviewGuide.technicalQuestions.map((q, i) => (
            <div
              key={i}
              className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 transition-all hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 font-mono text-xs font-bold text-blue-400 mt-0.5">
                    0{i + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-snug">{q.question}</h4>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
                      <FileCode className="h-3.5 w-3.5 text-zinc-500" />
                      <span>
                        Basé sur le projet : <strong className="text-blue-300 font-mono">{q.relatedProject}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expected depth */}
              <div className="mt-3 rounded-lg bg-zinc-900/90 border border-zinc-800 p-3 text-xs text-zinc-300">
                <strong className="text-sky-300">Critères d'évaluation attendus : </strong>
                {q.expectedDepth}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Architectural Topics & Soft Skills */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Architecture Topics */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <Layers className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Sujets d'Architecture Système à aborder</h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {interviewGuide.architecturalTopics.map((topic, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                <Target className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Soft Skills & Collaboration */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Qualités Relationnelles & Clarté Déduites</h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {interviewGuide.softSkillHighlights.map((soft, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{soft}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Personalized Outreach Message Generator */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                Message d'Approche Personnalisé
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Prêt à envoyer par Email ou LinkedIn, hyper-contextualisé sur ses travaux
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyEmail}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300 transition-colors hover:bg-blue-500/20 w-full sm:w-auto"
          >
            {copiedEmail ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copiedEmail ? 'Copié !' : 'Copier le message'}</span>
          </button>
        </div>

        {/* Subject & Body */}
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">Objet de l'email :</div>
            <div className="font-semibold text-sm text-white mt-0.5">
              {personalizedOutreachMessage.subject}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
            <div className="text-[11px] font-mono text-zinc-500 uppercase mb-2">Corps du message :</div>
            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
              {personalizedOutreachMessage.body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
