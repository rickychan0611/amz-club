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
      row
      align-start
      justify-space-between
    >
      <v-flex
        xs12
        md8
      >
        <h1 class="font-weight-thin">
          Rebate listing
        </h1>
      </v-flex>
      <v-flex
        xs12
        md4
      >
        <v-btn
          color="info"
          href="http://www.paypal.com"
          target="_blank"
          class="ma-2"
        >
          Paypal
        </v-btn>
        <v-btn
          color="info"
          href="http://www.simplii.com"
          target="_blank"
          class="ma-2"
        >
          Bank
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <div class="table-responsive">
        <table class="table body-2">
          <thead>
            <tr class="align-middle">
              <th scope="col">
                buyer
              </th>
              <th scope="col">
                etransfer
              </th>
              <th scope="col">
                orderNumber
              </th>
              <th scope="col">
                product
              </th>
              <th scope="col">
                sellerWechat
              </th>
              <th scope="col">
                list$
              </th>
              <th scope="col">
                rebate
              </th>
              <th scope="col">
                refund
              </th>
              <th scope="col">
                earning
              </th>
              <th scope="col">
                refundImg
              </th>
              <th scope="col">
                Rebated?
              </th>
            </tr>
          </thead>
          <tbody
            v-for="(item, index) in this.rebateList"
            :key="index"
          >
            <tr>
              <td>{{ item.buyer }}</td>
              <td>{{ item.etransfer }}</td>
              <td>{{ item.orderNumber }}</td>
              <td><a :href="item.amzLink" target="_blank">{{ item.name }}</a></td>
              <td>{{ item.sellerWechat }}</td>
              <td>{{ item.listPrice }}</td>
              <td>{{ item.rebate }}</td>
              <td>
                <input
                  style="width: 50px"
                  v-model="item.paypalGotMoney"
                  type="text"
                  class="gray--text caption border"
                  ></input>
              </td>
              <td>{{ earning(item) }}</td>
              <td>
                <a
                  :href="item.refundImg"
                  target="_blank"
                ><img
                  :src="item.refundImg"
                  height="50"
                ></a>
              </td>
              <td>
                <v-btn
                  small
                  @click="onRebated(item)"
                >
                  Yes
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-layout>
<!-- EARNING************************************************* -->
    <v-layout
      align-start
      justify-space-between
    >
      <v-flex xs10>
        <h1 class="font-weight-thin">
          Earning <span class="title">(Total: ${{parseFloat((myTotalEarning).toFixed(2))}}) | (Today earning: ${{parseFloat((todayEarning).toFixed(2))}})</span>
        </h1>
      </v-flex>
    </v-layout>
    <v-layout>
      <div class="table-responsive">
        <table class="table body-2">
          <thead>
            <tr class="align-middle">
              <th scope="col">
                Year
              </th>
              <th scope="col">
                Jan
              </th>
              <th scope="col">
                Feb
              </th>
              <th scope="col">
                Mar
              </th>
              <th scope="col">
                Apr
              </th>
              <th scope="col">
                May
              </th>
              <th scope="col">
                Jun
              </th>
              <th scope="col">
                Jul
              </th>
              <th scope="col">
                Aug
              </th>
              <th scope="col">
                Sep
              </th>
              <th scope="col">
                Oct
              </th>
              <th scope="col">
                Nov
              </th>
              <th scope="col">
                Dec
              </th>
            </tr>
          </thead>
          <tbody
            v-for="(year, index) in years"
            :key="index"
          >
            <tr>
              <td>{{year}}</td>
              <td v-for="(item, index) in monthlyIncome">
                <div v-if="year === item.year ">{{parseFloat((item.earning).toFixed(2))}}</div>
                <div v-if="year != item.year ">0</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-layout>
