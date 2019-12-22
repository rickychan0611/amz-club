<template>
  <v-container>
    <div style="position: sticky; z-index: 99; top:10px; background-color: white;">
    <v-layout row>
      <v-flex xs12 class="pl-4">
        <v-btn
          color="info"
          to="/myadmin/sellersList"
          class="ma-2"
        >
          Sellers
        </v-btn>
        <v-btn
          color="info"
          to="/myadmin/rebatetList"
          class="ma-2"
        >
          Rebate List
        </v-btn>
        <v-btn
          color="info"
          to="/myadmin/buyersList"
          class="ma-2"
        >
          Buyers List
        </v-btn>
        <v-btn
          color="info"
          to="/myadmin/productList"
          class="ma-2"
        >
          Product List
        </v-btn>
      <v-btn
        color="info"
        @click="restore"
        class="ma-2"
      >
      restore
    </v-btn>

      </v-flex>
    </v-layout>
    </div>
    <v-layout justify="start" align="start">
      <v-row>
      <!-- v-model="show" -->
        <v-col v-for="(seller, index) in sellerButton">
          <v-badge
            v-model="seller.show"
          color="cyan"
          left
          overlap
        >
          <template v-slot:badge>
            <span>{{seller.counter}}</span>
          </template>
          <v-card class="pa-4" width="180">
            <v-card-title class="title pt-0"  @click="toSeller(seller.name)" >{{seller.name}}</v-card-title>
            <div>
            <input
            v-model="seller.pp"
            type="text"
            class="gray--text caption border"
            size="18"
          ></input><a @click="paypal(seller)" class="caption ml-1">OK</a></div>

  <br />
  <div class="d-block info white--text caption pa-1 d-inline" v-if="seller.counter > 0">
    New Order {{seller.counter}}</div>
    <div class="d-block error white--text caption pa-1 d-inline" v-if="seller.reviewCounter > 0">
      New Reviewe {{seller.reviewCounter}}</div>
    <div class="d-block success white--text caption pa-1 d-inline" v-if="seller.reviewToldSeller">
      Waiting Rebate {{seller.reviewToldSeller}}</div>
</v-card>
</v-badge>
    </v-col>
    </v-row>
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
      sellersName: [],
      newOrder: 0,
      sellerButton: [],
      newOrderCounter: 0,
      show: false,
      reviewPlaced: false,
      reviewCounter: 0,
      reviewToldSellerCounter: 0,
      pp: 'no'
    }
  },
  created () {
    firebase.database().ref('sellers').on('value', (data) => {
      this.sellerButton = []
      const obj = data.val()
      this.sellersName = Object.keys(obj)
      // for (let o = 1; o < this.sellersName.length; o++) {

      for (let i in obj) {
        /// /console.log(JSON.stringify(obj[i]))

        this.newOrderCounter = 0
        this.reviewCounter = 0
        this.show = false
        this.reviewPlaced = false
        this.reviewToldSeller = 0
        // //console.log('NO')

        for (let j in obj[i]) {
          this.pp = obj[i][j].pp
          if (!obj[i][j].pp) { // don't loop for pp object
            for (let k in obj[i][j]) {
              if (obj[i][j][k].toldSeller == false || obj[i][j][k].toldSeller == undefined) {
                this.newOrderCounter++
              }
              if (obj[i][j][k].reviewUrl) {
                this.reviewPlaced = true
                if (!obj[i][j][k].refunded && !obj[i][j][k].reviewToldSeller) {
                  this.reviewCounter++
                }
                if (!obj[i][j][k].refunded && obj[i][j][k].reviewToldSeller) {
                  this.reviewToldSeller++
                }
              }
            }
          }
        }
        if (this.newOrderCounter > 0) {
          this.show = true
        }
        this.sellerButton.push(
          {
            'name': i,
            'counter': this.newOrderCounter,
            'show': this.show,
            'reviewPlaced': this.reviewPlaced,
            'reviewCounter': this.reviewCounter,
            'reviewToldSeller': this.reviewToldSeller,
            'pp': this.pp
          }
        )
        let newOrderCounter = 0
      }

      // }
    })
  },
  methods: {
    restore () {
      firebase.database().ref('sellers').once('value', (data) => {
        const obj = data.val()
        for (let i in obj) { // seller name
          for (let j in obj[i]) { // product name
            for (let k in obj[i][j]) {
               let key = obj[i][j][k].id
              let placedOrder =
                {[key]: obj[i][j][k]}

              if (obj[i][j][k].buyerId) {
               firebase.database().ref('buyers/' + obj[i][j][k].buyerId + '/placedOrders/').update(placedOrder)
              //  console.log(JSON.stringify(placedOrder))
              }
            }
          }
        }
      })
    },
    toSeller (seller) {
      this.$router.push('../sellers/' + seller)
    },
    paypal (seller) {
      // console.log('seller pp:' + seller.pp)
      if (seller.name) {
        firebase.database().ref('sellers/' + seller.name + '/pp/').update({ 'pp': seller.pp })
      }
    }
  }
}
</script>

<style>
.edit_input {
  border: 1px solid red;
  padding: 0px 3px;
}
</style>
