var request = require('supertest');

module.exports = function(registry, test) {
  var request = require('supertest')(registry.url);

  test('attempt to put unversioned thing fails', function(t) {
    t.plan(1);
    request.put('/testpack')
      .expect(500, t.pass.bind(t, 'done'));
  });

  test('attempt to put a thing with an invalid version string', function(t) {
    t.plan(1);
    request.put('/testpack@adsf')
      .expect(500, t.pass.bind(t, 'done'));
  });

  test('attempt to put a valid thing with no data fails', function(t) {
    t.plan(1);
    request
      .put('/testpack@0.0.0')
      .expect(500, t.pass.bind(t, 'done'));
  });
};
