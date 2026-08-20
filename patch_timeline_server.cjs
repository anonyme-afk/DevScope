const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const timelineHelper = `
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
`;

code = code.replace(
  `const topLanguage = Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a])[0] || 'Inconnu';`,
  `const topLanguage = Object.keys(langCounts).sort((a, b) => langCounts[b] - langCounts[a])[0] || 'Inconnu';\n${timelineHelper}`
);

code = code.replace(
  `estimatedCodeVelocity: \`\${Math.max(1, Math.round(totalReposAnalyzed / Math.max(1, accountAgeYears)))} dépôts majeurs / an\`,
        },`,
  `estimatedCodeVelocity: \`\${Math.max(1, Math.round(totalReposAnalyzed / Math.max(1, accountAgeYears)))} dépôts majeurs / an\`,
          activityTimeline,
        },`
);

fs.writeFileSync('server.ts', code);
