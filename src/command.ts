import { loadPullRequestInfos, PullRequestInfo } from './github';

const owner = process.argv[2];
const repo = process.argv[3];

if (!owner || !repo) {
  throw new Error('owner and repo values are required');
}

loadPullRequestInfos(owner, repo).then((infos: PullRequestInfo[]) => {
  console.log(infos);
});
