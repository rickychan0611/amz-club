<template>
  <v-container text-xs-center>
    <v-layout row>
      <v-flex
        xs12
        md10
        offset-md1
      >
        <v-card class="mx-3">
          <v-card-text>
            <h2 class="title">
              {{ product.name }}
            </h2>
          </v-card-text>
          <v-img
            :src="product.img"
            height="300px"
            contain
          />

          <v-card-text>
            <h4 class="body-2">
              List Price: ${{ product.listPrice }}
            </h4>
            <h3 class="title">
              Deal Price: ${{ product.dealPrice }}
            </h3>
            <h3 class="title red--text">
              Saving: <br>${{ product.rebate }}  rebate after review
            </h3>
          </v-card-text>
          <hr>

          <v-card-text>
            <!-- amazon link goes here -->
            <h4 center>
              Step 1: <br>Make your purchase on Amazon
            </h4>
            <v-btn
              class="orange"
              large
              round
            >
              Go to Amazon now &nbsp; <v-icon>exit_to_app</v-icon>
            </v-btn>
          </v-card-text>
          <hr>

          <v-card-text>
            <h4 center>
              Step 2: <br>Submit your order#:
            </h4>
            <v-container
              text-xs-center
              class="pa-0"
            >
              <v-layout
                row
                justify-center
              >
                <v-flex
                  xs12
                  sm5
                >
                  <v-text-field
                    v-model="orderNumber"
                    class="px-2"
                    name="orderNumber"
                    :mask="mask"
                    label="Order Number"
                    :rules="[rules.required, rules.counter]"
                    counter
                    maxlength="17"
                    outline
                    clearable
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-btn
            class="blue mb-4"
            type="submit"
            :disabled="!formIsValid"
            round
            large
            @click.prevent="onPlaceOrder"
          >
            Submit
          </v-btn>
          <!-- <v-btn class="blue mb-4" dark large round
    @click="$router.go(-1)"
    >
    Cancel
  </v-btn> -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    props: ['id'],
    props: ['index'],
    data () {
      return {
        mask: '###-#######-#######',
        orderNumber: '',
        rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length <= 17 || '17 numbers'
        }

      }
    }, // pass id from rounter clicked the buy button. for details, look at youtube video #9
    computed: {
      product () {
        return this.$store.getters.user.placedOrders[this.index]
      // find the singal product with this.id from props from getter in state
      },
      formIsValid () {
        return this.orderNumber.length > 16
      }
    },
    methods: {
      onPlaceOrder () {
        const fomartedOrderNumberA = [this.orderNumber.slice(0, 3), '-', this.orderNumber.slice(3)].join('')
        const fomartedOrderNumberB = [fomartedOrderNumberA.slice(0, 11), '-', fomartedOrderNumberA.slice(11)].join('')
        console.log('this.$store.getters.user.facebookName' + this.$store.getters.user.facebookName)
        const newOrder = {
          //   userId : this.$store.getters.user.id,
          orderNumber: fomartedOrderNumberB,
          // orderDate: new Date(),
          reviewUrl: '',
          userKey: this.$store.getters.user.userKey,
          buyer: this.$store.getters.user.facebookName
        // latestReservedDate:
        }

        console.log('onPlaceOrder ' + JSON.stringify(this.product))
        const newOrderData = Object.assign(newOrder, this.product)
      // this.$store.dispatch('placeOrder',  newOrderData)
      // this.$router.push('/myOrders')
      }
    }
  }
</script>
