const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const helper = `
// Extract rate limit from GitHub response
function extractRateLimit(res) {
  return {
    limit: parseInt(res.headers.get('x-ratelimit-limit') || '0', 10),
    remaining: parseInt(res.headers.get('x-ratelimit-remaining') || '0', 10),
    reset: parseInt(res.headers.get('x-ratelimit-reset') || '0', 10),
  };
}
`;

code = code.replace(`// API: Health check`, helper + '\n// API: Health check');

// Fix the userRes error branches
code = code.replace(
  `    const userRes = await fetch(\`https://api.github.com/users/\${cleanUsername}\`, { headers });
    if (!userRes.ok) {
      if (userRes.status === 404) {
        return res.status(404).json({ error: \`Le profil GitHub "\${cleanUsername}" n'existe pas.\` });
      }
      if (userRes.status === 403) {
        return res.status(429).json({
          error: "Limite de requêtes de l'API GitHub atteinte. Veuillez réessayer dans quelques minutes.",
        });
      }
      return res.status(userRes.status).json({ error: \`Erreur GitHub API: \${userRes.statusText}\` });
    }`,
  `    const userRes = await fetch(\`https://api.github.com/users/\${cleanUsername}\`, { headers });
    let rateLimit = extractRateLimit(userRes);
    if (!userRes.ok) {
      if (userRes.status === 404) {
        return res.status(404).json({ error: \`Le profil GitHub "\${cleanUsername}" n'existe pas.\`, rateLimit });
      }
      if (userRes.status === 403) {
        return res.status(429).json({
          error: "Limite de requêtes de l'API GitHub atteinte. Veuillez renseigner un Token GitHub dans l'interface.",
          rateLimit
        });
      }
      return res.status(userRes.status).json({ error: \`Erreur GitHub API: \${userRes.statusText}\`, rateLimit });
    }`
);

// Fix reposRes error branches
code = code.replace(
  `    const reposRes = await fetch(
      \`https://api.github.com/users/\${cleanUsername}/repos?per_page=100&sort=pushed&direction=desc\`,
      { headers }
    );
    let repos: any[] = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    } else {
      if (reposRes.status === 403) {
        return res.status(429).json({
          error: "Limite de requêtes atteinte lors de la récupération des dépôts.",
        });
      }
      return res.status(reposRes.status).json({ error: \`Erreur GitHub API (Dépôts): \${reposRes.statusText}\` });
    }`,
  `    const reposRes = await fetch(
      \`https://api.github.com/users/\${cleanUsername}/repos?per_page=100&sort=pushed&direction=desc\`,
      { headers }
    );
    rateLimit = extractRateLimit(reposRes) || rateLimit;
    let repos: any[] = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    } else {
      if (reposRes.status === 403) {
        return res.status(429).json({
          error: "Limite de requêtes atteinte lors de la récupération des dépôts. Veuillez ajouter un Token.",
          rateLimit
        });
      }
      return res.status(reposRes.status).json({ error: \`Erreur GitHub API (Dépôts): \${reposRes.statusText}\`, rateLimit });
    }`
);

code = code.replace(
  `    if (repos.length === 0) {
      return res.status(404).json({ 
        error: \`L'utilisateur "\${cleanUsername}" n'a aucun dépôt public (ou son profil est entièrement privé). L'analyse requiert au moins un projet public.\` 
      });
    }`,
  `    if (repos.length === 0) {
      return res.status(404).json({ 
        error: \`L'utilisateur "\${cleanUsername}" n'a aucun dépôt public (ou son profil est entièrement privé). L'analyse requiert au moins un projet public.\`,
        rateLimit
      });
    }`
);

// Append rateLimit to the final success JSON output
code = code.replace(
  `      personalizedOutreachMessage: parsedAiResult.personalizedOutreachMessage || {
        subject: \`Opportunité technique – Intérêt pour vos travaux en \${topLanguage}\`,
        body: \`Bonjour \${user.name || user.login}, j'ai examiné vos projets sur GitHub et...\`,
        targetAngle: "Approche directe.",
      },
    };

    return res.json(finalIntelligence);`,
  `      personalizedOutreachMessage: parsedAiResult.personalizedOutreachMessage || {
        subject: \`Opportunité technique – Intérêt pour vos travaux en \${topLanguage}\`,
        body: \`Bonjour \${user.name || user.login}, j'ai examiné vos projets sur GitHub et...\`,
        targetAngle: "Approche directe.",
      },
      rateLimit,
    };

    return res.json(finalIntelligence);`
);

fs.writeFileSync('server.ts', code);
