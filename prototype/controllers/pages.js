'use strict';

var express = require('express');

function pageIndex(request, response) {
  response.render('index.html', {
    title: 'Index'
  });
}

function pageAbout(request, response) {
  response.render('about.html', {
    title: 'About'
  });
}

function pageContacts(request, response) {
  response.render('contacts.html', {
    title: 'Contacts'
  });
}

var router = express.Router();
router.get('/', pageIndex);
router.get('/contacts', pageContacts);
router.get('/about', pageAbout);

module.exports = router;
