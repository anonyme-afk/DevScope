const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add token support
code = code.replace(
  `const { username } = req.body;`,
  `const { username } = req.body;\n    const customToken = req.headers['x-github-token'] as string | undefined;`
);
code = code.replace(
  `const headers = getGitHubHeaders();`,
  `const headers = getGitHubHeaders(customToken);`
);

// Add tree fetching helper
const treeHelper = `
async function fetchRepoTreeSignals(owner: string, repo: string, defaultBranch = 'main', headers: Record<string, string>) {
  try {
    const res = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}/git/trees/\${defaultBranch}?recursive=1\`, { headers });
    if (!res.ok) return { hasDocker: false, hasCICD: false, hasTests: false, hasLicense: false, hasIaC: false };
    const data = await res.json();
    if (!data.tree) return { hasDocker: false, hasCICD: false, hasTests: false, hasLicense: false, hasIaC: false };
    
    // Process paths
    let hasDocker = false, hasCICD = false, hasTests = false, hasLicense = false, hasIaC = false;
    for (let i = 0; i < Math.min(data.tree.length, 5000); i++) {
      const p = data.tree[i].path.toLowerCase();
      if (p.includes('dockerfile') || p.includes('docker-compose')) hasDocker = true;
      if (p.startsWith('.github/workflows') || p.includes('.gitlab-ci') || p.includes('travis.yml')) hasCICD = true;
      if (p.includes('test/') || p.includes('__tests__') || p.endsWith('.spec.ts') || p.endsWith('.test.js') || p.endsWith('.test.ts')) hasTests = true;
      if (p === 'license' || p.startsWith('license.')) hasLicense = true;
      if (p.includes('terraform/') || p.endsWith('.tf') || p.includes('k8s/') || p.includes('helm/')) hasIaC = true;
    }
    return { hasDocker, hasCICD, hasTests, hasLicense, hasIaC };
  } catch {
    return { hasDocker: false, hasCICD: false, hasTests: false, hasLicense: false, hasIaC: false };
  }
}
`;

code = code.replace('// Language color mapping helper', treeHelper + '\n// Language color mapping helper');

// Integrate in Step 4
const step4Old = `
    // 4. Fetch READMEs for top repositories
    const reposWithReadmes = await Promise.all(
      topReposToExtract.map(async (repo) => {
        const readmeContent = await fetchRepoReadme(repo.owner?.login || cleanUsername, repo.name, repo.default_branch, headers);
        return {
          ...repo,
          readmeContent,
          hasReadme: Boolean(readmeContent && readmeContent.trim().length > 20),
        };
      })
    );
`;

const step4New = `
    // 4. Fetch READMEs and deeper signals for top repositories
    const reposWithReadmes = await Promise.all(
      topReposToExtract.map(async (repo) => {
        const readmeContent = await fetchRepoReadme(repo.owner?.login || cleanUsername, repo.name, repo.default_branch, headers);
        const signals = await fetchRepoTreeSignals(repo.owner?.login || cleanUsername, repo.name, repo.default_branch, headers);
        return {
          ...repo,
          readmeContent,
          hasReadme: Boolean(readmeContent && readmeContent.trim().length > 20),
          signals,
        };
      })
    );
`;
code = code.replace(step4Old.trim(), step4New.trim());

// Update evaluateProfile mapping to pass signals
code = code.replace(
  `hasReadme: r.hasReadme,
    }));`,
  `hasReadme: r.hasReadme,
      signals: (r as any).signals || { hasDocker: false, hasCICD: false, hasTests: false, hasLicense: false, hasIaC: false },
    }));`
);

fs.writeFileSync('server.ts', code);
console.log('patched');
