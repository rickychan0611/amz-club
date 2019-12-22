<template>
  <div>
          <v-card class="ma-0 pa-1">
            <v-btn :to="{ 'name': 'Home', 'hash': '#'+index}" class="ma-3" floating><< home</v-btn>
<!-- '../../#' + index -->
            <v-img
              :src="product.img"
              contain
              class="mt-6"
              max-width="400px"
            />
      <v-card-title primary-title>
        <div>
          <div class="body-1 font-weight-bold mb-0">
            {{ product.name }} &nbsp;
          </div>

          <div class="caption">
            Sold by: {{ product.soldBy }}
          </div>
          <v-btn
            text
            class="orange caption ml-0"
            small
            :href="product.amzLink"
            target="_blank"
          >
            View on Amazon &nbsp; <v-icon small>
              mdi-amazon
            </v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <!-- <div class="body-1">
          {{ product.createDate }}
        </div> -->

        <div class="body-1">
          List Price: <span style="text-Decoration: line-through">${{ product.listPrice }}</span>
        </div>
        <div
          v-if="product.coupon > 0"
          class=" body-1 red--text font-weight-bold"
        >
          Instant coupon: ${{ product.coupon }}
        </div>
        <div class=" body-1 red--text font-weight-bold">
          Rebate after review: ${{ product.rebate }}
        </div>
        <div class="body-1 red--text font-weight-bold">
          <!-- Final Price: {{ product.dealPrice }} -->
          Final Price: {{ finalPrice (product) }}
          <span class="caption">save: {{ savePercent (product) }}%</span>
        </div>
        <span v-if="product.note">Note: {{ product.note }}</span>
        <!-- <v-btn rounded class="success"
          @click="clickedBuy(product.id)"
          >
          Reserve Yours Now
        </v-btn> -->


          <span class="ml-3">Qty left: {{ product.totalQty - product.totalCounter}}</span>

          <v-card-actions>
            <v-btn
              v-if="!product.isToday"
              rounded
              class="info"
              @click="openDialog(product)"
            >
              Reserve Now <v-icon class="ml-1">
                mdi-calendar-clock
              </v-icon>
            </v-btn>

            <v-btn
              v-if="product.isToday"
              rounded
              class="success"
              @click="openDialog(product)"
            >
              Get it Now <v-icon class="ml-1 ">
                mdi-check
              </v-icon>
            </v-btn> <span class="ml-3">Qty left: {{ product.totalQty - product.totalCounter}}</span>
          </v-card-actions>
          <!-- <p>Today: {{ product.date }}</p> -->
          <p
            v-if="!product.isToday"
            class="body-2"
          >
            This item will be Available on: <br>
            <span
              v-if="!product.isToday"
              class="headline"
            ><app-formatDate :date="product.latestReservedDate" /></span>
            <!-- is today here
            <span
              v-if=" product.isToday"
              class="headline"
            ><app-formatDate :date="product.latestReservedDate" /></span> -->
          </p>

      </v-card-text>
      <v-btn :to="{ 'name': 'Home', 'hash': '#'+index}" class="ma-3 mb-6" floating><< home</v-btn>
      <br /><br /><br />.

      <v-dialog
        v-model="lockedSellerDialog"
        max-width="500"
      >
        <v-card>

            <v-icon
              large
              class="orange--text mt-4 ml-6"
            >
              mdi-alert
            </v-icon>
            <v-card-title class="mt-0">
            You have got an item from the same seller.
            <br />
            Item: {{ onProduct.takenProduct }}. <br />Sold by: {{ onProduct.soldBy }}
          </v-card-title>

          <v-card-text>
            You can only get one product from this seller at one time. <br>
            Please wait until you have received the rebate for the {{ onProduct.takenProduct }}, or you can cancel the reservation of the pervious item.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="info"
              @click="lockedSellerDialog = false"
            >
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="loginDialog"
        max-width="500"
      >
        <v-card>
          <v-card-title>
            <v-icon
              large
              class="orange--text"
            >
              mdi-alert
            </v-icon>
            Please login
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="info"
              @click="loginDialog = false"
            >
              close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialog"
        max-width="500"
      >
        <!-- <v-card>  -->
        <v-card v-if="onProduct.isToday">
          <v-card-title class="headline" >
            <v-icon
              large
              class="green--text"
            >
              mdi-check
            </v-icon><span
      class="d-inline-block text-truncate"
      style="max-width: 400px;"
    >
            {{ onProduct.name }}
  </span>has been reserved for Today. <br>
          </v-card-title>
          <v-card-text class="subtitle-1 black--text">
            You have <span class="font-weight-bold red--text">24 hours </span> to purchase your product from Amazon<br>
            Please go to "My order" to proceed now
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              <v-icon>mdi-close-circle</v-icon>
              Cancel
            </v-btn>

            <v-btn
              color="green darken-1"
              text
              @click="clickedBuy"
            >
              <v-icon>mdi-cart-arrow-down</v-icon></v-iceon>
              Go to My Order
            </v-btn>
          </v-card-actions>
        </v-card>
        <!-- <v-card>  -->
        <!-- <v-card>  -->
        <v-card v-if="!onProduct.isToday">
          <v-card-title>
            <div>
              <v-icon
                large
                class="blue--text"
              >
                mdi-calendar-clock
              </v-icon>
              <div class="headline">
                {{ onProduct.name }} has been reserved for you.
              </div>
              <v-card-text
                class="title"
                style="lineHeight = 80%"
              >
                Please come back and place your order on: <br>
                <span class="title red--text"><app-formatDate :date="onProduct.latestReservedDate" /></span>
              </v-card-text>
              <v-card-text
                class="title"
                style="lineHeight = 80%"
              >
                You can view your reserved items in "My orders"
              </v-card-text>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-spacer />

            <v-btn
              color="green darken-1 white--text"
              @click="dialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              color="green darken-1 white--text"
              @click="clickedBuy"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
        <!-- <v-card>  -->
      </v-dialog>
      </v-card>
      </div>
