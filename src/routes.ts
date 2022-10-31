import { Request, Response, Router } from 'express';
import { loadPullRequestInfos, PullRequestInfo } from './github';
import GitHubAPIError from './GitHubAPIError';

function getPullRequests(req: Request, res: Response) {
  const owner = req.query.owner?.toString();
  const repo = req.query.repo?.toString();

  if (!owner || !repo) {
    return res
      .status(400)
      .send('"owner" and "repo" query parameters are required');
  }

  loadPullRequestInfos(owner, repo)
    .then((infos: PullRequestInfo[]) => {
      return res.send(infos);
    })
    .catch((err) => {
      if (err instanceof GitHubAPIError) {
        return res.status(err.status).send(err.message);
      } else {
        // probably want to use some internal logger here
        return res.status(500).end();
      }
    });
}

module.exports = (router: Router) => {
  router.get('/pull-requests', getPullRequests);
};
