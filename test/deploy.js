var request = require('supertest');

module.exports = function(registry, test) {
  test('attempt to put unversioned thing fails', function(t) {
    t.plan(1);
    request(registry.url)
      .put('/testpack')
      .expect(500, t.pass.bind(t, 'done'));
  });
};
