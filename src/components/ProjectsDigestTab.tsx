import React, { useState, useMemo } from 'react';
import {
  Star,
  GitFork,
  ExternalLink,
  Search,
  FileText,
  SlidersHorizontal,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  Code,
  Gauge,
  Flame,
} from 'lucide-react';
import { ProjectAnalysis } from '../types';

interface ProjectsDigestTabProps {
  projects: ProjectAnalysis[];
  onOpenReadme: (project: ProjectAnalysis) => void;
}

export const ProjectsDigestTab: React.FC<ProjectsDigestTabProps> = ({ projects, onOpenReadme }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'stars' | 'complexity' | 'recent'>('stars');
  const [onlyWithReadme, setOnlyWithReadme] = useState(false);

  // Extract unique languages for filter
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    projects.forEach((p) => {
      if (p.language && p.language !== 'Autre') langs.add(p.language);
    });
    return Array.from(langs);
  }, [projects]);

  // Filter & sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.architectureType.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLang = selectedLanguage === 'ALL' || p.language === selectedLanguage;
        const matchesReadme = !onlyWithReadme || p.hasReadme;

        return matchesSearch && matchesLang && matchesReadme;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return b.stars - a.stars;
        if (sortBy === 'complexity') return b.complexityScore - a.complexityScore;
        if (sortBy === 'recent') return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime();
        return 0;
      });
  }, [projects, searchQuery, selectedLanguage, sortBy, onlyWithReadme]);

  const getComplexityColor = (score: number) => {
    if (score >= 8) return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    if (score >= 6) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom de projet, techno, architecture..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          {/* Filters and Sorting Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Language filter dropdown */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 outline-none focus:border-blue-500/50"
            >
              <option value="ALL">Tous les langages</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>

            {/* Sort by dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 outline-none focus:border-blue-500/50"
            >
              <option value="stars">Trier par : Étoiles (Stars)</option>
              <option value="complexity">Trier par : Complexité technique</option>
              <option value="recent">Trier par : Récemment mis à jour</option>
            </select>

            {/* Toggle README only */}
            <button
              onClick={() => setOnlyWithReadme(!onlyWithReadme)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                onlyWithReadme
                  ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>README uniquement</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-2.5 text-xs text-zinc-400">
          <span>
            Affichage de <strong className="text-white">{filteredProjects.length}</strong> projet(s) sur{' '}
            {projects.length}
          </span>
          <span className="font-mono text-[11px] text-blue-400">
            Extraction & Digestion sémantique heuristique
          </span>
        </div>
      </div>

      {/* Projects List Cards */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-400">
          <SlidersHorizontal className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
          <p className="text-base font-semibold text-zinc-300">Aucun projet ne correspond à vos filtres</p>
          <p className="text-xs text-zinc-500 mt-1">Essayez de réinitialiser la recherche ou le filtre de langage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredProjects.map((project) => {
            const pushDate = new Date(project.pushedAt).toLocaleDateString('fr-FR', {
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={project.repoFullName}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl backdrop-blur-md transition-all hover:border-zinc-700 hover:shadow-blue-500/5"
              >
                <div>
                  {/* Card Header: Title & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group-hover:text-blue-400 flex items-center gap-1.5 font-mono text-base font-bold text-white transition-colors"
                        >
                          <span>{project.repoName}</span>
                          <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                        </a>
                      </div>
                      <div className="font-mono text-xs text-zinc-500 mt-0.5">
                        {project.repoFullName}
                      </div>
                    </div>

                    {/* Complexity Pill */}
                    <div
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-mono font-bold shrink-0 ${getComplexityColor(
                        project.complexityScore
                      )}`}
                      title="Complexité technique estimée de 1 à 10"
                    >
                      <Gauge className="h-3.5 w-3.5" />
                      <span>{project.complexityScore}/10</span>
                    </div>
                  </div>

                  {/* Architecture & Language tags */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300">
                      <Layers className="h-3 w-3 text-blue-400" />
                      <span>{project.architectureType}</span>
                    </span>

                    {project.language && (
                      <span className="rounded-md border border-zinc-700 bg-zinc-950 px-2 py-0.5 font-mono text-xs text-zinc-300">
                        {project.language}
                      </span>
                    )}

                    {project.hasReadme && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                        <FileText className="h-3 w-3" />
                        <span>README digéré</span>
                      </span>
                    )}
                  </div>

                  {/* Digested Summary Box */}
                  <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Résumé Exécutif du Projet :</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Key Features from README */}
                  {project.keyFeatures && project.keyFeatures.length > 0 && (
                    <div className="mt-3.5">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Fonctionnalités Clés Extraites du README :
                      </div>
                      <ul className="space-y-1.5">
                        {project.keyFeatures.slice(0, 4).map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Novelty Highlight */}
                  {project.noveltyHighlight && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-sky-950/30 border border-sky-500/20 p-2.5 text-xs text-sky-200">
                      <Flame className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                      <span>
                        <strong className="text-sky-100">Ce qui démarque : </strong>
                        {project.noveltyHighlight}
                      </span>
                    </div>
                  )}

                  {/* Tech Stack Pills */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="rounded bg-zinc-800/80 px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Stars, Forks, Date & Readme Modal Trigger */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-3 text-xs">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-zinc-400">
                    <div className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-400/20" />
                      <span>{project.stars.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{project.forks}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{pushDate}</span>
                    </div>
                  </div>

                  {project.hasReadme && (
                    <button
                      onClick={() => onOpenReadme(project)}
                      className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-blue-500/40 hover:bg-zinc-700 hover:text-white"
                    >
                      <FileText className="h-3.5 w-3.5 text-blue-400" />
                      <span>Lire le README</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
