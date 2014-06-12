var EventEmitter = require('events').EventEmitter;
var path = require('path');
var http = require('http');
var mapleTree = require('mapleTree');

/**
  # nokku-registry

  This is a simple service registry that is used by
  [nokku](https://github.com/DamonOehlman/nokku) to track local service
  installations and versions.

  ## Usage

  To be completed.

**/

module.exports = function(opts, callback) {
  var port = (opts || {}).port || 5500;
  var datapath = path.resolve((opts || {}).datapath || 'data');

  // create an event emitter as the registry instance
  var registry = new EventEmitter();

  // create the db
  var db = registry.db = levelup(datapath);

  // create the server instance
  var server = registry.server = http.createServer(handleRequest);


  function handleRequest(req, res) {
  }

  server.listen(function(err) {
    registry.emit(err ? 'error' : 'ready', err);

    if (typeof callback == 'function') {
      callback(err, registry);
    }
  });

  return registry;
};
