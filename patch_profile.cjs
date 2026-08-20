const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileHeader.tsx', 'utf8');
code = code.replace(`import { DeveloperIntelligence`, `import { t } from '../i18n';\nimport { DeveloperIntelligence`);
code = code.replace(`>Calcul algorithmique<`, `>{t('profile.algorithm')}<`);
code = code.replace(`>Score d'ingénierie<`, `>{t('profile.score')}<`);
code = code.replace(`>dépôts publics analysés<`, `>{t('profile.repos')}<`);
code = code.replace(`>Vélocité estimée<`, `>{t('profile.velocity')}<`);
fs.writeFileSync('src/components/ProfileHeader.tsx', code);
