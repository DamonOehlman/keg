module.exports = function(registry, test) {
  var request = require('supertest')('http://localhost:6700');

  test('get testpack 0.2.3', function(t) {
    t.plan(1);
    request.get('/main/testpack/0.2.3').expect(200, { age: 2 }, t.ifError);
  });

  test('get testpack 0.3.6', function(t) {
    t.plan(1);
    request.get('/main/testpack/0.3.6').expect(200, { age: 3 }, t.ifError);
  });

  test('get testpack 0.3.7 ==> 404', function(t) {
    t.plan(1);
    request.get('/main/testpack/0.3.7').expect(404, t.ifError);
  });

  test('get latest page of non-existent package t ==> 404', function(t) {
    t.plan(1);
    request.get('/main/t').expect(404, t.ifError);
  });

  test('get testpack 0.2.1 ==> 404', function(t) {
    t.plan(1);
    request.get('/main/testpack/0.2.1').expect(404, t.ifError);
  });
};
