// See https://developers.google.com/gmail/api/quickstart/js

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var base64 = require('js-base64').Base64;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
  // authorize(JSON.parse(content), listLabels);
  authorize(JSON.parse(content), listMessages);
});

// 699005611612-mavvgd51adjsh988l074ihqmid7n3rkf.apps.googleusercontent.com
// DqDAXbgiNs1fCJPmYSY0fr-L

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
module.exports.authorize = function (credentials, callback) {
  console.log('authorize', gapi);
  if (new Date()) return callback(null, null)
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
module.exports.listLabels = function (auth) {
  var gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}

/**
 * Lists the messages in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listMessages(auth) {
  var gmail = google.gmail('v1');
  gmail.users.messages.list({
    auth: auth,
    userId: 'me',
    labelIds: [ 'INBOXZ' ]
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log('->>>', response)
    var labels = response.messages;
    if (labels.length == 0) {
      console.log('No messages found.');
    } else {
      console.log('Messages:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.id);


        gmail.users.messages.get({
          auth: auth,
          id: label.id,
          userId: 'me',
        }, function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            return;
          }
          console.log('msg --->>>', response)

          response.payload.parts.forEach((part) => {
            console.log('--------- PART -----------------------------------------');
            console.log('  part:', part);
          })
          response.payload.headers.forEach((part) => {
            console.log('--------- HEADER ---------------------------------------');
            console.log('  header:', part);
          })
          let contents;
          if (response.payload.parts == null) {
            contents = base64.decode(response.payload.body.data);
          } else {
            contents = base64.decode(response.payload.parts[0].body.data);
          }
          console.log('contents=', contents);

          // let body = base64.decode(bodyData.replace(/-/g, '+').replace(/_/g, '/'));
          // console.log('Body: ', body);
        });
      }
    }
  });
}
