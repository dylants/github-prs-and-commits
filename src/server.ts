import express from 'express';
import { loadPullRequestInfos, PullRequestInfo } from './github';

const app = express();
const port = 3000;

app.get('/pull-requests', (req, res) => {
  const owner = req.query.owner?.toString() || 'dylants';
  const repo = req.query.repo?.toString() || 'puzzle-piece';
  loadPullRequestInfos(owner, repo).then((infos: PullRequestInfo[]) => {
    res.send(infos);
  });
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
