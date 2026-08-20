import React, { useState } from 'react';
import {
  ExternalLink,
  MapPin,
  Building,
  Calendar,
  Sparkles,
  Award,
  Check,
  Copy,
  Star,
  GitFork,
  BookOpen,
  Users,
  MessageSquare,
  FileDown,
} from 'lucide-react';
import { t } from '../i18n';
import { DeveloperIntelligence } from '../types';

interface ProfileHeaderProps {
  intelligence: DeveloperIntelligence;
  onOpenExport: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  intelligence,
  onOpenExport,
}) => {
  const { user, overallScore, archetype, archetypeBadgeColor, seniorityEstimation, quantitativeMetrics } =
    intelligence;
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    if (score >= 80) return 'text-blue-300 border-blue-400/40 bg-blue-400/10';
    if (score >= 70) return 'text-blue-200 border-blue-300/40 bg-blue-300/10';
    return 'text-blue-100 border-blue-200/40 bg-blue-200/10';
  };

  const getScoreTier = (score: number) => {
    if (score >= 95) return 'Top 1% Elite Architect';
    if (score >= 88) return 'Top 5% Lead Craftsman';
    if (score >= 80) return 'Top 15% Senior Innovator';
    if (score >= 70) return 'Solid Core Contributor';
    return 'Rising Developer';
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinYear = user.created_at ? new Date(user.created_at).getFullYear() : '2020';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Background Subtle Gradient Mesh */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20 blur-3xl bg-blue-500"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left column: Avatar and Identity */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Avatar with status ring */}
          <div className="relative shrink-0">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 border-zinc-700 object-cover shadow-xl ring-4 ring-zinc-800/50"
            />
            {user.hireable && (
              <span
                title="Disponible pour de nouvelles opportunités"
                className="absolute -bottom-2 -right-2 rounded-full border border-blue-500/40 bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-zinc-950 shadow-md"
              >
                DISPO
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {user.name || user.login}
              </h1>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                @{user.login}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Archetype & Seniority Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 font-sans text-xs font-semibold text-blue-300 shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>{archetype}</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300">
                <Award className="h-3.5 w-3.5 text-blue-300" />
                <span>{seniorityEstimation}</span>
              </span>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="max-w-2xl text-sm text-zinc-300 leading-relaxed pt-1">
                {user.bio}
              </p>
            )}

            {/* Meta row: Location, Company, Join Date, Website */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-xs text-zinc-400">
              {user.company && (
                <div className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{user.company}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                <span>Membre depuis {joinYear} ({quantitativeMetrics.accountAgeYears} ans)</span>
              </div>
              {user.blog && (
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Site web</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Score Card & Quick Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0">
          {/* Overall DevScore Radial Block */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-xl">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-400"
                  strokeDasharray={`${overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-base font-extrabold text-white">
                {overallScore}
              </span>
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                DevScore™ Global
              </div>
              <div className={`text-xs font-semibold ${getScoreColor(overallScore).split(' ')[0]}`}>
                {getScoreTier(overallScore)}
              </div>
              <div className="text-[11px] text-zinc-500">{t('profile.algorithm')}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenExport}
              id="btn-open-export-modal"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <FileDown className="h-3.5 w-3.5 text-zinc-400" />
              <span>Dossier PDF / MD</span>
            </button>

            <button
              onClick={handleCopyLink}
              id="btn-copy-profile-link"
              title="Copier le lien"
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-blue-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Banner Bottom */}
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-zinc-800/80 pt-6 sm:grid-cols-4 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-white">
              {quantitativeMetrics.totalStars.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400">Étoiles cumulées</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-white">
              {user.public_repos}
            </div>
            <div className="text-[11px] text-zinc-400">Dépôts publics</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-white">
              {user.followers.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400">Followers</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3">
          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
            <GitFork className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-white">
              {quantitativeMetrics.totalForks.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400">Forks cumulés</div>
          </div>
        </div>
      </div>
    </div>
  );
};
