'use strict';


// Index
module.exports.index = function(request, response) {
  response.render('index.html', {
    title: 'Ebola',
    subtitle: 'A live tracker of Ebola trials',
  });
}

// About
module.exports.about = function(request, response) {
  response.render('about.html', {
    title: 'About',
  });
}

// Patients
module.exports.patients = function(request, response) {
  response.render('patients.html', {
    title: 'Patients',
  });
}

// Researches
module.exports.researchers = function(request, response) {
  response.render('researchers.html', {
    title: 'Researchers',
  });
}

// Transparency
module.exports.transparency = function(request, response) {
  response.render('transparency.html', {
    title: 'Transparency',
  });
}
