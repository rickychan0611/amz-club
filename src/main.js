import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
// import * as firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import AlertCmp from './components/Shared/Alert.vue'
import FormatDate from './components/Shared/FormatDate.vue'
import EditProductForm from './components/Products/editProductForm.vue'
// Vue.use(FBSignInButton)
// import FacebookLogin from 'facebook-login-vuejs'
// import FacebookLogin from 'vue-facebook-login-component'

Vue.config.productionTip = false
Vue.component('app-alert', AlertCmp)// this is how u make a component globe
Vue.component('app-formatDate', FormatDate)
Vue.component('app-editProductForm', EditProductForm)
// Vue.component('app-facebookLogin', FacebookLogin)
// Vue.component('app-vfacebookLogin', VFacebookLogin)

var VueScrollTo = require('vue-scrollto');

Vue.use(VueScrollTo)

// You can also pass in the default options
Vue.use(VueScrollTo, {
     container: "body",
     duration: 500,
     easing: "ease",
     offset: 0,
     force: true,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: false,
     y: true
 })

new Vue({
  vuetify,
  router,
  store,
  created () {
    // //console.log('SIGNED IN')
    firebase.initializeApp({
      apiKey: 'AIzaSyBrMYR_M-cU3oApuvUPVm2GiV71EQOBGrk',
      authDomain: 'amzr-b7fd2.firebaseapp.com',
      databaseURL: 'https://amzr-b7fd2.firebaseio.com',
      projectId: 'amzr-b7fd2',
      storageBucket: 'gs://amzr-b7fd2.appspot.com'
    })

    this.$store.dispatch('initProducts')
    firebase.auth().onAuthStateChanged((user) => {
      // alert("1")

        if (user) {
          firebase.database().ref('buyers/' + user.uid).once('value', (data) => {
            const signedInUser = data.val()
        // console.log('auto user ' + JSON.stringify(user))
        console.log('onAuthStateChanged: SIGNED IN')
        this.$store.dispatch('autoSignIn', signedInUser)
        // this.$store.dispatch('initProducts')
      })
      .catch(
        (error) => {
          console.log(error)
          }
      )
      } else {
        // alert(" Not login")
        // this.$store.dispatch('logout')
        console.log('onAuthStateChanged: NOT SIGNED IN')
        const user = { 'signedIn': false }
        this.$store.dispatch('initProducts', user)
       this.$store.dispatch('noUser', user)
       }
    })

    // const resetTodayCounter = new Date("2019-07-22").toString()
  },
  render: h => h(App)
}).$mount('#app')
