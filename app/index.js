'use strict';
var path = require('path');
var reqdir = require('require-dir');
var express = require('express');
var nunjucks  = require('nunjucks');
var config = require('./config');
var routes = reqdir('./routes');
var views = path.join(__dirname, '/views');

/**
 * Module provides application
 */
var app = module.exports = express();

// Set config
app.set('config', config);

// Add routes
app.use(routes.main);

// Configure views
nunjucks.configure(views, {
  autoescape: true,
  express: app,
}).addGlobal(
  'email', config.get('contacts:email')
);