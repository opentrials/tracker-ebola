'use strict';
var config = require('../config');
var jtm = require('../storage');

/**
 * Module provides tracker data service
 */
module.exports = function() {
  return jtm.define({
    tableName: 'cases',
    resource: config.get('database:cases'),
    descriptor: require('./cases.json')
  });
};
