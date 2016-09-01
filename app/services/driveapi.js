var google = require('googleapis');
var Promise = require('bluebird');
var key = require('../../tracker-ebola-secret.json');

var scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly',
              'https://www.googleapis.com/auth/drive'];
var drive = google.drive('v3');
var jwtClient = new google.auth.JWT(key.client_email, null,
  key.private_key, scopes, null);

module.exports = {
  getContentByFileName: function(fileName) {
    return new Promise(function(resolve, reject) {
      jwtClient.authorize(function(err, tokens) {
        if (err) {
          console.log(err);
          reject('The API returned an error');
          return;
        }

        drive.files.list({
          auth: jwtClient,
          q: 'name=\'' + fileName + '\'',
          fields: 'files'
        }, function(err, response) {
          if (err) {
            console.log(err);
            reject('The API returned an error');
            return;
          }
          var files = response.files;
          if (files.length == 0) {
            reject('Trial summary has not been found!');
            return;
          }
          var file = files[0];
          var data = '';

          drive.files.export({
              auth: jwtClient,
              fileId: file.id,
              mimeType: 'text/html'
            })
            .on('data', function(chunk) {
              data += chunk;
            })
            .on('end', function() {
              resolve(data);
            })
            .on('error', function(err) {
              console.log(err);
              reject('Error during fetch data');
            });
        });
      });
    });
  }
};
