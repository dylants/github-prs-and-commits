import express, { Application } from 'express';
import nock from 'nock';
import request from 'supertest';
import config from '../config';

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
  });

  describe('/pull-requests', () => {
    describe('with successful GitHub data', () => {
      beforeEach(() => {
        nock(config.github_api.url)
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

        nock(config.github_api.url)
          .get('/commits/1')
          .reply(200, [{ sha: 123 }]);
      });

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

    describe('with more complex GitHub data', () => {
      beforeEach(() => {
        nock(config.github_api.url)
          .get('/repos/foo/bar/pulls')
          .reply(200, [
            {
              commits_url: 'https://api.github.com/commits/1',
              id: 10,
              number: 11,
              title: '12',
              user: { login: '13' },
            },
            {
              commits_url: 'https://api.github.com/commits/2',
              id: 20,
              number: 21,
              title: '22',
              user: { login: '23' },
            },
            {
              commits_url: 'https://api.github.com/commits/3',
              id: 30,
              number: 31,
              title: '32',
              user: { login: '33' },
            },
          ]);

        nock(config.github_api.url)
          .get('/commits/1')
          .reply(200, [{ sha: 123 }]);
        nock(config.github_api.url)
          .get('/commits/2')
          .reply(200, [{ sha: 123 }, { sha: 456 }]);
        nock(config.github_api.url)
          .get('/commits/3')
          .reply(200, [{ sha: 123 }, { sha: 456 }, { sha: 789 }]);
      });

      it('should return PRs and commits', () =>
        request(app)
          .get('/pull-requests?owner=foo&repo=bar')
          .expect(200)
          .then((data) => {
            expect(data.body).toEqual([
              {
                author: '13',
                commit_count: 1,
                id: 10,
                number: 11,
                title: '12',
              },
              {
                author: '23',
                commit_count: 2,
                id: 20,
                number: 21,
                title: '22',
              },
              {
                author: '33',
                commit_count: 3,
                id: 30,
                number: 31,
                title: '32',
              },
            ]);
          }));
    });

    describe('when GitHub pulls responds with an error response code', () => {
      beforeEach(() => {
        nock(config.github_api.url)
          .get('/repos/foo/bar/pulls')
          .reply(404, 'Not Found');
      });

      it('should return error response', () =>
        request(app)
          .get('/pull-requests?owner=foo&repo=bar')
          .expect(404)
          .then((data) => {
            expect(data.text).toEqual(
              'GitHub pulls API failed, status text: Not Found'
            );
          }));
    });

    describe('when GitHub commits responds with an error response code', () => {
      beforeEach(() => {
        nock(config.github_api.url)
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

        nock(config.github_api.url).get('/commits/1').reply(404, 'Not Found');
      });

      it('should return error response', () =>
        request(app)
          .get('/pull-requests?owner=foo&repo=bar')
          .expect(404)
          .then((data) => {
            expect(data.text).toEqual(
              'GitHub commits API failed, status text: Not Found'
            );
          }));
    });

    describe('when not supplying required query parameters', () => {
      it('should return error response', () =>
        request(app)
          .get('/pull-requests')
          .expect(400)
          .then((data) => {
            expect(data.text).toEqual(
              '"owner" and "repo" query parameters are required'
            );
          }));
    });

    describe('with any other bad issues', () => {
      beforeEach(() => {
        nock(config.github_api.url)
          .get('/repos/foo/bar/pulls')
          .reply(200, 'this will go badly');
      });

      it('should return error response', () =>
        request(app)
          .get('/pull-requests?owner=foo&repo=bar')
          .expect(500)
          .then((data) => {
            expect(data.text).toEqual('');
          }));
    });
  });
});
