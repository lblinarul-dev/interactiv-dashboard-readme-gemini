export interface GithubRepo {
  name: string;
  description: string;
  pushed_at?: string;
  updated_at?: string;
  html_url: string;
  fork?: boolean;
  stargazers_count?: number;
  language?: string;
  visibility?: string;
}

export interface ContributionItem {
  date: string;
  repo: string;
  type: 'Project' | 'Merged PR' | 'Issue';
  description: string;
  link: string;
  number?: number;
}

export interface ProfileSyncStatus {
  lastSynced?: string;
  ownProjectsCount: number;
  externalContributionsCount: number;
  status: 'idle' | 'syncing' | 'success' | 'error';
  message?: string;
}

export interface DiscussionReply {
  id: string;
  author: string;
  authorRole?: string;
  content: string;
  createdAt: string;
}

export interface DiscussionTopic {
  id: string;
  title: string;
  category: 'Mentoring' | 'Frontend' | 'Backend' | 'Math & Algorithms' | 'General';
  author: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: DiscussionReply[];
}

