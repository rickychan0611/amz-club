import store from '../store'
import Vue from 'vue'
import Vuex from 'vuex'

export default (to, from, next) => {
  if (store.getters.user.id) {
    // Multiply by 1000 because JS works in milliseconds instead of the UNIX seconds
    // var date = new Date(Date.now())
    //
    // var year = date.getUTCFullYear()
    // var month = date.getUTCMonth() + 1  // getMonth() is zero-indexed, so we'll increment to get the correct month number
    // var day = date.getUTCDate()
    // var hours = date.getUTCHours()
    // var minutes = date.getUTCMinutes()
    // var seconds = date.getUTCSeconds()
    //
    // month = (month < 10) ? '0' + month : month
    // day = (day < 10) ? '0' + day : day
    // hours = (hours < 10) ? '0' + hours : hours
    // minutes = (minutes < 10) ? '0' + minutes : minutes
    // seconds = (seconds < 10) ? '0' + seconds: seconds
    //
    // console.log( year + '-' + month + '-' + day + ' ' + hours + ':' + minutes)
    store.dispatch('initProducts')
    //     console.log(Date.now())
    next()
  } else {
    // store.dispatch('loadProducts')
    next('/signin')
  }
}
