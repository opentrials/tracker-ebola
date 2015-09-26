'use strict';
var reqdir = require('require-dir');
var services = reqdir('../services');

// Data
module.exports.data = function(req, res) {
  services.data.get().then(function(data) {
    res.send({results: data});
  });
};
