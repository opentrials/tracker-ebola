'use strict';


// Not found
module.exports.notfound = function(request, response, next) {
  response.status(404).render('errors/notfound.html', {
    title: 'Page could not be found',
  });
  return next();
};

// Server
module.exports.server = function(error, request, response, next) {
  response.status(500).render('errors/server.html', {
    title: 'Something went wrong...',
    error: error,
  });
  return next();
};
