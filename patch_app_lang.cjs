const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(`import { t } from './i18n';`, `import { t, getBrowserLang } from './i18n';`);
code = code.replace(
  `        headers: {
          'Content-Type': 'application/json',
          ...(githubToken ? { 'x-github-token': githubToken } : {}),
        },`,
  `        headers: {
          'Content-Type': 'application/json',
          'x-user-lang': getBrowserLang(),
          ...(githubToken ? { 'x-github-token': githubToken } : {}),
        },`
);
fs.writeFileSync('src/App.tsx', code);
