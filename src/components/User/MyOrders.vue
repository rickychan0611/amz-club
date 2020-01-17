<template>
  <v-container
    grid-list-md
    text-xs-left
  >
    <v-layout row>
      <v-flex xs12>
        <h1 class="font-weight-thin ml-2">
          My Orders
        </h1>
        <!-- <p class="ml-2 red--text">Please leave your review at least 4 days after your item has delivered.</p> -->
        <div v-if="loading">
          <h2>Loading....</h2>
        </div>
        <h1
          v-if="!placedOrders && !loading"
          class="font-weight-thin ml-2"
        >
        </h1>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex
        v-for="(order, index) in newArr"
        :key="index"
      >
        <h1 v-if="order.name == 'empty' || order == null">
          Empty
        </h1 class="font-weight-thin ml-2">
        <!-- orders not placed cards here below-->
        <div
          v-if="!order.orderPlaced"
          class="title"
        >
          Status: <span class="green--text">Awaiting purchase</span>
        </div>
        <v-card v-if="!order.orderPlaced">
          <v-list-item three-line>
            <v-list-item-avatar
              size="120"
              tile
              class="mr-2 "
            >
              <v-img :src="order.img" />
            </v-list-item-avatar>

            <v-list-item-content class="align-self-start">
              <v-list-item-title
                class="title "
                v-text="order.name"
              />
              <div>
                  <span class="body-1" mt-0>Make sure it is sold by: <span class="red--text font-weight-bold">{{ order.soldBy }}</span></span>
              </div>
              <div>
                <span class="caption ">List : ${{ parseFloat(order.listPrice).toFixed(2) }}  | </span>
                <span class="caption ">Coupon: ${{ parseFloat(order.coupon).toFixed(2) }} | </span>
                <span class="caption">Rebate: ${{ parseFloat(order.rebate).toFixed(2) }} |  </span>
                <span class="caption ">Deal: ${{ parseFloat(order.dealPrice).toFixed(2) }}</span>
              </div>
              <!-- <span v-if="!selling(order)">Sorry, this product is not available anymore. You may delete it.</span> -->

              <span v-if="checkToday(order.userReserveDate, order) ">Please get the item now.
                Reservation will be expired in {{ onDate (order.userReserveDate) }} hour(s)</span>
              <span v-if="!checkToday(order.userReserveDate, order) ">Item reserved. It will be available
                <span  v-if="dayCount(order.userReserveDate).day > 0">
                <span class="red--text font-weight-bold">{{dayCount(order.userReserveDate).day}}</span> days later on
                <app-formatDate :date="order.userReserveDate" />
                </span>

                <span  v-if="dayCount(order.userReserveDate).todayOKtime == 'TODAY'">
                  by
                <span class="red--text font-weight-bold"> <app-formatDate :date="order.userReserveDate" /></span>
                <br />
                *Please remember to buy it from amazon on the same day, otherwise your order may not be valid. 
                </span>

              </span>

            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-row justify="start">
              <v-col md="auto">
                <v-btn

                  class="orange"
                  :disabled="!checkToday(order.userReserveDate)"
                  @click="onSubmitOrder(order, index)"
                >
                  <v-icon class="mr-1">
                    mdi-cart-arrow-down
                  </v-icon>Buy it from Amazon now
                </v-btn>
              </v-col>
              <v-col md="auto">
                <v-btn
                  class="error"
                  @click="deleteDailog = true, thisOrder = order"
                >
                <!-- @click="onDeleteDialog(order, index)" -->
                  <v-icon class="mr-1">
                    mdi-delete
                  </v-icon>X
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>

        <!-- orders PLACED cards here below-->
        <div
          v-if="order.orderPlaced && !order.reviewPlaced"
          class="title"
        >
          Status: <span class="blue--text">Awaiting review</span>
        </div>
        <v-card v-if="order.orderPlaced && !order.reviewPlaced">
          <v-list-item three-line>
            <v-list-item-avatar
              size="120"
              tile
            >
              <v-img :src="order.img" />
            </v-list-item-avatar>

            <v-list-item-content class="align-self-start">
              <v-list-item-title
                class="title "
                v-text="order.name"
              />
              <div>
                <span class="caption ">List : ${{ parseFloat(order.listPrice).toFixed(2) }}  | </span>
                <span class="caption ">Coupon: ${{ parseFloat(order.coupon).toFixed(2) }} | </span>
                <span class="caption">Rebate: ${{ parseFloat(order.rebate).toFixed(2) }} |  </span>
                <span class="caption ">Deal: ${{ parseFloat(order.dealPrice).toFixed(2) }}</span>
                <br />
                <span class="caption ">Purchase Date: <app-formatDate :date="order.userReserveDate"></app-formatDate></span>
              </div>
              <div class="body-2 grey--text">
                Order #: {{ order.orderNumber }}
                <v-btn
                  text
                  class="blue--text"
                  @click="onEditOrder(order, index)"
                >
                  <v-icon class="mr-1">
                    mdi-square-edit-outline
                  </v-icon> Edit
                </v-btn>
                <v-btn
                  text
                  class="error--text"
                  @click="deleteDailog = true, thisOrder = order"
                >
                  <v-icon class="mr-1">
                    mdi-delete
                  </v-icon> Delete
                </v-btn>
              </div>
              <span>Please leave a 5 stars review 1 week after the item has arrived.</span>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn
              class="info"
              @click="onSubmitReview(order, index)"
            >
              <v-icon class="mr-1">
                mdi-message-draw
              </v-icon> Submit review
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Reviewed cards here below-->
        <div
          v-if="order.reviewPlaced && !order.refunded"
          class="title"
        >
          Status: <span class="orange--text">Awaiting rebate</span>
        </div>
        <v-card v-if="order.reviewPlaced && !order.refunded">
          <v-list-item three-line>
            <v-list-item-avatar
              size="80"
              tile
            >
              <v-img :src="order.img" />
            </v-list-item-avatar>

            <v-list-item-content class="align-self-start">
              <v-list-item-title
                class="title "
                v-text="order.name"
              />
              <div>
                <span class="caption ">List : ${{ parseFloat(order.listPrice).toFixed(2) }}  | </span>
                <span class="caption ">Coupon: ${{ parseFloat(order.coupon).toFixed(2) }} | </span>
                <span class="caption">Rebate: ${{ parseFloat(order.rebate).toFixed(2) }} |  </span>
                <span class="caption ">Deal: ${{ parseFloat(order.dealPrice).toFixed(2) }}</span>
                <br />
                <span class="caption ">Purchase Date: <app-formatDate :date="order.userReserveDate"></app-formatDate></span>
              </div>
              <div
                class="caption grey--text"
                style="line-height: 100%"
              >
                Order #: {{ order.orderNumber }}
              </div>
              <span class="red--text"><br>
                ${{ order.rebate }} rebate will be sent to your bank through e-transfer. </span>
                <div>
                  <span class="caption ">Your e-transfer email : {{ user.etransfer }} </span>
                </div>

              <v-card-actions>
                <v-btn
                  small
                  text
                  class="blue--text"
                  @click="onSubmitReview(order, index)"
                >
                  <v-icon class="mr-1">
                    mdi-playlist-edit
                  </v-icon>Edit review
                </v-btn>
              </v-card-actions>
            </v-list-item-content>
          </v-list-item>
        </v-card>

        <!-- REFUNDED cards here below-->
        <div
          v-if="order.refunded"
          class="title mt-2"
        >
          Status: <span class="red--text">Rebate released. Complete. </span>
        </div>
        <v-card v-if="order.refunded">
          <v-list-item three-line>
            <v-list-item-avatar
              size="80"
              tile
            >
              <v-img :src="order.img" />
            </v-list-item-avatar>

            <v-list-item-content class="align-self-start">
              <v-list-item-title
                class="title "
                v-text="order.name"
              />
              <div>
                <span class="caption ">List : ${{ parseFloat(order.listPrice).toFixed(2) }}  | </span>
                <span class="caption ">Coupon: ${{ parseFloat(order.coupon).toFixed(2) }} | </span>
                <span class="caption">Rebate: ${{ parseFloat(order.rebate).toFixed(2) }} |  </span>
                <span class="caption ">Deal: ${{ parseFloat(order.dealPrice).toFixed(2) }}</span>
              </div>
              <div
                class="caption grey--text"
                style="line-height: 100%"
              >
                Order #: {{ order.orderNumber }}<br />
                <span class="caption ">Purchase Date: <app-formatDate :date="order.userReserveDate"></app-formatDate></span>
              </div>
              <span class="red--text">${{ order.rebate }} has already been sent to your bank. Password is 'amazon' if needed</span>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-dialog v-model="deleteDailog">
          <v-card>
            <v-card-title>
              <v-icon
                class="error--text"
                large
              >
                mdi-alert
              </v-icon>
              {{ thisOrder.name }} will be deleted.
              <span v-if="thisOrder.orderNumber">This will NOT cancel your order on Amazon. Please contact admin for any problem.</span>
            </v-card-title>
            <br>
            <v-card-actions>
              <v-btn
                class="error"
                @click="onDelete(thisOrder)"
              >
                Delete
              </v-btn>
              <v-btn
                class="info"
                @click="deleteDailog = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { formatDate } from '@/components/Shared/formatDate.js'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import Vue from 'vue'
