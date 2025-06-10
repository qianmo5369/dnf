import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// 插件 & 样式
// import TnUI from '@tuniao/tnui-vue3-uniapp'
// import '@tuniao/tn-style/dist/uniapp/index.css'
// import '@tuniao/tn-icon/dist/index.css'


// #ifdef VUE3
import { createSSRApp } from 'vue'
import httpPlugin from '@/util/request'
import * as Pinia from 'pinia';
export function createApp() {
	const pinia = Pinia.createPinia()
  const app = createSSRApp(App)
  
  app.config.globalProperties.$toast = function(title) {
  	uni.showToast({
  		title: title,
  		icon: 'none'
  	})
  }
  // app.use(TnUI)
  app.use(pinia)
  app.use(httpPlugin) // 注册 http 插件
  return {
    app
  }
}
// #endif