'use strict';

var express = require('express');
var path = require('path');
var statics = path.join(__dirname, '/../public');

// Init router
var router = express.Router();

// Some express middleware to prepare request
router.use([

  // Static
  express.static(statics),

  // Controllers
  require('../controllers/pages'),

  // Errors
  require('../middlewares/notfound'),
  require('../middlewares/errors')

]);

module.exports = router;