<!-- Completed************************************************* -->
    <v-layout
      align-start
      justify-space-between
    >
      <v-flex xs10>
        <h1 class="font-weight-thin">
          Completed
        </h1>
      </v-flex>
    </v-layout>
    <v-layout>
      <div class="table-responsive">
        <table class="table body-2">
          <thead>
            <tr class="align-middle">
              <th scope="col">
                refund Date
              </th>
              <th scope="col">
                buyer
              </th>
              <th scope="col">
                orderNumber
              </th>
              <th scope="col">
                product
              </th>
              <th scope="col">
                rebate
              </th>
              <th scope="col">
                earning
              </th>
              <th scope="col">
                sellerWechat
              </th>
              <th scope="col">
                refundImg
              </th>
              <th scope="col">
                RESTORE
              </th>
            </tr>
          </thead>
          <tbody
            v-for="(item, index) in this.completedList"
            :key="index"
          >
            <tr>
              <td><app-formatDate :date="item.refundDate"></app-formatDate></td>
              <td>{{ item.buyer }}</td>
              <td>{{ item.orderNumber }}</td>
              <td><a :href="item.amzLink" target="_blank">{{ item.name }}</a></td>
              <td>{{ item.rebate }}</td>
              <td>{{ item.earning }}</td>
              <td>{{ item.sellerWechat }}</td>
              <td>
                <a
                  :href="item.refundImg"
                  target="_blank"
                ><img
                  :src="item.refundImg"
                  height="50"
                ></a>
              </td>
              <td>
                <v-btn
                  small
                  @click="onRestore(item)"
                >
                  Restore
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
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
      obj: [],
      sellers: [],
      rebateArr: [],
      completedArr: [],
      account: {},
      years: [],
      myTotalEarning: 0,
      todayEarning: 0,
      allMonths: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      monthlyIncome: [],
      total: 0
    }
  },

  created () {

    const today = new Date()
    for (let u in this.allMonths) {
      this.monthlyIncome.push(0)
    }
    firebase.database().ref('sellers').on('value', (data) => {
      // this.obj = []
      this.rebateArr = []
      this.completedArr = []
      const obj = data.val()
      for (let i in obj) {
        for (let j in obj[i]) {
          for (let k in obj[i][j]) {
            // console.log("b: " + JSON.stringify(obj[i][j][k].refundImg))
            // if there is a refund image, push that user into rebateArr
            if (obj[i][j][k].refundImg || obj[i][j][k].paypalGotMoney) {
              if (!obj[i][j][k].refunded) {

                this.rebateArr.push(obj[i][j][k])
                // console.log("rebate: " + JSON.stringify(this.rebateArr))
              }
              if (obj[i][j][k].refunded) {

                this.onTotal(obj[i][j][k].earning)
                this.completedArr.push(obj[i][j][k])
              }
            }
          }
        }
      }
    })
    firebase.database().ref('account').on('value', (data) => {
      this.years = []
      // this.monthlyIncome = []
      this.myTotalEarning = 0
      this.todayEarning = 0
      this.account = data.val()
      for (let a in this.account) {
        this.years.push(a)
        for (let b in this.account[a]) {
          let myMonthlyEarning = 0
          const month = b
          for (let c in this.account[a][b]) {
            this.myTotalEarning = this.myTotalEarning + this.account[a][b][c].earning
            myMonthlyEarning = myMonthlyEarning + this.account[a][b][c].earning
            let checkday = new Date(a + b + c)
            const todayD = (today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear())
            const checkdayD = (checkday.getDate() + '-' + (checkday.getMonth()+1) + '-' + checkday.getFullYear())
            if (todayD == checkdayD) {
              this.todayEarning = this.account[a][b][c].earning
            }
          }
          for (let yr in this.years) {
            for (let mon in this.allMonths) {
              if (b === this.allMonths[mon]) {
                this.monthlyIncome[mon] = { 'year': this.years[yr], 'month': b, 'earning': myMonthlyEarning }
                console.log('monthlyIncome' + JSON.stringify(this.monthlyIncome))
              }
            }
          }
          // this.monthlyBill.push({'month':b, 'earning':myMonthlyEarning})
        }
      }
    })
  },
  computed: {
    rebateList () {
      return this.rebateArr
    },
    completedList () {
      this.completedArr.sort((a, b) => {
        return new Date(b.refundDate) - new Date(a.refundDate)
      })
      return this.completedArr
    }
  },
  methods: {
    onSortByDate () {
      this.orderDateSortClicked = true
      this.productSortClicked = false
      if (this.sortByDate) {
        this.obj.sort((a, b) => {
          return new Date(b.date) - new Date(a.date)
          this.sortByDate = false
        })
      }
      if (!this.sortByDate) {
        this.obj.sort((b, a) => {
          return new Date(b.date) - new Date(a.date)
          this.sortByDate = true
        })
      }
    },
    onTotal(earning){
      if (typeof earning == 'number'){
      this.total = ((earning*100) + (this.total*100))/100

        // console.log(this.total)
      //return this.total
      }
    },
    totalEarning (account) {
      return 99
    },
    earning (item) {
      return parseFloat((item.paypalGotMoney - item.rebate).toFixed(2))
    },
    onSave (item) {
      this.edit = !this.edit
      // this.$store.dispatch('createProduct', this.obj)
      firebase.database().ref('products/' + item.id).update(item)
    },
    init () {
      firebase.database().ref('sellers' + '').on('value', (data) => {
        this.obj = data.val()
      })
    },
    onRebated (item) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      let today = new Date()
      let year = today.getFullYear()
      let month = months[today.getMonth()]
      let date = today.getDate()
      let earning = this.earning(item) + this.todayEarning
      if (item.sellerWechat && item.name && item.buyer) {
        firebase.database().ref('sellers/' + item.sellerWechat + '/' + item.name + '/' + item.buyer)
          .update({ 'refunded': true, 'refundAmg': item.refundAmg, 'earning': this.earning(item), 'refundDate': today })
      }
      if (item.buyerId && item.id) {
        firebase.database().ref('buyers/' + item.buyerId + '/placedOrders/' + item.id).update({ 'refunded': true })
      }
      firebase.database().ref('account/' + year + '/' + month + '/' + date + '/').update({ 'earning': earning })
    },
    onRestore (item) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      let refundDate = new Date(item.refundDate)
      let year = refundDate.getFullYear()
      let month = months[refundDate.getMonth()]
      let date = refundDate.getDate()
      let earning = this.todayEarning - item.earning
      console.log('item.earning' + item.earning)
      firebase.database().ref('account/' + year + '/' + month + '/' + date + '/').update({ 'earning': earning })
      if (item.sellerWechat && item.name && item.buyer) {
        firebase.database().ref('sellers/' + item.sellerWechat + '/' + item.name + '/' + item.buyer).update({ 'refunded': false })
      }
      if (item.buyerId && item.id) {
        firebase.database().ref('buyers/' + item.buyerId + '/placedOrders/' + item.id).update({ 'refunded': false })
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
