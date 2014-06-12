var messages = {
  requireVersion: 'A version is required to update a package'
};

module.exports = function(res, code) {
  res.writeHead(500);
  res.end(messages[code] || 'An unknown error has occurred');
};
