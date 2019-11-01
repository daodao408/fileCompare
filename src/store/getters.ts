import { GetterTree } from 'vuex'

const getters: GetterTree<any, any> = {
  isReceiveNewMessage(state): boolean {
    return state.receiveMessage
  }
}

export default getters
