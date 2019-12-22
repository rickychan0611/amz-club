<template>
  <v-container
    grid-list-xl
    text-center
  >
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialog"
        persistent
        max-width="500"
      >
        <v-card>
          <v-card-title class="headline">
            Thank you for submitting your order!
          </v-card-title>
          <v-card-text class="subtitle-1 black--text">
            Your order number has been submitted: <br><p class="red--text">
              {{ orderNumber }}
            </p>
            1. Once your product has arrived, please wait for <span class="red--text">1 week </span>before leaving your review. <br>
            2. You must give <span class="red--text">FIVE STARS </span>, write a few sentences and upload some pictures of the product in order to get the rebates. <br>
            3. Once your review is approved by Amazon, please go to <span class="red--text">My Order</span> and submit the link to your review.<br>
            Thank you : ) <v-icon>emoticon-happy-outline</v-icon>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1 white--text"
              @click="dialog = false, $router.push('/myOrders')"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <h1 class="font-weight-thin pl-1 mb-0">
      Edit Order
    </h1>

    <span class="headline">{{ product.name }}</span>

    <v-layout
      row
      text-xs-center
    >
      <v-flex
        xs12
        md10
        offset-md1
      >
        <v-card
          class="mx-auto"
          outlined
          py-2
        >
          <!-- amazon link goes here -->
        <div class="headline mt-4 ">
          order#:
          </div>
          <v-container
            text-xs-center
            class=""
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
                  clearable
                  v-model="product.orderNumber"
                  v-mask="mask"
                  class=""
                  name="orderNumber"
                  label="Order Number"
                  :rules="[rules.required, rules.counter]"
                  counter
                  maxlength="19"
                  outlined
                />
              </v-flex>
            </v-layout>
          </v-container>
          <hr>
          <v-container
            text-xs-center
            class=""
          >
            <v-layout
              row
              justify-center
            >
              <v-flex
                xs12
                sm6
              >
                <v-btn
                  class="info"
                  @click="onPickFile()"
                >
                  <v-icon>mdi-file-upload-outline</v-icon>Upload New screenshot
                </v-btn>
                <input
                  id="upload"
                  style="display:none"
                  type="File"
                  accept="image/*"
                  @change="onFilePicked($event, product)"
                >
                </input>
              </v-flex>
            </v-layout>

            <v-progress-linear
              v-if="fileLoaded"
              color="deep-purple accent-4"
              indeterminate
              rounded
              height="6"
            />
            <v-img
              v-if="product.orderImgUrl"
              :src="product.orderImgUrl"
              height="200px"
              contain
            />
          </v-container>

          <v-btn
            class="success ma-4 white--text"
            type="submit"
            :disabled="!formIsValid"
            rounded
            large
            @click.prevent="onPlaceOrder"
          >
            Submit
          </v-btn>

          <v-btn
            class="blue ma-4"
            dark
            large
            rounded
            @click="$router.go(-1)"
          >
            Cancel
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/database'
  import 'firebase/storage'
  import { mask } from 'vue-the-mask'
  export default {
    directives: {
      mask
    },
    props: ['id'],
    props: ['index'],
    data () {
      return {
        reviewUrl: '',
        mask: '###-#######-#######',
        orderNumber: '',
        rules: {
          required: value => !!value || 'Required.',
          counter: value => value.length <= 19 || '19 numbers'
        },
        dialog: false,
        reviewed: false,
        fomartedOrderNumber: '',
        orderImgUrl: '',
        fileLoaded: false,
        filePicked: false
      }
    }, // pass id from rounter clicked the buy button. for details, look at youtube video #9
    computed: {
      product () {
        return this.$store.getters.user.placedOrders[this.index]
      // find the singal product with this.id from props from getter in state
      },
      formIsValid () {
        console.log(this.orderNumber.length)
        if (this.orderNumber.length == 19) {
          //
          return true
        } else {
          return true
        }
      }
    },
    methods: {
      onSubmit () {
        const reviewInfo = { 'reviewUrl': this.reviewUrl, 'index': this.index }
        console.log(addInfoToProduct)
        const addInfoToProduct = Object.assign(this.product, reviewInfo)
        console.log(addInfoToProduct)
        this.dialog = true
        this.$store.dispatch('submitReview', addInfoToProduct)
      },
      onPlaceOrder () {
        let newnewOrder = {
          'orderNumber': this.product.orderNumber,
          buyer: this.$store.getters.user.facebookName,
          purchaseDate: this.$store.getters.today,
          orderPlaced: true
        }

        let newOrderData = Object.assign(this.product, newnewOrder)
        this.$store.dispatch('enterOrderNumber', newOrderData)
        console.log('onxxxxxxxxPlaceOrder ' + JSON.stringify(newOrderData))

        this.dialog = true
      },
      onPickFile () {
        // console.log(this.$refs.fileInput.click)
        let upload = 'upload'
        document.getElementById(upload).click() // $refs = all ref in this file, in this case, ref="fileInput"
      },
      onFilePicked (event, item) {
        this.fileLoaded = true
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add a valid file!')
        }
        const ext = filename.slice(filename.lastIndexOf('.'))
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
        firebase.storage().ref(this.product.name + '_' + this.orderNumber + ext).put(this.image)
          .then((fileData) => { // then get downloadUrl
            let storage = firebase.storage()
            let urlRef = storage.ref(this.product.name + '_' + this.orderNumber + ext)
            urlRef.getDownloadURL().then(function (downloadURL) {
              return downloadURL
            })
              .then((downloadURL) => {
                this.product.orderImgUrl = downloadURL
                firebase.database().ref('sellers/' + item.sellerWechat + '/' + item.name + '/' + this.$store.getters.user.facebookName).update({ 'orderImgUrl': downloadURL })
                firebase.database().ref('buyers/' + this.$store.getters.user.id + '/' +
                  '/placedOrders/' + item.name + '_' + item.sellerWechat).update({ 'orderImgUrl': downloadURL })
              })
              .then(() => {
                this.fileLoaded = false
                this.filePicked = true
              })
          })
      // .catch((error)) => {
      //   console.log(error)
      // }
      }
    // onfomartedOrderNumber (orderNumber) {
    //   console.log('orderNumber'+ orderNumber)
    //   let fomartedOrderNumberA = [this.orderNumber.slice(0, 3), '-', this.orderNumber.slice(3)].join('')
    //   let fomartedOrderNumberB = [fomartedOrderNumberA.slice(0, 11), '-', fomartedOrderNumberA.slice(11)].join('')
    //   return fomartedOrderNumberB
    // }
    }
  }
</script>
