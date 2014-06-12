var request = require('supertest');

module.exports = function(registry, test) {
  var request = require('supertest')(registry.url);

  test('attempt to put unversioned thing fails', function(t) {
    t.plan(1);
    request.put('/testpack').expect(500, t.ifError);
  });

  test('attempt to put a thing with an invalid version string', function(t) {
    t.plan(1);
    request.put('/testpack@adsf').expect(500, t.ifError);
  });

  test('attempt to put a valid thing with no data fails', function(t) {
    t.plan(1);
    request.put('/testpack@0.0.0').expect(500, t.ifError);
  });

  test('put a valid thing with a payload succeeds', function(t) {
    t.plan(1);
    request.put('/testpack@0.0.0').send({ name: 'Fred' }).expect(200, t.ifError);
  });

  test('put an existing valid thing with a payload fails', function(t) {
    t.plan(1);
    request.put('/testpack@0.0.0').send({ name: 'Bob' }).expect(412, t.ifError);
  });
};
