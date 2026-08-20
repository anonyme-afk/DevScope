const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  `  analyzedAt: string;
}`,
  `  analyzedAt: string;
  rateLimit?: { limit: number; remaining: number; reset: number };
}`
);

fs.writeFileSync('src/types.ts', code);
