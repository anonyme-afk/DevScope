import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Code,
  ShieldCheck,
  FileCheck,
  Gauge,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { DeveloperIntelligence } from '../types';
import { t } from '../i18n';
import { RadarChart } from './RadarChart';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

interface OverviewTabProps {
  intelligence: DeveloperIntelligence;
  onNavigateToProjects: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ intelligence, onNavigateToProjects }) => {
  const {
    executiveSummary,
    skillsRadar,
    strengths,
    growthOpportunities,
    topTechnologies,
    languageDistribution,
    quantitativeMetrics,
    projectAnalyses,
  } = intelligence;

  return (
    <div className="space-y-6">
      {/* 1. Executive Summary & Radar Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Executive Summary Card (7 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-white">Synthèse Exécutive Algorithmique</h3>
              </div>
              <span className="rounded-full bg-blue-950/80 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-mono text-blue-300">
                Advanced Algorithmic Analysis
              </span>
            </div>

            <div className="mt-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {executiveSummary}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-zinc-800/80 pt-4">
            <div className="rounded-xl bg-zinc-950/60 p-2.5 border border-zinc-800/60">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <FileCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>Couverture README</span>
              </div>
              <div className="font-mono text-sm font-bold text-white mt-1">
                {quantitativeMetrics.readmeCoveragePercent}%
              </div>
            </div>

            <div className="rounded-xl bg-zinc-950/60 p-2.5 border border-zinc-800/60">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Licences Open Source</span>
              </div>
              <div className="font-mono text-sm font-bold text-white mt-1">
                {quantitativeMetrics.licenseCoveragePercent}%
              </div>
            </div>

            <div className="rounded-xl bg-zinc-950/60 p-2.5 border border-zinc-800/60">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Gauge className="h-3.5 w-3.5 text-sky-400" />
                <span>Moyenne Étoiles / Repo</span>
              </div>
              <div className="font-mono text-sm font-bold text-white mt-1">
                {quantitativeMetrics.avgStarsPerRepo}
              </div>
            </div>

            <div className="rounded-xl bg-zinc-950/60 p-2.5 border border-zinc-800/60">
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                <span>Vélocité Estimée</span>
              </div>
              <div className="font-mono text-sm font-bold text-white mt-1 truncate">
                {quantitativeMetrics.estimatedCodeVelocity}
              </div>
            </div>
          </div>
        </div>

        {/* Radar Skills Matrix (5 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">{t('overview.radar')}</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">{t('overview.pillars')}</span>
          </div>

          <div className="py-2">
            <RadarChart skills={skillsRadar} size={300} />
          </div>

          {/* Quick radar legend badges */}
          <div className="grid grid-cols-2 gap-2 w-full pt-2 border-t border-zinc-800 text-[11px]">
            <div className="flex items-center justify-between bg-zinc-950/40 px-2.5 py-1 rounded-lg">
              <span className="text-zinc-400">Frontend :</span>
              <span className="font-mono font-bold text-blue-400">{skillsRadar.frontend}%</span>
            </div>
            <div className="flex items-center justify-between bg-zinc-950/40 px-2.5 py-1 rounded-lg">
              <span className="text-zinc-400">Backend :</span>
              <span className="font-mono font-bold text-sky-400">{skillsRadar.backend}%</span>
            </div>
            <div className="flex items-center justify-between bg-zinc-950/40 px-2.5 py-1 rounded-lg">
              <span className="text-zinc-400">Architecture :</span>
              <span className="font-mono font-bold text-purple-400">{skillsRadar.architectureDesign}%</span>
            </div>
            <div className="flex items-center justify-between bg-zinc-950/40 px-2.5 py-1 rounded-lg">
              <span className="text-zinc-400">Open Source :</span>
              <span className="font-mono font-bold text-emerald-400">{skillsRadar.openSourceImpact}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Strengths & Growth Areas Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Strengths Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">{t('overview.strengths')}</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {strengths.map((st, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Opportunities Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">{t('overview.growth')}</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {growthOpportunities.map((go, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                <span>{go}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Tech Stack Mastered & Language Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Top Mastered Technologies (7 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md lg:col-span-7">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Code className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">{t('overview.stack')}</h3>
            </div>
            <span className="text-xs text-zinc-400">{t('overview.stackDesc')}</span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {topTechnologies.map((tech, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-3.5 py-2.5 transition-colors hover:border-zinc-700"
              >
                <div>
                  <div className="font-semibold text-sm text-white">{tech.name}</div>
                  <div className="text-[11px] text-zinc-400">{tech.category}</div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                    tech.level === 'Expert'
                      ? 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
                      : tech.level === 'Avancé'
                      ? 'bg-sky-500/10 border border-sky-500/30 text-sky-300'
                      : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
                  }`}
                >
                  {tech.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution (5 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">{t('overview.langDist')}</h3>
              <span className="text-xs font-mono text-zinc-400">
                {languageDistribution.length} principaux
              </span>
            </div>

            {/* Visual Color Distribution Bar */}
            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-zinc-800">
              {languageDistribution.map((lang, i) => (
                <div
                  key={i}
                  style={{
                    width: `${Math.max(3, lang.percentage)}%`,
                    backgroundColor: lang.color,
                  }}
                  title={`${lang.name}: ${lang.percentage}%`}
                />
              ))}
            </div>

            {/* Language table */}
            <div className="mt-4 space-y-2">
              {languageDistribution.map((lang, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="font-medium text-zinc-200">{lang.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 font-mono">{lang.count} dépôts</span>
                    <span className="font-mono font-bold text-white">{lang.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateToProjects}
            className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-blue-400 transition-colors hover:border-blue-500/40 hover:bg-zinc-900"
          >
            <span>{t('overview.explore')} ({projectAnalyses.length})</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* 4. Timeline & Heatmap */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Activity Timeline (7 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md lg:col-span-7">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">{t('overview.timeline')}</h3>
            </div>
            <span className="text-xs text-zinc-400">{t('overview.timelineDesc')}</span>
          </div>
          <div className="h-48 w-full">
            {quantitativeMetrics.activityTimeline && quantitativeMetrics.activityTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quantitativeMetrics.activityTimeline}>
                  <XAxis dataKey="year" stroke="#52525b" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} axisLine={false} tickLine={false} width={30} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commits" 
                    name="Volume d'activité" 
                    stroke="#818cf8" 
                    strokeWidth={3} 
                    dot={{ fill: '#818cf8', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-500">Données insuffisantes pour la timeline.</div>
            )}
          </div>
        </div>

        {/* Heatmap des technologies (5 cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md lg:col-span-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">{t('overview.heatmap')}</h3>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={languageDistribution.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip 
                    cursor={{fill: '#27272a', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="percentage" name="Proportion (%)" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
