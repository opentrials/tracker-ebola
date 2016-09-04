'use strict';
var path = require('path');
var nconf = require('nconf');

/**
 * Module provides hierarchical config
 */
module.exports = {
  get: function(key) {return nconf.get.call(nconf, key);},
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
};

// 1. Config from env (overrides)
nconf.env({
  separator: '_',
  lowerCase: true
});

// 2. Config from file (default)
nconf.file({
  file: path.join(__dirname, '../../config.json')
});
