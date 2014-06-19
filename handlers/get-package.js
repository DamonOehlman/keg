var abort = require('./abort');
var debug = require('debug')('keg:get');
var svkey = require('slimver-key');
var slim = require('slimver');

module.exports = function(registry, opts) {
  function getLatestItem(req, res, data) {
    var db = registry.getStore('versions', data.store);
    var reader = db.createReadStream({
      start: data.name,
      limit: 1
    });

    sendPackage(reader, res, data);
  }

  function getMatchingVersion(req, res, data) {
    var db = registry.getStore('versions', data.store);
    var keys = slim.range(data.version).map(svkey).reverse().map(function(k) {
      return data.name + '!' + k;
    });
    var reader = db.createReadStream({
      start: keys[0],
      end: keys[1],
      limit: 1
    });

    debug('looking for in range: ' + keys.join(' --> '));
    sendPackage(reader, res, data);
  }

  function sendPackage(reader, res, data) {
    var found = false;

    reader
      .on('data', function(item) {
        var parts = item.key.split('!');
        var version = svkey.unpack(parts[1]);

        if (parts[0] !== data.name) {
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'x-keg-version': version
        });
        res.end(item.value);

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

  return function(req, res, data) {
    var key;

    debug('attempting to get package: ', data);

    // if we have no package version, get the latest item
    if (! data.version) {
      return getLatestItem(req, res, data);
    }

    return getMatchingVersion(req, res, data);
 };
};
