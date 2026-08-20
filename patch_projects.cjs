const fs = require('fs');
let code = fs.readFileSync('src/components/ProjectsDigestTab.tsx', 'utf8');
code = code.replace(`import { Github`, `import { t } from '../i18n';\nimport { Github`);
code = code.replace(`>Complexité technique<`, `>{t('projects.complexity')}<`);
code = code.replace(`>Voir le README<`, `>{t('projects.viewReadme')}<`);
code = code.replace(`Aucune description fournie.`, `{t('projects.noDescription')}`);
fs.writeFileSync('src/components/ProjectsDigestTab.tsx', code);
