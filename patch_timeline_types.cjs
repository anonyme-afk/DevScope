const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  `    accountAgeYears: number;
    estimatedCodeVelocity: string;
  };`,
  `    accountAgeYears: number;
    estimatedCodeVelocity: string;
    activityTimeline?: { year: string; commits: number; repos_active: number }[];
  };`
);

fs.writeFileSync('src/types.ts', code);
