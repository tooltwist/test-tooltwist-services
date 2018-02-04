// Add vue-awesome (part 1/2)
//  https://www.npmjs.com/package/vue-awesome#using-with-nuxtjs
//  https://github.com/nuxt/nuxt.js/issues/174#issuecomment-275939000
const nodeExternals = require('webpack-node-externals')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'test-tooltwist-services2',
    meta: [
      {
        charset: 'utf-8'
      }, {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }, {
        hid: 'description',
        name: 'description',
        content: 'Tester for Tooltwist microservices'
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  },
  router: { base: '/test-tooltwist-services/' },
  /*
  ** Customize the progress bar color
  */
  loading: {
    color: '#3B8070'
  },
  /*
  ** Build configuration
  */
  build: {
    //vendor: ['vue-awesome'],
    /*
    ** Run ESLint on save
    */
    extend(config, {isDev, isClient, isServer}) {
      if (isDev && isClient) {
        config.module.rules.push({enforce: 'pre', test: /\.(js|vue)$/, loader: 'eslint-loader', exclude: /(node_modules)/})
      }
      // Add vue-awesome (part 2/2)
      //  https://www.npmjs.com/package/vue-awesome#using-with-nuxtjs
      //  https://github.com/nuxt/nuxt.js/issues/174#issuecomment-275939000
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/]
          })
        ]
      }
    }
  },
  css: [
    // Load a node module directly (here it's a SASS file)
    //'bulma',
    // CSS file in the project
    //'@/assets/css/main.css',
    // SCSS file in the project
    //'@/assets/css/main.scss'
  ],
  plugins: ['~plugins/vue-awesome.js']
}