var vm = new Vue()
export default {
  data () {
    return {
      isToday: false,
      deleteDailog: false,
      thisOrder: {},
      user: this.$store.getters.user,
      todayOKtime: false,
      newArr: [],
      xplacedOrder: {}
    }
  },
  // created () {
  //   firebase.database().ref('buyers/'+ this.user.id ).on('value', (data) => {
  //     this.obj = []
  //     this.xplacedOrder = data.val()
  //     // console.log('uuuuuuuuuuuuuu' + JSON.stringify(this.xplacedOrder.placedOrders))
  //     for (let i in this.xplacedOrder.placedOrders) {
  //       this.newArr.push(this.xplacedOrder.placedOrders[i])
  //     }
  //     this.newArr.sort((a,b)=>{
  //       return new Date(b.userReserveDate) - new Date(a.userReserveDate)
  //     })
  //   })
  // },
  computed: {
    loading () {
      return this.$store.getters.loading
    },
    placedOrders () {
      // vm.$forceUpdate()
      // return this.$store.getters.user.placedOrders
      this.newArr = []
      // console.log('xxxxxxxxxxxxxxxxxxnewArr:'+ JSON.stringify(Object.keys(this.$store.getters.user.placedOrders).length))
      for (let i in this.$store.getters.user.placedOrders) {
        this.newArr.push(this.$store.getters.user.placedOrders[i])
      }
      this.newArr.sort((a, b) => {
        return new Date(b.userReserveDate) - new Date(a.userReserveDate)
      })
      console.log(this.newArr)
      return this.newArr
    }
  },

  methods: {
    // selling (order){
    //   let products = this.$store.getters.selling
    //   for (let i in products){
    //     if (toString(products[i].id) == toString(order.id)){
    //       //console.log('match' + order.id)
    //       console.log('xxxxxxxxxxxxxxxxxxxxx' + JSON.stringify(this.$store.getters.selling[i]))
    //       return products[i].selling
    //     }
    //   }
    // },
    dayCount (reservedDate) {
      let now = new Date(this.$store.getters.today)
      let theDate = new Date(reservedDate)
      let day = (theDate.getTime() - now.getTime())/ (1000 * 3600 * 24)
      day = ~~day
      console.log('day '+ day )
      if (day >= 1) {
        day = parseInt(day.toFixed(0))
        return { 'day': day, 'todayOKtime': false }
      }
      if (day == 0) {
        let hr = 0
        let min = 0
        let apm = ''
        if (theDate.getHours() < 12 ){
          hr = theDate.getHours()
          if (hr == 0){
            hr = 12
          }
          apm = 'am'
        }
        if (theDate.getHours() >= 12 ){
          hr = theDate.getHours() - 12
          apm = 'pm'
        }
        if (theDate.getMinutes() < 10) {
          min = ':0' + theDate.getMinutes()
        }
        if (theDate.getMinutes() > 10) {
          min = ':' + theDate.getMinutes()
        }
          return { 'day': hr + min + apm, 'todayOKtime': 'TODAY' }
        }
      if (day < 0) {
        return
      }
    },
    onDate (date) {
      let now = new Date(this.$store.getters.today)
      let reservedDate = new Date(date)
      let endTime = new Date(date)
      endTime.setDate(reservedDate.getDate() + 1)
      // console.log('endTime' + endTime)
      let expireTime = Math.round((endTime - now) / (60 * 60 * 1000))
      // console.log('expireTime' + expireTime)
      if (expireTime <= 24) {
        return expireTime
      } else if (expireTime > 24) {

      }
    },
    onEditOrder (order, index) {
      this.$router.push('/editOrder/' + order.id + '/' + order.id)
    },
    onSubmitOrder (order, index) {
      console.log(index)
      this.$router.push('/submitOrder/' + order.id + '/' + order.id)
    },
    onSubmitReview (order, index) {
      this.$router.push('/submitReview/' + order.id + '/' + order.id)
    },
    checkToday (date, order) {
      let now = new Date(this.$store.getters.today)
      console.log('now:' + now)
      let reservedDate = new Date(date)
      // console.log(reservedDate)
      let endTime = new Date(date)
      endTime.setDate(reservedDate.getDate() + 1)
      // console.log('endTime' + endTime)
      let expireTime = Math.round((endTime - now) / (60 * 60 * 1000))
      // console.log('expireTime' + expireTime)
      if (expireTime <= 24 && expireTime >= 0) {
        return true
      } else if (expireTime > 24) {
        return false
      } else if (expireTime < 0) {
        console.log('item expired and deleted')
        if (order.orderPlaced == false) {
          this.$store.dispatch('delOrder', order)
        }
      }
    },
    // onDeleteDialog (order, index) {
    //
    //   console.log('onDelete' + JSON.stringify(order))
    //   // this.deleteDailog = true
    // },
    onDelete (order) {
      // console.log('onDelet??e' + order)
      this.deleteDailog = false
      // console.log('what????' + this.user.facebookName)
      if (this.user.facebookName) {
        // console.log('sellers/' + order.sellerWechat + '/' + order.name + '/' + this.user.facebookName)
        firebase.database().ref('sellers/' + order.sellerWechat + '/' + order.name + '/' + this.user.facebookName).remove()
        vm.$forceUpdate()
      }

      this.$store.dispatch('delOrder', order)
      if (this.newArr.length == 1){
       this.$router.push('/')
      }
    },
    ranKey (index) {
      const key = 'o ' + Math.floor((Math.random() * 10000) + 1)
      return key
    },
    countDown (startDate) {
      var countDownTime = '0ddd0'
      let expireDate = new Date(startDate)
      expireDate.setDate(expireDate.getDate() + 1)
      return formatDate(expireDate)
    }
  }
  // created(){
  //   for ( let i in this.$store.getters.user.placedOrders) {
  //     const userReserveDateCheck = new Date(this.$store.getters.user.placedOrders[i].userReserveDate)
  //     if (userReserveDateCheck.getDate() < this.$store.getters.today.getDate()) {
  //       //console.log('userReserveDateCheck'+ this.$store.getters.user.placedOrders[i].userReserveDates)
  //       this.$store.dispatch('delOrder', i) // del item from myorders
  //     }
  //   }
  // }
}
</script>

<style>
table, th, td {
  //border: 1px solid black;
  border-collapse: collapse;
}
th, td {
  padding: 8px;
  text-align: left;
}
</style>
