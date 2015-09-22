'use strict';

var path = require('path');
var nconf = require('nconf');

nconf.file({
  file: path.join(__dirname, '/../settings.json')
});

// this is the object that you want to override in your own local config
nconf.defaults({
  env: process.env.NODE_ENV || 'development',
  database: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
    define: {
      charset: "utf-8",
      collate: "utf8_general_ci",
      timestamps: true
    }
  },
  appconfig: {
    port: process.env.PORT || 3000
  }
});

module.exports = {
  get: function(key) {
    return nconf.get.call(nconf, key);
  },
  set: nconf.set.bind(nconf),
  reset: nconf.reset.bind(nconf)
};
