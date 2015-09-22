'use strict';

var express = require('express');
var path = require('path');
var app = express();
var nunjucks  = require('nunjucks');
var views = path.join(__dirname, '/views');
var router = require('./routes/index');
var config = require('./config');

app.set('config', config);

app.use(router);

nunjucks.configure(views, {
  autoescape: true,
  express: app
});

module.exports = app;
