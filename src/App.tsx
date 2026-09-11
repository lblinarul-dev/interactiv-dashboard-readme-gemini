import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Overview } from './components/Overview.tsx';
import { ProjectShowcase } from './components/ProjectShowcase.tsx';
import { ActivitySection } from './components/ActivitySection.tsx';
import { MentoringSection } from './components/MentoringSection.tsx';
import { DiscussionsSection } from './components/DiscussionsSection.tsx';
import { ReadmeModal } from './components/ReadmeModal.tsx';
import { Mail, MessageSquare, ExternalLink, Github, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'overview' | 'projects' | 'activity' | 'mentoring' | 'discussions'>('all');
  const [isReadmeOpen, setIsReadmeOpen] = useState(false);

  const handleOpenDiscussions = () => {
    setActiveTab('discussions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans">
      <Header
        onOpenReadme={() => setIsReadmeOpen(true)}
        onOpenDiscussions={handleOpenDiscussions}
      />

      {/* Navigation Pills */}
      <div className="border-b border-[#30363d] bg-[#161b22]/80 sticky top-0 z-30 backdrop-blur-md px-4 py-2.5">
        <div className="mx-auto max-w-6xl flex items-center gap-1.5 overflow-x-auto text-xs sm:text-sm">
          {[
            { id: 'all', label: 'All Sections' },
            { id: 'overview', label: '👨‍💻 Overview & Expertise' },
            { id: 'projects', label: '📁 Projects & Works' },
            { id: 'activity', label: '📊 Activity & Snake' },
            { id: 'mentoring', label: '🌱 Mentoring' },
            { id: 'discussions', label: '💬 Discussions & Q&A' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1f6feb] text-white'
                  : 'text-[#8b949e] hover:text-white hover:bg-[#21262d]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8 sm:px-8 space-y-12">
        {(activeTab === 'all' || activeTab === 'overview') && <Overview />}
        {(activeTab === 'all' || activeTab === 'projects') && <ProjectShowcase />}
        {(activeTab === 'all' || activeTab === 'activity') && <ActivitySection />}
        {(activeTab === 'all' || activeTab === 'mentoring') && (
          <MentoringSection onOpenDiscussions={handleOpenDiscussions} />
        )}
        {(activeTab === 'all' || activeTab === 'discussions') && (
          <DiscussionsSection />
        )}

        {/* Tech Stack Matrix & Contact */}
        <section className="space-y-6 pt-4 border-t border-[#30363d]">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>🛠️</span> Tech Stack & Tooling
          </h2>

          <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider block mb-2">
                Primary Stack:
              </span>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Python', 'FastAPI', 'PostgreSQL', 'REST APIs', 'Docker', 'CI/CD'].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-semibold rounded-md bg-[#21262d] text-[#58a6ff] border border-[#388bfd]/30"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider block mb-2">
                Supporting Technologies:
              </span>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'Django', 'Redis', 'GitHub Actions', 'Playwright', 'pytest', 'Jest', 'SQLAlchemy'].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-[#0d1117] text-[#c9d1d9] border border-[#30363d]"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Contact & Discussion Footer Card */}
          <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>📫</span> Get in Touch & Collaborate
              </h3>
              <p className="text-xs text-[#8b949e] mt-1">
                Open to discussions, code reviews, and questions from junior developers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenDiscussions}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Open Discussions
              </button>
              <a
                href="mailto:lblinarul@gmail.com"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-white border border-[#30363d] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] bg-[#161b22] px-4 py-6 text-center text-xs text-[#8b949e]">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Lblinarul. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/lblinarul-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" /> github.com/lblinarul-dev
            </a>
            <button
              onClick={() => setIsReadmeOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              README Source
            </button>
          </div>
        </div>
      </footer>

      <ReadmeModal isOpen={isReadmeOpen} onClose={() => setIsReadmeOpen(false)} />
    </div>
  );
}
