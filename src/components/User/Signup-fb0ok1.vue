<template>
  <v-container
    grid-list-md
    text-xs-left
  >
    <v-layout row>
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <h1 class="font-weight-thin">
          Register
        </h1>
      </v-flex>
    </v-layout>
    <v-layout
      v-if="error"
      row
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <app-alert
          :text="error"
          @dismissed="onDismissed"
        >
          <!-- text is props send to onDismissed, app-alert
          app-alert set up in main.js
          clear error in state -->
        </app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        offset-sm3
      />
    </v-layout>

    <v-layout row>
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <v-card>
          <v-card-text>
            <v-checkbox v-model="checkboxA">
              <template v-slot:label>
                <div>
                  Your Amazon account must be more than six months old.
                  <span class="red--text">Required</span>
                </div>
              </template>
            </v-checkbox>

            <v-checkbox v-model="checkboxB">
              <template v-slot:label>
                <div>
                  You must have spent over $50 on Amazon in the past 12 months.
                  <span class="red--text">Required</span>
                </div>
              </template>
            </v-checkbox>

            <v-checkbox v-model="checkboxC">
              <template v-slot:label>
                <div>
                  We do not cover shipping. Amazon offers free shipping when your order is more than $35.
                  <span class="red--text">Required</span>
                </div>
              </template>
            </v-checkbox>

            <v-text-field
              id="etransfer"
              v-model="etransfer"
              name="etransfer"
              label="Your E-transfer email"
              :rules="[rules.required, rules.email]"
            />

            <v-text-field
              id="amzProfile"
              v-model="amzProfile"
              name="amzProfile"
              label="Your Amazon Profile Link"
              :rules="[rules.required]"
            />
            <span
              style="cursor: pointer"
              class="info--text"
              @click="onHow"
            > How to find your amazon public profile link
              <v-icon class="orange--text">mdi-help-circle</v-icon></span>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!checkValid()"
              class="info mb-4"
              @click="onSignup"
            >
              Sign up
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="howDialog"
      width="400"
    >
      <v-card>
        <v-card-title>
          Your Amazon Profile Link
        </v-card-title>
        <v-card-text>
          Your profile link is required for you to be eligible to review the products.
          <br>Go to <a
            href="http://www.amazon.ca"
            target="_blank"
          >www.amazon.ca</a>, go to the “Your Account” tab i the top menu. Then click on the link for “Your Account” in the dropdown menu.
          <hr>
          <img
            class="ma-4"
            width="300"
            src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/art_account_1.jpg?alt=media&token=7aa24d0d-7f96-404b-831e-b8853792af27"
          >
          <hr>Within the Personalization section, click on the link “Your Profile”.
          <img
            class="ma-4"
            width="300"
            src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/art_account_2.jpg?alt=media&token=8b595318-2c42-4ccd-be2a-d8d5ed04f740"
          >
          <hr>Copy (Command/Ctrl C) the URL on the top of the browser page
          <img
            class="ma-4"
            width="300"
            src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/art_account_3.png?alt=media&token=2f56250e-5e6e-4846-a617-d7f2dfa306aa"
          >
          <hr>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="info"
            @click="howDialog=false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    // props:['user'],
    data () {
      return {
        howDialog: false,
        checkboxA: false,
        checkboxB: false,
        checkboxC: false,
        requiredA: false,
        requiredB: false,
        requiredC: false,
        amzProfile: null,
        etransfer: null,
        rules: {
          required: value => !!value || 'Required.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }

      }
    },
    computed: {
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
      },
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          this.$router.push('/')
        }
      }
    },
    methods: {
      onHow () {
        this.howDialog = true
      },
      checkValid () {
        if (
          this.checkboxA == true &&
          this.checkboxB == true &&
          this.checkboxC == true &&
          this.amzProfile !== null &&
          this.amzProfile !== '' &&
          this.etransfer !== null &&
          this.etransfer !== ''
        ) {
          return true
        }
      },
      onSignup () {
        const userData = {
          'amzProfile': this.amzProfile,
          'etransfer': this.etransfer,
          'registered': true
        }
        // console.log(userData)
        this.$store.dispatch('register', userData)
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    }
  }
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
