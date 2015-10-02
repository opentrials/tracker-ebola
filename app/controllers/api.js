'use strict';
var reqdir = require('require-dir');
var services = reqdir('../services');

// Cases
module.exports.cases = function(req, res) {
  services.cases.get().then(function(data) {
    res.send({results: data});
  });
};

// Trials
module.exports.trials = function(req, res) {
  services.trials.get().then(function(data) {
    res.send({results: data});
  });
};
