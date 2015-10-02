'use strict';
var reqdir = require('require-dir');
var services = reqdir('../services');

// Data
module.exports.data = function(req, res) {
  services.data.get().then(function(data) {
    res.send({results: data});
  });
};

// Cases
module.exports.cases = function(req, res) {
  services.cases.get().then(function(data) {
    res.send({results: data});
  });
};
