const fs = require('fs');
let code = fs.readFileSync('src/components/ExportModal.tsx', 'utf8');
code = code.replace(`import { X`, `import { t } from '../i18n';\nimport { X`);
code = code.replace(`>Exporter le Rapport d'Audit<`, `>{t('export.title')}<`);
code = code.replace(`>Copier en Markdown<`, `>{t('export.copy')}<`);
code = code.replace(`>Télécharger le JSON brut<`, `>{t('export.download')}<`);
fs.writeFileSync('src/components/ExportModal.tsx', code);
