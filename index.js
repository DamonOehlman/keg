var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('keg');
var path = require('path');
var levelup = require('levelup');
var sublevel = require('level-sublevel');
var formatter = require('formatter');
var formatAddress = formatter('http://{{ address }}:{{ port }}');
var router = require('./router');

/**
  # keg

  This is a simple registry that is used by
  [nokku](https://github.com/DamonOehlman/nokku) to track local service
  installations and versions.  Could be used to store any versioned data though.

  __NOTE:__ Uses more restrictive [slimver](https://github.com/DamonOehlman/slimver-spec)
  versioning over semver, so be aware of those limitations.

  ## Endpoints

  <<< docs/endpoints.md

  ## Usage

  To be completed.

**/

module.exports = function(opts, callback) {
  var datapath = path.resolve((opts || {}).datapath || 'data');

  // create an event emitter as the registry instance
  var registry = new EventEmitter();

  // create the db
  var db = registry.db = sublevel(levelup(datapath));

  // create the event log
  var eventlog = registry.eventlog = require('./eventlog')(registry, opts);

  function getStore(section, storeName) {
    return db.sublevel(section + ':' + (storeName || 'main'));
  }

  // create the router
  registry.router = router(registry, opts);
  registry.getStore = getStore;

  return registry;
};
