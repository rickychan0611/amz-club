// import store from '../store'
// import Vue from 'vue'
// import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

function formatDate (date) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  let current_datetime = new Date(date)
  let formatted_date =
current_datetime.getDate() + '-' +
months[current_datetime.getMonth()] + '-' +
current_datetime.getFullYear() + ' ' +
current_datetime.getHours() + ':' +
current_datetime.getMinutes()
// console.log(formatted_date)
  return formatted_date
// return date.toUTCString()
}

export { formatDate }
