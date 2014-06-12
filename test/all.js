var test = require('tape');
var registry;

test('can create a registry instance', function(t) {
  t.plan(1);
  registry = require('..')();
  registry.once('ready', t.pass.bind(t, 'registry ready'));
  registry.once('error', t.ifError.bind(t));
});

test('can stop the registry server', function(t) {
  t.plan(1);
  registry.stop();
  t.pass('stopped');
});
