const fs = require('fs');

let codeApp = fs.readFileSync('src/App.tsx', 'utf8');
if (!codeApp.includes("import { t")) {
  codeApp = codeApp.replace(`import React`, `import { t, getBrowserLang } from './i18n';\nimport React`);
}
fs.writeFileSync('src/App.tsx', codeApp);

let codeMeth = fs.readFileSync('src/components/MethodologyModal.tsx', 'utf8');
if (!codeMeth.includes("import { t")) {
  codeMeth = codeMeth.replace(`import React`, `import { t } from '../i18n';\nimport React`);
}
fs.writeFileSync('src/components/MethodologyModal.tsx', codeMeth);

let codeAi = fs.readFileSync('src/components/AiAssistantTab.tsx', 'utf8');
if (!codeAi.includes("import { t")) {
  codeAi = codeAi.replace(`import React`, `import { t } from '../i18n';\nimport React`);
}
fs.writeFileSync('src/components/AiAssistantTab.tsx', codeAi);

