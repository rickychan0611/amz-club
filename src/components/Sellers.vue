<template>
  <v-container>
    <v-layout>
      <div class="title mb-3">
        Please send money to <span class="info--text">Paypal account: ric0611@gmail.com </span><br>
        After refund, please upload the Paypal screenshot. Thank you <v-icon>mdi-emoticon-wink-outline</v-icon>
      </div><br>
    </v-layout>
    <span class="headline">{{id}}</span>
    <v-layout>

      <div
        class="table-responsive"
        style="overflow-x:auto"
      >
        <table class="table">
          <thead>
            <tr class="align-middle"  >
              <th scope="col">
                <v-btn text @click="sortByDate =! sortByDate, onSortByDate()">Order Date
                <span v-if="sortByDate">↑</span><span v-if="!sortByDate">↓</span></v-btn>
              </th>
              <th scope="col">
                <v-btn text @click="sortByName =! sortByName, onSortByName()">Product</v-btn>
                <span v-if="sortByName">↑</span><span v-if="!sortByName">↓</span></v-btn>
              </th>
              <th scope="col">
                Price
              </th>
              <th scope="col">
                Buyer
              </th>
              <th scope="col">
                Order #
              </th>
              <th scope="col">
                told seller
              </th>
              <th scope="col">
                <v-btn text @click="onSortByReview">Review Date</v-btn>
                <span v-if="sortByReview">↑</span><span v-if="!sortByReview">↓</span></v-btn>
              </th>
              <th scope="col">
                Review
              </th>
              <th
                scope="col"
                class="text-center"
              >
                Paypal Refund Srceenshot
              </th>
              <th scope="col">
                DONE?
              </th>
            </tr>
          </thead>
          <tbody
            v-for="(item, index) in this.obj"
            :key="index"
            :bgcolor="toldSellerColor(item.toldSeller)"
          >
            <tr :style="{backgroundColor: item.reviewColor}">
              <td class="ml-2" width="20px">
                {{ formattedDate(item.date) }} <br />
                {{item.sellerWechat}}
              </td>
              <td width="180px">{{ item.productName }}</td>
              <td width="100px">
                list:
                <input
                  v-model.number="item.listPrice"
                  type="number"
                  style="width:60px;"
                  class="edit_input"
                ></input><br />
              coupon:
              <input
                v-model.number="item.coupon"
                type="number"
                style="width:60px"
                class="edit_input"
              ></input><br />
            rebate:
            <input
              v-model.number="item.rebate"
              type="number"
              style="width:60px"
              class="edit_input"
            ></input><br />
            deal: ${{ (item.listPrice - item.coupon - item.rebate).toFixed(2) }}<br />
            <v-btn small
              @click="onSave(item)"
            >
              Save
            </v-btn>
          </td>
              <td>{{ item.buyer }}<br /><br />
              referral: <br />{{item.referral}}</td>
              <td>
                {{ item.orderNumber }}<br>
                <a :href="item.orderImgUrl" target="_blank">order's screenshot</a>
                <v-dialog
                  v-model="dialog"
                >
                  <v-btn
                    class="info"
                    @click="dialog = false, orderimg = ''"
                  >
                    x close
                  </v-btn>
                  <v-card>
                    <v-img
                      :src="orderImg"
                      contain
                    />
                  </v-card>
                </v-dialog>
              </td>
              <td>
                  <v-checkbox  v-model="item.toldSeller"></v-checkbox>
                  {{onToldSeller(item.toldSeller, item)}}
              </td>
              <td v-if="!item.reviewDate">
                  none
              </td>
              <td v-if="item.reviewDate">
                  {{formattedDate(item.reviewDate)}}
                  <v-checkbox v-model="item.reviewToldSeller" color="red"></v-checkbox>
                  {{onReviewTold(item.reviewToldSeller, item)}}
              </td>
              <td v-if="item.reviewUrl">
                Review is live!!!<br>
                <v-btn
                  class="orange caption ml-0"
                  small
                  :href="item.reviewUrl"
                  target="_blank"
                >
                  <v-icon
                    small
                    class="mr-1"
                  >
                    mdi-amazon
                  </v-icon> Review is here
                </v-btn>
                <!-- <a :href="item.reviewUrl" target="_blank"><span text class="body-1">{{item.reviewUrl}}</span></a> -->
                <br>
              <!-- <span class="caption">Please upload a Paypal screenshot after refund. Thank you :)</span> -->
              </td><td v-if="!item.reviewUrl">
                Not reviewed yet
              </td>
              <td>

                <div class="text-center">
                  <!-- <v-btn @click="onRebated(item)"
                  class="mb-3">rebated?</v-btn><br /> -->
                  <v-progress-circular
                    v-if="item.loading"
                    indeterminate
                    color="primary"
                    class="mr-2"
                  />
                  <img
                    v-if="!item.loading"
                    :src="item.refundImg"
                    height="100"
                  >

                  <v-btn
                    v-if="!item.refundImg"
                    :disabled="!item.reviewUrl"
                    small
                    class="info"
                    @click="onPickFile(index)"
                  >
                    <v-icon class="mr-1">
                      mdi-upload
                    </v-icon>upload
                  </v-btn>
                  paypal earning:
                  <input
                  v-model.earning="item.paypal"
                  type="number"
                  style="width:60px"
                  class="edit_input"
                  ></input>
                  {{item.paypal}}
                  <v-btn
                    v-if="item.refundImg"
                    fab
                    small
                    text
                    @click="onDelFile(item)"
                  >
                    <v-icon class="blue--text mr-1">
                      mdi-delete
                    </v-icon>
                  </v-btn>
                  <input
                    :id="index"
                    style="display:none"
                    type="File"
                    accept="image/*"
                    @change="onFilePicked($event, item)"
                  >
                </div>
                </input>
              </td>
              <td v-if="!item.refundImg || !item.reviewUrl">
                <v-icon class="green--text" />
              </td>
              <td v-if="item.refundImg && item.reviewUrl">
                <v-icon class="green--text">
                  mdi-check-bold
                </v-icon>
              </td>
            </tr>
            <tr>
  <td colspan="10" ><span style="width:1100px; word-wrap:break-word; display:inline-block;">{{item.keywords}} new order, {{item.orderNumber}}<br />
    {{item.keywords}}, {{item.orderNumber}}: Review is live:
    {{item.reviewUrl}}</span></td>
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
import Vue from 'vue'

