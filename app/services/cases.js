'use strict';
var csv = require('csv');
var Promise = require('bluebird');
var jts = require('jsontableschema/lib');
var config = require('../config');
var schema = require('./schemaCases.json');

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
      new jts.Resource(schema, config.get('database:cases')).then(
        function(resource) {
          var values = [];

          resource.iter(iterator, true, false).then(function() {
            resolve(values);
          }, function(errors) {
            reject(errors);
          });

          function iterator(items) {
            values.push(resource.map(items));
          }
        }, function(error) {
          reject(error);
        });
    });
  }
};
