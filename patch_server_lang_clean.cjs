const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The block starts at `const lang = ` and ends around `const i18n = t[lang] || t['en'];`
// I'll replace the entire block with a clean version.

const cleanBlock = `const lang = (req.headers['x-user-lang'] || 'en').toString();
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
      let parts = [\`Profil développeur spécialisé en \${cat}.\`];
      if (tests) parts.push("Une culture de test a été détectée sur plusieurs dépôts.");
      if (cicd) parts.push("L'intégration continue (CI/CD) est présente, signalant une bonne maturité DevOps.");
      if (docker) parts.push("L'utilisation de Docker indique une bonne maîtrise des environnements conteneurisés.");
      if (!tests && !cicd && !docker) parts.push("L'activité est principalement concentrée sur le code brut sans outillage DevOps apparent.");
      return parts.join(' ');
    },
    strengths: (cat, totalStars, totalForks, accountAgeYears, readmeCoveragePercent) => [
      \`Forte spécialisation en \${cat}\`,
      \`Validation par les pairs (\${totalStars} étoiles, \${totalForks} forks)\`,
      \`Pérennité du profil (\${accountAgeYears} ans d'ancienneté)\`,
      \`Documentation présente à \${readmeCoveragePercent}%\`
    ],
    growth: [
      'Exploration de patterns architecturaux transverses',
      "Amélioration des tests et de l'intégration continue",
      'Contributions à des noyaux open-source complexes',
      'Optimisation des pipelines CI/CD'
    ],
    velocity: (v) => \`\${v} dépôts majeurs / an\`,
    outreach: (topLang, name) => ({
      subject: \`Opportunité technique – Intérêt pour vos travaux en \${topLang}\`,
      body: \`Bonjour \${name}, j'ai examiné vos projets sur GitHub et...\`,
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
      let parts = [\`Developer profile specialized in \${cat}.\`];
      if (tests) parts.push("A testing culture was detected across multiple repositories.");
      if (cicd) parts.push("Continuous Integration (CI/CD) is present, signaling good DevOps maturity.");
      if (docker) parts.push("The use of Docker indicates proficiency with containerized environments.");
      if (!tests && !cicd && !docker) parts.push("Activity is primarily focused on raw code without apparent DevOps tooling.");
      return parts.join(' ');
    },
    strengths: (cat, totalStars, totalForks, accountAgeYears, readmeCoveragePercent) => [
      \`Strong specialization in \${cat}\`,
      \`Peer validation (\${totalStars} stars, \${totalForks} forks)\`,
      \`Profile longevity (\${accountAgeYears} years of activity)\`,
      \`Documentation present at \${readmeCoveragePercent}%\`
    ],
    growth: [
      'Exploration of cross-cutting architectural patterns',
      'Improvement of testing and continuous integration',
      'Contributions to complex open-source cores',
      'Optimization of CI/CD pipelines'
    ],
    velocity: (v) => \`\${v} major repos / year\`,
    outreach: (topLang, name) => ({
      subject: \`Technical Opportunity – Interest in your work in \${topLang}\`,
      body: \`Hello \${name}, I have reviewed your projects on GitHub and...\`,
      targetAngle: "Direct approach."
    }),
    levelExp: 'Expert',
    levelAdv: 'Advanced',
    levelInt: 'Intermediate'
  }
};
const i18n = t[lang] || t['en'];`;

const regex = /const lang = \(req\.headers\['x-user-lang'\].*?const i18n = t\[lang\] \|\| t\['en'\];/s;

code = code.replace(regex, cleanBlock);

fs.writeFileSync('server.ts', code);