var vm = new Vue()
export default {
  props: ['id'],
  data () {
    return {
      obj: [],
      image: null,
      refundImg: '',
      dialog: false,
      orderImg: '',
      loading: false,
      toldSeller: false,
      reviewToldSeller: false,
      sortByDate: true,
      sortByName: true,
      sortByReview: true,
      imageUrl: '',
      orderDateSortClicked: false,
      productSortClicked: false
    }
  },
  created () {
    firebase.database().ref('sellers').child(this.id).once('value', (data) => {
      this.obj = []
      const obj = data.val()
      for (let i in obj) {
        if (i !== 'pp') { // don't get pp into loop. (pp = paypal)
          for (let j in obj[i]) {
            let reviewColor = ''
            if (obj[i][j].reviewUrl) {
              reviewColor = '#fff680'
            }
            if (obj[i][j].toldSeller == undefined || obj[i][j].toldSeller == false) {
              this.toldSeller = false
            } else if (obj[i][j].toldSeller == true) {
              this.toldSeller = true
            }
            if (obj[i][j].reviewToldSeller == undefined || obj[i][j].reviewToldSeller == false) {
              this.reviewToldSeller = false
            } else if (obj[i][j].reviewToldSeller == true) {
              this.reviewToldSeller = true
            }
            if (obj[i][j].refunded === false || obj[i][j].refunded == undefined) {
              this.obj.push({
                productName: obj[i][j].name,
                keywords: obj[i][j].keywords,
                orderNumber: obj[i][j].orderNumber,
                reviewUrl: obj[i][j].reviewUrl,
                date: obj[i][j].purchaseDate,
                buyer: obj[i][j].buyer,
                referral: obj[i][j].referral,
                buyerId: obj[i][j].buyerId,
                refundImg: obj[i][j].refundImg,
                orderImgUrl: obj[i][j].orderImgUrl,
                loading: false,
                'reviewColor': reviewColor,
                reviewDate: obj[i][j].reviewDate,
                'toldSeller': this.toldSeller,
                dealPrice: obj[i][j].dealPrice,
                coupon: obj[i][j].coupon,
                rebate: obj[i][j].rebate,
                listPrice: obj[i][j].listPrice,
                sellerWechat: obj[i][j].sellerWechat,
                name: obj[i][j].name,
                id: obj[i][j].id,
                'reviewToldSeller': this.reviewToldSeller,
                earning: 0,
                note: '',
                paypal: 0
              })
            }
          }
        }
      }
    })
    if (!this.orderDateSortClicked && !this.productSortClicked) {
      if (this.sortByDate) {
        this.obj.sort((a, b) => {
          // console.log(a)
          return new Date(b.date) - new Date(a.date)
        })
      }
    }
    if (this.orderDateSortClicked && !this.productSortClicked) {
      this.onSortByDate()
    }
    if (!this.orderDateSortClicked && this.productSortClicked) {
      this.onSortByName()
    }
  },
  onReviewTold (reviewToldSeller, item) {
    if (item.orderNumber) {
      firebase.database().ref('sellers/' + this.id + '/' + item.productName + '/' + item.buyer).update({ 'reviewToldSeller': reviewToldSeller })
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
    onSortByReview () {
      this.sortByReview = !this.sortByReview
      var nameA = 0
      var nameB = 0
      if (this.sortByReview) {
        this.obj.sort((a, b) => {
          if (a.reviewDate) { nameA = new Date(a.reviewDate) }
          if (b.reviewDate) { nameB = new Date(b.reviewDate) }
          if (!a.reviewDate) { nameA = 0 }
          if (!b.reviewDate) { nameB = 0 }
          if (nameA < nameB)// sort string ascending
          { return -1 } else if (nameA > nameB) { return 1 }
        // return 0 // default return value (no sorting)
        })
      }
      if (!this.sortByReview) {
        this.obj.sort((a, b) => {
          if (a.reviewDate) { nameA = new Date(a.reviewDate) }
          if (b.reviewDate) { nameB = new Date(b.reviewDate) }
          if (!a.reviewDate) { nameA = 0 }
          if (!b.reviewDate) { nameB = 0 }
          if (nameA < nameB)// sort string ascending
          { return 1 } else if (nameA > nameB) { return -1 }
        // return 0 // default return value (no sorting)
        })
      }
    },
    onSortByName () {
      // console.log('onSortByName')
      if (this.sortByName) {
        this.obj.sort((a, b) => {
          var nameA = a.name.toLowerCase().charAt(0); var nameB = b.name.toLowerCase().charAt(0)
          if (nameA < nameB) // sort string ascending
          { return -1 }
          if (nameA > nameB) { return 1 }
          return 0 // default return value (no sorting)

          this.sortByName = false
        })
      }
      if (!this.sortByName) {
        this.obj.sort((a, b) => {
          var nameA = a.name.toLowerCase().charAt(0); var nameB = b.name.toLowerCase().charAt(0)
          if (nameA > nameB) // sort string ascending
          { return -1 }
          if (nameA < nameB) { return 1 }
          return 0 // default return value (no sorting)

          this.sortByName = true
        })
      }
    },
    onReviewTold (reviewToldSeller, item) {
      // console.log('reviewToldSeller' + reviewToldSeller)
      if (reviewToldSeller != undefined) {
        // console.log('anythi' + reviewToldSeller)
        firebase.database().ref('sellers/' + this.id + '/' + item.productName + '/' + item.buyer).update({ 'reviewToldSeller': reviewToldSeller })
      }
    },
    onToldSeller (toldSeller, item) {
      if (item.orderNumber) {
        firebase.database().ref('sellers/' + this.id + '/' + item.productName + '/' + item.buyer).update({ 'toldSeller': toldSeller })
        // console.log("toldSeller" + JSON.stringify(item))
      //   firebase.database().ref('buyers/' + item.buyerId +
      // '/placedOrders/' + item.id + '/').update({ 'toldSeller': toldSeller })
      }
    },
    toldSellerColor (color) {
      if (color == true) {
        return '#ededed'
      } else {
        return 'white'
      }
    },
    imgDialog (img) {
      this.dialog = true
      this.orderImg = img
    },
    init () {
      firebase.database().ref('sellers' + '').on('value', (data) => {
        this.obj = data.val()
      })
    },
    formattedDate (date) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      let current_datetime = new Date(date)
      let formatted_date =
          current_datetime.getDate() + '-' +
          months[current_datetime.getMonth()] + '-' +
          current_datetime.getFullYear()
      //  + " " +
      // current_datetime.getHours() + ":" +
      // current_datetime.getMinutes()
      return formatted_date
    },
    onPickFile (index) {
      // console.log(this.$refs.fileInput.click)
      document.getElementById(index).click() // $refs = all ref in this file, in this case, ref="fileInput"
    },
    onFilePicked (event, item) {
      item.loading = true
      let files = ''
      files = event.target.files
      console.log(files)
      let filename = ''
      filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
      }
      const ext = filename.slice(filename.lastIndexOf('.'))
      let fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
      firebase.storage().ref('sellers/' + item.orderNumber + ext).put(this.image)
        .then((fileData) => { // then get downloadUrl
          let storage = firebase.storage()
          let urlRef = storage.ref('sellers/' + item.orderNumber + ext)
          urlRef.getDownloadURL().then(function (downloadURL) {
            item.refundImg = downloadURL
            return downloadURL
          })
            .then((downloadURL) => {
              firebase.database().ref('sellers/' + this.id + '/' + item.productName + '/' + item.buyer).update({ 'refundImg': downloadURL })
            })
            .then(() => {
              item.loading = false
              vm.$forceUpdate()
            })
        })
    },
    onDelFile (item) {
      firebase.database().ref('sellers/' + this.id + '/' + item.productName + '/' + item.buyer).update({ 'refundImg': '' })
      item.refundImg = ''
      item.loading = false
      this.imageUrl = ''
      this.img = ''

      event.target.files = ''

      vm.$forceUpdate()
    },
    // onRebated (item) {
    //   console.log('onRebated' + JSON.stringify(item))
    //   firebase.database().ref('sellers/' + item.sellerWechat + '/' + item.name + '/' + item.buyer).update({ 'refunded': true })
    //   firebase.database().ref('buyers/' + item.buyerId + '/placedOrders/' + item.id).update({ 'refunded': true })
    // },
    onSave (item) {
      //console.log('onSave' + JSON.stringify(item))
      // this.$store.dispatch('createProduct', this.obj)
      let updatePrices = {}
      item.dealPrice = (item.listPrice - item.coupon - item.rebate).toFixed(2)
      updatePrices = {'listPrice': item.listPrice, 'coupon': item.coupon, 'rebate': item.rebate, 'dealPrice': item.dealPrice}
      firebase.database().ref('sellers/' + item.sellerWechat + '/' + item.name + '/' + item.buyer).update(updatePrices)
      firebase.database().ref('buyers/' + item.buyerId + '/placedOrders/' + item.id).update(updatePrices)
    }
  }
}
</script>

<style>

</style>
