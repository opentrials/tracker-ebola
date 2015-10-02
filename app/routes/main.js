'use strict';
var path = require('path');
var reqdir = require('require-dir');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var controllers = reqdir('../controllers');
var middlewares = reqdir('../middlewares');
var statics = path.join(__dirname, '../public');
var config = require('../config');

/**
 * Module provides router
 */
var router = module.exports = express.Router();

// Static files
router.use(express.static(statics));

// General middlewares
router.use(cookieParser()),
router.use(session(config.get('session'))),
router.use(bodyParser.urlencoded({extended: true})),

// Site middlewares
router.use(middlewares.helpers.slash);
router.use(middlewares.access.token);

// Site API
router.get('/api/all', controllers.api.all);
router.get('/api/cases', controllers.api.cases);
router.get('/api/trials', controllers.api.trials);

// Site pages
router.get('/', controllers.pages.index);
router.get('/about', controllers.pages.about);

// Error handling
router.use(middlewares.errors.notfound);
router.use(middlewares.errors.server);
