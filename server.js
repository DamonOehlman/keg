var debug = require('debug')('keg:server');
var http = require('http');
var port = parseInt(process.env.PORT, 10) || 6700;
var registry = require('./index.js')();
var server = http.createServer(registry.router);

debug('server listening on port: ' + port);
server.listen(port, function(err) {
  debug('server started listening, err: ', err);
  registry.emit(err ? 'error' : 'ready', err);

  // attach a stop function for a convenient server close
  registry.stop = server.close.bind(server);

  if (typeof callback == 'function') {
    callback(err, registry);
  }
});
