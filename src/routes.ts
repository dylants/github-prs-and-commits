import { Request, Response, Router } from 'express';
import { loadPullRequestInfos, PullRequestInfo } from './github';

function getPullRequests(req: Request, res: Response) {
  const owner = req.query.owner?.toString() || 'dylants';
  const repo = req.query.repo?.toString() || 'puzzle-piece';
  loadPullRequestInfos(owner, repo).then((infos: PullRequestInfo[]) => {
    res.send(infos);
  });
}

module.exports = (router: Router) => {
  router.get('/pull-requests', getPullRequests);
};
