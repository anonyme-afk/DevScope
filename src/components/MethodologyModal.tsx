import { t } from '../i18n';
import React from 'react';
import { ShieldAlert, Terminal, Braces, Code2, Check, X } from 'lucide-react';

export const MethodologyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Méthodologie de Calcul</h2>
            <p className="text-xs text-zinc-400">Aucune "Boîte Noire" — Un algorithme 100% déterministe.</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-300">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-200">
            <h3 className="mb-2 flex items-center gap-2 font-bold"><Check className="h-4 w-4"/> Moteur Heuristique (Sans IA Générative)</h3>
            <p className="text-xs opacity-90 leading-relaxed">
              DevScope n'utilise pas de LLM (IA Générative) pour évaluer un candidat. Les scores, les archétypes et l'analyse d'architecture sont générés par un <strong>système heuristique pur (règles algorithmiques strictes)</strong>, garantissant l'objectivité absolue et la reproductibilité des résultats sans biais artificiel ni hallucination.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-zinc-400" />
              Extraction des Signaux
            </h3>
            <p className="text-xs text-zinc-400">Pour chaque profil, nous extrayons jusqu'aux 12 dépôts les plus significatifs en filtrant les "forks" :</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-400">
              <li><strong>Scan d'arborescence :</strong> Détection de fichiers <code className="text-blue-300 bg-blue-950 px-1 rounded">Dockerfile</code>, <code className="text-blue-300 bg-blue-950 px-1 rounded">.github/workflows</code>, dossiers <code className="text-blue-300 bg-blue-950 px-1 rounded">test/</code> ou <code className="text-blue-300 bg-blue-950 px-1 rounded">terraform/</code>.</li>
              <li><strong>{t('methodology.semantic')} :</strong> {t('methodology.semanticDesc')}</li>
              <li><strong>Validation sociale :</strong> Prise en compte du volume d'étoiles (Stars) et de Forks comme indicateur de succès Open Source.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Braces className="h-4 w-4 text-zinc-400" />
              Calcul du Score Global / 100
            </h3>
            <p className="text-xs text-zinc-400">Le score est la moyenne lissée de 8 piliers :</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-400">
              <li><strong>Spécialisations (Frontend, Backend, etc.) :</strong> Poids algorithmique basé sur les occurrences de tags.</li>
              <li><strong>Qualité & Documentation :</strong> Basé sur la longueur des READMEs, la présence de fichiers LICENSE, et la détection d'une culture de tests.</li>
              <li><strong>Architecture :</strong> Bonus pour la présence d'Intégration Continue (CI/CD), de conteneurisation (Docker) et d'Infrastructure as Code (IaC).</li>
              <li><strong>Séniorité :</strong> Si l'algorithme détecte des outils de production avancés ou une ancienneté +5 ans, l'archétype est promu "Senior".</li>
            </ul>
          </div>
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="mb-2 text-xs font-bold text-white uppercase tracking-wider">{t('methodology.limits')}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Un profil ne comportant <strong>que des dépôts privés</strong> apparaîtra vide et sera sous-évalué. Les dépôts d'entreprise ne sont pas scannés par l'API publique de GitHub. De plus, les bons développeurs ne documentent pas toujours leurs "side-projects", le manque de README pénalise légèrement la note "Qualité", mais n'effondre pas le score technique global.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
