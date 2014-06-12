var debug = require('debug')('keg:abort');
var messages = {
  emptyPayload: 'Empty payload',
  requireVersion: 'A version is required to update a package',
  requireValidVersion: 'A valid semantic version is required',
  unsupportedMethod: 'Unsupported method'
};

module.exports = function(res, code) {
  var message = messages[code] || 'An unknown error has occurred';

  debug('500: ' + message);
  res.writeHead(500);
  res.end(message);
};
