var abort = require('./handlers/abort');
var bee = require('beeline');
var debug = require('debug')('keg:router');

module.exports = function(registry, opts) {
  var storePackage = require('./handlers/store-package')(registry, opts);
  var packageRoutes = {
    'GET': require('./handlers/get-package')(registry, opts),
    'PUT': putPackage
  };

  var router = bee.route({
    '/`name`': packageRoutes,
    '/`name`/`version`': packageRoutes
  });

  function getPackage(req, res, tokens) {
  }

  function putPackage(req, res, tokens) {
    if (validPackage(req, res, tokens)) {
      storePackage(req, res, tokens);
    }
  }

  function validPackage(req, res, package) {
    if (! package) {
      return abort(res, 'noPackageData');
    }

    if (! package.name) {
      return abort(res, 'emptyPackageName')
    }

    if (! package.version) {
      return abort(res, 'invalidPackageVersion')
    }

    return true;
  }

  return router;
};
