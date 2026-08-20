import React, { useState } from 'react';
import { Key, Shield, X, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSaveToken: (token: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, token, onSaveToken }) => {
  const [inputVal, setInputVal] = useState(token);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Quota & Accès</h2>
            <p className="text-xs text-zinc-400">Ajoutez votre propre token (BYOT)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-200">
            <p className="mb-2 font-medium">L'API GitHub limite les requêtes non-authentifiées à ~60/heure pour tous les utilisateurs de l'outil.</p>
            <p className="text-xs opacity-80">
              Ajoutez un <strong>Personal Access Token (PAT)</strong> pour utiliser votre propre quota (~5000/h). Ce token est stocké <strong>uniquement dans le localStorage de votre navigateur</strong>. Le serveur ne le logue jamais.
            </p>
          </div>

          <div>
            <label htmlFor="token" className="mb-1.5 block text-xs font-semibold uppercase text-zinc-400">
              Personal Access Token
            </label>
            <input
              id="token"
              type="password"
              placeholder="ghp_XXXXXXXXXXXXXXXXXXXX"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
          </div>

          <div className="flex items-start gap-2 text-xs text-zinc-500">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Générez un "Fine-grained personal access token" sur GitHub. 
              <br/><strong>Aucune permission ("Scope") n'est requise.</strong> L'accès public en lecture seule suffit.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                onSaveToken(inputVal.trim());
                onClose();
              }}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Sauvegarder
            </button>
            {token && (
              <button
                onClick={() => {
                  setInputVal('');
                  onSaveToken('');
                  onClose();
                }}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
              >
                Retirer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
