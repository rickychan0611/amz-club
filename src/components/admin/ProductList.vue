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
      <v-flex xs12>
        <h1 class="font-weight-thin">
          Product listing
        </h1>
      </v-flex>
      <v-flex xs2>
        <v-btn
          color="info"
          to="/products/new"
        >
          Create
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr class="align-middle">
                <th scope="col">
                  Edit
                </th>
                <th scope="col">
                  Product
                </th>
                <th scope="col">
                  list price
                </th>
                <th scope="col">
                  coupon
                </th>
                <th scope="col">
                  rebate
                </th>
                <th scope="col">
                  deal price
                </th>
                <th scope="col">
                  daily Quota
                </th>
                <th scope="col">
                  daily counter
                </th>
                <th scope="col">
                  All quota
                </th>
                <th scope="col">
                  sold
                </th>
                <th scope="col">
                  last date
                </th>
                <th scope="col">
                  seller
                </th>
                <th scope="col">
                  SoldBy
                </th>
                <th scope="col">
                  Active
                </th>
                <th scope="col">
                  Selling
                </th>
              </tr>
            </thead>
            <tbody
              v-for="(item, index) in obj"
              :key="index"
            >
              <tr v-if="item.disable">
                <td>
                  <button @click="item.disable=false">
                    Edit
                  </button>
                </td>
                <td style="max-width:130px; word-wrap:break-word">
                  <a :href=" item.amzLink " target="_blank">{{ item.name }}</a>
                </td>
                <td>listPrice<br />{{ item.listPrice }}</td>
                <td>coupon<br />{{ item.coupon }}</td>
                <td>rebate<br />{{ item.rebate }}</td>
                <td>dealPrice<br />{{ item.dealPrice }}</td>
                <td>dailyQuota<br />{{ item.dailyQuota }}</td>
                <td>dailyCt.<br />{{ item.dailyQuotaCounter }}</td>
                <td>totalQty<br />{{ item.totalQty }}</td>
                <td>totalCt.<br />{{ item.totalCounter }}</td>
                <td><app-formatDate :date="item.latestReservedDate" /></td>
                <td><a :href="sellerLink( item.sellerWechat )" target="_blank">{{ item.sellerWechat }}</a></td>
                <td>{{ item.soldBy }}</td>


                <td>
                  <v-btn
                    v-if="item.activate"
                    small
                    class="ma-0 success caption"
                    @click="onActivate(item)"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="!item.activate"
                    small
                    class="ma-0 error caption"
                    @click="onActivate(item)"
                  >
                    <v-icon small>
                      mdi-block-helper
                    </v-icon>
                  </v-btn>
                </td>

                <td>
                  <v-btn
                    v-if="item.selling"
                    small
                    class="ma-0 success caption"
                    @click="onSelling(item)"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="!item.selling"
                    small
                    class="ma-0 error caption"
                    @click="onSelling(item)"
                  >
                    <v-icon small>
                      mdi-block-helper
                    </v-icon>
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
                  name<input
                    v-model="item.name"
                    type="text"
                    style="width:200px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  listPrice<input
                    v-model.number="item.listPrice"
                    type="number"
                    style="width:60px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  coupon<input
                    v-model.number="item.coupon"
                    type="number"
                    style="width:60px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  rebate<input
                    v-model.number="item.rebate"
                    type="number"
                    style="width:60px"
                    class="edit_input"
                  ></input>
                </td>
                  <td >
                    <!-- :value="item.listPrice - item.coupon - item.rebate" -->
                    dealPrice
                    {{ (item.listPrice - item.coupon - item.rebate).toFixed(2) }}
                      <!-- <input
                      :value="item.listPrice - item.coupon - item.rebate"
                      type="number"
                      style="width:50px; input:disabled"
                      class="edit_input"

                    ></input> -->
                  </td>
                  <td>
                  dailyQuota<input
                    v-model.number="item.dailyQuota"
                    type="number"
                    style="width:50px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  dailyQuotaCounter<input
                    v-model.number="item.dailyQuotaCounter"
                    type="number"
                    style="width:50px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                totalQty<input
                    v-model.number="item.totalQty"
                    type="number"
                    style="width:50px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  totalCounter<input
                    v-model.number="item.totalCounter"
                    type="number"
                    style="width:50px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  latestReservedDate<input
                    v-model="item.latestReservedDate"
                    type="text"
                    style="width:100px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  sellerWechat<input
                    v-model="item.sellerWechat"
                    type="text"
                    style="width:100px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  soldBy<input
                    v-model="item.soldBy"
                    type="text"
                    style="width:100px"
                    class="edit_input"
                  ></input>
                </td>
                <td>
                  <v-switch v-model="item.activate" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
  computed: {
    // onActivate (payload) {
    //   console.log(payload)
    //   return payload
    // }
  },
  created () {
    firebase.database().ref('products').on('value', (data) => {
      this.obj = []
      const obj = data.val()
      const disable = { 'disable': true }
      for (let key in obj) {
        const newObj = Object.assign(obj[key], disable)
        this.obj.push(newObj)
      }
    })
  },
  methods: {
    onSelling (item) {
      if (item.selling === true) {
        firebase.database().ref('products/' + item.id).update({ 'selling': false, 'masterDeActive': true })
        return false
      } else {
        firebase.database().ref('products/' + item.id).update({ 'selling': true, 'masterDeActive': false })
        return true
      }
    },
    onDealPrice (item) {
      return (item.listPrice*100 - item.coupon*100 - item.rebate*100)/100
    },
    sellerLink (name) {
      return 'https://amzsellers.web.app/sellers/' + name
    },
    onActivate (item) {
      if (item.activate === true) {
        firebase.database().ref('products/' + item.id).update({ 'activate': false, 'masterDeActive': true })
        return false
      } else {
        firebase.database().ref('products/' + item.id).update({ 'activate': true, 'masterDeActive': false })
        return true
      }
    },
    onSave (item) {
      console.log(item)
      this.edit = !this.edit
      // this.$store.dispatch('createProduct', this.obj)
      item.dealPrice = (item.listPrice*100 - item.coupon*100 - item.rebate*100)/100
      firebase.database().ref('products/' + item.id).update(item)
    },
    init () {
      firebase.database().ref('sellers' + '').on('value', (data) => {
        this.obj = data.val()
      })
    }
  }
}
</script>

<style>
.edit_input {
  border: 1px solid red;
  padding: 0px 3px;
}
.table {
  font-size:	13px
}

</style>
