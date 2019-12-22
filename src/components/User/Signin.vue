<template>
  <v-container>
    <v-layout row>
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <h1 class="font-weight-thin">
          Sign in
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
        <v-alert
          type="error"
          dismissible="dismissible"
        >
          {{ error }}
          <!-- text is props send to onDismissed, app-alert
            app-alert set up in main.js
             clear error in state -->
        </v-alert>
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
              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="email"
                      v-model="email"
                      name="email"
                      label="Mail"
                      type="email"
                      required
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

                <v-layout justify="space-between">
                  <v-flex xs12>
                    <v-btn
                      type="submit"
                      :disabled="loading"
                      :loading="loading"
                    >
                      Sign in
                    </v-btn>
                  </v-flex>
                  <v-flex xs12>
                    or <v-btn
                      type="submit"
                      :disabled="loading"
                      text
                      class="blue--text"
                      @click="$router.push('/signup')"
                    >
                      Register
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
    data () {
      return {
        email: '',
        password: ''
      }
    },
    computed: {
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
      user (value) { // listen if computed user has charges? run this function
        if (value !== null && value !== undefined) {
          this.$router.push('/') // when user has value go the this router
        }
      }
    },
    methods: {
      onSignin () {
        this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    }
  }
</script>

<style>
  /* .custom-loader {
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
  } */
</style>
