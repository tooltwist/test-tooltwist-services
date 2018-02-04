<template lang="pug">
section.container

  script(src="https://apis.google.com/js/api.js")

  div
    //- h1.title
    //-   | test-tooltwist-services2
    h2.subtitle
      | Create a new account
    br
    br
    br

    .myactions
      .mycheck
        .myrow
          //- p
          | A3 endpoint: &nbsp;&nbsp;&nbsp;
          input.input(v-model.trim="endpoint")
          | &nbsp;&nbsp;&nbsp;
        hr

      // Ping the A3 Server
      .mycheck
        .myrow
          .myicon
            icon.mytick(:name="pingIcon" v-bind:spin="pingIcon === 'spinner'")
          .mystep
            | Ping A3
          //-   //icon.mytimes(name="times")
          //-   | &nbsp;&nbsp;&nbsp;

          .mybutton2
            a.mybutton.button--green.is-small(@click="ping") go
        .myerror(v-if="pingError")
          | {{pingError}}
        hr

      // Create a new account
      .mycheck
        .myrow
          .myicon
            icon.mytick(:name="a3RegisterIcon" v-bind:spin="a3RegisterIcon === 'spinner'")
          .mystep
            | Register a new account
          //-   //icon.mytimes(name="times")
          //-   | &nbsp;&nbsp;&nbsp;
          .mybutton2
            a.mybutton.button--green.is-small(@click="a3Register") go
        .myerror(v-if="a3RegisterError")
          | {{a3RegisterError}}

        // Display user details
        .myrow
          | A3 email: &nbsp;&nbsp;
          input.input(v-model.trim="a3Email")
          br
          | A3 username: &nbsp;&nbsp;
          input.input(v-model.trim="a3Username")
          br
          | A3 password: &nbsp;&nbsp;
          input.input(v-model.trim="a3Password")
        hr

      // Check for verification email
      .mycheck
        .myrow
          .myicon
            icon.mytick(:name="a3EmailIcon" v-bind:spin="a3EmailIcon === 'spinner'")
          .mystep
            | Check for verification email
          //-   //icon.mytimes(name="times")
          //-   | &nbsp;&nbsp;&nbsp;
          .mybutton2
            a.mybutton.button--green.is-small(@click="verifyA3Email") go
        .myerror(v-if="a3EmailError")
          | {{a3EmailError}}
        .myrow(v-for="m in messages" v-bind:class="messageIsForCurrentUser(m) ? 'myMessageSelected' : ''").myMessageRow
          .myicon
          .mystep
            .myMsgEmail {{actualEmail(m.to)}}
            br
            | {{m.date}}
            br
            | {{m.subject}}
          .mybutton2
            a.button.mybutton.button--green.is-small(:href="m.url" target="_blank") verify
        hr

      // Login with invalid details
      .mycheck
        .myrow
          .myicon
            icon.mytick(:name="a3InvalidLoginIcon" v-bind:spin="a3InvalidLoginIcon === 'spinner'")
          .mystep
            | Invalid Login
          //-   //icon.mytimes(name="times")
          //-   | &nbsp;&nbsp;&nbsp;
          .mybutton2
            a.mybutton.button--green.is-small(@click="invalidLoginA3") go
        .myerror(v-if="a3InvalidLoginError")
          | {{a3InvalidLoginError}}
        hr

      // Login with email address
      .mycheck
        .myrow
          .myicon
            icon.mytick(:name="a3EmailLoginIcon" v-bind:spin="a3EmailLoginIcon === 'spinner'")
          .mystep
            | Email Login
          //-   //icon.mytimes(name="times")
          //-   | &nbsp;&nbsp;&nbsp;
          .mybutton2
            a.mybutton.button--green.is-small(@click="emailLoginA3") go
        .myerror(v-if="a3EmailLoginError")
          | {{a3EmailLoginError}}
        hr

      // Login with username
      .mycheck
        .myrow
          .myicon
            icon.mytick(:name="a3UsernameLoginIcon" v-bind:spin="a3UsernameLoginIcon === 'spinner'")
          .mystep
            | Username Login
          //-   //icon.mytimes(name="times")
          //-   | &nbsp;&nbsp;&nbsp;
          .mybutton2
            a.mybutton.button--green.is-small(@click="usernameLoginA3") go
        .myerror(v-if="a3UsernameLoginError")
          | {{a3UsernameLoginError}}
        hr

      // JWT after login
      .mycheck
        .myrow
          //- p
          | A3 JWT: &nbsp;&nbsp;&nbsp;
          input.input(v-model.trim="a3jwt" readonly)
          | &nbsp;&nbsp;&nbsp;
        hr

