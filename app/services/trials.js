'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var jtm = require('../storage');
var model = require('../models/trials');

/**
 * Module provides trials service
 */
module.exports = {
  get: function() {
    return new Promise(function(resolve, reject) {
      model().then(function(model) {
        jtm.Storage.load(model).then(function() {
          var models = jtm.Storage.all(model.tableName);
          var result = [];
          _.forEach(models, function(trialModel) {
            result.push(trialModel.proceed());
          });
          resolve(_.sortBy(result, function(trial) {
            return trial.publicationDelay;
          }));
        }, function(error) {
          reject(error);
        });
      }, function(error) {
        reject(error);
      });
    });
  }
};
