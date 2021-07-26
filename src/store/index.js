import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)
const state = {
  cartList: []
}
export default new Vuex.Store({
  state,
  //mutations唯一的目的就是修改state中的状态
  mutations,
  actions,
  getters,
  modules: {
  }
})
