'use strict';
var path = require('path');
var reqdir = require('require-dir');
var express = require('express');
var controllers = reqdir('../controllers');
var middlewares = reqdir('../middlewares');
var statics = path.join(__dirname, '../public');


// Init router
var router = express.Router();

// Static files
router.use(express.static(statics));

// Trailing slash
router.use(middlewares.helpers.slash);

// Site API
router.get('/api/data', controllers.api.data);

// Site pages
router.get('/', controllers.pages.index);
router.get('/about', controllers.pages.about);
router.get('/patients', controllers.pages.patients);
router.get('/researchers', controllers.pages.researchers);
router.get('/transparency', controllers.pages.transparency);

// Error handling
router.use(middlewares.errors.notfound);
router.use(middlewares.errors.server);

// Module interface
module.exports = router;
