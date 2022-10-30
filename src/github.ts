import fetch from 'cross-fetch';

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

export interface PullRequestInfo {
  id: number;
  number: number;
  title: string;
  author: string;
  commit_count: number;
}

function loadAdditionalData(
  pullRequest: GitHubPullRequest
): Promise<PullRequestInfo> {
  return new Promise<PullRequestInfo>((resolve) => {
    fetch(pullRequest.commits_url)
      .then((res) => res.json() as unknown as GitHubPullRequestCommits[])
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
      });
  });
}

export async function loadPullRequestInfos(
  owner: string,
  repo: string
): Promise<PullRequestInfo[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls`
  );
  const pullRequests: GitHubPullRequest[] = await res.json();
  const pullRequestInfoResolvers = pullRequests.map((pr) =>
    loadAdditionalData(pr)
  );

  return Promise.all(pullRequestInfoResolvers);
}
