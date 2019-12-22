<template>
  <v-container>
    <v-layout
      align-start
      justify-space-between
    >
      <v-flex xs10>
        <h1 class="font-weight-thin">
          Rebate listing
        </h1>
      </v-flex>
      <v-flex xs2>
        <v-btn
          color="info"
          href="http://www.paypal.com"
          target="_blank"
        >
          Paypal
        </v-btn>
        <v-btn
          class="ml-4"
          color="info"
          href="http://www.simplii.com"
          target="_blank"
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
                orderNumber
              </th>
              <th scope="col">
                product
              </th>
              <th scope="col">
                rebate
              </th>
              <th scope="col">
                sellerWechat
              </th>
              <th scope="col">
                refundImg
              </th>
              <th scope="col">
                submit
              </th>
            </tr>
          </thead>
          <tbody
            v-for="(item, index) in this.rebateList"
            :key="index"
          >
            <tr>
              <td>{{ item.buyer }}</td>
              <td>{{ item.orderNumber }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.rebate }}</td>
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
                  fab
                  @click="onSubmit"
                >
                  ok
                </v-btn>
              </td>
            </tr>
          <!-- <tr v-if="!item.disable">

            <td><button @click="onSave(item); item.disable=true" v-if="!item.disable" >Save</button>
                <button @click="onSave(item)" v-if="item.disable" ></button>
            </td>
            <td><input type="text" v-model="item.name" style="width:200px" class="edit_input"></input></td>
            <td><input type="text" v-model="item.listPrice" style="width:30px" class="edit_input"></input></td>
            <td><input type="text" v-model="item.rebate" style="width:20px" class="edit_input"></input></td>
            <td><input type="text" v-model="item.dailyQuota" style="width:20px" class="edit_input"></input></td>
            <td><input type="text" v-model="item.dailyQuotaCounter" style="width:20px" class="edit_input"></input></td>
            <td><input type="text" v-model="item.totalQty" style="width:20px" class="edit_input"></input></td>
            <td><input type="text" v-model="item.totalCounter" style="width:20px" class="edit_input"></input></td>
            <td><input type="text" v-model="item.latestReservedDate" style="width:100px" class="edit_input"></input></td>
            <td><input type="text" v-model="item.sellerName" style="width:100px" class="edit_input"></input></td>

          </tr> -->
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
        rebateArr: []
      }
    },
    computed: {
      rebateList () {
        return this.rebateArr
      }
    },
    created () {
      firebase.database().ref('sellers').on('value', (data) => {
        // this.obj = []
        this.rebateArr = []
        const obj = data.val()
        for (let i in obj) {
          for (let j in obj[i]) {
            for (let k in obj[i][j]) {
              // console.log("b: " + JSON.stringify(obj[i][j][k].refundImg))
              if (obj[i][j][k].refundImg) {
                this.rebateArr.push(obj[i][j][k])
                console.log('rebate: ' + JSON.stringify(this.rebateArr))
              }
            }
          }
        }
      })
    },
    methods: {
      onSave (item) {
        this.edit = !this.edit
        // this.$store.dispatch('createProduct', this.obj)
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
</style>
