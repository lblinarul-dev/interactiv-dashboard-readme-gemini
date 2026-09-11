import React, { useState, useEffect } from 'react';
import { DiscussionTopic } from '../types';
import {
  MessageSquare,
  PlusCircle,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Info,
  Send,
  User,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DiscussionsSectionProps {
  initialCategory?: string;
}

export const DiscussionsSection: React.FC<DiscussionsSectionProps> = ({ initialCategory }) => {
  const [topics, setTopics] = useState<DiscussionTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // New discussion form state
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DiscussionTopic['category']>('Mentoring');
  const [newAuthor, setNewAuthor] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply form state (per topic)
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTopicId, setReplyingTopicId] = useState<string | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const fetchDiscussions = async () => {
    try {
      const res = await fetch('/api/discussions');
      if (res.ok) {
        const data = await res.json();
        setTopics(data.discussions || []);
        if (!expandedTopicId && data.discussions?.length > 0) {
          setExpandedTopicId(data.discussions[0].id);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          author: newAuthor,
          content: newContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTopics([data.discussion, ...topics]);
        setExpandedTopicId(data.discussion.id);
        setNewTitle('');
        setNewAuthor('');
        setNewContent('');
        setShowNewForm(false);
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = async (topicId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyAuthor.trim() || !replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      const res = await fetch(`/api/discussions/${topicId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: replyAuthor,
          content: replyContent,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTopics((prev) =>
          prev.map((t) =>
            t.id === topicId ? { ...t, replies: [...t.replies, data.reply] } : t
          )
        );
        setReplyContent('');
        setReplyingTopicId(null);
      }
    } catch {
      // ignore
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleLike = async (topicId: string) => {
    try {
      const res = await fetch(`/api/discussions/${topicId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setTopics((prev) =>
          prev.map((t) => (t.id === topicId ? { ...t, likes: data.likes } : t))
        );
      }
    } catch {
      // ignore
    }
  };

  const categories = ['All', 'Mentoring', 'Frontend', 'Backend', 'Math & Algorithms', 'General'];

  const filteredTopics =
    selectedCategory === 'All'
      ? topics
      : topics.filter((t) => t.category === selectedCategory);

  return (
    <section id="discussions-section" className="space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#3fb950]" />
            Developer Discussions &amp; Community Q&amp;A
          </h2>
          <p className="text-xs sm:text-sm text-[#8b949e] mt-1">
            Exchange questions on engineering, code reviews, React architecture, or math mentoring.
          </p>
        </div>

        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-sm font-semibold text-white transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {showNewForm ? 'Cancel' : 'New Discussion'}
        </button>
      </div>

      {/* GitHub 404 Notice & Direct Alternatives Helper */}
      <div className="rounded-xl border border-[#388bfd]/30 bg-[#161b22] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#1f6feb]/20 text-[#58a6ff] shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Direct Communication Channels</h4>
            <p className="text-xs text-[#8b949e] mt-0.5 leading-relaxed">
              Post questions directly on this board or reach out through GitHub Issues and email. (Note: GitHub Discussions requires enabling in your repository settings: <em>Settings → Features → Discussions</em>).
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="https://github.com/lblinarul-dev/lblinarul-dev/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-medium text-white border border-[#30363d] transition-colors"
          >
            GitHub Issues
            <ExternalLink className="w-3 h-3 text-[#8b949e]" />
          </a>
          <a
            href="mailto:lblinarul@gmail.com"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-medium text-white border border-[#30363d] transition-colors"
          >
            Email Lblinarul
          </a>
        </div>
      </div>

      {/* Create Discussion Form */}
      {showNewForm && (
        <form
          onSubmit={handleCreateTopic}
          className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 space-y-4 transition-all"
        >
          <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d29922]" />
              Start a New Discussion
            </h3>
            <span className="text-xs text-[#8b949e]">Visible to all visitors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#8b949e] uppercase mb-1">
                Your Name or GitHub Handle *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AlexDev or Jane"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#0d1117] border border-[#30363d] text-white text-sm focus:outline-none focus:border-[#58a6ff]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8b949e] uppercase mb-1">
                Category *
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md bg-[#0d1117] border border-[#30363d] text-white text-sm focus:outline-none focus:border-[#58a6ff]"
              >
                <option value="Mentoring">🌱 Mentoring & Junior Q&A</option>
                <option value="Frontend">⚛️ Frontend & React</option>
                <option value="Backend">🐍 Backend & FastAPI</option>
                <option value="Math & Algorithms">📐 Math & Algorithms</option>
                <option value="General">💬 General Discussion</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase mb-1">
              Discussion Title *
            </label>
            <input
              type="text"
              required
              placeholder="What would you like to discuss or ask?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#0d1117] border border-[#30363d] text-white text-sm focus:outline-none focus:border-[#58a6ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase mb-1">
              Details & Context *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide background, code snippets, or specific questions..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-[#0d1117] border border-[#30363d] text-white text-sm focus:outline-none focus:border-[#58a6ff]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-medium text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Posting...' : 'Publish Discussion'}
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#58a6ff] text-white'
                : 'bg-[#161b22] text-[#8b949e] hover:text-white border border-[#30363d]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discussions Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-[#8b949e] text-sm bg-[#161b22] rounded-xl border border-[#30363d]">
            Loading discussions...
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-12 text-center text-[#8b949e] text-sm bg-[#161b22] rounded-xl border border-[#30363d]">
            No discussions found in this category yet. Be the first to start one!
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            return (
              <div
                key={topic.id}
                className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden transition-all"
              >
                {/* Topic Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1f6feb]/20 text-[#58a6ff] border border-[#388bfd]/30 font-medium">
                          {topic.category}
                        </span>
                        <span className="text-xs text-[#8b949e] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {topic.createdAt.slice(0, 10)}
                        </span>
                      </div>
                      <h3
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="text-base sm:text-lg font-bold text-white hover:text-[#58a6ff] cursor-pointer transition-colors"
                      >
                        {topic.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                        <span className="font-semibold text-white">{topic.author}</span>
                        {topic.authorRole && (
                          <span className="px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                            {topic.authorRole}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-start">
                      <button
                        onClick={() => handleLike(topic.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-[#8b949e] hover:text-white border border-[#30363d] transition-colors cursor-pointer"
                        title="Upvote"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-[#58a6ff]" />
                        {topic.likes}
                      </button>

                      <button
                        onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-white border border-[#30363d] transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#3fb950]" />
                        {topic.replies.length}
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <p className="mt-4 text-sm text-[#c9d1d9] leading-relaxed whitespace-pre-wrap">
                    {topic.content}
                  </p>
                </div>

                {/* Expanded Replies & Comment Form */}
                {isExpanded && (
                  <div className="border-t border-[#30363d] bg-[#0d1117] p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">
                        Replies ({topic.replies.length})
                      </h4>
                      {replyingTopicId !== topic.id && (
                        <button
                          onClick={() => setReplyingTopicId(topic.id)}
                          className="inline-flex items-center gap-1 text-xs text-[#58a6ff] hover:underline cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Leave a Reply
                        </button>
                      )}
                    </div>

                    {topic.replies.length === 0 ? (
                      <p className="text-xs text-[#8b949e] italic py-2">
                        No replies yet. Be the first to join this conversation.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {topic.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-3.5 rounded-lg bg-[#161b22] border border-[#30363d] text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{reply.author}</span>
                                {reply.authorRole && (
                                  <span className="px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d] text-[10px]">
                                    {reply.authorRole}
                                  </span>
                                )}
                              </div>
                              <span className="text-[#8b949e] text-[10px]">
                                {reply.createdAt.slice(0, 10)}
                              </span>
                            </div>
                            <p className="text-[#c9d1d9] leading-relaxed whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Reply Form */}
                    {replyingTopicId === topic.id && (
                      <form
                        onSubmit={(e) => handleCreateReply(topic.id, e)}
                        className="mt-3 p-4 rounded-lg bg-[#161b22] border border-[#30363d] space-y-3"
                      >
                        <div className="text-xs font-semibold text-white">Write a Reply</div>
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Your Name or Handle"
                            value={replyAuthor}
                            onChange={(e) => setReplyAuthor(e.target.value)}
                            className="w-full px-3 py-1.5 rounded bg-[#0d1117] border border-[#30363d] text-white text-xs focus:outline-none focus:border-[#58a6ff]"
                          />
                        </div>
                        <div>
                          <textarea
                            required
                            rows={3}
                            placeholder="Type your reply or insight..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full px-3 py-1.5 rounded bg-[#0d1117] border border-[#30363d] text-white text-xs focus:outline-none focus:border-[#58a6ff]"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingTopicId(null)}
                            className="px-3 py-1 rounded bg-[#21262d] text-white text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingReply}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                            {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