</template>

<script>
export default {
  props: ['key'],
  data () {
    return {
      index: 0,
          onProduct: [],
          buyDisable: true,
          dialog: false,
          setDate: '',
          lockedSellerDialog: false, // set lastestreserved day
          loginDialog: false,
          show: false,
          searchKeywords: '',
          alert: true,
          showSearchBar: false,
          search: ''

    }
  },
  computed: {
    product () {
      console.log('this.productKeywords' + this.key)

      let result = {}
      this.index = 0
        for (let i in this.$store.getters.loadedProducts) {
          // console.log('xxxxxx:' + this.$store.getters.loadedProducts[i].id)
          if (this.$store.getters.loadedProducts[i].keywords == this.key) {

            this.index = i
              console.log('this.iiiiiiiiii' + i)
            return this.$store.getters.loadedProducts[i]
          }
        }

    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    savePercent (product) {
      const finalPrice = (product.listPrice - product.coupon - product.rebate).toFixed(2)
      const listPrice = product.listPrice
      return (1 - (finalPrice / listPrice).toFixed(2)) * 100
    },
    finalPrice (product) {
      const finalPrice = (product.listPrice - product.coupon - product.rebate).toFixed(2)
      if (finalPrice == 0) {
        return 'FREE'
      } else {
        return '$' + finalPrice
      }
    },
    newBadge (createDate) {
      const date = new Date(createDate)
      const isNew = this.$store.getters.today - date
      if (isNew < 86400000 * 2) { // one day is 86400000 millisec.
        return true
      } else {
        return false
      }
    },
    ranKey (index) {
      const key = 'p ' + Math.floor((Math.random() * 10000) + 1)
      // console.log(key)
      return key
    },
    openDialog: function (product) {
      // console.log('openDialog:' + JSON.stringify(this.$store.getters.user.signedIn))
      if (this.$store.getters.user.id) {
        if (this.$store.getters.user.registered != true) {
          this.$router.push('/signup')
          return
        }
      }
      if (this.$store.getters.user.id == undefined) {
        this.loginDialog = true
        return
      }
      this.onProduct = product
      if (this.$store.getters.user.lockedSellers) {
        for (let i in this.$store.getters.user.lockedSellers) {
          if (this.$store.getters.user.lockedSellers[i]['lockedSeller'] == product.soldBy) {
            this.lockedSellerDialog = true
            return
          }
        }
        // //console.log('lockerd')
        // this.lockedSellerDialog = true
        // return
      }

      // this.onProduct['lastestReserveDate'] = this.setDate
      this.dialog = true
      // //console.log('onProduct: ' + JSON.stringify(this.onProduct))
    },
    // buyToday (product, index) {
    //       this.$router.push('/submitReview/' + index + '/' + product.id)
    // },
    clickedBuy (id) {
      // console.log('this.$store.getters.user.facebookName ' + this.$store.getters.user.facebookName)
      const newOrder = { // gether infomatin of this product to placeOrder
        //   userId : this.$store.getters.user.id,
        orderNumber: '',
        // orderDate: new Date(),
        reviewUrl: '',
        // userKey: this.$store.getters.user.userKey,
        userReserveDate: this.onProduct.latestReservedDate,
        latestReservedDate: this.onProduct.latestReservedDate,
        dailyQuotaCounter: this.onProduct.dailyQuotaCounter,
        totalCounter: this.onProduct.totalCounter,
        // buyer: this.$store.getters.user.facebookName,
        amzLink: this.onProduct.amzLink,
        sellerName: this.onProduct.sellerName,
        buyerId: this.$store.getters.user.id
        // latestReservedDate:
      }

      const newOrderData = Object.assign(newOrder, this.onProduct)
      // console.log(newOrderData)
      this.$store.dispatch('placeOrder', newOrderData)
      this.dialog = false
      // //console.log('onPlaceOrder ' +  JSON.stringify(this.product))
      this.$router.push('/myOrders')
    }
  }
}

</script>
