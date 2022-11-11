import fetch from 'cross-fetch';
import config from '../config';
import GitHubAPIError from './GitHubAPIError';

interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  user: {
    login: string;
  };
  commits_url: string;
}

interface GitHubPullRequestCommits {
  sha: string;
}

async function loadAdditionalData(
  pullRequest: GitHubPullRequest
): Promise<PullRequestInfo> {
  const res = await fetch(pullRequest.commits_url);
  if (res.status !== 200) {
    throw new GitHubAPIError(
      res.status,
      `GitHub commits API failed, status text: ${res.statusText}`
    );
  }

  const pullRequestCommits: GitHubPullRequestCommits[] = await res.json();
  const commit_count: number = pullRequestCommits.length;
  return {
    id: pullRequest.id,
    number: pullRequest.number,
    title: pullRequest.title,
    // eslint-disable-next-line sort-keys
    author: pullRequest.user.login,
    commit_count,
  };
}

export interface PullRequestInfo {
  id: number;
  number: number;
  title: string;
  author: string;
  commit_count: number;
}

export async function loadPullRequestInfos(
  owner: string,
  repo: string
): Promise<PullRequestInfo[]> {
  const res = await fetch(
    `${config.github_api.url}/repos/${owner}/${repo}/pulls`
  );
  if (res.status !== 200) {
    throw new GitHubAPIError(
      res.status,
      `GitHub pulls API failed, status text: ${res.statusText}`
    );
  }

  const pullRequests: GitHubPullRequest[] = await res.json();
  const pullRequestInfoResolvers = pullRequests.map((pr) =>
    loadAdditionalData(pr)
  );

  return Promise.all(pullRequestInfoResolvers);
}
