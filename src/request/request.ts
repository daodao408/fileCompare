import axios from 'axios'
import router from '../router'
// import store from '../store/store'
import { Message } from 'element-ui'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API // api的base_url
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // get请求添加当前时间的时间戳避免IE出现请求缓存的情况
    if (config.method === 'get') {
      let dateNowStr: any = new Date()
      config.params = {
        _t: dateNowStr.getTime(),
        ...config.params
      }
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // if (!store.state.isLogin) {
      //   store.commit('LoginIn')
      //   // _login()
      // }
      router.push({
        path: '/'
      })
      // router.currentRoute.path !== 'login' &&
      //   router.replace({
      //     path: 'login'
      //   })
      return Promise.reject(error)
    } else if (error.response.status === 500) {
      Message({
        message: '接口请求异常,请联系管理员',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    console.log('err' + error) // for debug
    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
