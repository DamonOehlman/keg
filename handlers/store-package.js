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
  return function(req, res, data) {
    var db = registry.getStore('versions', data.store);
    var key;

    // TODO: tweak the encoding based on content type
    read(req, function(err, payload, encoding) {
      if (err) {
        return abort(res, err.message);
      }

      // create the key using padded semver so lexi sorting works
      key = data.name + '!' + svkey(data.version);
      debug('looking for existing package: ' + key);

      db.get(key, function(err, value) {
        // if it already exists, then complain
        if (! err) {
          return abort(res, 'existingKey');
        }

        async.series([
          db.put.bind(db, key, payload, { valueEncoding: encoding }),
          registry.eventlog(data.store, key)
        ], function(err) {
          if (err) {
            return abort(res, 'putFailed');
          }

          res.writeHead(200);
          res.end('ok');
        });
      });
    });
  };
};
