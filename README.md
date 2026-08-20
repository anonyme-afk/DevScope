# DevScope

[Link to Live Site](https://ais-pre-2zvbykwimp26l4djlpd5jh-114166625783.europe-west2.run.app) <!-- Replace with your final production domain -->

DevScope is an objective, deterministic GitHub profile analyzer. It evaluates software engineering profiles using strict heuristic algorithms rather than generative AI, ensuring reproducible and unbiased scoring based on actual code artifacts.

## Overview

Unlike standard profile viewers, DevScope performs a deep architectural scan of a developer's public repositories. It relies on a "No Black Box" methodology, computing scores via explicit rules. 

Key features include:
*   Heuristic Engine: Scans file trees (up to 5000 files per repository) to detect production signals such as Dockerfiles, CI/CD workflows, Infrastructure as Code, and test suites.
*   Deterministic Radar Chart: Generates a 0-100 score across 8 engineering pillars (Frontend, Backend, DevOps, Data, etc.) based on topics, language distribution, and detected patterns.
*   Bring Your Own Token (BYOT): Users can provide their own GitHub Personal Access Token to bypass standard unauthenticated API rate limits. Tokens are stored securely and exclusively in the browser's localStorage.
*   Data Visualization: Visualizes commit volume timelines and technology heatmaps.
*   Engineering Dossier Export: Exports the complete analysis as a Markdown report optimized for Applicant Tracking Systems (ATS) or as raw JSON.

## Architecture

*   Frontend: React 18, Vite, Tailwind CSS, Recharts.
*   Backend: Node.js, Express. The backend acts as a proxy relay to query the GitHub API securely, extract git trees, and compute the heuristic scores before returning the aggregated intelligence payload.
*   Build System: The frontend is built into static assets via Vite, and the backend is bundled via esbuild into a single CommonJS file.

## Local Development

### Prerequisites
*   Node.js (v18 or newer)
*   npm

### Installation

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server (runs both the Vite frontend and Express backend concurrently):
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### Production Build

To build the application for deployment:

```bash
npm run build
```
This command generates the optimized frontend in the `dist/` directory and compiles the server to `dist/server.cjs`.

To run the production build locally:

```bash
npm start
```

## Methodology

DevScope intentionally avoids LLMs (Large Language Models) for candidate evaluation. 
1. Repository Fetching: Extracts up to 100 repositories, strictly filtering out passive forks.
2. Deep Tree Scan: Inspects file paths (e.g., `.github/workflows` for CI/CD, `terraform/` for IaC, `__tests__/` for QA).
3. Categorization: Maps topic tags and languages to engineering archetypes.
4. Dynamic Templating: Generates an executive summary by assembling pre-written logical blocks based on the final computed scores.

## License

MIT
