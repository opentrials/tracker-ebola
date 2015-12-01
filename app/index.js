'use strict';
var path = require('path');
var reqdir = require('require-dir');
var express = require('express');
var nunjucks  = require('nunjucks');
var config = require('./config');
var routes = reqdir('./routes');
var views = path.join(__dirname, '/views');
var _ = require('lodash');

/**
 * Module provides application
 */
var app = module.exports = express();

// Set config
app.set('config', config);

// Add routes
app.use(routes.main);

// Configure views
var env = nunjucks.configure(views, {
  autoescape: true,
  express: app
});
env.addGlobal('email', config.get('contacts:email'));
env.addGlobal('interval', config.get('updates:interval'));
env.addGlobal('urlencode', encodeURIComponent);
env.addGlobal('joinListOfNames', function(items) {
  if (_.isArray(items)) {
    var result = items;
    if (items.length > 2) {
      var last = items.pop();
      result = [items.join(', '), last];
      items.push(last);
    }
    return result.join(' and ');
  }
  return items;
});
env.addGlobal('wrapWithTag', function(items, tag) {
  if (_.isArray(items)) {
    return _.map(items, function(item) {
      return '<' + tag + '>' + item + '</' + tag + '>';
    });
  }
  return items;
});