</template>

<script>
/* import Ping from '~/lib/ping.js' */
import axios from 'axios'
import Gmail from '~/lib/gmail'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  data: function() {
    return {
      endpoint: 'http://localhost:9090',
      pingSpin: false,
      pingIcon: null,
      pingError: '',

      a3RegisterSpin: false,
      a3RegisterIcon: null,
      a3RegisterError: '',

      a3EmailSpin: false,
      a3EmailIcon: null,
      a3EmailError: '',

      a3InvalidLoginSpin: false,
      a3InvalidLoginIcon: null,
      a3InvalidLoginError: '',

      a3EmailLoginSpin: false,
      a3EmailLoginIcon: null,
      a3EmailLoginError: '',

      a3UsernameLoginSpin: false,
      a3UsernameLoginIcon: null,
      a3UsernameLoginError: '',

      a3Email: null,
      a3Username: null,
      a3Password: null,
      a3Appname: null,
      a3jwt: null,
      a3AppAPIKEY: null,

      messages: [],
    }
  },
  methods: {

    /*
     *  Ping the a3 endpoint with dud credentials, just to see if it is there.
     */
    ping: function() {
      this.pingIcon = 'spinner'
      let url = this.endpoint + '/v2/API1XXXXXXXXXXXXXXXXXXXXXXXXX/email/login'
      axios({
          method: 'post',
          url,
          headers: {
            // 'Authorization': 'Bearer ' + jwt
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: {
            email: 'xxxxxxxxxx',
            password: 'xxxxxxxxxx'
          }
        })
        .then(response => {
          // This should not happen, with those dud cr4edentials.
          console.log('axios reply (response.data)=', response.data)
          this.pingIcon = 'times'
          this.pingError = 'Unexpected success!!!'
        })
        .catch(e => {
          console.log('axios error (response.data)=', e.response)

          if (e.response && e.response.status === 401) {
            // This is the expected response, for the email/password above
            this.pingIcon = 'check'
            console.log('Received the correct error, for connection with wrong credentials.')
            this.pingError = ''
          } else {
            console.log(`Error is `, e);
            this.pingIcon = 'times'
            if (e.response) {
              this.pingError = `${e.response.status} ${e.response.statusText}`
            }
          }
        }) // axios
    }, // ping()

    //  Register a new account at a3.
    a3Register: function() {

      // Choose a random user name
      let num = Math.round(Math.random() * 1000000)
      this.a3Email = `test.dude.tooltwist+${num}@gmail.com`
      this.a3Username = `tester${num}`
      this.a3Password = `password-${Math.round(Math.random() * 1000000)}`
      console.log(`email is ${this.a3Email}`)
      console.log(`username is ${this.a3Username}`)
      console.log(`password is ${this.a3Password}`)
      //- if (new Date()) return

      this.a3RegisterIcon = 'spinner'
      let url = this.endpoint + '/v2/API129AAFPC5U27JUKZZ0A1NX533A/email/register'
      axios({
          method: 'put',
          url,
          headers: {
            // 'Authorization': 'Bearer ' + jwt
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: {
            email: this.a3Email,
            username: this.a3Username,
            password: this.a3Password,
            firstName: 'Test',
            lastName: 'Dude'
          }
        })
        .then(response => {
          // This should not happen, with those dud cr4edentials.
          console.log('axios reply (response.data)=', response.data)
          this.a3RegisterIcon = 'check'
        })
        .catch(e => {
          console.log(`Error is `, e);
          this.a3RegisterIcon = 'times'
          if (e.response) {
            this.a3RegisterError = `${e.response.status} ${e.response.statusText}`
          }
        }) // Axios
    }, // a3Register

    //  Check for the A3 verification email
    verifyA3Email: function() {
      console.log('verifyA3Email()')
      console.log('gapi=', gapi)
      Gmail.connect((err, auth) => {
        console.log('Back from connect')

        let to = null
        let requiredUrlPrefix = `${this.endpoint}/v2/register/confirm/`
        Gmail.findEmail(to, requiredUrlPrefix, (err, list) => {
          console.log(`Back from find`, list)
          this.messages = list
        })
      })
    }, // verifyA3Email

    // Check that we cannot login with invalid details
    invalidLoginA3: function() {
      console.log(`invalidLoginA3()`)

      this.a3InvalidLoginIcon = 'spinner'
      this.a3InvalidLoginError = ''
      let url = this.endpoint + '/v2/API129AAFPC5U27JUKZZ0A1NX533A/email/login'
      let params = {
          method: 'post',
          url,
          headers: {
            // 'Authorization': 'Bearer ' + jwt
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: {
            email: 'xxxxxxxxxx',
            // email: this.a3Email,
            // username: this.a3Username,
            password: this.a3Password,
            // firstName: 'Test',
            // lastName: 'Dude'
          }
        }
      axios(params)
        .then(response => {
          // This should not happen, with those dud cr4edentials.
          console.log('axios reply (response.data)=', response.data)
          this.a3InvalidLoginIcon = 'check'
        })
        .catch(e => {
          console.log(`Error is `, e);
          this.a3InvalidLoginIcon = 'times'
          if (e.response) {
            this.a3InvalidLoginError = `${e.response.status} ${e.response.statusText}`
          }
        }) // Axios
    },

    // Check login with an new email address
    emailLoginA3: function() {
      console.log(`emailLoginA3()`)

      this.a3EmailLoginIcon = 'spinner'
      let url = this.endpoint + '/v2/API129AAFPC5U27JUKZZ0A1NX533A/email/login'
      this.a3EmailLoginError = ''
      let params = {
          method: 'post',
          url,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: {
            email: this.a3Email,
            password: this.a3Password,
          }
        }
      axios(params)
        .then(response => {
          // This should not happen, with those dud cr4edentials.
          console.log('axios reply (response.data)=', response.data)
          this.a3jwt = response.data.jwt
          this.a3EmailLoginIcon = 'check'
        })
        .catch(e => {
          console.log(`Error is `, e);
          this.a3EmailLoginIcon = 'times'
          if (e.response) {
            this.a3EmailLoginError = `${e.response.status} ${e.response.statusText}`
          }
        }) // Axios
    },

    // Check login with username
    usernameLoginA3: function() {
      console.log(`usernameLoginA3()`)

      this.a3UsernameLoginIcon = 'spinner'
      this.a3UsernameLoginError = ''
      let url = this.endpoint + '/v2/API129AAFPC5U27JUKZZ0A1NX533A/email/login'
      let params = {
          method: 'post',
          url,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: {
            username: this.a3Username,
            password: this.a3Password,
          }
        }
      axios(params)
        .then(response => {
          // This should not happen, with those dud cr4edentials.
          console.log('axios reply (response.data)=', response.data)
          this.a3jwt = response.data.jwt
          this.a3UsernameLoginIcon = 'check'
        })
        .catch(e => {
          console.log(`Error is `, e);
          this.a3UsernameLoginIcon = 'times'
          if (e.response) {
            this.a3UsernameLoginError = `${e.response.status} ${e.response.statusText}`
          }
        }) // Axios
    },

    actualEmail: function (str) {
      if (str.charAt(0) === '<') {
        str = str.substring(1);
      }
      let pos = str.indexOf('>')
      if (pos > 0) {
        str = str.substring(0, pos)
      }
      return str;
    },

    messageIsForCurrentUser: function (msg) {
      return (this.actualEmail(msg.to) === this.a3Email);
    }
  }, // methods
  computed: {
    //
  }
}
</script>

<style scoped lang="scss">
.container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    /* 1 */
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
}

.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}

.links {
    padding-top: 15px;
}

.myactions {
    display: inline-block;
    left: auto;
    right: auto;
    width: 800px;
    border: solid 1px #333;
    padding-left: 10px;
    padding-right: 10px;
    color: #666;
}
.mycheck {
  padding-top: 10px;
  // background-color: yellow;
}
.myrow {
    display: block;
    margin-bottom: 5px;
}
.myicon {
    display: inline-block;
    width: 20px;
}
.mystep {
    display: inline-block;
    width: 350px;
    text-align: left;
    padding-left: 10px;
}
.mybutton2 {
  display: inline-block;
  background-color: yellow;
  vertical-align: top;
}
.mybutton2 a {
  min-width: 60px;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 6px;
  padding-bottom: 7px;
  font-size: 13px;
  margin-top: 0px;
}
.myMessageRow {
  // font-size: 11px;
  margin-top: 12px;
  // background-color: red;
  font-size: 11px;
  .myMsgEmail {
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    // color: black;
  }
}
.myMessageSelected .mystep {
  color: green;
  background-color: #eee;
}
.myerror {
    display: inline-block;
    text-align: left;
    margin-left: 10px;
    width: 200px;
    color: red;
    overflow-x: scroll;
}
</style>
