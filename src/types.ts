export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: { key: string; name: string; spdx_id: string } | null;
  default_branch: string;
  topics?: string[];
  readmeContent?: string;
  languagesBreakdown?: Record<string, number>;
}

export interface ProjectAnalysis {
  repoName: string;
  repoFullName: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  description: string;
  summary: string;
  keyFeatures: string[];
  techStack: string[];
  architectureType: string;
  complexityScore: number; // 1 to 10
  noveltyHighlight: string;
  hasReadme: boolean;
  rawReadmeSnippet?: string;
  pushedAt: string;
}

export interface SkillsRadar {
  frontend: number;
  backend: number;
  devopsCloud: number;
  architectureDesign: number;
  openSourceImpact: number;
  codeQualityDocs: number;
  aiDataEngineering: number;
  systemsAlgorithms: number;
}

export interface DeveloperIntelligence {
  user: GitHubUser;
  overallScore: number; // 0-100
  archetype: string;
  archetypeBadgeColor: string;
  seniorityEstimation: string;
  executiveSummary: string;
  strengths: string[];
  growthOpportunities: string[];
  skillsRadar: SkillsRadar;
  topTechnologies: { name: string; category: string; level: 'Expert' | 'Avancé' | 'Intermédiaire' }[];
  languageDistribution: { name: string; count: number; percentage: number; color: string }[];
  quantitativeMetrics: {
    totalStars: number;
    totalForks: number;
    totalReposAnalyzed: number;
    avgStarsPerRepo: number;
    activeProjectsCount: number;
    readmeCoveragePercent: number;
    licenseCoveragePercent: number;
    accountAgeYears: number;
    estimatedCodeVelocity: string;
    activityTimeline?: { year: string; commits: number; repos_active: number }[];
  };
  interviewGuide: {
    technicalQuestions: { question: string; relatedProject: string; expectedDepth: string }[];
    architecturalTopics: string[];
    softSkillHighlights: string[];
  };
  personalizedOutreachMessage: {
    subject: string;
    body: string;
    targetAngle: string;
  };
  projectAnalyses: ProjectAnalysis[];
  analyzedAt: string;
  rateLimit?: { limit: number; remaining: number; reset: number };
}

export interface AnalysisHistoryItem {
  username: string;
  name: string | null;
  avatar_url: string;
  overallScore: number;
  archetype: string;
  stars: number;
  analyzedAt: string;
}
