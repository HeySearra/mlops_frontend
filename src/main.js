import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont'
import '@/assets/css/global.css'
import {http,http_wang, http_vis} from './axios.js'
import VueClipboard from 'vue-clipboard2'
import './assets/icons/iconfont'
import * as echarts from 'echarts';
import JsonViewer from 'vue-json-viewer'
import Network from  "vue2vis/src/components/Network";

Vue.use(Element)
Vue.use(VueClipboard)
Vue.use(JsonViewer)
Vue.use(Network)
Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$http_wang = http_wang
Vue.prototype.$http_vis = http_vis
Vue.prototype.$echarts = echarts
Vue.prototype.$bus = new Vue() // 总线

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

