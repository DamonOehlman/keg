var EventEmitter = require('events').EventEmitter;
var debug = require('debug')('keg');
var path = require('path');
var http = require('http');
var levelup = require('levelup');
var formatter = require('formatter');
var semver = require('semver');
var formatAddress = formatter('http://{{ address }}:{{ port }}');
var abort = require('./lib/abort');

/**
  # keg

  This is a simple service registry that is used by
  [nokku](https://github.com/DamonOehlman/nokku) to track local service
  installations and versions.

  ## Usage

  To be completed.

**/

module.exports = function(opts, callback) {
  var port = (opts || {}).port || 6700;
  var datapath = path.resolve((opts || {}).datapath || 'data');
  var rePartsDelim = /[\@\:]/;

  // only bind to localhost by default
  var hostname = (opts || {}).hostname || 'localhost';

  // create an event emitter as the registry instance
  var registry = new EventEmitter();

  // create the db
  var db = registry.db = levelup(datapath);

  // create the server instance
  var server = registry.server = http.createServer(handleRequest);

  function handleRequest(req, res) {
    var package = req.url.split(rePartsDelim);

    if (! package[1]) {
      return abort(res, 'requireVersion');
    }
  }

  debug('server listening on port: ' + port);
  server.listen(port, hostname, function(err) {
    var address = (! err) && server.address();

    // set the registry url
    registry.url = address && formatAddress(address);

    debug('server started listening, err: ', err);
    registry.emit(err ? 'error' : 'ready', err);

    if (typeof callback == 'function') {
      callback(err, registry);
    }
  });

  // attach a stop function for a convenient server close
  registry.stop = server.close.bind(server);

  return registry;
};
