'use strict';

module.exports = function(error, request, response, next) {
  response.status(404).render('error.html', {
    title: 'Something went wrong...',
    error: error
  });
  return next();
};
