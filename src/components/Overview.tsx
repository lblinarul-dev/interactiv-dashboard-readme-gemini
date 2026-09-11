import React from 'react';
import { Layers, Server, Database, GitBranch, ShieldCheck, CheckCircle2 } from 'lucide-react';

const expertiseAreas = [
  {
    title: 'Frontend',
    icon: Layers,
    color: 'text-[#58a6ff]',
    bg: 'bg-[#1f6feb]/10',
    border: 'border-[#388bfd]/30',
    items: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Component Architecture', 'Responsive UI'],
  },
  {
    title: 'Backend',
    icon: Server,
    color: 'text-[#3fb950]',
    bg: 'bg-[#238636]/10',
    border: 'border-[#2ea043]/30',
    items: ['Python', 'FastAPI', 'Django', 'REST APIs', 'Auth & Authorization', 'Async Processing'],
  },
  {
    title: 'Data',
    icon: Database,
    color: 'text-[#d29922]',
    bg: 'bg-[#bb8009]/10',
    border: 'border-[#d29922]/30',
    items: ['PostgreSQL', 'SQL', 'Redis', 'Database Design', 'Migrations', 'Query Optimization'],
  },
  {
    title: 'Delivery / DevOps',
    icon: GitBranch,
    color: 'text-[#a371f7]',
    bg: 'bg-[#8957e5]/10',
    border: 'border-[#a371f7]/30',
    items: ['Docker', 'GitHub Actions', 'CI/CD Pipelines', 'Linux', 'Git Workflows'],
  },
  {
    title: 'Quality & Testing',
    icon: ShieldCheck,
    color: 'text-[#f0883e]',
    bg: 'bg-[#bd561d]/10',
    border: 'border-[#f0883e]/30',
    items: ['pytest', 'Jest', 'Playwright', 'Unit Tests', 'E2E Testing', 'Code Reviews'],
  },
];

const principles = [
  'Start with the simplest architecture that satisfies real requirements',
  'Keep frontend, backend, and data responsibilities strictly decoupled',
  'Prefer explicit API contracts and predictable failure handling',
  'Test business-critical behavior and regression-prone areas',
  'Measure before optimizing performance with profiling',
  'Automate repetitive quality, security, and delivery checks',
];

export const Overview: React.FC = () => {
  return (
    <section className="space-y-8">
      {/* Intro Card */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
          <span>👨‍💻</span> Senior Full-Stack Engineering
        </h2>
        <p className="text-[#8b949e] leading-relaxed text-sm sm:text-base">
          I build and maintain full-stack web applications across frontend, backend, data, and delivery.
          My focus is on practical engineering: clear architecture, reliable APIs, maintainable code,
          automated testing, and production-ready development workflows.
        </p>
        <p className="text-[#8b949e] leading-relaxed text-sm sm:text-base mt-3">
          I enjoy solving problems where product requirements meet technical constraints — from responsive
          React interfaces and API design to database performance, debugging, CI/CD, and incremental system improvement.
        </p>
      </div>

      {/* Core Expertise Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🎯</span> Core Expertise
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expertiseAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div
                key={area.title}
                className={`rounded-lg border ${area.border} bg-[#161b22] p-5 hover:border-[#58a6ff]/50 transition-colors`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-md ${area.bg}`}>
                    <Icon className={`w-5 h-5 ${area.color}`} />
                  </div>
                  <h4 className="font-semibold text-white text-base">{area.title}</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {area.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2 py-1 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Development Approach */}
      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔧</span> Development Approach
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {principles.map((principle, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-[#8b949e]">
              <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0 mt-0.5" />
              <span>{principle}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
