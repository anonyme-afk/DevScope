const fs = require('fs');
let code = fs.readFileSync('src/data/sampleProfiles.ts', 'utf8');

code = code.replace(
  `estimatedCodeVelocity: '3.1 dépôts majeurs / an',`,
  `estimatedCodeVelocity: '3.1 dépôts majeurs / an',
    activityTimeline: [
      { year: '2022', commits: 45, repos_active: 8 },
      { year: '2023', commits: 120, repos_active: 15 },
      { year: '2024', commits: 350, repos_active: 28 },
      { year: '2025', commits: 480, repos_active: 38 },
      { year: '2026', commits: 290, repos_active: 22 },
    ]`
);

fs.writeFileSync('src/data/sampleProfiles.ts', code);
