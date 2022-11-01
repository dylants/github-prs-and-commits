# GitHub PRs and Commits

A coding exercise to load GitHub pull requests and associated commits.

## Technical Overview

This application utilizes the [GitHub REST API](https://docs.github.com/en/rest) to query for the list of pull requests and number of associated commits for a given repository. This is done by first querying for the [list of pull requests](https://docs.github.com/en/rest/pulls/pulls#list-pull-requests), then for each pull request, build a set of URLs to [query for commits](https://docs.github.com/en/rest/pulls/pulls#list-commits-on-a-pull-request). These queries are then executed and the results are awaited by a `Promise.all`.

The response is of the form:

```typescript
[
  {
    id: number;
    number: number;
    title: string;
    author: string;
    commit_count: number;
  },
  ...
]
```

## Getting Started

This project was built using specific versions of Node and yarn, found in the package.json file. It is assumed both are installed and available.

If using nvm, you can switch to a valid version of Node using:

```
$ nvm use
```

Install dependencies:

```
$ yarn
```

## Load Pull Requests and Commits

There are multiple ways to load the pull requests and commits for a repo:

### API

Load the pull requests and commits via an API:

Build the project:

```
$ yarn build
```

Start the server (in production mode):

```
$ yarn prod
```

Navigate to `http://localhost:3000/api/pull-requests` using the query parameters `owner` and `repo` to specify the GitHub owner and repository. For example:

http://localhost:3000/api/pull-requests?owner=lquixada&repo=cross-fetch

### Command Line

Use the `yarn pull-requests` command:

```
$ yarn pull-requests <owner> <repo>
```

For example:

```
$ yarn pull-requests lquixada cross-fetch
```

## Development

To lint the files:

```
$ yarn lint
```

To run the tests:

```
$ yarn test
```

To run the tests in watch mode:

```
$ yarn test:watch
```

Run the server with automatic restart:

```
$ yarn start
```
