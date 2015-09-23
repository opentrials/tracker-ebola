'use strict';
var csv = require('csv');
var request = require('request');
var Promise = require('bluebird');
var config =  require('../config');

// Get data
module.exports.get = function() {
  return new Promise(function(resolve, reject) {
    request(config.get('trackerData'), function(err, res, body) {
      if (!err && res.statusCode == 200) {
        csv.parse(body, {columns: true}, function(err, data) {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        });
      } else {
        reject(err);
      }
    });
  });
};
