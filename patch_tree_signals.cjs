const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  `async function fetchRepoTreeSignals(owner: string, repo: string, defaultBranch = 'main', headers: Record<string, string>) {
  try {
    const res = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}/git/trees/\${defaultBranch}?recursive=1\`, { headers });
    if (!res.ok) return { hasDocker: false, hasCICD: false, hasTests: false, hasLicense: false, hasIaC: false };
    const data = await res.json();
    if (!data.tree) return { hasDocker: false, hasCICD: false, hasTests: false, hasLicense: false, hasIaC: false };
    
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
}`,
  `async function fetchRepoTreeSignals(owner: string, repo: string, defaultBranch = 'main', headers: Record<string, string>) {
  try {
    const res = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}/git/trees/\${defaultBranch}?recursive=1\`, { headers });
    if (!res.ok) return { hasDocker: false, hasCICD: false, hasTests: false, hasIaC: false };
    const data = await res.json();
    if (!data.tree) return { hasDocker: false, hasCICD: false, hasTests: false, hasIaC: false };
    
    let hasDocker = false, hasCICD = false, hasTests = false, hasIaC = false;
    for (let i = 0; i < Math.min(data.tree.length, 5000); i++) {
      const p = data.tree[i].path.toLowerCase();
      if (p.includes('dockerfile') || p.includes('docker-compose')) hasDocker = true;
      if (p.startsWith('.github/workflows') || p.includes('.gitlab-ci') || p.includes('travis.yml')) hasCICD = true;
      if (p.includes('test/') || p.includes('__tests__') || p.endsWith('.spec.ts') || p.endsWith('.test.js') || p.endsWith('.test.ts')) hasTests = true;
      if (p.includes('terraform/') || p.endsWith('.tf') || p.includes('k8s/') || p.includes('helm/')) hasIaC = true;
    }
    return { hasDocker, hasCICD, hasTests, hasIaC };
  } catch {
    return { hasDocker: false, hasCICD: false, hasTests: false, hasIaC: false };
  }
}`
);

// We need to also remove `hasLicense` from the Signals usage in evaluateProfile
code = code.replace(
  `          if (repo.signals.hasLicense) totalLicense++;`,
  ``
);

code = code.replace(
  `let totalTests = 0, totalCICD = 0, totalDocker = 0, totalIaC = 0, totalLicense = 0;`,
  `let totalTests = 0, totalCICD = 0, totalDocker = 0, totalIaC = 0, totalLicense = reposWithLicense;`
);

code = code.replace(
  `      signals: (r as any).signals || { hasDocker: false, hasCICD: false, hasTests: false, hasLicense: false, hasIaC: false },`,
  `      signals: (r as any).signals || { hasDocker: false, hasCICD: false, hasTests: false, hasIaC: false },`
);

fs.writeFileSync('server.ts', code);
