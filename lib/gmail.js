// See https://developers.google.com/gmail/api/quickstart/js
// import [ Base64 ] from 'js-base64'
var base64 = require('js-base64').Base64;

module.exports.connect = function(callback) {
  console.log(`Gmail.connect()`)

  // Client ID and API key from the Developer Console
  var CLIENT_ID = '699005611612-mavvgd51adjsh988l074ihqmid7n3rkf.apps.googleusercontent.com';

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

  var authorizeButton = document.getElementById('authorize-button');
  var signoutButton = document.getElementById('signout-button');

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  // function handleClientLoad() {
  console.log(`ok 1`)
  gapi.load('client:auth2', () => {
    console.log(`ok 2`)
    gapi.client.init({discoveryDocs: DISCOVERY_DOCS, clientId: CLIENT_ID, scope: SCOPES}).then(function() {
      console.log(`ok 3`)

      let updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
          console.log(`Signed in`)
          // authorizeButton.style.display = 'none';
          // signoutButton.style.display = 'block';
          // listLabels();
          gapi.client.gmail.users.labels.list({'userId': 'me'}).then(function(response) {
            var labels = response.result.labels
            console.log('Labels:')

            if (labels && labels.length > 0) {
              for (i = 0; i < labels.length; i++) {
                var label = labels[i];
                console.log(label.name)
              }
            } else {
              console.log('No Labels found.')
            }
            console.log(`Returning from connect()`);
            return callback(null)
          });

        } else {
          // authorizeButton.style.display = 'block';
          // signoutButton.style.display = 'none';
          console.log(`NOT signed in`);
          // return callback(null, false)
        }// isSignedIn
      };// updateSigninStatus

      // let handleAuthClick = function (event) {
      //   gapi.auth2.getAuthInstance().signIn();
      // }


      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      let initiallySignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      updateSigninStatus(initiallySignedIn);

      if (initiallySignedIn) {
        console.log(`Was signed in already`);
      } else {
        console.log(`Was not already signed in.`);
        setTimeout(() => {
          console.log(`Signing in...`);
          gapi.auth2.getAuthInstance().signIn();
        }, 1000)
      }

      // authorizeButton.onclick = handleAuthClick;
      // signoutButton.onclick = handleSignoutClick;
    });

  });
  // }

  // return callback(null, null)
}

module.exports.findEmail = function(to, urlPrefix, callback) {
  // var gmail = google.gmail('v1');
  let list = [ ]
  gapi.client.gmail.users.messages.list({'userId': 'me'}).then(function(response) {
  //
  // gmail.users.messages.list({
  //   auth: auth,
  //   userId: 'me',
  //   labelIds: [ 'INBOXZ' ]
  // }, function(err, response) {
  //   if (err) {
  //     console.log('The API returned an error: ' + err);
  //     return;
  //   }
    console.log('->>>', response)
    var messages = response.result.messages;
    if (!messages) {
      return callback(null, [ ])
    }

    (function nextMessage(index) {
      if (index >= messages.length) {
        // All done
        return callback(null, list)
      }

      // Look at the next message.
      let message = messages[index];
      console.log('- %s', message.id);


      gapi.client.gmail.users.messages.get({
        id: message.id,
        userId: 'me',
      }).then(function(response) {
        // if (err) {
        //   console.log('The API returned an error: ' + err);
        //   return;
        // }
        console.log('msg --->>>', response)
        console.log(`msg --->>>`)
        console.log(`msg --->>>`)
        console.log(`msg --->>>`)
        console.log(`msg --->>>`)
        console.log(`msg --->>>`)

        response.result.payload.parts.forEach((part) => {
          console.log('--------- PART -----------------------------------------');
          console.log('  part:', part);
        })

        let msg = { };
        response.result.payload.headers.forEach((header) => {
          console.log('--------- HEADER ---------------------------------------');
          console.log('  header:', header);
          switch (header.name) {
            case 'From':
              msg.from = header.value;
              break;
            case 'To':
              msg.to = header.value;
              break;
            case 'Date':
              msg.date = header.value;
              break;
            case 'Subject':
              msg.subject = header.value;
              break;
          }
        })
        if (response.result.payload.parts == null) {
          msg.contents = base64.decode(response.result.payload.body.data);
        } else {
          msg.contents = base64.decode(response.result.payload.parts[0].body.data);
        }
        console.log('========', msg);

        // See if this email contains the confirm URL.
        let pos = msg.contents.indexOf('<' + urlPrefix)
        if (pos >= 0) {
          let url = msg.contents.substring(pos + 1);
          let pos2 = url.indexOf('>');
          if (pos2 > 0) {
            msg.url = url.substring(0, pos2)
          } else {
            msg.url = url
          }
          list.push(msg);
        }
        return nextMessage(index + 1);
      });// messages.get
    })(0); // Start with the first message
  });
}
