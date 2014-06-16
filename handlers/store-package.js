var abort = require('./abort');
var async = require('async');
var debug = require('debug')('keg:put');
var concat = require('concat-stream');
var svkey = require('slimver-key');

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
  var db = registry.db.sublevel('versions');

  return function(req, res, package) {
    var key;

    // TODO: tweak the encoding based on content type
    read(req, function(err, data, encoding) {
      if (err) {
        return abort(res, err.message);
      }

      // create the key using padded semver so lexi sorting works
      key = package.name + '!' + svkey(package.version);
      debug('looking for existing package: ' + key);

      db.get(key, function(err, value) {
        // if it already exists, then complain
        if (! err) {
          return abort(res, 'existingKey');
        }

        async.series([
          db.put.bind(db, key, data, { valueEncoding: encoding }),
          registry.eventlog(key)
        ], function(err) {
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
