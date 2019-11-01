import { ActionTree } from 'vuex'
import TYPES from './types'

const actions: ActionTree<any, any> = {
  // 获取modules
  setReceiveNewMessage({ state, commit }, flag: boolean): void {
    commit(TYPES.SET_RECEIVE_MESSAGE_STATUS, flag)
  }
}

export default actions
