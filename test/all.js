var test = require('tape');
var keg = require('..');
var path = require('path');
var rimraf = require('rimraf');
var registry;

test('can reset the data storage', function(t) {
  t.plan(1);
  rimraf(path.resolve(__dirname, '..', 'data'), t.ifError);
});

test('can create a registry instance', function(t) {
  t.plan(1);
  registry = keg();
  registry.once('ready', t.pass.bind(t, 'registry ready'));
  registry.once('error', t.ifError.bind(t));
});

test('server has bound to localhost only', function(t) {
  t.plan(1);
  t.equal(registry.url, 'http://127.0.0.1:6700');
});

test('run subtests', function(t) {
  require('./deploy')(registry, t.test);
  require('./expression')(registry, t.test);
});

test('can stop the registry server', function(t) {
  t.plan(1);
  registry.stop();
  t.pass('stopped');
});

require('./deploy');

