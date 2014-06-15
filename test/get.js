module.exports = function(registry, test) {
  var request = require('supertest')(registry.url);

  test('get testpack 0.2.3', function(t) {
    t.plan(1);
    request.get('/testpack/0.2.3').expect(200, { age: 2 }, t.ifError);
  });

  test('get testpack 0.3.6', function(t) {
    t.plan(1);
    request.get('/testpack/0.3.6').expect(200, { age: 3 }, t.ifError);
  });

  test('get testpack 0.3.7 ==> 404', function(t) {
    t.plan(1);
    request.get('/testpack/0.3.7').expect(404, t.ifError);
  });
};
