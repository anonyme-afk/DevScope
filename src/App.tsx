import { t, getBrowserLang } from './i18n';
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  LayoutDashboard,
  Layers,
  Briefcase,
  MessageSquare,
  FileCode2,
  Terminal,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { DeveloperIntelligence, AnalysisHistoryItem, ProjectAnalysis } from './types';
import { Navbar } from './components/Navbar';
import { SearchHero } from './components/SearchHero';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ProfileHeader } from './components/ProfileHeader';
import { OverviewTab } from './components/OverviewTab';
import { ProjectsDigestTab } from './components/ProjectsDigestTab';
import { RecruitmentIntelligenceTab } from './components/RecruitmentIntelligenceTab';
import { ReadmeModal } from './components/ReadmeModal';
import { ExportModal } from './components/ExportModal';
import { DEMO_PRESET_ANALYSIS, SAMPLE_PROFILES } from './data/sampleProfiles';

export default function App() {
  const [currentIntelligence, setCurrentIntelligence] = useState<DeveloperIntelligence | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzingUsername, setAnalyzingUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [githubToken, setGithubToken] = useState<string>(() => localStorage.getItem('devscope_github_token') || '');
  const [rateLimit, setRateLimit] = useState<{ limit: number; remaining: number; reset: number } | null>(null);

  React.useEffect(() => {
    if (githubToken) localStorage.setItem('devscope_github_token', githubToken);
    else localStorage.removeItem('devscope_github_token');
  }, [githubToken]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'recruitment'>('overview');

  // Modals
  const [selectedReadmeProject, setSelectedReadmeProject] = useState<ProjectAnalysis | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Persistent storage (History)

  const [history, setHistory] = useState<AnalysisHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('devscope_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Add item to history
  const addToHistory = (intel: DeveloperIntelligence) => {
    const newItem: AnalysisHistoryItem = {
      username: intel.user.login,
      name: intel.user.name,
      avatar_url: intel.user.avatar_url,
      overallScore: intel.overallScore,
      archetype: intel.archetype,
      stars: intel.quantitativeMetrics.totalStars,
      analyzedAt: new Date().toISOString(),
    };

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.username.toLowerCase() !== intel.user.login.toLowerCase());
      const updated = [newItem, ...filtered].slice(0, 15);
      try {
        localStorage.setItem('devscope_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Main Analyze Trigger
  const handleAnalyze = async (usernameToAnalyze: string) => {
    const clean = usernameToAnalyze.trim().replace(/^@/, '');
    if (!clean) return;

    setIsLoading(true);
    setAnalyzingUsername(clean);
    setErrorMessage(null);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (githubToken) headers['x-github-token'] = githubToken;
      
      const response = await fetch('/api/analyze-github', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          username: clean,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erreur serveur (${response.status})`);
      }

      setCurrentIntelligence(data);
      addToHistory(data);
      setActiveTab('overview');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } catch (err: any) {
      console.error("Erreur d'analyse:", err);
      setErrorMessage(err.message || "Une erreur est survenue lors de l'extraction du profil GitHub.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentIntelligence(null);
    setErrorMessage(null);
    setAnalyzingUsername('');
  };

  const handleLoadDemo = () => {
    setCurrentIntelligence(DEMO_PRESET_ANALYSIS);
    addToHistory(DEMO_PRESET_ANALYSIS);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Navbar */}
      <Navbar
        currentAnalysis={currentIntelligence}
        history={history}
        onSelectHistory={handleAnalyze}
        onOpenExportModal={() => setIsExportOpen(true)}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Loading State with telemetry matrix */}
        {isLoading ? (
          <AnalysisLoader username={analyzingUsername} />
        ) : !currentIntelligence ? (
          /* Search Hero Landing View */
          <div>
            <SearchHero
              onSearch={handleAnalyze}
              isLoading={isLoading}
              history={history}
              errorMessage={errorMessage}
            />

            {/* Quick Demo Showcase Bar */}
            <div className="mx-auto max-w-2xl mt-4 mb-16 text-center">
              <button
                onClick={handleLoadDemo}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-950/40 px-4 py-2 text-xs font-semibold text-blue-300 transition-all hover:bg-blue-900/40 hover:border-blue-500/50 cursor-pointer shadow-lg shadow-zinc-950"
              >
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>Charger la démonstration pré-analysée (@shadcn)</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Analysis Results Workspace */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Developer Profile Header */}
            <ProfileHeader
              intelligence={currentIntelligence}
              onOpenExport={() => setIsExportOpen(true)}
            />

            {/* Navigation Tabs Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {/* Tab: Overview & Radar */}
                <button
                  id="tab-overview"
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-blue-500/10 border border-blue-500/40 text-blue-400 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t('app.tab.overview')}</span>
                </button>

                {/* Tab: Projects & READMEs */}
                <button
                  id="tab-projects"
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'projects'
                      ? 'bg-blue-500/10 border border-blue-500/40 text-blue-400 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <FileCode2 className="h-4 w-4" />
                  <span>{t('app.tab.projects')}</span>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.2 font-mono text-[11px] text-blue-400">
                    {currentIntelligence.projectAnalyses.length}
                  </span>
                </button>

                {/* Tab: Recruitment Intelligence */}
                <button
                  id="tab-recruitment"
                  onClick={() => setActiveTab('recruitment')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'recruitment'
                      ? 'bg-blue-500/10 border border-blue-500/40 text-blue-400 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Recrutement & Guide d'Entretien</span>
                </button>
              </div>
            </div>

            {/* Active Tab View Rendering */}
            <div className="mt-6">
              {activeTab === 'overview' && (
                <OverviewTab
                  intelligence={currentIntelligence}
                  onNavigateToProjects={() => setActiveTab('projects')}
                />
              )}

              {activeTab === 'projects' && (
                <ProjectsDigestTab
                  projects={currentIntelligence.projectAnalyses}
                  onOpenReadme={(project) => setSelectedReadmeProject(project)}
                />
              )}

              {activeTab === 'recruitment' && (
                <RecruitmentIntelligenceTab intelligence={currentIntelligence} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-900 bg-zinc-950/80 py-8 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-zinc-400">DevScope</span>
            <span>—</span>
            <span>{t('app.footer.desc')}</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>{t('app.footer.powered')}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReadmeModal
        project={selectedReadmeProject}
        onClose={() => setSelectedReadmeProject(null)}
      />

      {isExportOpen && (
        <ExportModal
          intelligence={currentIntelligence}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
