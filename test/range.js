module.exports = function(registry, test) {
  var request = require('supertest')('http://localhost:6700');

  test('request for testpack ^1.0.0 returns version 1.0.5', function(t) {
    t.plan(1);
    request
      .get('/main/testpack/^1.0.0')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '1.0.5')
      .expect(200, { name: 'Fred', age: 50 }, t.ifError);
  });

  test('request for testpack 0.2.x returns version 0.2.3', function(t) {
    t.plan(1);
    request
      .get('/main/testpack/0.2.x')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '0.2.3')
      .expect(200, { age: 2 }, t.ifError);
  });

  test('request for testpack 0.3.x returns version 0.3.6', function(t) {
    t.plan(1);
    request
      .get('/main/testpack/0.3.x')
      .expect('Content-Type', /json/)
      .expect('x-keg-version', '0.3.6')
      .expect(200, { age: 3 }, t.ifError);
  });

  test('request for testpack 0.4.x returns 404', function(t) {
    t.plan(1);
    request
      .get('/main/testpack/0.4.x')
      .expect(404, t.ifError);
  });
};
