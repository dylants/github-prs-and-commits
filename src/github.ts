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

function loadAdditionalData(
  pullRequest: GitHubPullRequest
): Promise<PullRequestInfo> {
  return new Promise<PullRequestInfo>((resolve, reject) => {
    fetch(pullRequest.commits_url)
      .then((res) => {
        if (res.status !== 200) {
          throw new GitHubAPIError(
            res.status,
            `GitHub commits API failed, status text: ${res.statusText}`
          );
        }

        return res.json() as unknown as GitHubPullRequestCommits[];
      })
      .then((pullRequestCommits) => {
        const commit_count: number = pullRequestCommits.length;
        return resolve({
          id: pullRequest.id,
          number: pullRequest.number,
          title: pullRequest.title,
          // eslint-disable-next-line sort-keys
          author: pullRequest.user.login,
          commit_count,
        });
      })
      .catch(reject);
  });
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
