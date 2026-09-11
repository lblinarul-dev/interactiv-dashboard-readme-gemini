import React, { useEffect, useState } from 'react';
import { GithubRepo } from '../types';
import { FolderGit2, ExternalLink, GitFork, Star, Calendar, RefreshCw } from 'lucide-react';

export const ProjectShowcase: React.FC = () => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'github' | 'cached'>('cached');

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/own-projects');
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repos || []);
        setSource(data.source || 'cached');
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <span>📁</span> My Repositories & Selected Work
        </h2>
        <button
          onClick={fetchRepos}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-[#8b949e] hover:text-[#58a6ff] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : `Refresh repos (${source === 'github' ? 'live' : 'cached'})`}
        </button>
      </div>

      {/* Selected Work Feature Card: react-debugger */}
      <div className="rounded-xl border border-[#388bfd]/40 bg-[#161b22] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-[#1f6feb]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#30363d] pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#58a6ff]" />
              <h3 className="text-lg font-bold text-white">
                Selected Work — <code className="text-[#58a6ff]">react-debugger</code>
              </h3>
            </div>
            <p className="text-xs text-[#8b949e] mt-1">
              Production-style React & backend performance debugging
            </p>
          </div>
          <a
            href="https://github.com/lblinarul-dev/react-debugger"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-[#58a6ff] border border-[#30363d] transition-colors w-fit"
          >
            Open Repository
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d]">
            <div className="font-semibold text-[#f85149] mb-1.5">Problem</div>
            <p className="text-[#8b949e] text-xs leading-relaxed">
              In <code className="text-white">backend/services.py</code>, an async <code className="text-white">upload_to_imgbb()</code> function was defined inside <code className="text-white">generate_image()</code> but never called. Images fell back to temporary DALL-E URLs instead of permanent hosting.
            </p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d]">
            <div className="font-semibold text-[#58a6ff] mb-1.5">Decision</div>
            <p className="text-[#8b949e] text-xs leading-relaxed">
              Traced the actual execution path before altering unrelated code. Implemented intended upload: generate image, download bytes, call ImgBB upload helper, return ImgBB URL when successful, retain DALL-E URL as fallback.
            </p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d]">
            <div className="font-semibold text-[#3fb950] mb-1.5">Result</div>
            <p className="text-[#8b949e] text-xs leading-relaxed">
              Verified with unit tests exercising both successful upload and error paths. Confirmed <code className="text-white">_upload_to_imgbb()</code> is invoked properly with graceful fallback.
            </p>
          </div>
        </div>
      </div>

      {/* Owned Projects Table / Cards */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Public Repositories</h3>
          <span className="text-xs text-[#8b949e]">{repos.length} project(s) tracked</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#8b949e] text-sm">Loading repositories...</div>
        ) : repos.length === 0 ? (
          <div className="p-8 text-center text-[#8b949e] text-sm">
            No public repositories found. Check configuration or GitHub API token.
          </div>
        ) : (
          <div className="divide-y divide-[#30363d]">
            {repos.map((repo) => (
              <div
                key={repo.name}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#21262d]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold text-[#58a6ff] hover:underline flex items-center gap-1"
                    >
                      {repo.name}
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                    {repo.language && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#8b949e] mt-1">
                    {repo.description || 'No description provided'}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#8b949e] shrink-0">
                  {repo.stargazers_count !== undefined && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#d29922]" />
                      {repo.stargazers_count}
                    </span>
                  )}
                  {repo.pushed_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {repo.pushed_at.slice(0, 10)}
                    </span>
                  )}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] font-medium"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
