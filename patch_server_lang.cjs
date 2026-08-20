const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const getLangStr = `
const lang = (req.headers['x-user-lang'] || 'en').toString();
const t = {
  fr: {
    errRequired: "Le pseudo GitHub est requis.",
    errNotFound: \`Le profil GitHub "\${cleanUsername}" n'existe pas.\`,
    errLimitUser: "Limite de requêtes de l'API GitHub atteinte. Veuillez renseigner un Token GitHub dans l'interface.",
    errApiUser: \`Erreur GitHub API: \${userRes.statusText}\`,
    errLimitRepo: "Limite de requêtes atteinte lors de la récupération des dépôts. Veuillez ajouter un Token.",
    errApiRepo: \`Erreur GitHub API (Dépôts): \${reposRes.statusText}\`,
    errEmpty: \`L'utilisateur "\${cleanUsername}" n'a aucun dépôt public (ou son profil est entièrement privé). L'analyse requiert au moins un projet public.\`,
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
    errNotFound: \`GitHub profile "\${cleanUsername}" does not exist.\`,
    errLimitUser: "GitHub API rate limit reached. Please provide a GitHub Token in the interface.",
    errApiUser: \`GitHub API Error: \${userRes.statusText}\`,
    errLimitRepo: "Rate limit reached while fetching repositories. Please add a Token.",
    errApiRepo: \`GitHub API Error (Repos): \${reposRes.statusText}\`,
    errEmpty: \`User "\${cleanUsername}" has no public repositories. Analysis requires at least one public project.\`,
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
const i18n = t[lang] || t['en'];
`;

code = code.replace(
  `    const cleanUsername = username.trim().replace(/^@/, '');
    const headers = getGitHubHeaders(customToken);`,
  `    const cleanUsername = username.trim().replace(/^@/, '');
    const headers = getGitHubHeaders(customToken);\n` + getLangStr
);

// Error replacements
code = code.replace(`Le pseudo GitHub est requis.`, `\${i18n.errRequired}`);
code = code.replace(/Le profil GitHub.*n'existe pas./, `\${i18n.errNotFound}`);
code = code.replace(/Limite de requêtes de l'API GitHub atteinte.*/, `\${i18n.errLimitUser}`);
code = code.replace(/Erreur GitHub API: .*/, `\${i18n.errApiUser}`);
code = code.replace(/Limite de requêtes atteinte lors de la récupération des dépôts.*/, `\${i18n.errLimitRepo}`);
code = code.replace(/Erreur GitHub API \(Dépôts\): .*/, `\${i18n.errApiRepo}`);
code = code.replace(/L'utilisateur.*n'a aucun dépôt public.*/, `\${i18n.errEmpty}`);

code = code.replace(
  `const categoryNames = { frontend: 'Frontend', backend: 'Backend', devops: 'DevOps & Cloud', data: 'Data & IA', systems: 'Systèmes & Bas Niveau' };`,
  `const categoryNames = i18n.cat;`
);

code = code.replace(
  `let execSummary = \`Profil développeur spécialisé en \${dominantCategory.replace('_', ' ')}.\`;
      if (totalTests > 0) execSummary += ' Une culture de test a été détectée sur plusieurs dépôts.';
      if (totalCICD > 0) execSummary += " L'intégration continue (CI/CD) est présente, signalant une bonne maturité DevOps.";
      if (totalDocker > 0) execSummary += " L'utilisation de Docker indique une bonne maîtrise des environnements conteneurisés.";`,
  `let execSummary = i18n.execTemplate(categoryNames[dominantCategory] || dominantCategory, totalTests > 0, totalCICD > 0, totalDocker > 0);`
);

code = code.replace(
  /strengths: \[[^\]]*\],/s,
  `strengths: i18n.strengths(categoryNames[dominantCategory] || dominantCategory, totalStars, totalForks, accountAgeYears, readmeCoveragePercent),`
);

code = code.replace(
  /growthOpportunities: \[[^\]]*\],/s,
  `growthOpportunities: i18n.growth,`
);

code = code.replace(
  /estimatedCodeVelocity: \`\$\{Math.max\(1, Math.round\(totalReposAnalyzed \/ Math.max\(1, accountAgeYears\)\)\)\} dépôts majeurs \/ an\`,/s,
  `estimatedCodeVelocity: i18n.velocity(Math.max(1, Math.round(totalReposAnalyzed / Math.max(1, accountAgeYears)))),`
);

code = code.replace(
  `level: count > 3 ? 'Expert' : count > 1 ? 'Avancé' : 'Intermédiaire',`,
  `level: count > 3 ? i18n.levelExp : count > 1 ? i18n.levelAdv : i18n.levelInt,`
);

code = code.replace(
  /personalizedOutreachMessage: parsedAiResult.personalizedOutreachMessage \|\| \{[^}]*\},/s,
  `personalizedOutreachMessage: parsedAiResult.personalizedOutreachMessage || i18n.outreach(topLanguage, user.name || user.login),`
);

fs.writeFileSync('server.ts', code);
