import React from 'react';
import { BookOpen, GraduationCap, Compass, MessageSquare, ExternalLink } from 'lucide-react';

export const MentoringSection: React.FC<{
  onOpenDiscussions?: () => void;
}> = ({ onOpenDiscussions }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
        <span>🌱</span> Mentoring & Community Contribution
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Junior Dev Mentoring */}
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-[#238636]/20 border border-[#2ea043]/30">
                <BookOpen className="w-5 h-5 text-[#3fb950]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Junior & New Programmers</h3>
                <p className="text-xs text-[#8b949e]">Practical, code-level guidance</p>
              </div>
            </div>

            <p className="text-sm text-[#8b949e] leading-relaxed mb-4">
              I answer questions and give code-level feedback to people earlier in their engineering path.
              The goal is to help them understand the underlying problem and become able to solve the next one independently.
            </p>

            <ul className="space-y-2 text-xs text-[#c9d1d9] mb-6">
              <li className="flex items-start gap-2">
                <span className="text-[#3fb950] font-bold">✓</span>
                Explain why something does not work, not only how to patch it
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3fb950] font-bold">✓</span>
                Review junior-written code with specific, actionable feedback
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3fb950] font-bold">✓</span>
                Walk through debugging by isolating failures before applying fixes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3fb950] font-bold">✓</span>
                Explain architectural and implementation trade-offs
              </li>
            </ul>
          </div>

          <button
            onClick={onOpenDiscussions}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-sm font-semibold text-white border border-[#30363d] transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#3fb950]" />
            Ask in Community Discussions
          </button>
        </div>

        {/* Math Mentoring */}
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-[#1f6feb]/20 border border-[#388bfd]/30">
                <GraduationCap className="w-5 h-5 text-[#58a6ff]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Math Mentoring for Students</h3>
                <p className="text-xs text-[#8b949e]">Higher mathematics & software applications</p>
              </div>
            </div>

            <p className="text-sm text-[#8b949e] leading-relaxed mb-4">
              I tutor students in higher mathematics, with an emphasis on understanding concepts and connecting
              abstract ideas to practical applications in software and engineering where useful.
            </p>

            <div className="mb-4">
              <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider block mb-2">
                Areas Covered:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Calculus (single & multivariable)',
                  'Linear Algebra',
                  'Discrete Mathematics',
                  'Probability & Statistics',
                  'Algorithm Complexity (Big-O)',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded bg-[#0d1117] text-[#58a6ff] border border-[#30363d]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0d1117] border border-[#30363d] text-xs text-[#8b949e] space-y-1">
              <div className="font-semibold text-white">Approach:</div>
              <div>• Work from student coursework and problem sets directly</div>
              <div>• Emphasize conceptual understanding over mechanical repetition</div>
              <div>• Use code examples and visual models for abstract mechanics</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
