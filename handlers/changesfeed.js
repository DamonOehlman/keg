var debug = require('debug')('keg:changes');
var qs = require('querystring');
var pull = require('pull-stream');
var pl = require('pull-level');
var svkey = require('slimver-key');

function writeData(read, req, res, vdb, opts) {
  var writtenHead = false;
  var includeDocs = (opts || {}).includeDocs;
  var ended = false;

  req.once('close', function() {
    ended = true;
  });

  function next(end, data) {
    var parts = data && data.value.split('!');
    var payload = parts && [data.key, parts[0], svkey.unpack(parts[1]) ];

    function sendPayload() {
      res.write(JSON.stringify(payload));
      read(null, next);
    }

    if (end || ended) {
      return read(end || ended);
    }

    if (! writtenHead) {
      res.writeHead(200);
      writtenHead = true;
    }

    if (! includeDocs) {
      return sendPayload();
    }

    vdb.get(data.value, function(err, data) {
      if (err) {
        return read(err);
      }

      payload.push(data);
      sendPayload();
    });
  }

  read(null, next);
}

module.exports = function(registry, opts) {
  var db = registry.db.sublevel('eventlog', {
    valueEncoding: 'utf8'
  });

  var vdb = registry.db.sublevel('versions', { valueEncoding: 'utf8' });

  return function(req, res) {
    var opts = qs.parse(req.url.split('?')[1]);

    debug('received changes feed request', [].slice.call(arguments, 2));

    pull(
      pl.read(db, { tail: true, min: (opts || {}).since }),
      pull.Sink(writeData)(req, res, vdb, opts)
    )
  };
};
