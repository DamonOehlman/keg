var test = require('tape');
var registry;

test('can create a registry instance', function(t) {
  t.plan(1);
  registry = require('..')();
  t.once('ready', t.pass.bind(t, 'registry ready'));
  t.once('error', t.ifError.bind(t));
});
