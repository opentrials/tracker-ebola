'use strict';


// Trailing slash redirect
module.exports.slash = function(req, res, next) {
  if(req.url.length > 1 && req.url.substr(-1) == '/') {
    res.redirect(301, req.url.slice(0, -1));
  } else {
    next();
  }
};
