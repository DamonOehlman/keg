var request = require('supertest');

module.exports = function(registry, test) {
  var request = require('supertest')('http://localhost:6700');

  test('attempt to put unversioned thing fails', function(t) {
    t.plan(1);
    request.put('/main/testpack').expect(500, t.ifError);
  });

  test('attempt to put a thing with an invalid version string', function(t) {
    t.plan(1);
    request.put('/main/testpack/adsf').expect(500, t.ifError);
  });

  test('attempt to put a valid thing with no data fails', function(t) {
    t.plan(1);
    request.put('/main/testpack/1.0.0').expect(500, t.ifError);
  });

  test('put a valid thing with a payload succeeds', function(t) {
    t.plan(1);
    request.put('/main/testpack/1.0.0').send({ name: 'Fred' }).expect(200, t.ifError);
  });

  test('can get the created thing', function(t) {
    t.plan(1);
    request
      .get('/main/testpack/1.0.0')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '1.0.0')
      .expect(200, { name: 'Fred' }, t.ifError);
  });

  test('put an existing valid thing with a payload fails', function(t) {
    t.plan(1);
    request.put('/main/testpack/1.0.0').send({ name: 'Bob' }).expect(412, t.ifError);
  });

  test('put a new valid thing succeeds', function(t) {
    t.plan(1);
    request.put('/main/testpack/8.0.0').send({ name: 'Frederick' }).expect(200, t.ifError);
  });

  test('can get the new thing', function(t) {
    t.plan(1);
    request
      .get('/main/testpack/8.0.0')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '8.0.0')
      .expect(200, { name: 'Frederick' }, t.ifError);
  });

  test('can deploy a thing which is a patch of an earlier version', function(t) {
    t.plan(1);
    request.put('/main/testpack/1.0.5').send({ name: 'Fred', age: 50 }).expect(200, t.ifError);
  });

  test('can get the patched thing', function(t) {
    t.plan(1);
    request
      .get('/main/testpack/1.0.5')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '1.0.5')
      .expect(200, { name: 'Fred', age: 50 }, t.ifError);
  });

  test('can deploy a thing that might create lexicographic chaos', function(t) {
    t.plan(1);
    request.put('/main/testpack/10.3.5').send({ name: 'F', age: 51 }).expect(200, t.ifError);
  });

  test('can get that new troublesome thing', function(t) {
    t.plan(1);
    request
      .get('/main/testpack/10.3.5')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '10.3.5')
      .expect(200, { name: 'F', age: 51 }, t.ifError);
  });

  test('can get the latest thing', function(t) {
    t.plan(1);
    request
      .get('/main/testpack')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '10.3.5')
      .expect(200, { name: 'F', age: 51 }, t.ifError);
  });

  test('deploy testpack 0.2.3', function(t) {
    t.plan(1);
    request.put('/main/testpack/0.2.3').send({ age: 2 }).expect(200, t.ifError);
  });

  test('deploy testpack 0.3.6', function(t) {
    t.plan(1);
    request.put('/main/testpack/0.3.6').send({ age: 3 }).expect(200, t.ifError);
  });
};
