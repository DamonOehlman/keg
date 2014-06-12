var abort = require('../lib/abort');
var debug = require('debug')('keg:put');
var concat = require('concat-stream');
var p = require('padded-semver');

function read(req, callback) {
  var encoding = 'json';

  req.pipe(concat(function(data) {
    if (Array.isArray(data) && data.length === 0) {
      return callback(new Error('emptyPayload'));
    }

    switch (encoding) {
      default: {
        try {
          data = JSON.parse(data.toString());
        }
        catch (e) {
          return callback(new Error('invalidPayload'));
        }
      }
    }

    callback(null, data, encoding);
  }));
}

module.exports = function(registry, opts) {
  var db = registry.db;

  return function(req, res, package) {
    var key;

    // TODO: tweak the encoding based on content type
    debug('attempting to handle request: ' + req.url);
    read(req, function(err, data, encoding) {
      if (err) {
        return abort(res, err.message);
      }

      // create the key using padded semver so lexi sorting works
      key = package.name + ':' + p.pad(package.version);
      debug('looking for existing package: ' + key);

      db.get(key, function(err, value) {
        // if it already exists, then complain
        if (! err) {
          return abort(res, 'existingKey');
        }

        db.put(key, data, { valueEncoding: encoding }, function(err) {
          if (err) {
            return abort(res, 'putFailed');
          }

          res.writeHead(200);
          res.end('ok');
        });
      });
    });
    req.pipe(concat(function(data) {
      if (Array.isArray(data) && data.length === 0) {
        return abort(res, 'emptyPayload');
      }

    }));
  };
};
