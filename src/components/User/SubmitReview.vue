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
        max-width="600"
      >
        <v-card>
          <v-card-title class="headline">
            Thank you for submitting your review!
          </v-card-title>
          <v-card-text class="subtitle-1 black--text">
            Your rebate will be sent to your bank account by e-transfer in 1 - 4 business days. Thank you.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1 white--text"
              @click="dialog = false, $router.push('/myOrders')"
            >
              Done
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="questionBox"
        persistent
        max-width="500"
      >
        <v-card>
          <v-card-title class="headline">
            You can get the link to your review by clicking the title of your review in your browser.
          </v-card-title>
          <v-card-text>
            <img
              contain
              width="450"
              src="https://firebasestorage.googleapis.com/v0/b/amzr-b7fd2.appspot.com/o/amazon%2FDirect-Link-to-Your-Amazon-Review-IV.jpg?alt=media&token=b95cfbb4-4d80-4c12-9af0-ff8e15de83f9"
            >
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green darken-1"
              @click="questionBox = false"
            >
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <h1 class="font-weight-thin pl-1 mb-0">
      Submitting Review
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
            Enter Review's URL
            <v-btn
              text
              icon
              small
              color="orange"
              @click="onQuestion"
            >
              <v-icon>mdi-comment-question-outline</v-icon>
            </v-btn>
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
                  v-model="reviewUrl"
                  name="Review URL"
                  label="Review URL"
                  :rules="[rules.required]"
                  outlined
                  clearable
                  mb-0
                  :value="product.reviewUrl"
                />
              </v-flex>
            </v-layout>
          </v-container>
          <!-- <hr /> -->

          <!-- <div class="headline mt-4 ">Step 3: </div>
      <div class="title my-1 ">Upload a screenshot of your order details</div>
      <v-container text-xs-center class="">
      <v-layout row justify-center>
      <v-flex xs12 sm6>
      <v-btn class="info" @click="onPickFile()">
      <v-icon>mdi-file-upload-outline</v-icon>Upload</v-btn>
      <input style="display:none"
      type="File" id="upload"
      accept="image/*"
      @change="onFilePicked($event, product)">
    </input>
  </v-flex>
</v-layout>

<v-progress-linear v-if="fileLoaded"
color="deep-purple accent-4"
indeterminate
rounded
height="6"
></v-progress-linear>
<v-img v-if="this.orderImgUrl" :src="this.orderImgUrl" height="200px" contain></v-img>

</v-container> -->

          <v-btn
            class="success mb-4 mt-0 white--text"
            type="submit"
            :disabled="!formIsValid"
            rounded
            large
            @click.prevent="onPlaceOrder"
          >
            Submit Your Review
          </v-btn>
          <hr>
          <v-btn
            class="blue my-4"
            dark
            small
            rounded
            @click="$router.go(-1)"
          >
            <v-icon>mdi-arrow-back</v-icon>Go Back
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
    // mask,
    },
    props: ['id'],
    props: ['index'],
    data () {
      return {
        reviewUrl: '',
        // mask: 'https://',
        orderNumber: '',
        rules: {
          required: value => !!value || 'Required.'
        // counter: value => value.length <= 17 || '17 numbers'
        },
        dialog: false,
        questionBox: false,
        reviewed: false,
        orderImgUrl: '',
        fileLoaded: false,
        filePicked: false
      }
    },
    computed: {
      product () {
        return this.$store.getters.user.placedOrders[this.index]
      // find the singal product with this.id from props from getter in state
      },
      formIsValid () {
        if (this.reviewUrl) {
          return true
        } else {
          return false
        }
      }
    }, // pass id from rounter clicked the buy button. for details, look at youtube video #9
    created () {
      this.reviewUrl = this.product.reviewUrl
    },
    methods: {
      onQuestion () {
        this.questionBox = true
      },
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
          'reviewUrl': this.reviewUrl,
          reviewDate: this.$store.getters.today,
          reviewPlaced: true
        }

        let newOrderData = Object.assign(this.product, newnewOrder)
        this.$store.dispatch('enterOrderNumber', newOrderData)
        firebase.database().ref('buyers/' + this.$store.getters.user.id + '/lockedSellers/' + this.product.soldBy).remove()
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
                this.orderImgUrl = downloadURL
                firebase.database().ref('sellers/' + item.sellerWechat + '/' + item.name + '/' + item.buyer).update({ 'orderImgUrl': downloadURL })
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
