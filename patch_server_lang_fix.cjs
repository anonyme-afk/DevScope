const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The replacement was partially incomplete, let's fix it properly by parsing out the error strings
code = code.replace(
  `return res.status(400).json({ error: "\${i18n.errRequired}" });`,
  `return res.status(400).json({ error: i18n.errRequired });`
);

code = code.replace(
  `return res.status(404).json({ error: \`Le profil GitHub "\${cleanUsername}" n'existe pas.\`, rateLimit });`,
  `return res.status(404).json({ error: i18n.errNotFound, rateLimit });`
);

code = code.replace(
  `          error: "Limite de requêtes de l'API GitHub atteinte. Veuillez renseigner un Token GitHub dans l'interface.",`,
  `          error: i18n.errLimitUser,`
);

code = code.replace(
  `return res.status(userRes.status).json({ error: \`Erreur GitHub API: \${userRes.statusText}\`, rateLimit });`,
  `return res.status(userRes.status).json({ error: i18n.errApiUser, rateLimit });`
);

code = code.replace(
  `          error: "Limite de requêtes atteinte lors de la récupération des dépôts. Veuillez ajouter un Token.",`,
  `          error: i18n.errLimitRepo,`
);

code = code.replace(
  `return res.status(reposRes.status).json({ error: \`Erreur GitHub API (Dépôts): \${reposRes.statusText}\`, rateLimit });`,
  `return res.status(reposRes.status).json({ error: i18n.errApiRepo, rateLimit });`
);

code = code.replace(
  `        error: \`L'utilisateur "\${cleanUsername}" n'a aucun dépôt public (ou son profil est entièrement privé). L'analyse requiert au moins un projet public.\`,`,
  `        error: i18n.errEmpty,`
);

fs.writeFileSync('server.ts', code);
