'use strict';

// Index
module.exports.index = function(req, res) {
  res.render('index.html', {
    title: 'Ebola',
    subtitle: 'A live tracker of Ebola trials',
  });
};

// About
module.exports.about = function(req, res) {
  res.render('about.html', {
    title: 'About',
  });
};
