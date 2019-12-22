import store from '../store'
import Vue from 'vue'
import Vuex from 'vuex'

export default (to, from, next) => {
  if (store.getters.user.id) {
    next()
  } else {
    next('/')
  }
}
