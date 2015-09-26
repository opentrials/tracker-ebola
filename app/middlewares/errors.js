'use strict';

// Not found
module.exports.notfound = function(req, res, next) {
  res.status(404).render('errors/notfound.html', {
    title: 'Page could not be found',
  });
  return next();
};

// Server
module.exports.server = function(err, req, res, next) {
  //TODO: show error only in dev environ
  res.status(500).render('errors/server.html', {
    title: 'Something went wrong...',
    error: err,
  });
  return next();
};
