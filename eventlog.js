var ts = require('monotonic-timestamp');

module.exports = function(registry, opts) {
  var db = registry.db.sublevel('eventlog', {
    valueEncoding: 'utf8'
  });

  function write(line) {
    return function(callback) {
      db.put(ts(), line, callback);
    };
  };


  return function(line, callback) {
    if (! callback) {
      return write(line);
    }

    return write(line)(callback);
  };
};
