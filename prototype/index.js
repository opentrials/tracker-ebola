'use strict';

var app = require('./app');

var port = app.get('config').get('appconfig:port');

app.listen(port, function() {
  console.log('Open Trials is being served at :' + port);
});
