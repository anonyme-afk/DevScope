import React, { useState } from 'react';
import { t } from '../i18n';
import { X, Download, Copy, Check, FileText, Code2, Printer, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DeveloperIntelligence } from '../types';

interface ExportModalProps {
  intelligence: DeveloperIntelligence | null;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ intelligence, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!intelligence) return null;

  // Generate clean Markdown dossier
  const generateMarkdown = () => {
    const { user, overallScore, archetype, seniorityEstimation, executiveSummary, strengths, growthOpportunities, skillsRadar, topTechnologies, quantitativeMetrics, projectAnalyses, interviewGuide, personalizedOutreachMessage, analyzedAt } = intelligence;

    return `# Dossier d'Audit Technique & Profil GitHub : @${user.login}
*Généré par DevScope AI le ${new Date(analyzedAt).toLocaleDateString('fr-FR')}*

---

## 👤 Informations Générales
- **Nom complet :** ${user.name || user.login}
- **Pseudo GitHub :** [@${user.login}](${user.html_url})
- **Score Global DevScope :** **${overallScore}/100**
- **Archétype Développeur :** **${archetype}**
- **Niveau de Séniorité Estimé :** ${seniorityEstimation}
- **Entreprise / Organisation :** ${user.company || 'Non spécifié'}
- **Localisation :** ${user.location || 'Non spécifié'}
- **Bio :** ${user.bio || 'Aucune'}
- **Ancienneté du compte :** ${quantitativeMetrics.accountAgeYears} ans (depuis ${new Date(user.created_at).getFullYear()})

---

## 📊 Métriques Quantitatives & Impact
- **Total Étoiles cumulées :** ${quantitativeMetrics.totalStars.toLocaleString()} ⭐
- **Total Forks cumulés :** ${quantitativeMetrics.totalForks.toLocaleString()} 🍴
- **Dépôts analysés :** ${quantitativeMetrics.totalReposAnalyzed}
- **Moyenne d'étoiles par dépôt :** ${quantitativeMetrics.avgStarsPerRepo}
- **Couverture de README :** ${quantitativeMetrics.readmeCoveragePercent}%
- **Couverture de Licences :** ${quantitativeMetrics.licenseCoveragePercent}%
- **Vélocité estimée :** ${quantitativeMetrics.estimatedCodeVelocity}

---

## 🧠 Synthèse Exécutive Heuristique
${executiveSummary}

---

## 🎯 Radar de Compétences (Scores / 100)
- **Frontend :** ${skillsRadar.frontend}%
- **Backend :** ${skillsRadar.backend}%
- **Architecture & Conception :** ${skillsRadar.architectureDesign}%
- **DevOps & Cloud :** ${skillsRadar.devopsCloud}%
- **Impact Open Source :** ${skillsRadar.openSourceImpact}%
- **Qualité de Code & Documentation :** ${skillsRadar.codeQualityDocs}%
- **Data Engineering :** ${skillsRadar.aiDataEngineering}%
- **Systèmes & Algorithmes :** ${skillsRadar.systemsAlgorithms}%

---

## ⚡ Points Forts Majeurs
${strengths.map((s) => `- ✅ ${s}`).join('\n')}

## 🚀 Axes d'Évolution & Opportunités
${growthOpportunities.map((g) => `- 💡 ${g}`).join('\n')}

---

## 🛠️ Technologies Maîtrisées
${topTechnologies.map((t) => `- **${t.name}** (${t.category}) — *Niveau : ${t.level}*`).join('\n')}

---

## 📦 Projets Clés & READMEs Digérés (${projectAnalyses.length} projets)
${projectAnalyses
  .map(
    (p, idx) => `### ${idx + 1}. [${p.repoName}](${p.url}) (${p.stars} ⭐)
- **Langage :** ${p.language} | **Architecture :** ${p.architectureType} | **Complexité :** ${p.complexityScore}/10
- **Résumé du projet :** ${p.summary}
- **Ce qui démarque :** ${p.noveltyHighlight}
- **Fonctionnalités clés extraites :**
${p.keyFeatures.map((f) => `  - ${f}`).join('\n')}
- **Stack technique :** ${p.techStack.join(', ')}
`
  )
  .join('\n')}

---

## 💼 Guide d'Entretien Technique & Recrutement
### Questions d'Entretien Ciblées :
${interviewGuide.technicalQuestions
  .map(
    (q, i) => `**Q${i + 1} (${q.relatedProject}) :** ${q.question}
*Critères attendus :* ${q.expectedDepth}
`
  )
  .join('\n')}

### Sujets d'Architecture Recommandés :
${interviewGuide.architecturalTopics.map((t) => `- ${t}`).join('\n')}

---

## ✉️ Modèle de Message d'Approche Personnalisé
**Objet :** ${personalizedOutreachMessage.subject}

\`\`\`
${personalizedOutreachMessage.body}
\`\`\`
`;
  };

  const markdownContent = generateMarkdown();
  const jsonContent = JSON.stringify(intelligence, null, 2);
  const activeContent = activeFormat === 'markdown' ? markdownContent : jsonContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = activeFormat === 'markdown' ? 'md' : 'json';
    const mimeType = activeFormat === 'markdown' ? 'text/markdown' : 'application/json';
    const blob = new Blob([activeContent], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devscope-audit-${intelligence.user.login}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[85vh] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Exporter le Dossier d'Ingénierie
              </h3>
              <p className="text-xs text-zinc-400">
                Profil complet de @{intelligence.user.login}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-xs">
              <button
                onClick={() => setActiveFormat('markdown')}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 font-medium transition-colors ${
                  activeFormat === 'markdown'
                    ? 'bg-blue-500/20 text-blue-300 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Markdown (.md)</span>
              </button>
              <button
                onClick={() => setActiveFormat('json')}
                className={`flex items-center gap-1 rounded-md px-3 py-1.5 font-medium transition-colors ${
                  activeFormat === 'json'
                    ? 'bg-blue-500/20 text-blue-300 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>JSON (.json)</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950/60">
          <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap break-words leading-relaxed p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            {activeContent}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-950 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Format optimisé pour les rapports d'ingénierie et ATS</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimer / PDF</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copié !' : 'Copier tout'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-400 hover:to-blue-500 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Télécharger ({activeFormat === 'markdown' ? '.md' : '.json'})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
