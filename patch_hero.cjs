const fs = require('fs');
let code = fs.readFileSync('src/components/SearchHero.tsx', 'utf8');

code = code.replace(
  `interface SearchHeroProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  history: AnalysisHistoryItem[];
  errorMessage: string | null;
}`,
  `import { HelpCircle } from 'lucide-react';\n\ninterface SearchHeroProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  history: AnalysisHistoryItem[];
  errorMessage: string | null;
  onOpenMethodology?: () => void;
}`
);

code = code.replace(
  `export const SearchHero: React.FC<SearchHeroProps> = ({
  onSearch,
  isLoading,
  history,
  errorMessage,
}) => {`,
  `export const SearchHero: React.FC<SearchHeroProps> = ({
  onSearch,
  isLoading,
  history,
  errorMessage,
  onOpenMethodology,
}) => {`
);

// Add the methodology link
code = code.replace(
  `</div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">`,
  `</div>
        
        {onOpenMethodology && (
          <button 
            onClick={onOpenMethodology}
            className="absolute -top-2 right-0 flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Comment ça marche ?
          </button>
        )}

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">`
);

fs.writeFileSync('src/components/SearchHero.tsx', code);
