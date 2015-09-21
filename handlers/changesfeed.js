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
      res.write(JSON.stringify(payload) + '\n');
      read(null, next);
    }

    if (end || ended) {
      debug('ended');
      res.end();
      return read(end || ended, function() {});
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
  return function(req, res, data) {
    var db = registry.getStore('eventlog', data.store);
    var vdb = registry.getStore('versions', data.store);
    var opts = qs.parse(req.url.split('?')[1]);
    var live = (opts || {}).live;

    debug('received changes feed request', [].slice.call(arguments, 2));

    pull(
      pl.read(db, { tail: live, min: (opts || {}).since }),
      pull.Sink(writeData)(req, res, vdb, opts)
    );
  };
};
