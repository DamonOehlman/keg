module.exports = function(registry, opts) {
  return function(req, res) {
    res.writeHead(404);
    res.end();
  };
};
