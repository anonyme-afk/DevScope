const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newEval = `    const evaluateProfile = () => {
      const categoryWeights = { frontend: 0, backend: 0, devops: 0, data_ai: 0, systems: 0 };
      let totalTests = 0, totalCICD = 0, totalDocker = 0, totalIaC = 0, totalLicense = 0;

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
        const repoStr = \`\${repo.language} \${repo.description} \${repo.topics.join(' ')}\`.toLowerCase();
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
          if (repo.signals.hasLicense) totalLicense++;
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

      // Templated Executive Summary
      const regSignal = accountAgeYears > 4 ? 'une activité pérenne' : 'une présence active';
      const ciSignal = totalCICD > 0 ? \`L'intégration continue (CI/CD) est présente sur \${totalCICD} projets, signalant une bonne maturité de déploiement.\` : '';
      const testSignal = totalTests > 0 ? \`Une culture de test a été détectée sur \${totalTests} dépôts (\${Math.round(totalTests/reposForGemini.length*100)}% de couverture).\` : 'Peu de tests détectés formellement.';
      
      const execSummary = \`Ce profil montre \${regSignal} sur \${accountAgeYears} ans, avec une spécialisation marquée en \${dominantCategory.replace('_', ' ')}. Le développeur cumule \${totalReposAnalyzed} projets (\${totalStars} étoiles). \${ciSignal} \${testSignal} L'analyse des arborescences suggère une maîtrise \${isSenior ? 'avancée' : 'intermédiaire'} des pratiques de production.\`;

      const projectAnalyses = reposForGemini.map((repo) => {
        const repoStr = \`\${repo.language} \${repo.description} \${repo.topics.join(' ')}\`.toLowerCase();
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
          noveltyHighlight: repo.stars > 0 ? \`Validé par la communauté avec \${repo.stars} étoiles.\` : 'Implémentation technique personnelle.',
        };
      });`;

const startIdx = code.indexOf('    const evaluateProfile = () => {');
const endIdx = code.indexOf('      return {', startIdx);
code = code.substring(0, startIdx) + newEval + '\n' + code.substring(endIdx);
fs.writeFileSync('server.ts', code);
