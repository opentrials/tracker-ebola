'use strict';
var csv = require('csv');
var request = require('request');
var Promise = require('bluebird');
var _ = require('lodash');
var config =  require('../config');

/**
 * Load and return cases and deaths data
 *
 * @returns {Promise}
 */
function get() {
  return _loadData().then(_parseData).then(_cleanData);
}

/**
 * Load and return normalized tracker data
 *
 * @returns {Promise}
 */
function getMapped() {
  return _loadData().then(_parseData).then(_cleanData).then(_processData);
}

function _processData(trials) {
  return new Promise(function(resolve, reject) {
    var results = _.map(trials, function(trial) {
      return {
        year: trial.year,
        month: trial.month,
        cases: trial.cases || 0,
        deaths: trial.deaths || 0,
        dataPackage: trial.datapackage
      };
    });
    resolve(results);
  });
}

//TODO: add timeout
function _loadData() {
  return new Promise(function(resolve, reject) {
    request(config.get('database:cases'), function(err, res, data) {
      if (!err && res.statusCode === 200) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function _parseData(data) {
  return new Promise(function(resolve, reject) {
    var options = {columns: true, auto_parse: true}; // jscs:disable
    csv.parse(data, options, function(err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function _cleanData(data) {
  return data;
}

/**
 * Module provides tracker data service
 */
module.exports = {
  get,
  getMapped
};
