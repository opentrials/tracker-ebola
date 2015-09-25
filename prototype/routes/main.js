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

// Init router
var router = express.Router();

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
router.get('/api/data', controllers.api.data);

// Site pages
router.get('/', controllers.pages.index);
router.get('/about', controllers.pages.about);

// Error handling
router.use(middlewares.errors.notfound);
router.use(middlewares.errors.server);

// Module interface
module.exports = router;
