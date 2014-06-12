var debug = require('debug')('keg:put');

module.exports = function(registry, opts) {
  var db = registry.db;

  return function(req, res) {
    req.on('end', function() {
    });
  };
};
