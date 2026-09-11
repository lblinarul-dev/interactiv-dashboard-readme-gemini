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

// In-memory discussions storage initialized with profile-relevant topics
let discussions: any[] = [
  {
    id: 'disc-1',
    title: 'Open Q&A for Junior Developers: Debugging, Code Reviews & Getting Unstuck',
    category: 'Mentoring',
    author: 'Lblinarul',
    authorRole: 'Senior Dev / Maintainer',
    content:
      'Welcome! If you are a junior engineer with questions about debugging tricky errors, structuring clean React components, or understanding backend data flows, drop your question here. I prioritize explaining the root cause rather than just giving a quick patch.',
    createdAt: '2026-09-08T10:30:00Z',
    likes: 12,
    replies: [
      {
        id: 'rep-1',
        author: 'SarahM',
        authorRole: 'Junior Frontend Dev',
        content: 'What is your recommended process when a React component re-renders too many times in production?',
        createdAt: '2026-09-08T14:10:00Z',
      },
      {
        id: 'rep-2',
        author: 'Lblinarul',
        authorRole: 'Senior Dev / Maintainer',
        content: 'Start with React DevTools Profiler to record the exact render trigger. 90% of the time, it is either un-memoized object/array references passed as props, or state lifted too high that forces unrelated children to update. Measure first, avoid blindly wrapping everything in useMemo!',
        createdAt: '2026-09-08T16:05:00Z',
      },
    ],
  },
  {
    id: 'disc-2',
    title: 'react-debugger Case Study: Isolating silent failures in async flows',
    category: 'Frontend',
    author: 'Lblinarul',
    authorRole: 'Senior Dev / Maintainer',
    content:
      'In react-debugger, we investigated why images reverted to temporary DALL-E links. The root cause was an async helper defined inside another function that was never invoked. How do you catch uncalled async helpers in your codebase?',
    createdAt: '2026-09-09T09:15:00Z',
    likes: 8,
    replies: [
      {
        id: 'rep-3',
        author: 'MarcusK',
        authorRole: 'Backend Engineer',
        content: 'Static analysis (ruff / flake8 in Python, ESLint with no-unused-vars in JS) caught similar issues for us, plus thorough integration testing covering the complete asset lifecycle.',
        createdAt: '2026-09-09T11:20:00Z',
      },
    ],
  },
  {
    id: 'disc-3',
    title: 'Math Mentoring: Understanding Gradient Descent via Multivariable Calculus',
    category: 'Math & Algorithms',
    author: 'Lblinarul',
    authorRole: 'Senior Dev / Maintainer',
    content:
      'Many students struggle when jumping from single-variable calculus to partial derivatives and gradients in machine learning. Remember that the gradient is simply a vector pointing in the direction of steepest ascent on the loss surface. Anyone having questions on upcoming calculus or linear algebra coursework is welcome to post here!',
    createdAt: '2026-09-09T15:40:00Z',
    likes: 15,
    replies: [],
  },
];

// Discussions API endpoints
app.get('/api/discussions', (req, res) => {
  res.json({ discussions });
});

app.post('/api/discussions', (req, res) => {
  const { title, category, author, content } = req.body;
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, author, and content are required' });
  }

  const newTopic = {
    id: `disc-${Date.now()}`,
    title: String(title).trim(),
    category: category || 'General',
    author: String(author).trim(),
    authorRole: 'Community Member',
    content: String(content).trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    replies: [],
  };

  discussions.unshift(newTopic);
  res.status(201).json({ discussion: newTopic });
});

app.post('/api/discussions/:id/replies', (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: 'Author and content are required' });
  }

  const topic = discussions.find((d) => d.id === id);
  if (!topic) {
    return res.status(404).json({ error: 'Discussion topic not found' });
  }

  const newReply = {
    id: `rep-${Date.now()}`,
    author: String(author).trim(),
    authorRole: 'Community Member',
    content: String(content).trim(),
    createdAt: new Date().toISOString(),
  };

  topic.replies.push(newReply);
  res.status(201).json({ reply: newReply });
});

app.post('/api/discussions/:id/like', (req, res) => {
  const { id } = req.params;
  const topic = discussions.find((d) => d.id === id);
  if (!topic) {
    return res.status(404).json({ error: 'Discussion topic not found' });
  }
  topic.likes = (topic.likes || 0) + 1;
  res.json({ likes: topic.likes });
});


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
