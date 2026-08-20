const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `  const [githubToken, setGithubToken] = useState<string>(() => localStorage.getItem('devscope_github_token') || '');`,
  `  const [githubToken, setGithubToken] = useState<string>(() => localStorage.getItem('devscope_github_token') || '');
  const [rateLimit, setRateLimit] = useState<{ limit: number; remaining: number; reset: number } | null>(null);`
);

code = code.replace(
  `      if (!response.ok) {
        throw new Error(data.error || \`Erreur serveur (\${response.status})\`);
      }
      setCurrentIntelligence(data);
      addToHistory(data);
      setActiveTab('overview');`,
  `      if (data.rateLimit) {
        setRateLimit(data.rateLimit);
      }
      if (!response.ok) {
        throw new Error(data.error || \`Erreur serveur (\${response.status})\`);
      }
      setCurrentIntelligence(data);
      addToHistory(data);
      setActiveTab('overview');`
);

code = code.replace(
  `      <Navbar
        currentAnalysis={currentIntelligence}
        history={history}
        onSelectHistory={handleAnalyze}
        onOpenExportModal={() => setIsExportOpen(true)}
        onReset={handleReset}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />`,
  `      <Navbar
        currentAnalysis={currentIntelligence}
        history={history}
        onSelectHistory={handleAnalyze}
        onOpenExportModal={() => setIsExportOpen(true)}
        onReset={handleReset}
        onSettingsClick={() => setIsSettingsOpen(true)}
        rateLimit={rateLimit}
      />`
);

fs.writeFileSync('src/App.tsx', code);
