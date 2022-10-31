# GitHub PRs and Commits

A coding exercise to load GitHub pull requests and associated commits.

## Getting Started

This project was built using specific versions of Node and yarn, found in the package.json file. It is assumed both are installed and available.

Install dependencies:

```bash
$ yarn
```

## Load Pull Requests and Commits

There are multiple ways to load the pull requests and commits for a repo:

### API

Load the pull requests and commits via an API:

Start the server:

```bash
$ yarn start
```

Navigate to http://localhost:3000/pull-requests using the query parameters `owner` and `repo` to specify the GitHub owner and repository. For example:

http://localhost:3000/pull-requests?owner=atom&repo=atom

If you do not specify an owner or repo, it will use the defaults: `dylants` and `puzzle-piece`.

### Command Line

Use the `yarn pull-requests` command:

```bash
$ yarn pull-requests <owner> <repo>
```

For example:

```bash
$ yarn pull-requests selfrefactor rambda
```

If you do not specify an owner or repo, it will use the defaults: `dylants` and `puzzle-piece`
