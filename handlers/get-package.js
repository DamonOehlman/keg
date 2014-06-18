var abort = require('./abort');
var debug = require('debug')('keg:get');
var svkey = require('slimver-key');
var slim = require('slimver');

module.exports = function(registry, opts) {
  var db = registry.db.sublevel('versions');

  function getLatestItem(req, res, package) {
    var reader = db.createReadStream({
      start: package.name,
      limit: 1
    });

    sendPackage(reader, res, package);
  }

  function getMatchingVersion(req, res, package) {
    var keys = slim.range(package.version).map(svkey).reverse().map(function(k) {
      return package.name + '!' + k;
    });
    var reader = db.createReadStream({
      start: keys[0],
      end: keys[1],
      limit: 1
    });

    debug('looking for in range: ' + keys.join(' --> '));
    sendPackage(reader, res, package);
  }

  function sendPackage(reader, res, package) {
    var found = false;

    reader
      .on('data', function(data) {
        var parts = data.key.split('!');
        var version = svkey.unpack(parts[1]);

        if (parts[0] !== package.name) {
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'x-keg-version': version
        });
        res.end(data.value);

        found = true;
        reader.destroy();
      })
      .on('end', function() {
        if (! found) {
          res.writeHead(404);
          res.end('Not found');
        }
      });
  }

  return function(req, res, package) {
    var key;

    debug('attempting to get package: ', package);

    // if we have no package version, get the latest item
    if (! package.version) {
      return getLatestItem(req, res, package);
    }

    return getMatchingVersion(req, res, package);
 };
};
