const fs = require('fs');

// App.tsx
let codeApp = fs.readFileSync('src/App.tsx', 'utf8');
codeApp = codeApp.replace(`<span>{t('app.tab.overview')}</span>`, `<span>{t('app.tab.overview')}</span>`); // just a test
codeApp = codeApp.replace(`import { t, getBrowserLang } from './i18n';`, `import { t, getBrowserLang } from './i18n';`);
fs.writeFileSync('src/App.tsx', codeApp);

// AiAssistantTab.tsx
let codeAi = fs.readFileSync('src/components/AiAssistantTab.tsx', 'utf8');
if (!codeAi.includes(`import { t } from '../i18n';`)) {
  codeAi = codeAi.replace(`import React`, `import { t } from '../i18n';\nimport React`);
}
fs.writeFileSync('src/components/AiAssistantTab.tsx', codeAi);

// MethodologyModal.tsx
let codeMeth = fs.readFileSync('src/components/MethodologyModal.tsx', 'utf8');
if (!codeMeth.includes(`import { t } from '../i18n';`)) {
  codeMeth = codeMeth.replace(`import React`, `import { t } from '../i18n';\nimport React`);
}
fs.writeFileSync('src/components/MethodologyModal.tsx', codeMeth);

