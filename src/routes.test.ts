import express, { Application } from 'express';
import nock from 'nock';
import request from 'supertest';

describe('routes', () => {
  let app: Application;

  beforeAll(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  beforeEach(() => {
    app = express();

    const routes = require('./routes');
    routes(app);

    nock('https://api.github.com')
      .get('/repos/foo/bar/pulls')
      .reply(200, [
        {
          commits_url: 'https://api.github.com/commits/1',
          id: 1,
          number: 2,
          title: 'title',
          user: { login: 'user' },
        },
      ]);

    nock('https://api.github.com')
      .get('/commits/1')
      .reply(200, [{ sha: 123 }]);
  });

  describe('/pull-requests', () => {
    it('should return PRs and commits', () =>
      request(app)
        .get('/pull-requests?owner=foo&repo=bar')
        .expect(200)
        .then((data) => {
          expect(data.body).toEqual([
            {
              author: 'user',
              commit_count: 1,
              id: 1,
              number: 2,
              title: 'title',
            },
          ]);
        }));
  });
});
