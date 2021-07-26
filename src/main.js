import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'
// 安装toast插件
Vue.use(toast)
Vue.use(VueLazyLoad, {
  loading: require("assets/img/common/placeholder.png")
})

//解决移动端300ms延迟
FastClick.attach(document.body)

Vue.config.productionTip = false
//为了使用事件总线$bus
Vue.prototype.$bus = new Vue()
new Vue({
  router,
  store,
  toast,
  render: h => h(App)
}).$mount('#app')
