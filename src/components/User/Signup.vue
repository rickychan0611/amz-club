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
      />
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
        <v-card class="pb-4">
          <v-layout row>
            <v-card-text>
              <v-text-field
                id="email"
                v-model="email"
                name="email"
                label="*E-mail"
                type="email"
                :rules="[rules.required, rules.email]"
              />

              <v-text-field
                id="password"
                v-model="password"
                name="password"
                label="*Password (more than 6 chararcters)"
                type="text"
                :rules="[rules.required]"
              />

              <v-text-field
                id="confirmPassword"
                v-model="confirmPassword"
                name="confirmPassword"
                label="*Confirm Password"
                type="text"
                :rules="[rules.required, rules.comparePasswords]"
              />

              <v-text-field
                id="facebookName"
                v-model="facebookName"
                name="facebookName"
                label="*Real name on facebook (Important! We communitcate with you by this name.)"
                :rules="[rules.required]"
              />

              <v-text-field
                id="facebookId"
                v-model="facebookId"
                name="facebookId"
                label="*Your Facebook profile url"
                :rules="[rules.required]"
              />
              <span
                style="cursor: pointer"
                class="info--text"
                @click="howfbDialog=true"
              > How to find your facebook profile link
                <v-icon class="orange--text">mdi-help-circle</v-icon>
                <v-icon class="grey--text">mdi-cursor-default-click-outline</v-icon></span>
              <v-dialog
                v-model="howfbDialog"
              >
                <v-card>
                  <v-card-title>
                    Your facebook profile link
                  </v-card-title>
                  <v-card-text>
                    Open your browser,
                    go to <a
                      href="http://www.facebook.com"
                      target="_blank"
                    >facebook</a>, login and click on your name. Copy the link in the address bar.
                    <hr>
                    <v-img
                      class="ma-4"
                      src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/amazon%2Fmain-qimg-14dce33d7d4ecb97cdee5e4feb510a46.png?alt=media&token=906985e7-5252-4a69-b066-59404c128f9b"
                    />
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      class="info"
                      @click="howfbDialog=false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-text-field
                id="etransfer"
                v-model="etransfer"
                name="etransfer"
                label="*Your E-transfer email"
                :rules="[rules.required, rules.email]"
              />

              <v-text-field
                id="amzProfile"
                v-model="amzProfile"
                name="amzProfile"
                label="*Your Amazon Profile Link"
                :rules="[rules.required]"
              />
              <span
                style="cursor: pointer"
                class="info--text"
                @click="onHow"
              > How to find your amazon profile link
                <v-icon class="orange--text">mdi-help-circle</v-icon>
                <v-icon class="grey--text">mdi-cursor-default-click-outline</v-icon></span>

                <v-text-field
                  id="referral"
                  v-model="referral"
                  name="referral"
                  label="Full name of referring member (optional)"
                />

              <v-checkbox v-model="checkboxA">
                <template v-slot:label>
                  <div>
                    <span class="red--text">*</span>Your Amazon account must be more than six months old and you have spent over $50 on Amazon in the past 12 months. If not, you will not be allowed to leave any reviews on Amazon. In order words, you will not be able to get rebates.
                    <span class="red--text">Required</span>
                  </div>
                </template>
              </v-checkbox>

              <v-checkbox v-model="checkboxC">
                <template v-slot:label>
                  <div>
                    <span class="red--text">*</span>We do not cover shipping. Amazon offers free shipping when your order is more than $35.
                    <span class="red--text">Required</span>
                  </div>
                </template>
              </v-checkbox>

              <v-checkbox v-model="checkboxD">
                <template v-slot:label>
                  <div>
                    <span class="red--text">*</span>To be eligable to get the reimbursement after review, you must give FIVE STARS for your review. Simply write a few sentences and upload some pictures of the product.
                    <span class="red--text">Required</span>
                  </div>
                </template>
              </v-checkbox>

              <v-checkbox v-model="checkboxF">
                <template v-slot:label>
                  <div>
                    <span class="red--text">*</span>For any reason you are unable to leave a review, please contact admin immdiately.
                    <span class="red--text">Required</span>
                  </div>
                </template>
              </v-checkbox>

              <v-checkbox v-model="checkboxE">
                <template v-slot:label>
                  <div>
                    <span class="red--text">*</span>Please make sure you have fulfilled and understood all the above requirements and all the infomation is correct. Any mistake may delay / terminate your rebate.
                    <span class="red--text">Required</span>
                  </div>
                </template>
              </v-checkbox>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!checkValid()"
                class="info mb-8 ml-4"
                @click="onSignup"
              >
                Submit
                <v-progress-circular
                  v-if="this.$store.getters.loading"
                  size=18
                  width=2
      indeterminate
      color="primary"
      class="ml-2"
    ></v-progress-circular>
              </v-btn>
              <span class="red--text ml-2" v-if="!checkValid()"> * All fields are required</span>
              {{userCreated}}
            </v-card-actions>
          </v-layout>
          <v-alert
            v-if="error"
            type="error"
            dismissible="dismissible"
            class ="mb-4"
          >
            {{ error }}
          </v-alert>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="howDialog"
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
          <v-img
            max-width="650px"
            src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/art_account_1.jpg?alt=media&token=7aa24d0d-7f96-404b-831e-b8853792af27"
          />
          <hr>Within the Ordering and shopping preferences section, click on the link “Profile”.
          <v-img
            max-width="700px"
            src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/amazon%2FprofileScreen.jpg?alt=media&token=81eef7a0-dd81-43cd-9af9-b710bc3b8ba1"
          />
          <hr>Copy (Command/Ctrl C) the URL on the top of the browser page
          <v-img
            max-width="650px"
            src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/art_account_3.png?alt=media&token=2f56250e-5e6e-4846-a617-d7f2dfa306aa"
          />
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
      referral: '',
      alert: false,
      email: '',
      password: '',
      confirmPassword: '',
      facebookName: '',
      facebookId: '',
      howfbDialog: false,
      howDialog: false,
      checkboxA: false,
      checkboxC: false,
      checkboxD: false,
      checkboxE: false,
      checkboxF: false,
      requiredA: false,
      requiredB: false,
      requiredC: false,
      requiredD: false,
      amzProfile: '',
      etransfer: null,
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        comparePasswords: value => {
          return this.password == value || 'Passwords do not match'
        }
      }
    }
  },
  computed: {
    comparePasswords () {
      return this.password !== this.confirmPassword ? 'Passwords do not match' : 'OK! Passwords match'
    },
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    },
    userCreated () {

      console.log('xxxxxxxxxxxxgetters.user.id' + this.$store.getters.user.id)
      if (this.$store.getters.user.id){
        this.$router.push('/')
      }
    }
  },
  // watch: {
  //   user (value) {
  //     if (value !== null && value !== undefined) {
  //       this.$router.push('/')
  //     }
  //   }
  // },
  methods: {
    onHow () {
      this.howDialog = true
    },
    checkValid () {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      // console.log('pattern: ' + pattern.test(this.etransfer))
      if (
        this.checkboxA == true &&
          this.checkboxC == true &&
          this.checkboxD == true &&
          this.checkboxE == true &&
          this.amzProfile !== null &&
          this.amzProfile !== '' &&
          this.facebookName !== null &&
          this.facebookName !== '' &&
          this.facebookId !== null &&
          this.facebookId !== '' &&
          this.etransfer !== null &&
          this.etransfer !== '' &&
          pattern.test(this.etransfer) == true &&
          this.email !== null &&
          this.email !== '' &&
          pattern.test(this.email) == true &&
          this.password !== null &&
          this.password !== '' &&
          this.confirmPassword === this.password
      ) {
        return true
      }
      else {
        return false
      }
    },
    onSignup () {
      const userData = {
        'email': this.email,
        'password': this.password,
        'facebookName': this.facebookName,
        'facebookId': this.facebookId,
        'amzProfile': this.amzProfile,
        'etransfer': this.etransfer,
        'registered': true,
        'referral': this.referral
      }
      // console.log(userData)
      this.$store.dispatch('signUserUp', userData)

      // this.$router.push('/')
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
