const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import t
code = code.replace(
  `import { MethodologyModal } from './components/MethodologyModal';`,
  `import { MethodologyModal } from './components/MethodologyModal';\nimport { t } from './i18n';`
);

// Search placeholder
code = code.replace(
  `placeholder="Taper un pseudo GitHub ici... (ex: torvalds)"`,
  `placeholder={t('app.placeholder')}`
);

// Buttons and headers
code = code.replace(`>Analyser<`, `>{t('app.analyze')}<`);
code = code.replace(`>Auditez l'ingénierie de n'importe quel développeur.<`, `>{t('app.subtitle')}<`);
code = code.replace(`>Comment ça marche ?<`, `>{t('app.howItWorks')}<`);

// Tabs
code = code.replace(`<span>Vue d'Ensemble & Radar</span>`, `<span>{t('app.tab.overview')}</span>`);
code = code.replace(`<span>Projets & READMEs Digérés</span>`, `<span>{t('app.tab.projects')}</span>`);
code = code.replace(`<span>Synthèse Recrutement</span>`, `<span>{t('app.tab.recruitment')}</span>`);

// Footer
code = code.replace(`>Moteur d'Audit de Code & Intelligence Profils GitHub<`, `>{t('app.footer.desc')}<`);
code = code.replace(`>Propulsé par GitHub REST API & Moteur Heuristique<`, `>{t('app.footer.powered')}<`);

fs.writeFileSync('src/App.tsx', code);
