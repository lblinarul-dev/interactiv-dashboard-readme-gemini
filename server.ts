import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve local assets (like the snake SVGs and GIFs)
const assetsPath = path.join(process.cwd(), 'assets');
if (fs.existsSync(assetsPath)) {
  app.use('/assets', express.static(assetsPath));
}

const DEFAULT_USERNAME = 'lblinarul-dev';
const README_PATH = path.join(process.cwd(), 'README.md');
const OWN_START_MARKER = '<!-- OWN-PROJECTS:START -->';
const OWN_END_MARKER = '<!-- OWN-PROJECTS:END -->';
const EXT_START_MARKER = '<!-- EXTERNAL-CONTRIBUTIONS:START -->';
const EXT_END_MARKER = '<!-- EXTERNAL-CONTRIBUTIONS:END -->';
const DASHBOARD_ANCHOR = '<a id="-github-activity" name="-github-activity"></a>';
const DASHBOARD_HEADING = '## 📊 GitHub Activity';

// Fallback project data matching Lblinarul's README
const FALLBACK_OWN_REPOS = [
  {
    name: 'react-debugger',
    description: 'I Fixed a Production-Style React Performance Problem',
    pushed_at: '2026-09-07T12:00:00Z',
    updated_at: '2026-09-07T12:00:00Z',
    html_url: 'https://github.com/lblinarul-dev/react-debugger',
    stargazers_count: 5,
    language: 'TypeScript',
    visibility: 'public',
  },
];

function getHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'lblinarul-dev-profile-app',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const effectiveToken = token || process.env.GH_TOKEN;
  if (effectiveToken) {
    headers['Authorization'] = `Bearer ${effectiveToken}`;
  }
  return headers;
}

// Fetch owned repositories
app.get('/api/own-projects', async (req, res) => {
  const username = (req.query.username as string) || process.env.GH_USERNAME || DEFAULT_USERNAME;
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=100&type=owner`,
      { headers: getHeaders() }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const filtered = data
          .filter(
            (r: any) =>
              !r.fork &&
              r.name?.toLowerCase() !== username.toLowerCase() &&
              (r.visibility === 'public' || !r.private)
          )
          .slice(0, 10);
        return res.json({ repos: filtered, source: 'github' });
      }
    }
  } catch (err) {
    console.warn('[GitHub API] Using fallback own projects:', err);
  }

  // Graceful fallback
  res.json({ repos: FALLBACK_OWN_REPOS, source: 'cached' });
});

// Fetch external contributions
app.get('/api/external-contributions', async (req, res) => {
  const username = (req.query.username as string) || process.env.GH_USERNAME || DEFAULT_USERNAME;
  const rows: any[] = [];

  try {
    // Search merged PRs
    const prsRes = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(
        `author:${username} type:pr is:merged`
      )}&per_page=15&sort=updated&order=desc`,
      { headers: getHeaders() }
    );

    if (prsRes.ok) {
      const prsData = await prsRes.json();
      if (Array.isArray(prsData.items)) {
        for (const item of prsData.items) {
          const repoUrl = item.repository_url || '';
          const parts = repoUrl.replace(/\/$/, '').split('/');
          const repoName = parts.length >= 2 ? parts.slice(-2).join('/') : '';
          if (repoName && !repoName.toLowerCase().startsWith(`${username.toLowerCase()}/`)) {
            rows.push({
              date: item.updated_at || '',
              repo: repoName,
              type: 'Merged PR',
              description: item.title || 'Untitled PR',
              link: item.html_url || '',
              number: item.number,
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('[GitHub API] External contributions lookup note:', err);
  }

  res.json({ contributions: rows, source: rows.length > 0 ? 'github' : 'cached' });
});

// Get README markdown content
app.get('/api/readme', (req, res) => {
  try {
    if (fs.existsSync(README_PATH)) {
      const content = fs.readFileSync(README_PATH, 'utf-8');
      return res.json({ content });
    }
    return res.status(404).json({ error: 'README.md not found' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for escaping markdown table cell content
function escapeMarkdown(val: string): string {
  return val.replace(/\|/g, '\\|').replace(/\r/g, ' ').replace(/\n/g, ' ').trim();
}

// Sync README logic adhering to update_own_projects.py & update_external_contributions.py
app.post('/api/sync-readme', async (req, res) => {
  try {
    if (!fs.existsSync(README_PATH)) {
      return res.status(404).json({ error: 'README.md not found' });
    }

    let content = fs.readFileSync(README_PATH, 'utf-8');
    const username = process.env.GH_USERNAME || DEFAULT_USERNAME;

    // 1. Fetch own repos
    let ownRepos: any[] = FALLBACK_OWN_REPOS;
    try {
      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=pushed&direction=desc&per_page=100&type=owner`,
        { headers: getHeaders() }
      );
      if (repoRes.ok) {
        const data = await repoRes.json();
        if (Array.isArray(data)) {
          ownRepos = data
            .filter(
              (r: any) =>
                !r.fork &&
                r.name?.toLowerCase() !== username.toLowerCase() &&
                (r.visibility === 'public' || !r.private)
            )
            .slice(0, 10);
        }
      }
    } catch {
      // Keep fallback
    }

    // Render own projects table
    let ownTableMarkdown = '';
    if (!ownRepos.length) {
      ownTableMarkdown =
        '| Repo | Description | Last Updated | Link |\n|---|---|---|---|\n| _(no public repositories found yet)_ | | | |';
    } else {
      const lines = [
        '| Repo | Description | Last Updated | Link |',
        '|---|---|---|---|',
      ];
      for (const repo of ownRepos) {
        const name = escapeMarkdown(repo.name || 'unknown');
        const description = escapeMarkdown(repo.description || '') || '_no description_';
        const updated = escapeMarkdown((repo.pushed_at || '')?.slice(0, 10));
        const link = repo.html_url || '';
        lines.push(`| ${name} | ${description} | ${updated} | [Repo](${link}) |`);
      }
      ownTableMarkdown = lines.join('\n');
    }

    // Replace OWN-PROJECTS markers
    if (content.includes(OWN_START_MARKER) && content.includes(OWN_END_MARKER)) {
      const startIdx = content.indexOf(OWN_START_MARKER);
      const endIdx = content.indexOf(OWN_END_MARKER);
      if (endIdx > startIdx) {
        const before = content.slice(0, startIdx);
        const after = content.slice(endIdx + OWN_END_MARKER.length);
        content = `${before}${OWN_START_MARKER}\n${ownTableMarkdown}\n${OWN_END_MARKER}${after}`;
      }
    }

    // Ensure stable dashboard anchor
    const anchorVariants = [
      '<a id="-github-activity"></a>',
      '<a name="-github-activity"></a>',
      DASHBOARD_ANCHOR,
    ];
    for (const v of anchorVariants) {
      content = content.replaceAll(v, '');
    }
    if (content.includes(DASHBOARD_HEADING)) {
      content = content.replace(DASHBOARD_HEADING, `${DASHBOARD_ANCHOR}\n\n${DASHBOARD_HEADING}`);
    }

    fs.writeFileSync(README_PATH, content, 'utf-8');

    res.json({
      success: true,
      message: 'README.md synchronized successfully.',
      ownReposCount: ownRepos.length,
      content,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
