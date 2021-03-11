'use strict';

const mock = require('egg-mock');

describe('test/syslog.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/syslog-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, syslog')
      .expect(200);
  });
});
