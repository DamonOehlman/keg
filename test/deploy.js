var request = require('supertest');

module.exports = function(registry, test) {
  test('attempt to put unversioned thing fails', function(t) {
    t.plan(1);
    request(registry.url)
      .put('/testpack')
      .expect(500, t.pass.bind(t, 'done'));
  });

  test('attempt to put a thing with an invalid version string', function(t) {
    t.plan(1);
    request(registry.url)
      .put('/testpack@adsf')
      .expect(500, t.pass.bind(t, 'done'));
  });
};
