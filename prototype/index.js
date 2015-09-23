'use strict';
var app = require('./app');
var port = app.get('config').get('appConfig:port');


// Start listening
app.listen(port, function() {
  console.log('Application is being served at:' + port);
});
