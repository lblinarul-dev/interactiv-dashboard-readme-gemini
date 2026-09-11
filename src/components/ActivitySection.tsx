import React, { useEffect, useState } from 'react';
import { ContributionItem } from '../types';
import { GitPullRequest, Bug, GitCommit, ExternalLink, RefreshCw } from 'lucide-react';

export const ActivitySection: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [snakeTheme, setSnakeTheme] = useState<'dark' | 'light' | 'gif'>('dark');

  const fetchContributions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/external-contributions');
      if (res.ok) {
        const data = await res.json();
        setContributions(data.contributions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const snakeSrc =
    snakeTheme === 'dark'
      ? '/assets/github-contribution-grid-snake-dark.svg'
      : snakeTheme === 'light'
      ? '/assets/github-contribution-grid-snake.svg'
      : '/assets/github-contribution-grid-snake.gif';

  return (
    <section className="space-y-8" id="-github-activity">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span>📊</span> GitHub Activity & Statistics
        </h2>
        <button
          onClick={fetchContributions}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-[#8b949e] hover:text-[#58a6ff] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh activity'}
        </button>
      </div>

      {/* Snake Animation Card */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span>🐍</span> Contribution Snake Grid
            </h3>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Visual contribution eat-the-dots grid generated via GitHub Actions
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0d1117] p-1 rounded-lg border border-[#30363d] text-xs self-start">
            <button
              onClick={() => setSnakeTheme('dark')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                snakeTheme === 'dark' ? 'bg-[#238636] text-white' : 'text-[#8b949e] hover:text-white'
              }`}
            >
              Dark SVG
            </button>
            <button
              onClick={() => setSnakeTheme('light')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                snakeTheme === 'light' ? 'bg-[#238636] text-white' : 'text-[#8b949e] hover:text-white'
              }`}
            >
              Light SVG
            </button>
            <button
              onClick={() => setSnakeTheme('gif')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                snakeTheme === 'gif' ? 'bg-[#238636] text-white' : 'text-[#8b949e] hover:text-white'
              }`}
            >
              Animated GIF
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-[#0d1117] border border-[#30363d] p-4 flex items-center justify-center overflow-x-auto min-h-[160px]">
          <img
            src={snakeSrc}
            alt="GitHub contribution grid snake"
            className="max-w-full h-auto object-contain"
            onError={(e) => {
              // Fallback to github raw if local file asset is caching
              (e.target as HTMLImageElement).src =
                'https://raw.githubusercontent.com/lblinarul-dev/lblinarul-dev/main/assets/github-contribution-grid-snake-dark.svg';
            }}
          />
        </div>
      </div>

      {/* Stats Cards & Activity Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 flex flex-col items-center justify-center">
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3 self-start">
            GitHub Stats
          </h4>
          <img
            src="https://github-readme-stats.vercel.app/api?username=lblinarul-dev&show_icons=true&theme=tokyonight&hide_border=true"
            alt="GitHub Stats"
            className="w-full max-w-[440px] h-auto rounded"
            loading="lazy"
          />
        </div>

        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 flex flex-col items-center justify-center">
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3 self-start">
            GitHub Streak
          </h4>
          <img
            src="https://streak-stats.demolab.com/?user=lblinarul-dev&theme=tokyonight&hide_border=true"
            alt="GitHub Streak"
            className="w-full max-w-[440px] h-auto rounded"
            loading="lazy"
          />
        </div>
      </div>

      {/* Top Languages & 90 Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 flex flex-col items-center justify-center">
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3 self-start">
            Top Languages
          </h4>
          <img
            src="https://github-readme-stats.vercel.app/api/top-langs/?username=lblinarul-dev&layout=compact&theme=tokyonight&hide_border=true"
            alt="Top Languages"
            className="w-full max-w-[440px] h-auto rounded"
            loading="lazy"
          />
        </div>

        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 flex flex-col items-center justify-center">
          <h4 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3 self-start">
            Activity — Last 90 Days
          </h4>
          <img
            src="https://github-readme-activity-graph.vercel.app/graph?username=lblinarul-dev&days=90&theme=tokyo-night&hide_border=true&bg_color=00000000&custom_title=Contribution+Activity+%28Last+90+Days%29"
            alt="GitHub activity graph"
            className="w-full max-w-[440px] h-auto rounded"
            loading="lazy"
          />
        </div>
      </div>

      {/* External Contributions Table */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>🔍</span> External Contributions & Open-Source Work
            </h3>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Contributions to repositories outside personal ownership (PRs, issues, fixes)
            </p>
          </div>
          <span className="text-xs text-[#8b949e]">{contributions.length} item(s)</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#8b949e] text-sm">Loading activity...</div>
        ) : contributions.length === 0 ? (
          <div className="p-8 text-center text-[#8b949e] text-sm">
            No external public PRs or issues recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#30363d]">
            {contributions.map((item, idx) => (
              <div
                key={idx}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#21262d]/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#0d1117] border border-[#30363d] mt-0.5 shrink-0">
                    {item.type === 'Merged PR' ? (
                      <GitPullRequest className="w-4 h-4 text-[#a371f7]" />
                    ) : item.type === 'Issue' ? (
                      <Bug className="w-4 h-4 text-[#f0883e]" />
                    ) : (
                      <GitCommit className="w-4 h-4 text-[#58a6ff]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{item.repo}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#8b949e] mt-1">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#8b949e] shrink-0">
                  <span>{item.date.slice(0, 10)}</span>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] border border-[#30363d] font-medium flex items-center gap-1"
                    >
                      View Link
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
