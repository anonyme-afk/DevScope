const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
code = code.replace(`import { Github`, `import { t } from '../i18n';\nimport { Github`);
code = code.replace(`>Quota / Token<`, `>{t('nav.quota')}<`);
code = code.replace(`>Exporter<`, `>{t('nav.export')}<`);
code = code.replace(`>Historique<`, `>{t('nav.history')}<`);
fs.writeFileSync('src/components/Navbar.tsx', code);
