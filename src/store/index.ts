import Vue from 'vue'
import Vuex, { ActionTree, MutationTree } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

interface State {
  receiveMessage: boolean
}

let state: State = {
  receiveMessage: false
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
})
