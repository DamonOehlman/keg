var request = require('supertest');

module.exports = function(registry, test) {
  var request = require('supertest')(registry.url);

  test('attempt to put unversioned thing fails', function(t) {
    t.plan(1);
    request.put('/testpack').expect(500, t.ifError);
  });

  test('attempt to put a thing with an invalid version string', function(t) {
    t.plan(1);
    request.put('/testpack/adsf').expect(500, t.ifError);
  });

  test('attempt to put a valid thing with no data fails', function(t) {
    t.plan(1);
    request.put('/testpack/1.0.0').expect(500, t.ifError);
  });

  test('put a valid thing with a payload succeeds', function(t) {
    t.plan(1);
    request.put('/testpack/1.0.0').send({ name: 'Fred' }).expect(200, t.ifError);
  });

  test('can get the created thing', function(t) {
    t.plan(1);
    request
      .get('/testpack/1.0.0')
      .expect('Content-Type', /json/)
      .expect(200, { name: 'Fred' }, t.ifError);
  });

  test('put an existing valid thing with a payload fails', function(t) {
    t.plan(1);
    request.put('/testpack/1.0.0').send({ name: 'Bob' }).expect(412, t.ifError);
  });

  test('put a new valid thing succeeds', function(t) {
    t.plan(1);
    request.put('/testpack/8.0.0').send({ name: 'Frederick' }).expect(200, t.ifError);
  });

  test('can get the new thing', function(t) {
    t.plan(1);
    request
      .get('/testpack/8.0.0')
      .expect('Content-Type', /json/)
      .expect(200, { name: 'Frederick' }, t.ifError);
  });

  test('can deploy a thing which is a patch of an earlier version', function(t) {
    t.plan(1);
    request.put('/testpack/1.0.5').send({ name: 'Fred', age: 50 }).expect(200, t.ifError);
  });

  test('can get the patched thing', function(t) {
    t.plan(1);
    request
      .get('/testpack/1.0.5')
      .expect('Content-Type', /json/)
      .expect(200, { name: 'Fred', age: 50 }, t.ifError);
  });

  test('can deploy a thing that might create lexicographic chaos', function(t) {
    t.plan(1);
    request.put('/testpack/10.3.5').send({ name: 'F', age: 51 }).expect(200, t.ifError);
  });

  test('can get that new troublesome thing', function(t) {
    t.plan(1);
    request
      .get('/testpack/10.3.5')
      .expect('Content-Type', /json/)
      .expect(200, { name: 'F', age: 51 }, t.ifError);
  });

  test('can get the latest thing', function(t) {
    t.plan(1);
    request
      .get('/testpack')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '10.3.5')
      .expect(200, { name: 'F', age: 51 }, t.ifError);
  });
};
