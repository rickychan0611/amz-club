<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <h1 class="font-weight-thin">
          Admin Panel
        </h1>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12>
        <v-btn
          color="info"
          to="/myadmin/sellersList"
          class="ma-2"
        >
          Sellers
        </v-btn>
      </v-flex>

        <v-flex xs12>
          <v-btn
            color="info"
            to="/myadmin/rebatetList"
            class="ma-2"
          >
            Rebate List
          </v-btn>
        </v-flex>

      <v-flex xs12>
        <v-btn
          color="info"
          to="/myadmin/buyersList"
          class="ma-2"
        >
          Buyers List
        </v-btn>
      </v-flex>

      <v-flex xs12>
        <v-btn
          color="info"
          to="/myadmin/productList"
          class="ma-2"
        >
          Product List
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/database'
  import 'firebase/storage'
  export default {
    props: ['id'],
    data () {
      return {
        edit: true,
        obj: []
      }
    },

    methods: {
    }
  }
</script>

<style>
.edit_input {
  border: 1px solid red;
  padding: 0px 3px;
}
</style>
