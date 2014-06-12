module.exports = function(registry, opts) {
  var handlers = {};

  ['put'].forEach(function(method) {
    exports[method] = require('./' + method + '.js')(registry, opts);
  });

  return handlers;
};
