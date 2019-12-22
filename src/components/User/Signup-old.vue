<template>
  <v-container>
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
      >
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignup">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="email"
                      readonly
                      name="email"
                      label="E-mail"
                      :value="user.email"
                      type="email"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="password"
                      v-model="password"
                      name="password"
                      label="Password"
                      type="password"
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="confirmPassword"
                      v-model="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      :rules="[comparePasswords]"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="facebookName"
                      v-model="facebookName"
                      name="facebookName"
                      label="Full name on your facebook"
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="facebookId"
                      v-model="facebookId"
                      name="facebookId"
                      label="Your Facebook profile url"
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="amzProfile"
                      v-model="amzProfile"
                      name="amzProfile"
                      label="Your Amazon profile url"
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="etransfer"
                      v-model="etransfer"
                      name="etransfer"
                      label="Your e-transfer email"
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn
                      type="submit"
                      :disabled="loading"
                      :loading="loading"
                      class="info"
                      round
                    >
                      Sign up
                      <span
                        slot="loader"
                        class="custom-loader"
                      >
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['user'],
    data () {
      return {
        email: this.user.email,
        password: '',
        confirmPassword: '',
        facebookName: '',
        facebookId: '',
        amzProfile: '',
        etransfer: ''

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
      onSignup () {
        const userData = {
          email: this.email,
          password: this.password,
          facebookName: this.facebookName,
          facebookId: this.facebookId,
          amzProfile: this.amzProfile,
          etransfer: this.etransfer,
          placedOrders: this.placedOrders,
          userKey: ''
        }
        this.$store.dispatch('signUserUp', userData)
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
