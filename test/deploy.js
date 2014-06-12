module.exports = function(registry, test) {
  test('registry has a url', function(t) {
    t.plan(1);
    t.ok(registry.server);
  });
};
