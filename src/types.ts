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
