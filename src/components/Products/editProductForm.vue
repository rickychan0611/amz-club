<template>
  <form @submit.prevent="onCreateProduct">
    <v-container>
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <h4>Create a new Meetup</h4>
        </v-flex>

        <v-flex xs12>
          <v-text-field
            v-model="name"
            class="mr-3"
            label="Product Name"
            required
            outline
          />
        </v-flex>

        <v-flex xs6>
          <v-text-field
            v-model="amzLink"
            class="mr-3"
            label="Amazon's link"
            required
            outline
          />
        </v-flex>

        <v-flex xs6>
          <v-text-field
            v-model="keywords"
            class="mr-3"
            label="keywords"
            required
            outline
          />
        </v-flex>

        <v-flex grow>
          <v-text-field
            v-model="listPrice"
            class="mr-3"
            label="List Price"
            required
            outline
          />
        </v-flex>

        <v-flex grow>
          <v-text-field
            v-model="dealPrice"
            class="mr-3"
            label="Deal Price"
            required
            outline
          />
        </v-flex>

        <v-flex grow>
          <v-text-field
            v-model="rebate"
            class="mr-3"
            label="Rebate"
            required
            outline
          />
        </v-flex>

        <v-flex grow>
          <v-text-field
            v-model="totalQty"
            class="mr-3"
            label="Total Quantity"
            outline
          />
        </v-flex>

        <v-flex grow>
          <v-text-field
            v-model="dailyQuota"
            class="mr-3"
            label="Daily Quota"
            outline
          />
        </v-flex>

        <v-flex xs6>
          <v-text-field
            v-model="sellerName"
            class="mr-3"
            label="Seller's Name on Facebook"
            outline
          />
        </v-flex>

        <v-flex xs6>
          <v-text-field
            v-model="sellerWechat"
            class="mr-3"
            label="Seller Wechat"
            outline
          />
        </v-flex>

        <v-flex xs12>
          <v-text-field
            v-model="img"
            label="Image URL"
            outline
            required
          />
        </v-flex>

        <v-flex xs12>
          <img
            :src="img"
            height="150"
          >
        </v-flex>

        <v-flex xs12>
          <v-btn
            class="primary"
            :disabled="!formIsValid"
            type="submit"
          >
            Create Meetup
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </form>
</template>

<script>
  export default {
    data () {
      return {
        name: '',
        id: '',
        listPrice: null,
        dealPrice: null,
        rebate: null,
        amzLink: '',
        keywords: '',
        img: '',
        link: '',
        date: '',
        totalQty: null,
        dailyQuota: null,
        reserveCounter: '',
        orderPlaced: '',
        sellerName: '',
        sellerWechat: '',
        buyer: '',
        dailyQuotaCounter: 0,
        totalCounter: 0
      }
    },
    computed: {
      formIsValid () {
        return this.name !== '' &&
          // this.id !== '' &&
          this.listPrice !== '' &&
          this.dealPrice !== '' &&
          this.rebate !== '' &&
          // this.amzLink !== '' &&
          this.img !== ''
        // this.link !== '' &&
        // this.date !== ''
      }
    },
    methods: {
      onCreateProduct () {
        let today = new Date(Date.now())
        const productData = {
          name: this.name,
          id: this.id,
          listPrice: this.listPrice,
          dealPrice: this.dealPrice,
          rebate: this.rebate,
          amzLink: this.amzLink,
          img: this.img,
          createDate: today.toString(),
          totalQty: this.totalQty,
          dailyQuota: this.dailyQuota,
          userReserveDate: '',
          orderPlaced: this.orderPlaced,
          sellerName: this.sellerName,
          sellerWechat: this.sellerWechat,
          buyer: this.buyer,
          // buyerCounter: this.buyerCounter,
          dailyQuotaCounter: this.dailyQuotaCounter,
          totalCounter: this.totalCounter
        }
        this.$store.dispatch('createProduct', productData)
        this.$router.push('/products/new')
      }
    }
  }
</script>
