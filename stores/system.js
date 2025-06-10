import {
	defineStore
} from 'pinia';

export const useSystemStore = defineStore('system', {
	state: () => {
		return {
			config: uni.getStorageSync('config') || null
		};
	},
	actions: {
		setConfig(config) {
			this.config = config;
		},
		async fetchConfig() {
		  try {
		    const res = await uni.$http.get('/index/config')
		    if (res.code === 1) {
			   this.config(res.data)
			   uni.setStorageSync('config', res.data)
			   console.log(res.data);
		      return res
		    } else {
		      return null
		    }
		  } catch (e) {
		    return null
		  }
		},
	},
	persist: {
		enabled: true
	}
});