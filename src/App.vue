<template>
  <v-app>
    <v-content>
      <!-- toolbar /////////////////////////////////////////////////////// -->
      <!-- <v-progress-linear
        v-if="this.$store.getters.facebookLoading"
        indeterminate
        color="yellow darken-2"
      /> -->
      <div v-if="this.$store.loading">
        <h2>Loading....</h2>
      </div>
      <v-app-bar
        v-if="!this.$store.loading"
        dark
        class="primary"
        fixed
        app
        hideOnScroll
      >
        <!-- <v-app-bar-nav-icon
        @click.stop="sideNav = !sideNav">
      </v-app-bar-nav-icon> -->

        <!-- <v-toolbar-title> -->
        <!-- <router-link
          to="/"
          tag="span"
          style="cursor: pointer"
        > -->
        <div class="d-inline">
          <img
            width="50px"
            src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/amazon%2Fandroid-chrome-512x512.png?alt=media&token=57dd5bc0-2583-48f4-8f9a-bec7a684205f"
          >
        </div>
        <div class="d-none d-sm-inline">
          Amazon Review Discount Club
        </div>
        <!-- </router-link> -->
        <!-- </v-toolbar-title> -->
        <v-spacer />
        <!-- {} icon: 'mdi-check-box-multiple-outline', title: 'My orders', link: '/myOrders' }, -->

        <!-- <v-btn
          text
          @click="logoutDialog=true"
        >
          <v-icon>mdi-logout</v-icon>
          Logout
        </v-btn> -->

        <v-btn
          v-if="!userIsAuthenticated"
          text
          @click="signinFB"
        >
          <v-icon>mdi-account-arrow-right</v-icon>Login
        </v-btn>

        <v-btn
          v-if="!userIsAuthenticated"
          text
          @click="$router.push('signup')"
        >
          <v-icon>mdi-account-plus</v-icon>Sign up
        </v-btn>

        <!-- <app-vFacebookLogin app-id="496146481139333"></app-vFacebookLogin> -->

        <router-link
          v-if="userIsAuthenticated"
          to="/profile"
          tag="span"
          style="cursor: pointer"
        >
          <!-- {{this.$store.getters.user.facebookName}} -->
          Hello, {{ this.$store.getters.user.facebookName }}

          <v-icon>mdi-account-edit</v-icon>
          <!-- <v-avatar
            v-if="userIsAuthenticated"
            class="ml-2"
          >
            <img
              v-if="userIsAuthenticated"
              :src="this.$store.getters.user.photoURL"
              contain
            >
          </v-avatar> -->
        </router-link>
      </v-app-bar>

      <!-- <p>{{ this.$store.getters.today }}</p> -->
      <router-view />

      <v-dialog
        v-model="logoutDialog"
        max-width="500"
      >
        <v-card>
          <v-card-title>
            <v-icon
              large
              class="orange--text"
            >
              mdi-alert
            </v-icon>Do you want to logout?
          </v-card-title>
          <v-card-actions>
            <v-btn
              class="info"
              @click="logoutDialog=false"
            >
              No
            </v-btn>
            <v-btn
              class="info"
              @click="signOutFB"
            >
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
    <v-bottom-navigation
      grow
      min-height="62px"
      app
      class="primary--text pt-2"

    >
      <v-btn
        to="/"
        @click="$store.dispatch('initProducts')"
      >
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn
        v-if="userIsAuthenticated"
        to="/myOrders"
      >
        <span>My orders</span>
        <v-icon>mdi-cart-outline</v-icon>
      </v-btn>

      <v-btn
        text
        href="https://www.facebook.com/groups/2215482821996647/"
        target="_blank"
      >
        <span>Ask Admin</span>
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>

      <v-btn
        v-if="userIsAuthenticated"
        text
        @click="logoutDialog = true"
      >
        <span>Sign Out</span><v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/database'
  import 'firebase/storage'
  export default {
    data () {
      return {
        sideNav: false,
        logoutDialog: false,
        fbSignInParams: {
          scope: 'email,user_likes',
          return_scopes: true,
          bottomNav: 'recent'
        }
      }
    },
    computed: {
      menuItems () {
        let menuItems = [
          { icon: 'mdi-account-plus', title: 'Sign up', link: '/signup' },
          { icon: 'mdi-account-arrow-left', title: 'Sign in', link: '/signin' }
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            { icon: 'mdi-check-box-multiple-outline', title: 'My orders', link: '/myOrders' },
            { icon: 'mdi-account', title: 'Profile', link: '/profile' }
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user.id !== null &&
          this.$store.getters.user.id !== undefined ||
          this.$store.getters.user.singedIn == true
      }
    },
    methods: {
      signinFB () {
        var provider = new firebase.auth.FacebookAuthProvider()
        this.$router.push('/signin')
      // firebase.auth().signInWithRedirect(provider)
      // this.$store.dispatch('signinFB')
      },
      signOutFB () {
        this.logoutDialog = false
        this.$store.dispatch('logout')
        this.$router.push('/')
      // FB.logout(function (response) {
      //   console.log('&&&&& when logout', response)
      // })
      },
      // onSignInSuccess (response) {
      //   FB.api('/me', dude => {
      //     console.log(`Good to see you, ${dude.name}.`)
      //   })
      // },
      onSignInError (error) {
        console.log('OH NOES', error)
      },

      //   getUserData() {
      //     this.FB.api('/me', 'GET', { fields: 'id,name,email'},
      //     userInformation => {
      //       console.warn('data api', userInformation)
      //       this.personalID = userInformation.id
      //       this.email = userInformation.email
      //       this.name = userInformation.name
      //     }
      //   )
      // },
      // FBSignInButton
      onSignInSuccess (response) {
        FB.api('/me', dude => {
          console.log(`Good to see you, ${dude.name}.`)
        })
      },
      onSignInError (error) {
        console.log('OH NOES', error)
      }
    }
  }

</script>

<style>
.fb-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #4267b2;
  color: #fff;
}
</style>
