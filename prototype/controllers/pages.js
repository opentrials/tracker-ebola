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

// Patients
module.exports.patients = function(req, res) {
  res.render('patients.html', {
    title: 'Patients',
  });
};

// Researches
module.exports.researchers = function(req, res) {
  res.render('researchers.html', {
    title: 'Researchers',
  });
};

// Transparency
module.exports.transparency = function(req, res) {
  res.render('transparency.html', {
    title: 'Transparency',
  });
};
