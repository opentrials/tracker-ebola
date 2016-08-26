var Promise = require('bluebird'),
  requireDir = require('require-dir'),
  services = requireDir('../services');

// Index
module.exports = {
  index: function (req, res) {
    services.trials.get().then(function (data) {
      res.render('index.html', {
        title: 'Ebola',
        subtitle: 'A live tracker of Ebola trials',
        trials: data,
        info: services.utils.collectTrialsInfo(data),
        req: req,
        disableLeaderboard: !!req.app.get('config').get('disable:leaderboard')
      });
    });
  },

  chart: function (req, res) {
    Promise.all([
                  services.trials.get(),
                  services.cases.get()
                ]).then(function (data) {
      var chartData = services.utils.collectDataForChart(data[0], data[1]);

      res.render('graph.html', {
        title: 'Ebola Graph',
        chartData: JSON.stringify(chartData)
      });
    });
  }
}
;
