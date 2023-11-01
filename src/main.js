import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont'
import '@/assets/css/global.css'
import {http, http_wang, http_vis, http_zyq, http_jbw} from './axios.js'
import VueClipboard from 'vue-clipboard2'
import './assets/icons/iconfont'
import * as echarts from 'echarts';
import JsonViewer from 'vue-json-viewer'
import Network from  "vue2vis/src/components/Network";
import {alert_msg, login_manager} from './global.js'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css' 
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})
Vue.use(Element)
Vue.use(VueClipboard)
Vue.use(JsonViewer)
Vue.use(Network)
Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.prototype.$http_wang = http_wang
Vue.prototype.$http_vis = http_vis
Vue.prototype.$http_zyq = http_zyq
Vue.prototype.$http_jbw = http_jbw
Vue.prototype.$echarts = echarts
Vue.prototype.alert_msg = alert_msg;
Vue.prototype.login_manager = login_manager;
Vue.prototype.$bus = new Vue() // 总线

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

