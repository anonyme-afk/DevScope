import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper for GitHub headers
function getGitHubHeaders(customToken?: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'DevScope-AI-Profile-Analyzer',
  };
  if (customToken && customToken.trim()) {
    headers['Authorization'] = `token ${customToken.trim()}`;
  }
  return headers;
}

// Fetch GitHub Raw Readme helper
async function fetchRepoReadme(owner: string, repo: string, defaultBranch = 'main', headers: Record<string, string>): Promise<string> {
  try {
    // Attempt 1: GitHub API readme endpoint
    const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.content && data.encoding === 'base64') {
        const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
        return decoded.slice(0, 5000); // Take first 5000 chars for token efficiency
      }
    }
  } catch {
    // ignore
  }

  // Attempt 2: Raw GitHub usercontent fallback
  const branches = [defaultBranch, 'main', 'master', 'dev'];
  const filenames = ['README.md', 'readme.md', 'README', 'Readme.md', 'README.MD'];

  for (const branch of branches) {
    for (const file of filenames) {
      try {
        const rawRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`);
        if (rawRes.ok) {
          const text = await rawRes.text();
          if (text && !text.includes('404: Not Found')) {
            return text.slice(0, 5000);
          }
        }
      } catch {
        // continue next try
      }
    }
  }
  return '';
}

// Fetch GitHub Repo Tree Signals helper
async function fetchRepoTreeSignals(owner: string, repo: string, defaultBranch = 'main', headers: Record<string, string>) {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
    if (!res.ok) return { hasDocker: false, hasCICD: false, hasTests: false, hasIaC: false };
    const data = await res.json();
    if (!data.tree) return { hasDocker: false, hasCICD: false, hasTests: false, hasIaC: false };
    
    let hasDocker = false, hasCICD = false, hasTests = false, hasIaC = false;
    for (let i = 0; i < Math.min(data.tree.length, 5000); i++) {
      const p = data.tree[i].path.toLowerCase();
      if (p.includes('dockerfile') || p.includes('docker-compose')) hasDocker = true;
      if (p.startsWith('.github/workflows') || p.includes('.gitlab-ci') || p.includes('travis.yml')) hasCICD = true;
      if (p.includes('test/') || p.includes('__tests__') || p.endsWith('.spec.ts') || p.endsWith('.test.js') || p.endsWith('.test.ts')) hasTests = true;
      if (p.includes('terraform/') || p.endsWith('.tf') || p.includes('k8s/') || p.includes('helm/')) hasIaC = true;
    }
    return { hasDocker, hasCICD, hasTests, hasIaC };
  } catch {
    return { hasDocker: false, hasCICD: false, hasTests: false, hasIaC: false };
  }
}

// Language color mapping helper
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Solidity: '#AA6746',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Lua: '#000080',
  Zig: '#ec915c',
  Other: '#64748b',
};


// Extract rate limit from GitHub response
function extractRateLimit(res) {
  return {
    limit: parseInt(res.headers.get('x-ratelimit-limit') || '0', 10),
    remaining: parseInt(res.headers.get('x-ratelimit-remaining') || '0', 10),
    reset: parseInt(res.headers.get('x-ratelimit-reset') || '0', 10),
  };
}

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: Analyze GitHub Profile
app.post('/api/analyze-github', async (req, res) => {
  try {
    const { username } = req.body;

    const lang = (req.headers['x-user-lang'] || 'en').toString();
    const t = {
      fr: {
        errRequired: "Le pseudo GitHub est requis.",
        errNotFound: "Le profil GitHub n'existe pas.",
        errLimitUser: "Limite de requêtes de l'API GitHub atteinte. Veuillez renseigner un Token GitHub dans l'interface.",
        errApiUser: "Erreur GitHub API.",
        errLimitRepo: "Limite de requêtes atteinte lors de la récupération des dépôts. Veuillez ajouter un Token.",
        errApiRepo: "Erreur GitHub API (Dépôts).",
        errEmpty: "Cet utilisateur n'a aucun dépôt public (ou son profil est entièrement privé).",
        cat: { frontend: "Frontend", backend: "Backend", devops: "DevOps & Cloud", data: "Data & IA", systems: "Systèmes & Bas Niveau" },
        execTemplate: (cat, tests, cicd, docker) => {
          let parts = [`Profil développeur spécialisé en ${cat}.`];
          if (tests) parts.push("Une culture de test a été détectée sur plusieurs dépôts.");
          if (cicd) parts.push("L'intégration continue (CI/CD) est présente, signalant une bonne maturité DevOps.");
          if (docker) parts.push("L'utilisation de Docker indique une bonne maîtrise des environnements conteneurisés.");
          if (!tests && !cicd && !docker) parts.push("L'activité est principalement concentrée sur le code brut sans outillage DevOps apparent.");
          return parts.join(' ');
        },
        strengths: (cat, totalStars, totalForks, accountAgeYears, readmeCoveragePercent) => [
          `Forte spécialisation en ${cat}`,
          `Validation par les pairs (${totalStars} étoiles, ${totalForks} forks)`,
          `Pérennité du profil (${accountAgeYears} ans d'ancienneté)`,
          `Documentation présente à ${readmeCoveragePercent}%`
        ],
        growth: [
          'Exploration de patterns architecturaux transverses',
          "Amélioration des tests et de l'intégration continue",
          'Contributions à des noyaux open-source complexes',
          'Optimisation des pipelines CI/CD'
        ],
        velocity: (v) => `${v} dépôts majeurs / an`,
        outreach: (topLang, name) => ({
          subject: `Opportunité technique – Intérêt pour vos travaux en ${topLang}`,
          body: `Bonjour ${name}, j'ai examiné vos projets sur GitHub et...`,
          targetAngle: "Approche directe."
        }),
        levelExp: 'Expert',
        levelAdv: 'Avancé',
        levelInt: 'Intermédiaire'
      },
      en: {
        errRequired: "GitHub username is required.",
        errNotFound: "GitHub profile does not exist.",
        errLimitUser: "GitHub API rate limit reached. Please provide a GitHub Token in the interface.",
        errApiUser: "GitHub API Error.",
        errLimitRepo: "Rate limit reached while fetching repositories. Please add a Token.",
        errApiRepo: "GitHub API Error (Repos).",
        errEmpty: "This user has no public repositories.",
        cat: { frontend: "Frontend", backend: "Backend", devops: "DevOps & Cloud", data: "Data & AI", systems: "Systems & Low Level" },
        execTemplate: (cat, tests, cicd, docker) => {
          let parts = [`Developer profile specialized in ${cat}.`];
          if (tests) parts.push("A testing culture was detected across multiple repositories.");
          if (cicd) parts.push("Continuous Integration (CI/CD) is present, signaling good DevOps maturity.");
          if (docker) parts.push("The use of Docker indicates proficiency with containerized environments.");
          if (!tests && !cicd && !docker) parts.push("Activity is primarily focused on raw code without apparent DevOps tooling.");
          return parts.join(' ');
        },
        strengths: (cat, totalStars, totalForks, accountAgeYears, readmeCoveragePercent) => [
          `Strong specialization in ${cat}`,
          `Peer validation (${totalStars} stars, ${totalForks} forks)`,
          `Profile longevity (${accountAgeYears} years of activity)`,
          `Documentation present at ${readmeCoveragePercent}%`
        ],
        growth: [
          'Exploration of cross-cutting architectural patterns',
          'Improvement of testing and continuous integration',
          'Contributions to complex open-source cores',
          'Optimization of CI/CD pipelines'
        ],
        velocity: (v) => `${v} major repos / year`,
        outreach: (topLang, name) => ({
          subject: `Technical Opportunity – Interest in your work in ${topLang}`,
          body: `Hello ${name}, I have reviewed your projects on GitHub and...`,
          targetAngle: "Direct approach."
        }),
        levelExp: 'Expert',
        levelAdv: 'Advanced',
        levelInt: 'Intermediate'
      }
    };
    const i18n = t[lang] || t['en'];
    const categoryNames = i18n.cat;

    const customToken = req.headers['x-github-token'] as string | undefined;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: i18n.errRequired });
    }

    const cleanUsername = username.trim().replace(/^@/, '');
    const headers = getGitHubHeaders(customToken);




    // 1. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${cleanUsername}`, { headers });
    let rateLimit = extractRateLimit(userRes);
    if (!userRes.ok) {
      if (userRes.status === 404) {
        return res.status(404).json({ error: i18n.errNotFound, rateLimit });
      }
      if (userRes.status === 403) {
        return res.status(429).json({
          error: i18n.errLimitUser,
          rateLimit
        });
      }
      return res.status(userRes.status).json({ error: i18n.errApiUser, rateLimit });
    }
    const user = await userRes.json();

    // 2. Fetch Repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${cleanUsername}/repos?per_page=100&sort=pushed&direction=desc`,
      { headers }
    );
    rateLimit = extractRateLimit(reposRes) || rateLimit;
    let repos: any[] = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    } else {
      if (reposRes.status === 403) {
        return res.status(429).json({
          error: i18n.errLimitRepo,
          rateLimit
        });
      }
      return res.status(reposRes.status).json({ error: i18n.errApiRepo, rateLimit });
    }

    if (repos.length === 0) {
      return res.status(404).json({ 
        error: i18n.errEmpty,
        rateLimit
      });
    }

    // 3. Compute Quantitative Metrics
    const ownRepos = repos.filter((r) => !r.fork);
    const analyzedReposList = ownRepos.length > 0 ? ownRepos : repos;

    const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
    const totalReposAnalyzed = repos.length;
    const avgStarsPerRepo = totalReposAnalyzed > 0 ? Math.round((totalStars / totalReposAnalyzed) * 10) / 10 : 0;

    // Language calculation
    const langCounts: Record<string, number> = {};
    for (const r of repos) {
      if (r.language) {
        langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      }
    }
    const totalReposWithLang = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const languageDistribution = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalReposWithLang) * 100),
        color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Other,
      }));

    // Calculate account age in years
    const createdDate = new Date(user.created_at);
    const now = new Date();
    const accountAgeYears = Math.max(0.1, Math.round(((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10);

    // Repos with license
    const reposWithLicense = repos.filter((r) => r.license !== null).length;
    const licenseCoveragePercent = totalReposAnalyzed > 0 ? Math.round((reposWithLicense / totalReposAnalyzed) * 100) : 0;

    // Sort repos to pick top significant repos for README extraction (up to 12)
    // Priority: own repos first, sorted by stars desc, then push recency
    const sortedRepos = [...analyzedReposList].sort((a, b) => {
      if ((b.stargazers_count || 0) !== (a.stargazers_count || 0)) {
        return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      }
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    });

    const topReposToExtract = sortedRepos.slice(0, 12);

    // 4. Fetch READMEs and deeper signals for top repositories
    const reposWithReadmes = await Promise.all(
      topReposToExtract.map(async (repo) => {
        const readmeContent = await fetchRepoReadme(repo.owner?.login || cleanUsername, repo.name, repo.default_branch, headers);
        const signals = await fetchRepoTreeSignals(repo.owner?.login || cleanUsername, repo.name, repo.default_branch, headers);
        return {
          ...repo,
          readmeContent,
          hasReadme: Boolean(readmeContent && readmeContent.trim().length > 20),
          signals,
        };
      })
    );

    const totalReadmesCount = reposWithReadmes.filter((r) => r.hasReadme).length;
    const readmeCoveragePercent = topReposToExtract.length > 0 ? Math.round((totalReadmesCount / topReposToExtract.length) * 100) : 0;

    // Prepare repos summary payload for Gemini
    const reposForGemini = reposWithReadmes.map((r) => ({
      name: r.name,
      fullName: r.full_name,
      description: r.description || 'Aucune description',
      language: r.language || 'Non spécifié',
      stars: r.stargazers_count,
      forks: r.forks_count,
      topics: r.topics || [],
      homepage: r.homepage,
      pushedAt: r.pushed_at,
      readmeSnippet: r.readmeContent ? r.readmeContent.slice(0, 2000) : 'Aucun README disponible',
      hasReadme: r.hasReadme,
      signals: (r as any).signals || { hasDocker: false, hasCICD: false, hasTests: false, hasIaC: false },
    }));

    // 5. Structure deterministic intelligence without AI (Advanced Heuristic Engine)
    const evaluateProfile = () => {
      const categoryWeights = { frontend: 0, backend: 0, devops: 0, data_ai: 0, systems: 0 };
      let totalTests = 0, totalCICD = 0, totalDocker = 0, totalIaC = 0, totalLicense = reposWithLicense;

      const countMatches = (text: string, arr: string[], words: string[]) => {
        let count = 0;
        const lowerText = text.toLowerCase();
        words.forEach((w) => {
          if (arr.includes(w) || lowerText.includes(w)) count++;
        });
        return count;
      };

      const frontendTags = ['react', 'vue', 'angular', 'svelte', 'frontend', 'ui', 'tailwind', 'css', 'html', 'javascript', 'typescript', 'nextjs', 'nuxt'];
      const backendTags = ['backend', 'api', 'server', 'node', 'django', 'flask', 'spring', 'laravel', 'sql', 'database', 'redis', 'postgres', 'java', 'ruby', 'php', 'c#'];
      const devopsTags = ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci', 'cd', 'terraform', 'devops', 'infrastructure', 'shell', 'bash'];
      const dataAiTags = ['machine-learning', 'deep-learning', 'ai', 'data-science', 'python', 'jupyter', 'pytorch', 'tensorflow', 'nlp', 'data'];
      const systemsTags = ['rust', 'c', 'c++', 'systems', 'kernel', 'os', 'compiler', 'webassembly', 'golang', 'go'];

      reposForGemini.forEach((repo) => {
        const repoStr = `${repo.language} ${repo.description} ${repo.topics.join(' ')}`.toLowerCase();
        categoryWeights.frontend += countMatches(repoStr, repo.topics, frontendTags);
        categoryWeights.backend += countMatches(repoStr, repo.topics, backendTags);
        categoryWeights.devops += countMatches(repoStr, repo.topics, devopsTags);
        categoryWeights.data_ai += countMatches(repoStr, repo.topics, dataAiTags);
        categoryWeights.systems += countMatches(repoStr, repo.topics, systemsTags);

        if (repo.signals) {
          if (repo.signals.hasTests) totalTests++;
          if (repo.signals.hasCICD) { totalCICD++; categoryWeights.devops += 2; }
          if (repo.signals.hasDocker) { totalDocker++; categoryWeights.devops += 1; }
          if (repo.signals.hasIaC) { totalIaC++; categoryWeights.devops += 2; }

        }
      });

      const dominantCategory = (Object.keys(categoryWeights) as (keyof typeof categoryWeights)[]).reduce((a, b) =>
        categoryWeights[a] > categoryWeights[b] ? a : b
      );

      let archetype = 'Software Engineer';
      let archetypeBadgeColor = '#3b82f6';
      if (dominantCategory === 'frontend') { archetype = 'Frontend Engineer'; archetypeBadgeColor = '#eab308'; }
      else if (dominantCategory === 'backend') { archetype = 'Backend Engineer'; archetypeBadgeColor = '#10b981'; }
      else if (dominantCategory === 'devops') { archetype = 'DevOps & Infra Engineer'; archetypeBadgeColor = '#8b5cf6'; }
      else if (dominantCategory === 'data_ai') { archetype = 'Data & AI Engineer'; archetypeBadgeColor = '#f43f5e'; }
      else if (dominantCategory === 'systems') { archetype = 'Systems Engineer'; archetypeBadgeColor = '#f97316'; }

      const isSenior = accountAgeYears >= 5 || totalStars > 100 || totalCICD > 2 || totalTests > 3;
      if (isSenior) archetype = 'Senior ' + archetype;
      else if (accountAgeYears >= 3) archetype = 'Mid-Level ' + archetype;

      const normalize = (val: number, max: number) => Math.min(100, Math.round((val / max) * 100));

      const frontendScore = 40 + normalize(categoryWeights.frontend, 20);
      const backendScore = 40 + normalize(categoryWeights.backend, 20);
      const devopsScore = 40 + normalize(categoryWeights.devops, 15);
      const systemsScore = 30 + normalize(categoryWeights.systems, 15);
      const aiDataScore = 30 + normalize(categoryWeights.data_ai, 15);

      const openSourceScore = Math.min(100, 30 + normalize(totalStars, 500) + normalize(totalForks, 100) + normalize(totalLicense, 5) * 0.2);
      const qualityScore = Math.min(100, 40 + (readmeCoveragePercent / 2) + normalize(totalTests, 5) * 0.4 + normalize(totalCICD, 5) * 0.2);
      const architectureScore = Math.min(100, 50 + (isSenior ? 20 : 0) + normalize(categoryWeights.backend + categoryWeights.systems, 30) + normalize(totalDocker, 5) * 0.2);

      const overallScore = Math.round(
        (frontendScore + backendScore + devopsScore + systemsScore + aiDataScore + openSourceScore + qualityScore + architectureScore) / 8
      );

      const topLanguage = Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a])[0] || 'Inconnu';

      // Activity Timeline (Repos created & pushed per year)
      const activityTimeline = [];
      const yearsMap = {};
      reposForGemini.forEach(repo => {
        if (!repo.pushedAt) return;
        const pushYear = new Date(repo.pushedAt).getFullYear();
        if (!yearsMap[pushYear]) yearsMap[pushYear] = { year: pushYear.toString(), commits: 0, repos_active: 0 };
        yearsMap[pushYear].repos_active += 1;
        yearsMap[pushYear].commits += repo.stars + (repo.forks || 1) * 2 + 5; // Heuristic fake commit volume based on repo size
      });
      
      const years = Object.keys(yearsMap).sort((a, b) => parseInt(a) - parseInt(b));
      if (years.length === 1) {
         const y = parseInt(years[0]);
         yearsMap[y-1] = { year: (y-1).toString(), commits: 0, repos_active: 0 };
         years.unshift((y-1).toString());
      }
      years.forEach(y => {
        activityTimeline.push(yearsMap[y]);
      });


      // Templated Executive Summary
      const regSignal = accountAgeYears > 4 ? 'une activité pérenne' : 'une présence active';
      const ciSignal = totalCICD > 0 ? `L'intégration continue (CI/CD) est présente sur ${totalCICD} projets, signalant une bonne maturité de déploiement.` : '';
      const testSignal = totalTests > 0 ? `Une culture de test a été détectée sur ${totalTests} dépôts (${Math.round(totalTests/reposForGemini.length*100)}% de couverture).` : 'Peu de tests détectés formellement.';
      
      const execSummary = `Ce profil montre ${regSignal} sur ${accountAgeYears} ans, avec une spécialisation marquée en ${dominantCategory.replace('_', ' ')}. Le développeur cumule ${totalReposAnalyzed} projets (${totalStars} étoiles). ${ciSignal} ${testSignal} L'analyse des arborescences suggère une maîtrise ${isSenior ? 'avancée' : 'intermédiaire'} des pratiques de production.`;

      const projectAnalyses = reposForGemini.map((repo) => {
        const repoStr = `${repo.language} ${repo.description} ${repo.topics.join(' ')}`.toLowerCase();
        let arch = 'Application Standard';
        
        if (repo.signals && repo.signals.hasIaC) arch = 'Infrastructure as Code';
        else if (repo.signals && repo.signals.hasDocker && countMatches(repoStr, repo.topics, ['api', 'backend', 'server']) > 0) arch = 'Microservice / Conteneur Backend';
        else if (countMatches(repoStr, repo.topics, ['api', 'backend', 'server']) > 0) arch = 'API / Serveur Backend';
        else if (countMatches(repoStr, repo.topics, ['react', 'vue', 'ui', 'frontend']) > 0) arch = 'Application Frontend SPA';
        else if (countMatches(repoStr, repo.topics, ['cli', 'terminal', 'tool']) > 0) arch = 'Outil CLI / Script';
        else if (countMatches(repoStr, repo.topics, ['library', 'sdk', 'package']) > 0) arch = 'Bibliothèque / SDK';

        const complexity = Math.min(10, 3 + repo.topics.length / 2 + (repo.readmeSnippet.length > 500 ? 1 : 0) + (repo.stars > 10 ? 2 : 0) + (repo.signals && repo.signals.hasTests ? 1 : 0) + (repo.signals && repo.signals.hasCICD ? 2 : 0) + (repo.signals && repo.signals.hasDocker ? 1 : 0));

        return {
          repoName: repo.name,
          summary: repo.description || 'Projet de développement logiciel sans description.',
          keyFeatures: repo.topics.length > 0 ? repo.topics : [repo.language || 'Code', 'Automatisation'],
          techStack: repo.language ? [repo.language, ...repo.topics.slice(0, 3)] : ['Technologie Inconnue'],
          architectureType: arch,
          complexityScore: Math.round(complexity),
          noveltyHighlight: repo.stars > 0 ? `Validé par la communauté avec ${repo.stars} étoiles.` : 'Implémentation technique personnelle.',
        };
      });

      return {
        overallScore,
        archetype,
        archetypeBadgeColor,
        seniorityEstimation: isSenior ? 'Senior' : 'Intermédiaire',
        executiveSummary: execSummary,
        strengths: i18n.strengths(categoryNames[dominantCategory] || dominantCategory, totalStars, totalForks, accountAgeYears, readmeCoveragePercent),
        growthOpportunities: i18n.growth,
        skillsRadar: {
          frontend: frontendScore,
          backend: backendScore,
          devopsCloud: devopsScore,
          architectureDesign: architectureScore,
          openSourceImpact: openSourceScore,
          codeQualityDocs: qualityScore,
          aiDataEngineering: aiDataScore,
          systemsAlgorithms: systemsScore,
        },
        topTechnologies: languageDistribution.slice(0, 5).map((lang) => ({
          name: lang.name,
          category: 'Langage Core',
          level: lang.count > 5 ? 'Expert' : lang.count > 2 ? 'Avancé' : 'Intermédiaire',
        })),
        projectAnalyses: projectAnalyses,
        interviewGuide: {
          technicalQuestions: [
            {
              question: `Pouvez-vous nous détailler l'architecture et les choix techniques de ${reposForGemini[0]?.name || 'votre projet principal'} ?`,
              relatedProject: reposForGemini[0]?.name || 'Projet majeur',
              expectedDepth: "Attente sur la clarté des patterns d'architecture et la gestion d'état.",
            },
            {
              question: `Comment gérez-vous la dette technique et la couverture de tests sur vos projets en ${topLanguage} ?`,
              relatedProject: 'Général',
              expectedDepth: "Recherche d'une méthodologie rigoureuse (TDD, CI/CD).",
            },
            {
              question: `Au vu de votre orientation ${dominantCategory.replace('_', ' ')}, quel est le défi d'ingénierie le plus complexe que vous ayez résolu ?`,
              relatedProject: 'Expérience passée',
              expectedDepth: "Évaluation de la profondeur technique et du problem solving.",
            },
          ],
          architecturalTopics: [
            `Scalabilité des systèmes ${dominantCategory.replace('_', ' ')}`,
            'Sécurité et gestion des vulnérabilités',
            'Optimisation des performances et gestion mémoire',
          ],
          softSkillHighlights: [
            'Autonomie et delivery open-source',
            'Communication asynchrone (commits, READMEs)',
            'Veille technologique continue',
          ],
        },
        personalizedOutreachMessage: {
          subject: `Opportunité technique – Intérêt pour vos travaux en ${topLanguage}`,
          body: `Bonjour ${
            user.name || user.login
          },\n\nNotre équipe technique a analysé avec grand intérêt vos dépôts GitHub. Vos travaux sur ${
            reposForGemini[0]?.name || 'vos projets'
          }, couplés à votre expertise évidente en ${topLanguage}, correspondent au niveau d'ingénierie que nous recherchons.\n\nSeriez-vous ouvert(e) à un échange technique sur vos projets ?\n\nCordialement,`,
          targetAngle: "Approche directe basée sur la qualité du code et l'empreinte open-source.",
        },
      };
    };

    const parsedAiResult = evaluateProfile();

    // Merge AI project analyses with raw repo metadata
    const finalProjectAnalyses = reposWithReadmes.map((repo) => {
      const matchedAi = parsedAiResult.projectAnalyses?.find(
        (p: any) => p.repoName?.toLowerCase() === repo.name?.toLowerCase()
      );
      return {
        repoName: repo.name,
        repoFullName: repo.full_name,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        language: repo.language || 'Autre',
        url: repo.html_url,
        description: repo.description || 'Aucune description fournie',
        summary: matchedAi?.summary || repo.description || 'Dépôt de code sur GitHub',
        keyFeatures: matchedAi?.keyFeatures || (repo.topics?.length ? repo.topics : ['Code source', 'Versionné sur Git']),
        techStack: matchedAi?.techStack || (repo.language ? [repo.language] : []),
        architectureType: matchedAi?.architectureType || 'Module Logiciel',
        complexityScore: matchedAi?.complexityScore || 5,
        noveltyHighlight: matchedAi?.noveltyHighlight || `Projet avec ${repo.stargazers_count || 0} étoiles`,
        hasReadme: repo.hasReadme,
        rawReadmeSnippet: repo.readmeContent ? repo.readmeContent.slice(0, 1500) : '',
        pushedAt: repo.pushed_at,
      };
    });

    // Final consolidated response
    const finalIntelligence = {
      user: {
        login: user.login,
        id: user.id,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        name: user.name,
        company: user.company,
        blog: user.blog,
        location: user.location,
        email: user.email,
        hireable: user.hireable,
        bio: user.bio,
        twitter_username: user.twitter_username,
        public_repos: user.public_repos,
        public_gists: user.public_gists,
        followers: user.followers,
        following: user.following,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      overallScore: Math.min(100, Math.max(10, parsedAiResult.overallScore || 75)),
      archetype: parsedAiResult.archetype || 'Développeur Full-Stack Polyvalent',
      archetypeBadgeColor: parsedAiResult.archetypeBadgeColor || '#3b82f6',
      seniorityEstimation: parsedAiResult.seniorityEstimation || 'Senior Engineer',
      executiveSummary: parsedAiResult.executiveSummary || 'Profil développeur avec une solide activité GitHub.',
      strengths: parsedAiResult.strengths || [],
      growthOpportunities: parsedAiResult.growthOpportunities || [],
      skillsRadar: parsedAiResult.skillsRadar || {
        frontend: 70,
        backend: 70,
        devopsCloud: 60,
        architectureDesign: 75,
        openSourceImpact: 65,
        codeQualityDocs: 70,
        aiDataEngineering: 50,
        systemsAlgorithms: 65,
      },
      topTechnologies: parsedAiResult.topTechnologies || [],
      languageDistribution,
      quantitativeMetrics: {
        totalStars,
        totalForks,
        totalReposAnalyzed,
        avgStarsPerRepo,
        activeProjectsCount: sortedRepos.length,
        readmeCoveragePercent,
        licenseCoveragePercent,
        accountAgeYears,
        estimatedCodeVelocity:
          accountAgeYears > 0 ? `${Math.round((totalReposAnalyzed / accountAgeYears) * 10) / 10} dépôts / an` : 'Actif',
      },
      interviewGuide: parsedAiResult.interviewGuide || {
        technicalQuestions: [],
        architecturalTopics: [],
        softSkillHighlights: [],
      },
      personalizedOutreachMessage: parsedAiResult.personalizedOutreachMessage || {
        subject: `Opportunité d'échange - Travaux GitHub de ${user.name || user.login}`,
        body: `Bonjour ${user.name || user.login}, j'ai examiné vos projets sur GitHub et...`,
        targetAngle: 'Projets Open-Source & Expertise Technique',
      },
      projectAnalyses: finalProjectAnalyses,
      analyzedAt: new Date().toISOString(),
    };

    return res.json(finalIntelligence);
  } catch (error: any) {
    console.error('Erreur lors de l\'analyse GitHub:', error);
    return res.status(500).json({
      error: error.message || "Une erreur est survenue lors de l'analyse du profil GitHub.",
    });
  }
});

// Vite & Static middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DevScope Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
