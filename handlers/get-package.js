var abort = require('./abort');
var debug = require('debug')('keg:get');
var p = require('padded-semver');

module.exports = function(registry, opts) {
  var db = registry.db;

  return function(req, res, package) {
    var key = package.name + ':' + p.pad(package.version);

    db.get(key, { valueEncoding: 'utf-8' }, function(err, value) {
      // if it already exists, then complain
      if (err) {
        return abort(res, err.notFound ? 'notFound' : '', err);
      }

      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(value);
    });
  };
};
