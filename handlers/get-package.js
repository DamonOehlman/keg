var abort = require('./abort');
var debug = require('debug')('keg:get');
var svkey = require('slimver-key');
var slim = require('slimver');

module.exports = function(registry, opts) {
  var db = registry.db;

  function getLatestItem(req, res, package) {
    var reader = db.createReadStream({
      start: package.name,
      limit: 1
    });

    sendPackages(reader, res);
  }

  function getMatchingVersion(req, res, package) {
    var range = slim.range(package.version).map(slim.unpack).map(svkey);
    var reader = db.createReadStream({
      start: package.name + '!' + range[1],
      end: package.name + '!' + range[0]
    });

    sendPackages(reader, res);
  }

  function sendPackages(reader, res) {
    var writtenHead = false;

    function writeHead(data) {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });

      return true;
    }

    reader
      .on('data', function(data) {
        var val = data.value;
        var version = svkey.unpack(data.key.split('!')[0]);

        writtenHead = writtenHead || writeHead(data);

        val.version = version;
        res.write(val);
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

    return getMatchingVersion(req, res, package);
 };
};
