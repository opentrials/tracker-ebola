'use strict';
var app = require('./prototype');
var port = app.get('config').get('server:port');

// Start listening
app.listen(port, function() {
  console.log('Application is being served at:' + port);
});
