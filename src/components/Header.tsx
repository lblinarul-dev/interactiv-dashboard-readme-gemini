import React from 'react';
import { Github, ExternalLink, MessageSquare, Mail, Terminal } from 'lucide-react';

export const Header: React.FC<{
  onOpenReadme: () => void;
  onOpenDiscussions: () => void;
}> = ({ onOpenReadme, onOpenDiscussions }) => {
  return (
    <header className="border-b border-[#30363d] bg-[#161b22] px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#58a6ff] bg-[#21262d] flex items-center justify-center text-2xl font-bold text-[#58a6ff] shadow-md">
              LB
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#3fb950] border-2 border-[#161b22]" title="Active" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Lblinarul
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#1f6feb]/20 text-[#58a6ff] border border-[#388bfd]/30">
                Full-Stack Senior Dev
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#8b949e] mt-1">
              Building things that ship · Always learning, always shipping
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#8b949e]">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" /> React · TypeScript · Python · FastAPI
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <a
            href="https://github.com/lblinarul-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub Profile
            <ExternalLink className="w-3 h-3 text-[#8b949e]" />
          </a>
          <button
            onClick={onOpenDiscussions}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#3fb950]" />
            Discussions
          </button>
          <button
            onClick={onOpenReadme}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md bg-[#238636] hover:bg-[#2ea043] text-white transition-colors cursor-pointer"
          >
            View README
          </button>
        </div>
      </div>
    </header>
  );
};
