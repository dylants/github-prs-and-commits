export default class GitHubAPIError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
  }
}
