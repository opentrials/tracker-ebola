'use strict';
var join = require('bluebird').join;
var reqdir = require('require-dir');
var services = reqdir('../services');

// All
module.exports.all = function(req, res) {
  join(services.cases.get(), services.trials.get(), function(cases, trials) {
    res.send({results: {cases: cases, trials: trials}});
  });
};

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
