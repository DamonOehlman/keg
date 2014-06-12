var abort = require('../lib/abort');
var debug = require('debug')('keg:put');
var concat = require('concat-stream');

module.exports = function(registry, opts) {
  var db = registry.db;

  return function(req, res, data) {
    debug('attempting to handle request: ' + req.url);
    req.pipe(concat(function(data) {
      if (Array.isArray(data) && data.length === 0) {
        return abort(res, 'emptyPayload');
      }
    }));
  };
};
