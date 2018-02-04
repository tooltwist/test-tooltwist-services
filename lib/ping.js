import axios from 'axios'

export default (endpoint) =>
{
  return new Promise((resolve, reject) => {
    console.log('login(email=' + email + ')')

  //   host: 'localhost',
  // port: 9090,
  // version: 'v2',
  // apikey: 'API129AAFPC5U27JUKZZ0A1NX533A'


    let email = 'xxxxxxxxxx'
    let password = 'xxxxxxxxxx'
    console.log('++++++++++ email=' + email + ', password=' + password)

    // endpoint = 'http://localhost:9090/v2/API1XXXXXXXXXXXXXXXXXXXXXXXXX'
    // endpoint = 'http://localhost:9090/v2/API129AAFPC5U27JUKZZ0A1NX533A'

    /*
     *  Call the server to authenticate the username/password.
     */
    let url = endpoint + '/v2/API1XXXXXXXXXXXXXXXXXXXXXXXXX/email/login'
    axios({
      method: 'post',
      url,
      headers: {
        // 'Authorization': 'Bearer ' + jwt
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        email: email,
        password: password
      }
    })
      .then(response => {
        // This should not happen!
        console.log('axios reply (response.data)=', response.data)
        // resolve({ status: 'ok' })
        reject('Strange error: the service was reached, and returned success, despite dud username/password.')
      })
      .catch(e => {
        console.log('axios error (response.data)=', e.response)

        if (e.response && e.response.status === 401) {
          // This is the expected response, for the email/password above
          console.log('Received expected error, for connection with wrong credentials.')
          resolve({ status: 'ok' })
        } else {
          console.log(`Error is `, e);
          reject(e)
        }
      })
  })// promise

}
