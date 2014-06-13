var debug = require('debug')('keg:abort');
var messages = {
  noPackageData: 'No package data supplied',
  emptyPackageName: 'No package name given',
  emptyPayload: 'Empty payload',
  requireVersion: 'A version is required to update a package',
  invalidPackageVersion: 'A valid semantic version is required',
  existingKey: 'The specified package and version already exists, cannot overwrite',
  unsupportedMethod: 'Unsupported method',
  putFailed: 'An error occurred while putting the data'
};

var statusCodes = {
  existingKey: 412 // precondition failed
};

module.exports = function(res, code, err) {
  var message = messages[code] || 'An unknown error has occurred';
  var statusCode = statusCodes[code] || 500;

  if (err) {
    message += ': ' + err;
  }

  debug(statusCode + ': ' + message);
  res.writeHead(statusCode);
  res.end(message);

  return false;
};
