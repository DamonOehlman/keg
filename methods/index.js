module.exports = function(registry, opts) {
  var handlers = {};

  ['put'].forEach(function(method) {
    handlers[method] = require('./' + method + '.js')(registry, opts);
  });

  return handlers;
};
