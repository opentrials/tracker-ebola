var cases = require('../services/cases');
var trials = require('../services/trials');

module.exports = {
  // Cases
  cases: function(req, res) {
    cases.get().then(function(data) {
      res.send({results: data});
    });
  },

  // Trials
  trials: function(req, res) {
    trials.get().then(function(data) {
      res.send({results: data});
    });
  }
};
