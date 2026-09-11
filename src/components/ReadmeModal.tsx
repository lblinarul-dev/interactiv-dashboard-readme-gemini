import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, Copy, FileText, Code2 } from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const loadReadme = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/readme');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || '');
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadReadme();
    }
  }, [isOpen]);

  const handleSync = async () => {
    setSyncing(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/sync-readme', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setContent(data.content);
        setStatusMsg(`Sync successful: Updated with ${data.ownReposCount} project(s)`);
      } else {
        setStatusMsg(`Sync error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMsg(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#58a6ff]" />
            <h3 className="font-bold text-white text-lg">README.md Viewer & Sync Console</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 bg-[#0d1117] border-b border-[#30363d] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Running Sync...' : 'Sync Tables from GitHub'}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] transition-colors cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Markdown'}
            </button>
          </div>
          {statusMsg && (
            <span className="text-[#3fb950] font-medium">{statusMsg}</span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-[#c9d1d9] bg-[#0d1117] leading-relaxed whitespace-pre-wrap select-text">
          {loading ? (
            <div className="py-12 text-center text-[#8b949e]">Loading README.md...</div>
          ) : (
            content
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between text-xs text-[#8b949e]">
          <span>Replaces markers: &lt;!-- OWN-PROJECTS --&gt; &amp; &lt;!-- EXTERNAL-CONTRIBUTIONS --&gt;</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
