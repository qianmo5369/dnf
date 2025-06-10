import {
	baseUrl
} from "../env";
import Request from '@/js_sdk/luch-request/luch-request/index.js' // 下载的插件
import { useUserStore } from '@/stores/user'
// 创建实例
const http = new Request({
  baseURL: baseUrl, // 修改为你的地址
  timeout: 10000,
  custom: {
    auth: true // 自定义字段示例
  }
})

// 请求拦截器
http.interceptors.request.use((config) => {
	const userStore = useUserStore()
	if (userStore.token) {
	    config.header.token = userStore.token
	  }
  // const token = uni.getStorageSync('token')
  // if (token && config.custom?.auth) {
  //   config.header.token = token
  // }
  uni.showLoading({
  	title: '加载中...'
  })
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
http.interceptors.response.use((response) => {
  // 业务成功码
  uni.hideLoading()
  if (response.data.code === 1 || response.data.code === 200) {
    return response.data;
  } else {
    uni.showToast({
      title: response.data.msg || '请求错误',
      icon: 'none'
    })
    return Promise.reject(response.data)
  }
}, (error) => {
  console.log(error.statusCode);
  
  if (error.statusCode == 401) {
  	  uni.showToast({
  	    title: '请先登录',
  	    icon: 'none'
  	  })
	  
	  const userStore = useUserStore()
	      userStore.logout()
	  
  	 uni.reLaunch({ url: '/pages/login/login' })
  }else{
	  uni.showToast({
	    title: '网络异常',
	    icon: 'none'
	  })
  }
 
  
  // uni.hideLoading()
  return Promise.reject(error)
})


const plugin = {
  install(app) {
    app.config.globalProperties.$http = http
    uni.$http = http // 让 setup 中也能使用
  }
}

// 👉 重点：同时导出插件和 http 实例
export {
  http
}
export default plugin

// const test = {}
// export default test

// export default {
//   install(app) {
//     app.config.globalProperties.$http = http
//   }
// }