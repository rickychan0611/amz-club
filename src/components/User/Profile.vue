<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1 class="font-weight-thin mb-3 ml-2 mr-2 mt-3">
          Profile
        </h1>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-card class="mb-3 ml-2 mr-2">
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex xs12>
                  <span class="title">{{ user.facebookName }}</span>
                </v-flex>
              </v-layout>
              <br>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    id="facebookName"
                    v-model="user.facebookName"
                    name="facebookName"
                    label="Facebook Name"
                    required
                  />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    id="etransfer"
                    v-model="user.etransfer"
                    name="etransfer"
                    label="E-transfer E-mail"
                    required
                  />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    id="email"
                    v-model="user.email"
                    name="email"
                    label="Login E-mail"
                    disabled
                  />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    id="email"
                    v-model="user.password"
                    name="email"
                    label="Login password"
                    disabled
                  />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    id="amzProfile"
                    v-model="user.amzProfile"
                    name="amzProfile"
                    label="Amazon profile link"
                    required
                  />
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    id="facebookId"
                    v-model="user.facebookId"
                    name="facebookId"
                    label="Facebook Profile link"
                    required
                  />
                </v-flex>
              </v-layout>


              <v-layout row>
                <v-flex xs12>
                  <v-btn
                    class="info"
                    rounded
                    @click="onSave"
                  >
                    Save
                  </v-btn>
                </v-flex>
              </v-layout>
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
      // user: this.$store.getters.user
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onSave () {
        console.log(this.user)
        if (this.user.id == undefined || this.user.id == null) {
          console.log(this.user)
          this.$router.push('/')
        } else {
          console.log(this.user)
          this.$store.dispatch('autoSignIn', this.user)
        }
      }
    }
  }

</script>
