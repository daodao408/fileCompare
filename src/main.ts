// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUi from 'element-ui'
import iView from 'iview'
import uploader from 'vue-simple-uploader'
import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-chalk/index.css'
import './sass/default.scss'
import './sass/common.scss'
// 引入图标库
import './sass/icons/iconfont.css'
import './sass/icons/iconfont.js'
// 自定义window上的参数
import './typings/ts-declare'

Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.use(iView)
Vue.use(uploader)

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  data: {
    eventHub: new Vue()
  },
  components: { App },
  methods: {}
})

window.vm = vm
