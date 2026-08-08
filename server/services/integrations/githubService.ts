// ─── Integration Service: GitHub REST API ──────────────────────────────────────
// Interfacing with official GitHub REST API v3: https://api.github.com
// Authenticated server-side API token & 5-minute memory caching.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 Minutes Cache TTL
const memoryCache = new Map<string, { data: any; timestamp: number }>();

export interface GitHubRepoDetails {
  name: string;
  fullName: string;
  owner: string;
  description: string;
  visibility: string;
  defaultBranch: string;
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
  htmlUrl: string;
}

export interface GitHubCommitItem {
  sha: string;
  fullSha: string;
  message: string;
  author: string;
  date: string;
  htmlUrl: string;
}

export interface GitHubIssueItem {
  id: number;
  number: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  htmlUrl: string;
}

export interface GitHubPullRequestItem {
  id: number;
  number: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  htmlUrl: string;
}

export interface GitHubRateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  resetTime: string;
}

export class GitHubIntegrationService {
  private static getParams() {
    const token = process.env.GITHUB_TOKEN?.trim();
    const username = process.env.GITHUB_USERNAME || 'pratheeshclement-cmd';
    const owner = process.env.GITHUB_OWNER || username;
    const repo = process.env.GITHUB_REPO || `${username}.github.io`;

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Pratheesh-OS-Backend',
    };

    if (token) {
      headers.Authorization = `token ${token}`;
    }

    return { token, username, owner, repo, headers, hasToken: Boolean(token && token.length > 0) };
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const { token, owner, repo, headers, hasToken } = this.getParams();
    const start = Date.now();

    if (!hasToken) {
      return {
        id: 'github',
        name: 'GitHub REST API',
        category: 'Developer Platform',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v3',
        docsUrl: 'https://docs.github.com/en/rest',
        message: 'Authentication Required. Configure GITHUB_TOKEN in server/.env.',
        configured: false,
      };
    }

    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
        headers,
        timeout: 8000,
      });

      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'github',
        name: 'GitHub REST API',
        category: 'Developer Platform',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v3',
        docsUrl: 'https://docs.github.com/en/rest',
        message: `GitHub REST API connected for repository ${res.data.full_name} (${res.data.stargazers_count} stars).`,
        configured: true,
        metadata: {
          owner,
          repo: res.data.name,
          stars: res.data.stargazers_count,
          forks: res.data.forks_count,
          openIssues: res.data.open_issues_count,
        },
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'github',
        name: 'GitHub REST API',
        category: 'Developer Platform',
        status: 'error',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v3',
        docsUrl: 'https://docs.github.com/en/rest',
        message: `GitHub API Notice: ${err.response?.data?.message || err.message}`,
        configured: true,
      };
    }
  }

  public static async getRepository(): Promise<{ configured: boolean; data?: GitHubRepoDetails; message?: string }> {
    const { owner, repo, headers, hasToken } = this.getParams();
    if (!hasToken) return { configured: false, message: 'Configure GITHUB_TOKEN in server/.env' };

    const cacheKey = `repo_${owner}_${repo}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers, timeout: 8000 });
      const r = res.data;
      const data: GitHubRepoDetails = {
        name: r.name,
        fullName: r.full_name,
        owner: r.owner.login,
        description: r.description || 'Personal Portfolio & Admin OS',
        visibility: r.visibility || (r.private ? 'private' : 'public'),
        defaultBranch: r.default_branch || 'main',
        stars: r.stargazers_count,
        forks: r.forks_count,
        openIssues: r.open_issues_count,
        updatedAt: r.updated_at,
        htmlUrl: r.html_url,
      };

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.message || err.message };
    }
  }

  public static async getCommits(): Promise<{ configured: boolean; data?: GitHubCommitItem[]; message?: string }> {
    const { owner, repo, headers, hasToken } = this.getParams();
    if (!hasToken) return { configured: false, message: 'Configure GITHUB_TOKEN in server/.env' };

    const cacheKey = `commits_${owner}_${repo}`;
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { configured: true, data: cached.data };
    }

    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`, { headers, timeout: 8000 });
      const data: GitHubCommitItem[] = (res.data || []).map((c: any) => ({
        sha: c.sha.substring(0, 7),
        fullSha: c.sha,
        message: c.commit.message,
        author: c.commit.author?.name || 'Developer',
        date: c.commit.author?.date || new Date().toISOString(),
        htmlUrl: c.html_url,
      }));

      memoryCache.set(cacheKey, { data, timestamp: Date.now() });
      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.message || err.message };
    }
  }

  public static async getIssues(): Promise<{ configured: boolean; data?: GitHubIssueItem[]; message?: string }> {
    const { owner, repo, headers, hasToken } = this.getParams();
    if (!hasToken) return { configured: false, message: 'Configure GITHUB_TOKEN in server/.env' };

    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=10`, { headers, timeout: 8000 });
      const data: GitHubIssueItem[] = (res.data || [])
        .filter((iss: any) => !iss.pull_request)
        .map((iss: any) => ({
          id: iss.id,
          number: iss.number,
          title: iss.title,
          state: iss.state,
          author: iss.user?.login || 'User',
          createdAt: iss.created_at,
          htmlUrl: iss.html_url,
        }));

      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.message || err.message };
    }
  }

  public static async getPullRequests(): Promise<{ configured: boolean; data?: GitHubPullRequestItem[]; message?: string }> {
    const { owner, repo, headers, hasToken } = this.getParams();
    if (!hasToken) return { configured: false, message: 'Configure GITHUB_TOKEN in server/.env' };

    try {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=5`, { headers, timeout: 8000 });
      const data: GitHubPullRequestItem[] = (res.data || []).map((pr: any) => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.user?.login || 'User',
        createdAt: pr.created_at,
        htmlUrl: pr.html_url,
      }));

      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.message || err.message };
    }
  }

  public static async getRateLimit(): Promise<{ configured: boolean; data?: GitHubRateLimitInfo; message?: string }> {
    const { headers, hasToken } = this.getParams();
    if (!hasToken) return { configured: false, message: 'Configure GITHUB_TOKEN in server/.env' };

    try {
      const res = await axios.get('https://api.github.com/rate_limit', { headers, timeout: 5000 });
      const rate = res.data.resources?.core || {};
      const data: GitHubRateLimitInfo = {
        limit: rate.limit || 60,
        remaining: rate.remaining || 0,
        reset: rate.reset || 0,
        resetTime: rate.reset ? new Date(rate.reset * 1000).toISOString() : new Date().toISOString(),
      };

      return { configured: true, data };
    } catch (err: any) {
      return { configured: true, message: err.response?.data?.message || err.message };
    }
  }
}
