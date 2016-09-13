'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
var jtm = require('../storage');
var model = require('../models/cases');

/**
 * Module provides tracker data service
 */
module.exports = {
  /**
   * Load and return normalized tracker data
   *
   * @returns {Promise}
   */
  get: function() {
    return new Promise(function(resolve, reject) {
      model().then(function(model) {
        jtm.Storage.load(model).then(function() {
          var models = jtm.Storage.all(model.tableName);
          var result = [];
          _.forEach(models, function(caseModel) {
            result.push(caseModel.mapped());
          });
          resolve(result);
        }, function(error) {
          reject(error);
        });
      }, function(error) {
        reject(error);
      });
    });
  }
};
