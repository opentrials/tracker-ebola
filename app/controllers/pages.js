'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var requireDir = require('require-dir');
var services = requireDir('../services');

// Index
module.exports.index = function(req, res) {
  services.trials.getMapped().then(function(data) {
    res.render('index.html', {
      title: 'Ebola',
      subtitle: 'A live tracker of Ebola trials',
      trials: data,
      info: services.utils.collectTrialsInfo(data),
      req: req
    });
  });
};

// About
module.exports.about = function(req, res) {
  res.render('about.html', {
    title: 'About'
  });
};

module.exports.chart = function(req, res) {
  var promises = [
    services.trials.getMapped(),
    services.cases.getMapped()
  ];
  Promise.all(promises).then(function(data) {
    var trials = data[0];
    var cases = data[1];
    var chartData = services.utils.collectDataForChart(trials, cases);
    res.render('graph.html', {
      title: 'Ebola Graph',
      chartData: JSON.stringify(chartData)
    });
  });
};
