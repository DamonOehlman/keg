var messages = {
  requireVersion: 'A version is required to update a package',
  requireValidVersion: 'A valid semantic version is required'
};

module.exports = function(res, code) {
  res.writeHead(500);
  res.end(messages[code] || 'An unknown error has occurred');
};
