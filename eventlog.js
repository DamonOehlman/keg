var ts = require('monotonic-timestamp');

module.exports = function(registry, opts) {
  function write(store, line) {
    var db = registry.getStore('eventlog', store);

    return function(callback) {
      db.put(ts(), line, callback);
    };
  }

  return function(store, line, callback) {
    if (! callback) {
      return write(store, line);
    }

    return write(store, line)(callback);
  };
};
