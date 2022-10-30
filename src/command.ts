import { loadPullRequestInfos, PullRequestInfo } from './github';

// attempt to load the owner and repo from the command line
const owner = process.argv[2] || 'dylants';
const repo = process.argv[3] || 'puzzle-piece';

// const owner = 'selfrefactor';
// const repo = 'rambda';
// const owner = 'atom';
// const repo = 'atom';
// const owner = 'dylants';
// const repo = 'puzzle-piece';
// const owner = 'dylants';
// const repo = 'fake';
// const owner = 'bad&data';
// const repo = 'fake';

loadPullRequestInfos(owner, repo).then((infos: PullRequestInfo[]) => {
  console.log(infos);
});
