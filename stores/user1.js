import {
	defineStore
} from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			userInfo: {
				id: 1
			},
			isLogin: false
		};
	},
	actions: {
		setUserInfo(data) {
			this.userInfo = data
		},
		setLoginStatus(data) {
			this.isLogin = data
		},
	},
	persist: {
		enabled: true
	}
});