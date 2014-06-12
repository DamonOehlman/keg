var test = require('tape');
var keg = require('..');
var registry;

test('can create a registry instance', function(t) {
  t.plan(1);
  registry = keg();
  registry.once('ready', t.pass.bind(t, 'registry ready'));
  registry.once('error', t.ifError.bind(t));
});

test('run subtests', function(t) {
  require('./deploy')(registry, t.test);
});

test('can stop the registry server', function(t) {
  t.plan(1);
  registry.stop();
  t.pass('stopped');
});

require('./deploy');

