'use strict';

module.exports = function(request, response, next) {
  response.status(404).render('notfound.html', {
    title: 'Page could not be found'
  });
  return next();
};
