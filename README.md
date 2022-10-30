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

### Command Line

Use the `yarn pull-request` command:

```bash
$ yarn pull-request <owner> <repo>
```

For example:

```bash
$ yarn pull-request selfrefactor rambda
```

If you do not specify an owner or repo, it will use the defaults: `dylants` and `puzzle-piece`

```bash
$ yarn pull-request    // defaults to "dylants" and "puzzle-piece"
```

### API

Load the pull requests and commits via an API (say, if you would prefer to load it in a browser for easy viewing):

Start the server:

```bash
$ yarn start
```

Navigate to http://localhost:3000 using the query parameters `owner` and `repo` to specify the GitHub owner and repository. For example:

http://localhost:3000?owner=atom&repo=atom

If you do not specify an owner or repo, it will use the defaults: `dylants` and `puzzle-piece`.
