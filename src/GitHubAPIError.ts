export default class GitHubAPIError {
  constructor(public status: number, public message: string) {}
}
