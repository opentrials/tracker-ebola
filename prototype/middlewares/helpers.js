'use strict';


module.exports.slash = function(request, response, next) {
  if(request.url.length > 1 && request.url.substr(-1) == '/') {
    response.redirect(301, request.url.slice(0, -1));
  } else {
    next();
  }
};
