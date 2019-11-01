import TYPES from './types'
import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
  [TYPES.SET_RECEIVE_MESSAGE_STATUS](state, flag): void {
    state.receiveMessage = flag
  }
}
export default mutations
