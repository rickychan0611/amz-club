import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
Vue.use(Vuex)
var vm = new Vue()

export default new Vuex.Store({
  state: {
    loadedProducts: [],
    user: {},
    // placedOrders: [],
    loading: false,
    error: '',
    today: '',
    // today: new Date(),
    // today: new Date("Wed Jan 17 2020 00:25:32 GMT-0800 (Pacific Standard Time)"),
    lockedSellers: [],
    facebookLoading: true,
    allBuyers: {}
  },

  mutations: {
    setAllBuyers (state, payload) {
      state.allBuyers = payload
      // //console.log('loadedProducts:' + JSON.stringify(payload))
    },
    setLoadedProducts (state, payload) {
      state.loadedProducts = payload
      // //console.log('loadedProducts:' + JSON.stringify(payload))
    },
    createProduct (state, payload) {
      state.loadedProducts.unshift(payload)
    },
    setUser (state, payload) {
      state.user = payload // 2.sent to state
      // console.log('xYYsetlellers:' + JSON.stringify(payload))
    },
    setLocked (state, payload) {
      state.user.lockedSellers = payload
      // console.log('xxxxsetlockedSellers:' + JSON.stringify(payload))
    },
    removeLocked (state, payload) {
      delete state.user.lockedSellers[payload]
    },
    setuserplacedOrders (state, payload) {
      state.user.placedOrders = payload
      // //console.log('setuserplacedOrders:' +  JSON.stringify(payload))
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = ''
    },
    addUserOrder (state, payload) {
      state.user.placedOrders = payload
      // //console.log('state.user: '+JSON.stringify(state.user))
    },
    setLastestReserveDate (state, payload) {
      state.user = payload
    },
    setDeletedOrder (state, payload) {
      state.user.placedOrders = payload
      //console.log('state.user: '+JSON.stringify(state.user))
    },
    setlockedSellers (state, payload) {
      state.lockedSellers = payload
    },
    setFacebookLoading (state, payload) {
      state.facebookLoading = payload
    },
    setCurrentTime (state, payload) {
      state.today = payload
    }
  },

  actions: {
    loadBuyers ({ commit, getters, state }, payload) {
      // firebase.database().ref('buyers').on('value', (data) => {
      //   let buyers = data.val()
      //   console.log(buyers)
      // })
    },
    placeOrder ({ commit, getters, state }, payload) {
      let dailyQuotaCounterUpOne = payload.dailyQuotaCounter + 1 // update dailycourt per click
      let latestReservedDate = new Date(payload.latestReservedDate)
      let resetCounter = 0
      const today = new Date(getters.today)
      let totalCounterUpOne = payload.totalCounter + 1
      let updatePlacedOrder = Object.assign({}, payload)
      updatePlacedOrder.userReserveDate = latestReservedDate.toString()
      updatePlacedOrder.latestReservedDate = latestReservedDate.toString()
      updatePlacedOrder.orderPlaced = false
      // updatePlacedOrder = [updatePlacedOrder]
      let updateProductDates = {}
      let existinglockedSellers = {}
      if (getters.user.lockedSellers) {
        existinglockedSellers = getters.user.lockedSellers
      }
      let newLockedSeller = {}
      newLockedSeller[payload.soldBy] = { 'lockedSeller': payload.soldBy }
      let productKey = payload.id
      let lockedSeller = payload.soldBy
      let updateLockedSeller = Object.assign(existinglockedSellers, newLockedSeller)
      // console.log('down ' + JSON.stringify(updateLockedSeller))

      firebase.database().ref('buyers/' + getters.user.id + '/placedOrders/' + productKey).update(updatePlacedOrder)
      firebase.database().ref('buyers/' + getters.user.id + '/lockedSellers/' + lockedSeller).update({ lockedSeller: payload.soldBy, 'takenProduct': payload.keywords })

      commit('setLocked', updateLockedSeller)

      // if dailyQuota meet, reset counter, totalcounter + 1, reserdate + 1
      if (payload.dailyQuota == dailyQuotaCounterUpOne) {
        updateProductDates = {
          'dailyQuotaCounter': 0,
          'totalCounter': totalCounterUpOne,
          'latestReservedDate': latestReservedDate.setDate(latestReservedDate.getDate() + 1)
        }
      }
      // if dailyQuota not meet, counter+1, totalcounter+1, reserdate stay
      if (payload.dailyQuota > dailyQuotaCounterUpOne) {
        updateProductDates = {
          'dailyQuotaCounter': dailyQuotaCounterUpOne,
          'totalCounter': totalCounterUpOne,
          'latestReservedDate': latestReservedDate
        }
      }
      // //console.log(JSON.stringify(updateProductDates))
      firebase.database().ref('products/' + payload.id + '/').update(updateProductDates)

      if (totalCounterUpOne == payload.totalQty) {
        firebase.database().ref('products/' + payload.id + '/').update({ 'activate': false })
      }
      vm.$forceUpdate()
      this.dispatch('initProducts')
      // firebase.database().ref('sellers/' + payload.sellerName +'/'+ payload.name+'/'+ getters.user.facebookName).set(payload)
    },
    BuyerListDelOrder ({ commit, getters }, order, userId) { // if any changes, change with delOrder
      console.log('BuyerListDelOrder RUN')
      // const toBeDelete = getters.user.placedOrders
      const objkey = order.name + '_' + order.sellerWechat
      const productId = order.name + '_' + order.sellerWechat
      firebase.database().ref('products/' + objkey).once('value', (dataB) => {
        const product = dataB.val()
        let latestReservedDate = new Date(product.latestReservedDate)
        // delete toBeDelete[objkey]
        let updateCounters = {}
        if (product.totalCounter > 0) {
          let totalCounter = product.totalCounter - 1
        }
        if (product.totalCounter < 0) {
          let totalCounter = 0
        }
        if (product.dailyQuotaCounter > 0) {
          let dailyQuotaCounter = product.dailyQuotaCounter - 1
        }
        if (product.dailyQuotaCounter < 0) {
          let dailyQuotaCounter = 0
        }
        if (product.dailyQuotaCounter == 0) {
          latestReservedDate = latestReservedDate.setDate(latestReservedDate.getDate() - 1)
          dailyQuotaCounter = product.dailyQuota - 1
          updateCounters = {
            'dailyQuotaCounter': dailyQuotaCounter,
            'latestReservedDate': latestReservedDate,
            'totalCounter': totalCounter
          }
          console.log('updateCounters' + updateCounters)
          firebase.database().ref('products/' + objkey).update(updateCounters)
        // this.dispatch('initProducts')
        } else {
          updateCounters = {
            'dailyQuotaCounter': dailyQuotaCounter,
            'totalCounter': totalCounter,
            'latestReservedDate': latestReservedDate
          }
          firebase.database().ref('products/' + objkey).update(updateCounters)

        // this.dispatch('initProducts')
        }
        // }//

        firebase.database().ref('buyers/' + order.userId + '/lockedSellers/' + order.soldBy).remove()
        // commit('setDeletedOrder', toBeDelete)
        // commit('removeLocked', order.soldBy)
        if (product.masterDeActive == false || product.masterDeActive == undefined) {
          firebase.database().ref('products/' + product.id + '/').update({ 'activate': true })
        }
      // this.dispatch('initProducts')
      })
      firebase.database().ref('buyers/' + order.userId + '/placedOrders/' + objkey).remove()
    },

    delOrder ({ commit, getters }, order, index) { // if any changes, change with BuyerListDelOrder
      const toBeDelete = getters.user.placedOrders
      const objkey = order.name + '_' + order.sellerWechat
      console.log('objkey' + objkey)
      const productId = order.name + '_' + order.sellerWechat
      delete toBeDelete[objkey]
      commit('setDeletedOrder', toBeDelete)
      //commit('setuserplacedOrders', toBeDelete)
      console.log('tooooooooooooooooooBeDelete' + JSON.stringify(toBeDelete))
      firebase.database().ref('products/' + objkey).once('value', (dataB) => {
        const product = dataB.val()
        // console.log('dsfdsfdsfsd' + JSON.stringify(product))
        let latestReservedDate = new Date(product.latestReservedDate)
        // console.log('latestReservedDate ' + latestReservedDate)

        let updateCounters = {}
        let dailyQuotaCounter = 0
        let totalCounter = 0
        if (product.totalCounter > 0) {
          totalCounter = product.totalCounter - 1
        }
        if (product.totalCounter <= 0) {
          totalCounter = 0
        }
        if (product.dailyQuotaCounter > 0) {
          dailyQuotaCounter = product.dailyQuotaCounter - 1
        }
        if (product.dailyQuotaCounter <= 0) {
          dailyQuotaCounter = 0
        }
        if (product.dailyQuotaCounter == 0) {
          latestReservedDate = latestReservedDate.setDate(latestReservedDate.getDate() - 1)
          dailyQuotaCounter = product.dailyQuota - 1
          updateCounters = {
            'dailyQuotaCounter': dailyQuotaCounter,
            'latestReservedDate': latestReservedDate,
            'totalCounter': totalCounter
          }
          firebase.database().ref('products/' + objkey).update(updateCounters)
          vm.$forceUpdate()
          //this.dispatch('initProducts')
        } else {
          // //console.log('xxxxxx'+ product.dailyQuotaCounter)
          updateCounters = {
            'dailyQuotaCounter': dailyQuotaCounter,
            'totalCounter': totalCounter,
            'latestReservedDate': latestReservedDate
          }
          // console.log('xxxxxx' + JSON.stringify(updateCounters))
          firebase.database().ref('products/' + objkey).update(updateCounters)
          vm.$forceUpdate()
          //this.dispatch('initProducts')
        }
        // }//
        firebase.database().ref('buyers/' + getters.user.id + '/placedOrders/'+ objkey).remove()
        // //console.log('updateCounters'+ productId + updateCounters)
        firebase.database().ref('buyers/' + getters.user.id + '/lockedSellers/' + order.soldBy).remove()

        commit('removeLocked', order.soldBy)
        if (product.masterDeActive == false || product.masterDeActive == undefined) {
          firebase.database().ref('products/' + product.id + '/').update({ 'activate': true })
        }
        vm.$forceUpdate()
        //this.dispatch('initProducts')
      })
    },

    initProducts ({ commit, state, getters }, payload) {
      commit('setLoading', true)
      if (payload) {
        commit('setUser', payload)
      }
      // setCurrentTime
      firebase.database().ref('currentTime/').update({ time: firebase.database.ServerValue.TIMESTAMP })
        .then(function (data) {
          firebase.database().ref('currentTime').once('value', (data) => {
            var t = data.val().time
            // console.log('server time: ', t)
            let currentTime = new Date(t)
            // currentTime = new Date('sep 8 2019 2:30:00 GMT-0700 (Pacific Daylight Time)'),
            commit('setCurrentTime', currentTime)
          })
        }).then(() => {
          firebase.database().ref('products').once('value', (data) => {
            const today = new Date(getters.today)
            const obj = data.val()
            // let resetDate = new Date()
            const dailyQuotaCounter = 0
            for (let key in obj) {
              const latestReservedDate = new Date(obj[key].latestReservedDate)
              let resetDate = new Date(obj[key].resetDate)
              // const overOneDay = today.getDate() - latestReservedDate.getDate()
              // console.log(obj[key].id + ': ' + overOneDay)
              // console.log('key' + JSON.stringify(obj[key].id))
              // if latestReservedDate earlier than today, set latestReservedDate = today
              if (obj[key].latestReservedDate == undefined || today.getDate() > latestReservedDate.getDate()) {
                // const latestReservedDate = { 'latestReservedDate': today.toString() }
                firebase.database().ref('products/' + obj[key].id).update({ 'latestReservedDate': today.toString() })
                //* *** resetDate is used to determine when to reset daily counter to 0.
                // if reset date is today or earily than today. set reset day to tomorrow, then set dailyCounter to 0 for today.
                // if reset date is tomorrow. do nothing.
              } else if (today.getDate() >= resetDate.getDate() || resetDate.getDate() == undefined) {
                resetDate = new Date(getters.today)
                resetDate.setDate(today.getDate() + 1)
                resetDate.setHours(0)
                resetDate.setMinutes(0)
                // console.log(resetDate)
                // const update = {}{'resetDate':resetDate}, {'dailyQuotaCounter':0}
                if (obj[key].id) {
                  firebase.database().ref('products/' + obj[key].id).update(
                    {
                      'resetDate': resetDate.toString(),
                      'latestReservedDate': today.toString(),
                      'dailyQuotaCounter': 0
                    }
                  )
                }
              }
              //* *** add activate key if doesn't have one
              if (obj[key].activate == undefined) {
                // console.log(obj[key])
                firebase.database().ref('products/' + obj[key].id).update({ 'activate': true })
              }
            }
          })
        })
        .then(() => {
          firebase.database().ref('products').on('value', (data) => {
            const today = new Date(getters.today)
            const products = []
            const obj = data.val()
            let isToday = true

            for (let key in obj) {
              const reservedDate = new Date(obj[key].latestReservedDate)
              //*  *** IS TODAY???
              //* * if latestReservedDate is today or eariler than today, set isToday = true. if not set fasle
              if (obj[key].latestReservedDate === '' ||
            reservedDate <= today ||
            obj[key].latestReservedDate === undefined) {
              // const formattedDate = formatDate(today)
                isToday = true
              // console.log('11111111' + products)
              }
              // if product IS reserved, can NOT buy today, set isTody=false
              else {
              // const formattedDate = formatDate(obj[key].latestReservedDate)
              // //console.log('formatted' + formatted)
                isToday = false
              // //console.log('products.isToday222222222' + products)
              }
              //* ** don't push is item is non-active
              if (obj[key].activate == true) {
                const todayObj = { 'isToday': isToday }
                const newObj = Object.assign(obj[key], todayObj)
                products.push(newObj)
              }
              // this part only to set if today = latestReservedDate
              // if product is NOT reserved, can be bought today, set isTody=true

              commit('setLoadedProducts', products)
              commit('setLoading', false)
            }
          }
          )
        }).then(() => {
          let buyerRef = ''
          let a = getters.user.facebookName
          // buyerRef = 'buyers/' + getters.user.id + '/placedOrders'
          firebase.database().ref('buyers/' + getters.user.id + '/placedOrders').on('value', (data) => {
            const placedOrders = data.val()
            if (placedOrders) {
              commit('setuserplacedOrders', placedOrders)
            }
          })
        }).then(() => {
          firebase.database().ref('buyers/' + getters.user.id + '/lockedSellers').once('value', (data) => {
            const lockedSellers = data.val()
            commit('setlockedSellers', lockedSellers)
            // console.log('setlockedSellers', JSON.stringify(lockedSellers))
          })
        })

        .catch(
          (error) => {
            // console.log(error)
            commit('setLoading', false)
          }
        )
    },

    createProduct ({ commit }, payload) {
      const key = payload.name + '_' + payload.sellerWechat
      firebase.database().ref('products/' + key + '/').update(payload) // push to firebase
        .then((data) => {
          // //console.log('createproduct@@@' + JSON.stringify(payload))
          // const key = payload.name + '_' + data.key
          // commit('createProduct', { id: key })
          // return key // to mutation with payload
        })
      // .then((key) => { firebase.database().ref('products/' + key).update({ 'id': key }) })
        .catch((error) => {
          // console.log(error)
        })
    },
    noUser ({ commit }, payload) {
      // console.log('nouser' + JSON.stringify(payload))
      commit('setUser', payload)
    },
    signinFB ({ commit, getters }) {
      commit('setFacebookLoading', true)
    },
    fbSignUp ({ commit, getters }, payload) {
      commit('setUser', payload)
      firebase.database().ref('buyers/' + payload.id + '/').update(payload)
    },
    register ({ commit, getters }, payload) {
      // const registerUser = Object.assign(payload, getters.user)
      // console.log(payload)
      commit('setUser', payload)
      firebase.database().ref('buyers/' + payload.id + '/').update(payload)
    },
    signUserUp ({ commit, getters }, payload) {
      commit('setLoading', true) // commit to mutation setloading with payload = true
      commit('clearError')
      console.log(payload)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(respond => {
          console.log('respong?')
          const newUser = { id: respond.user.uid }
          const newUserData = Object.assign(newUser, payload)
          commit('setUser', newUserData)
          firebase.database().ref('buyers/' + newUser.id).update(newUserData)
          return firebase.database().ref('buyers/' + newUser.id).once('value')// earch userData 1st
        })
        .then(respond => {
          // //console.log('run22?' + JSON.stringify(respond))
          const temp = Object.keys(respond.val()) // return an array
          const userKey = temp[0]
          const newUserData = getters.user
          // newUserData.userKey = userKey
          // console.log('userkey ' + userKey)
          // console.log('data.val: ' + getters.user)
          commit('setUser', newUserData)
          commit('setLoading', false) // not loading anymore, commit to mutation setloading with payload = false
          // //console.log('data.val: '+JSON.stringify(newUserData))
          return firebase.database().ref('buyers/' + getters.user.id + '/').update(newUserData)
        })
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error.message)
            // //console.log(error.message)
          }
        )
    },
    signUserIn ({ commit, getters }, payload) {
      console.log('xxxxxxxxxxxxxxxxxxxxxxx')
      commit('setLoading', true) // commit to mutation setloading with payload = true
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(respond => {
          console.log('respond' + respond.user.uid)
          return firebase.database().ref('buyers/' + respond.user.uid).once('value')
        })
        .then(data => {
          const today = new Date(getters.today)
          const dataKey = Object.keys(data.val())
          const newUserData = data.val()
          dispatch('autoSignIn', newUserData)
          // newUserData.userKey = dataKey[0]
          // newUserData.displayName = payload.displayName
          // newUserData.email = payload.email
          // newUserData.photoURL = payload.photoURL
          // newUserData.password = payload.uid
          console.log('data.val: ' + JSON.stringify(newUserData))
          commit('setUser', newUserData) // 1.sent to mutations
          commit('setLoading', false) // not loading anymore, commit to mutation setloading with payload = false

          for (let i in getters.user.placedOrders) {
            const userReserveDateCheck = new Date(getters.user.placedOrders[i].userReserveDate)
            if (userReserveDateCheck.getDate() < today.getDate()) {
              // console.log('userReserveDateCheck' + getters.user.placedOrders[i].userReserveDates)
              // console.log('index ' + i)

              this.dispatch('delOrder', i) // del item from myorders
            }
          }
        })
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error.message)
            // //console.log(error.message)
          }
        )
    },
    submitReview ({ commit, getters }, payload) {
      // console.log('submitReview' + JSON.stringify(payload.name))
      let addReferral = payload
      addReferral.referral = getters.user.referral
      console.log('rrrrrrrrrrrrrrr' + addReferral)
      firebase.database().ref('buyers/' + getters.user.id + '/placedOrders/' + payload.index + '/').update(payload)
    },
    enterOrderNumber ({ commit, getters }, payload) {
    // let lockedSeller = getters.user.lockedSellers
    // delete lockedSeller.payload.soldBy
    // commit('setlockedSellers', lockedSeller)
      firebase.database().ref('buyers/' + getters.user.id +
    '/placedOrders/' + payload.id + '/').update(payload)
      // firebase.database().ref('buyers/'  + this.$store.getters.user.id + '/lockedSellers/' + this.product.soldBy).remove()
      firebase.database().ref('sellers/' + payload.sellerWechat + '/' + payload.name + '/' + getters.user.facebookName).update(payload)
    },
    clearError ({ commit }) {
      commit('clearError')
    },
    stopfacebookLoading ({ commit }, payload) {
      commit('setFacebookLoading', payload)
    },

    autoSignIn ({ commit, getters }, payload) {
      commit('setLoading', true)
      commit('setFacebookLoading', false)
      commit('setUser', payload)
      // console.log('autoSignIn')
      firebase.database().ref('buyers/' + payload.id).update(payload).then(() => {})
      firebase.database().ref('buyers/' + payload.id).on('value', (user) => {
        const today = new Date(getters.today)

        commit('setLoading', false)
        commit('setFacebookLoading', false)
        for (let i in getters.user.placedOrders) {
          const userReserveDateCheck = new Date(getters.user.placedOrders[i].userReserveDate)
          if (parseInt(userReserveDateCheck.getDate()) < parseInt(today.getDate())) {
            // console.log('userReserveDateCheck' + getters.user.placedOrders[i].userReserveDates)
            // console.log('index ' + i)

            this.dispatch('delOrder', i) // del item from myorders
          }
        }
      // this.$router.go() // not loading anymore, commit to mutation setloading with payload = false
      }
      )
      // .catch(
      //   error => {
      //     commit('setLoading', false)
      //     commit('setError', error.message)
      //     ////console.log(error.message)
      //   }
      // )
    },
    logout ({ commit }) {
      // FB.logout(function (response) {
      //   // Person is now logged out
      // })
      firebase.auth().signOut()
        .then(function () {
          // console.log('Sign out ed!')
          sessionStorage.clear()
        }, function (error) {
          // console.log('Signout failed')
        })
      commit('setUser', ' ')
    }
  },
  setProfile ({ commit }, payload) {
  // commit('setUser', payload)
  // //console.log('setProfile:' +  JSON.stringify(payload))
  // firebase.database().ref('buyers/' + getters.user.id).update(payload)
  },

  getters: {
    sortedProducts (state) {
      return state.loadedProducts.sort((meetupA, meetupB) => {
        // console.log("a:"+new Date(meetupA.createDate) + "b:" + new Date(meetupB.createDate))
        return new Date(meetupB.createDate) - new Date(meetupA.createDate)
      })
    },
    loadedProducts (state, getters) {
      let newArr = []
      // console.log('hello')
      const today = new Date(getters.today)
      // //console.log("getters.sortedProducts" + getters.sortedProducts)
      let filteredProducts = getters.sortedProducts

      for (let i in getters.sortedProducts) {
      // //console.log(i)
      // //console.log('state.loadedProducts:' + getters.sortedProducts[i].id)
        for (let j in state.user.placedOrders) {
        // find same id then userReserveDate
          if (getters.sortedProducts[i].id == state.user.placedOrders[j].id) {
            const userReserveDateCheck = new Date(state.user.placedOrders[j].userReserveDate)
            // //console.log('left'+ userReserveDateCheck+ ' right'+ state.today)

            if (userReserveDateCheck.getDate() >= today.getDate()) { // expired item stay in array
              filteredProducts.splice(i, 1)
            }
          }
        }
      }
      for (let k in filteredProducts) {
        if (filteredProducts[k].totalCounter == filteredProducts[k].totalQty) {
          filteredProducts.splice(k, 1)
        }
      }
      // if (getters.user.lockedSellers){
      //   let newArry = []
      //   for (let n in getters.user.lockedSellers){
      //     for (let m in filteredProducts) {
      //       if (filteredProducts[m].soldBy != getters.user.lockedSellers[n]['lockedSeller']) {
      //         //console.log (filteredProducts[m].soldBy +":"+ JSON.stringify(getters.user.lockedSellers[n]['lockedSeller']))
      //         newArry.push(filteredProducts[m])
      //       }
      //     }
      //   }
      //
      //   return newArry
      // }
      vm.$forceUpdate()
      return filteredProducts
    },

    loadedProduct (state) {
      return (productId) => {
        return state.loadedProducts.find((product) => {
          return product.id === productId
        })
      }
    },
    user (state) {
      return state.user // 3. send to getters everywhere
    },
    userPlacedOrders (state) {
      let array = []
      // sort the array
      for (let i in state.user.placedOrders) {
        array.push(state.user.placedOrders[i])
      }
      return array.sort((a, b) => {
        return new Date(b.userReserveDate) - new Date(a.userReserveDate)
      })
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    today (state) {
      return state.today
    },
    facebookLoading (state) {
      return state.facebookLoading
    },
    allBuyers (state) {
      return state.allBuyers
    },
    lockedSellers (state) {
      return state.lockedSellers
    },
    selling (state) {
      return state.loadedProducts
    }
  // resetTodayCounter (state) {
  //   return state.resetTodayCounter
  // }
  }
})
