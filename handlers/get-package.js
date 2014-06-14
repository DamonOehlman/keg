var abort = require('./abort');
var debug = require('debug')('keg:get');
var svkey = require('slimver-key');

module.exports = function(registry, opts) {
  var db = registry.db;

  function getLatestItem(req, res, package) {
    var reader = db.createReadStream({
      start: package.name,
      limit: 1
    });
    var writtenHead = false;

    function writeHead(data) {
      var parts = data.key.split('!');

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'x-keg-version': svkey.unpack(parts[1])
      });
    }

    reader
      .on('data', function(data) {
        writtenHead = writtenHead || writeHead(data);
        res.write(data.value);
      })
      .on('end', function() {
        res.end();
      });
  }

  return function(req, res, package) {
    var key;

    // if we have no package version, get the latest item
    if (! package.version) {
      return getLatestItem(req, res, package);
    }

    key = package.name + '!' + svkey(package.version);
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
