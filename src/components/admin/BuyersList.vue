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
      </v-flex>
    </v-layout>
  </div>
    <v-layout
      align-start
      justify-space-between
    >
      <v-flex xs10>
        <h1 class="font-weight-thin">
          Buyers list
        </h1>
      </v-flex>
    </v-layout>
    <v-layout>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr class="align-middle">
              <th scope="col">
                Name
              </th>
              <th scope="col">
                Placed Orders /  expired order deleted: {{expiredOrder}}
              </th>
              <th scope="col">
                Del user
              </th>
            </tr>
          </thead>
          <tbody
            v-for="(item, index) in this.obj"
            :key="index"
          >
            <tr v-if="item.disable">
              <td style="max-width:130px; word-wrap:break-word">
                <span class="title">{{ item.facebookName }}</span>
                <v-btn @click="loginUser(item)" href="../myorders/" target="_blank" small>
                  login</v-btn>
                <br>{{ item.id }}
                <br><br>Referral: <br />{{item.referral}}
                <br><br>amzProfile: <br /><a :href="item.amzProfile" target="_blank">{{item.amzProfile}}</a>
                <br><br>email: {{ item.email }}
                <br>password: {{ item.password }}
                <br><br>etransfer: {{ item.etransfer }}
                <br><br><a :href="item.facebookId" target="_blank">facebookId</a>
              </td>
              <td>
                <ul
                  v-for="(order, i) in sortedplacedOrders(item.placedOrders)"
                  :key="i"
                >
                  <li style="word-wrap:break-word;">
                    <a
                      :href="order.reviewUrl"
                      target="_blank"
                    >
                      <span
                        v-if="order.reviewUrl"
                        class="red white--text"
                      > Reviewed </span></a>{{ order.name }}
                    <v-btn @click="addToSeller(order)"small class="ml-4 error caption">add to seller</v-btn><br>
                    <a
                      :href="sellerLink( order.sellerWechat )"
                      target="_bank"
                    >
                      seller: {{ order.sellerWechat }}<br>
                      <span
                        v-if="!order.orderPlaced"
                        class="grey--text"
                      > Haven't bought yet <app-formatDate :date="order.userReserveDate" /></span>
                      <!-- <span v-if="checkToday(order.userReserveDate, order)"> getting today</span> -->
                      <!-- {{ checkToday(order.userReserveDate, order, item.id) }} -->
                      <span
                        v-if="order.orderPlaced && !order.reviewUrl"
                        class="red--text "
                      >
                        Bought: <app-formatDate :date="order.purchaseDate" />
                      </span>
                    </a>
                    {{ order.orderNumber }} <br>
                    <span style="font-size: 10px">{{ order.orderImgUrl }}</span>

                  </li>
                </ul>
              </td>
              <td style="max-width:130px; word-wrap:break-word">
                <v-btn
                  small
                  text
                  class="error--text"
                  @click="delUser(item)"
                >
                  x
                </v-btn>
              </td>
            </tr>

            <tr v-if="!item.disable">
              <td>
                <button
                  v-if="!item.disable"
                  @click="onSave(item); item.disable=true"
                >
                  Save
                </button>
                <button
                  v-if="item.disable"
                  @click="onSave(item)"
                />
              </td>
              <td>
                <input
                  v-model="item.facebookName"
                  type="text"
                  style="width:200px"
                  class="edit_input"
                ></input>
              </td>
              <td>
                <input
                  v-model="item.email"
                  type="text"
                  style="width:200px"
                  class="edit_input"
                ></input>
              </td>
              <td>
                <input
                  v-model="item.etransfer"
                  type="text"
                  style="width:200px"
                  class="edit_input"
                ></input>
              </td>
              <td>
                <input
                  v-model="item.amzProfile"
                  type="text"
                  style="width:200px"
                  class="edit_input"
                ></input>
              </td>
              <td>
                <input
                  v-model="item.placedOrders"
                  type="text"
                  style="width:200px"
                  class="edit_input"
                ></input>
              </td>
            </tr>
          </tbody>
        </table>

        <v-dialog
          v-model="openUserDialog"
        >
          <v-card>
            <v-card-title>
              Name:
              <a
                :href="this.userInfo.facebookId"
                target="_blank"
              >
                {{ this.userInfo.facebookName }}</a>
            </v-card-title>
            <v-card-text>
              etransfer: {{ this.userInfo.etransfer }}<br>
              amzProfile: <a
                :href="this.userInfo.amzProfile"
                target="_blank"
              >{{ this.userInfo.amzProfile }}</a><br>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
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
      obj: {},
      openUserDialog: false,
      userInfo: {},
      expiredOrder: 0
    }
  },
  created () {
    firebase.database().ref('buyers').once('value', (data) => {
      this.obj = []
      let arr = {}
      const obj = data.val()
      for (let i in obj) {
        arr = {
          facebookName: obj[i].facebookName,
          facebookId: obj[i].facebookId,
          id: obj[i].id,
          // userKey: obj[i].userKey,
          placedOrders: obj[i].placedOrders,
          etransfer: obj[i].etransfer,
          amzProfile: obj[i].amzProfile,
          email: obj[i].email,
          disable: true,
          lastUpdate: '',
          password: obj[i].password,
          toldSeller: obj[i].toldSeller,
          referral: obj[i].referral
        }
        let compareDate = 0
        for (let j in obj[i].placedOrders) {
          // //console.log(obj[i].placedOrders[j].purchaseDate)
          if (new Date(obj[i].placedOrders[j].purchaseDate) > new Date(compareDate)) {
            compareDate = obj[i].placedOrders[j].purchaseDate
          }
          if (new Date(obj[i].placedOrders[j].userReserveDate) > new Date(compareDate)) {
            compareDate = obj[i].placedOrders[j].userReserveDate
          }
        }
        arr.lastUpdate = compareDate

        this.obj.push(arr)
      }
      // Start -- ADD takenProduct to lockedSellers ********************************************************************
      // for (let a in this.obj) {
      //   for (let b in this.obj[a].placedOrders) {
      //     let takenProduct = this.obj[a].placedOrders[b].keywords
      //     // if (this.obj[a].id == 'XsSqUtEpMiZF5Om9o33GcejHmml1') { //specific a user by putting the id
      //       firebase.database().ref('buyers/' + this.obj[a].id + '/lockedSellers/' + this.obj[a].placedOrders[b].soldBy)
      //         .update({ lockedSeller: this.obj[a].placedOrders[b].soldBy, 'takenProduct': takenProduct })
      //     // }
      //   }
      // }
      // END -- ADD takenProduct to lockedSellers ********************************************************************
      this.obj.sort((a, b) => {
        return new Date(b.lastUpdate) - new Date(a.lastUpdate)
      })
    })
    // //console.log('objxxx' + JSON.stringify(this.obj))
  },
  methods: {
    loginUser (item) {
      console.log(item)
      this.$store.dispatch('logout')
      this.$store.dispatch('signUserIn', { email: item.email, password: item.password })
    },
    addToSeller (order) {
      // console.log(JSON.stringify(order))
      if (order.orderNumber) {
        firebase.database().ref('sellers/' + order.sellerWechat + '/' + order.name + '/' + order.buyer + '/').update(order)
      }
    },
    checkToday (date, order, id) {
      let userId = { 'userId': id }
      Object.assign(order, userId)
      let now = new Date(this.$store.getters.today)
      let reservedDate = new Date(date)
      let endTime = new Date(date)
      endTime.setDate(reservedDate.getDate() + 1)
      // //console.log('endTime' + endTime)
      let expireTime = Math.round((endTime - now) / (60 * 60 * 1000))
      // //console.log('expireTime' + expireTime)
      if (expireTime <= 24 && expireTime >= 0) {
        return 'expire in ' + expireTime + ' hr'
      } else if (expireTime > 24) {
        return 'expire in' + expireTime + ' hr'
      }
      console.log('order.orderPlaced '+this.expiredOrder)
      if (order.orderPlaced === false) {
        if (expireTime < 0) {
          // automatic del all expired orders
          this.$store.dispatch('BuyerListDelOrder', order)
          console.log('expired item del: ' + this.expiredOrder)
          this.expiredOrder++
          // console.log('del')
          return 'Del'
          // del item
        }
        //return 'nothing happened'
      }
    },
    sortedplacedOrders (item) {
      // //console.log(Object.keys(item))
      let arr = []
      for (let i in item) {
        arr.push(item[i])
      }
      // return arr
      return arr.sort((a, b) => {
        return new Date(b.purchaseDate) - new Date(a.purchaseDate)
      })
    },
    userDialog (item) {
      // console.log('click')
      this.openUserDialog = true
      this.userInfo = item
    },
    sellerLink (seller) {
      return '../sellers/' + seller
    },
    delUser (item) {
      // console.log('del: ' + item.facebookName)
      // firebase.database().ref('buyers/' + item.id + '/' + item.userKey + '/')
      // .remove()
    },
    onSave (item) {
      this.edit = !this.edit
      firebase.database().ref('buyers/' + item.id + '/' + item.userKey + '/').update(item)
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
