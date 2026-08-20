const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  `interface NavbarProps {
  currentAnalysis: DeveloperIntelligence | null;
  history: AnalysisHistoryItem[];
  onSelectHistory: (username: string) => void;
  onOpenExportModal: () => void;
  onReset: () => void;
  onSettingsClick?: () => void;
}`,
  `interface NavbarProps {
  currentAnalysis: DeveloperIntelligence | null;
  history: AnalysisHistoryItem[];
  onSelectHistory: (username: string) => void;
  onOpenExportModal: () => void;
  onReset: () => void;
  onSettingsClick?: () => void;
  rateLimit?: { limit: number; remaining: number; reset: number } | null;
}`
);

code = code.replace(
  `  onReset,
  onSettingsClick,
}) => {`,
  `  onReset,
  onSettingsClick,
  rateLimit,
}) => {`
);

code = code.replace(
  `<button 
            onClick={onSettingsClick}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-700"
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quota / Token</span>
          </button>`,
  `<button 
            onClick={onSettingsClick}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-700 group"
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quota / Token</span>
            {rateLimit && (
              <span className={\`ml-1.5 hidden sm:inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] \${
                rateLimit.remaining < 10 ? 'bg-red-500/20 text-red-400' : 'bg-zinc-700 text-zinc-300 group-hover:bg-zinc-600'
              }\`}>
                {rateLimit.remaining}/{rateLimit.limit}
              </span>
            )}
          </button>`
);

fs.writeFileSync('src/components/Navbar.tsx', code);
