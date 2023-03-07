import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont'
import '@/assets/css/global.css'
import http from './axios.js'
import VueClipboard from 'vue-clipboard2'

Vue.use(Element)
Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.prototype.$http = http

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
