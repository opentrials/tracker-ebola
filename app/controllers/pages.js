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
      req: req,
      disableLeaderboard: !!req.app.get('config').get('disable:leaderboard')
    });
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

module.exports.correspondence = function(req, res) {
  services.driveapi.getContentByFileName(req.params.fileName)
    .then(function(html) {
      html = html.replace('<body', '<div');
      html = html.replace('</body', '</div');

      res.render('correspondence.html', {
        title: 'Ebola trial correspondence',
        html: html
      });
    }, function(error) {
      res.render('errors/server.html', {
        title: 'Ebola Tracker Error',
        error: error
      });
    });
};
