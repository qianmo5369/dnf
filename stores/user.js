import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('user_info') || null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.userInfo
  },

  actions: {
    setToken(token) {
      this.token = token
      uni.setStorageSync('token', token)
    },

    setUserInfo(info) {
      this.userInfo = info
      uni.setStorageSync('user_info', info)
    },

    async fetchUserInfo() {
      try {
        const res = await uni.$http.get('/user/getUserInfo',{},{
						custom: {
							loading: false,
						}
					})
        if (res.code === 1) {
          this.setUserInfo(res.data)
          return res
        } else {
          this.logout()
          return null
        }
      } catch (e) {
        this.logout()
        return null
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
      uni.removeStorageSync('user_info')
    }
  }
})
