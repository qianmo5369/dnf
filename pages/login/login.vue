<template>
	<view class="login-page">
		<view class="login-box">
			<text class="login-title">欢迎登录</text>


			<input class="input" v-model="phone" placeholder="请输入账号" />
			<view v-if="loginType === 'account'">
				<input class="input" v-model="password" placeholder="请输入密码" password />
			</view>

			<view v-else>
				<view class="input-wrapper">
					<input class="input full" placeholder="请输入验证码" />
					<text class="send-code-text" :class="{ disabled: countdown > 0 }" @click="sendCode">
						{{ countdown > 0 ? countdown + 's后重试' : '发送验证码' }}
					</text>
				</view>
			</view>

			<button class="login-btn" @click="handleLogin">登录</button>
		

			<view class="login-switch">
				<text :class="{ active: loginType === 'account' }" v-if="loginType === 'account'"
					@click="loginType = 'code'">验证码登录</text>
				<text :class="{ active: loginType === 'code' }" v-else @click="loginType = 'account'">账号密码登录</text>
			</view>

			<view class="agreement-check">
				<radio :checked="isChecked" style="transform: scale(.7);" @click="isChecked = !isChecked"></radio>
				<!-- <checkbox :checked="isChecked" @click="isChecked = !isChecked" class="checkbox" /> -->
				<view class="agreement-text">
					登录即代表您已同意 <text class="link">《用户协议》</text> 和 <text class="link">《隐私政策》</text>
				</view>
			</view>

			<view class="wechat-login" @click="mpLogin">
				<image src="https://dnf.hanyunkeji.cn/static/wechat_login.png" class="wechat-icon" />
				<text class="wechat-text">微信一键登录</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	// import { showToast } from '@dcloudio/uni-ui'
	import {
		useUserStore
	} from '@/stores/user'
	const loginType = ref('account')
	const countdown = ref(0)
	const isChecked = ref(true)
	const phone = ref('')
	const password = ref('')
	const code = ref('')
	let timer = null;

	const sendCode = async () => {
		if (countdown.value > 0) {
			return;
		}
		if (!phone.value) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}

		const res = await uni.$http.post('/sms/send', {
			mobile: phone.value,
			event: 'mobilelogin'
		})

		if (res.code === 1) {
			countdown.value = 60;
			// timer = setInterval(() => {
			// 	countdown.value--
			// 	if (countdown.value <= 0) clearInterval(timer)
			// }, 1000)
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}

	}


	const handleLogin = async () => {
		if (!isChecked.value) {
			uni.showToast({
				title: '请先勾选同意协议',
				icon: 'none'
			})
			return
		}

		if (!phone.value) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return;
		}
		if (loginType.value === 'code') {
			if (!code.value) {
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				})
				return
			}
		} else {
			if (!password.value) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none'
				})
				return
			}
		}

		if (loginType.value == 'code') {
			var res = await uni.$http.post('/user/mobilelogin', {
				mobile: phone.value,
				captcha: code.value,
				share_uid: uni.getStorageSync('share_uid')
			})
		} else {
			var res = await uni.$http.post('/user/login', {
				account: phone.value,
				password: password.value,
				share_uid: uni.getStorageSync('share_uid')
			})
		}

		if (res.code === 1) {
			uni.setStorageSync('token', res.data.userinfo.token);

			const token = res.data.userinfo.token
			const userStore = useUserStore()
			userStore.setToken(token)
			await userStore.fetchUserInfo()
			uni.reLaunch({
				url: '/pages/index/index'
			})

			// uni.showToast({
			// 	title: res.msg,
			// 	icon: 'none'
			// })
			uni.reLaunch({
				url: '/pages/index/index'
			})
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}
	
	
	const mpLogin =  () => {
		uni.login({
			success:  async (loginRes) => {
				const res = await uni.$http.post('/user/wechatLogin', {
					'code': loginRes.code,
					'anonymousCode': loginRes.anonymousCode,
				})
	
	
				if (res.code === 1) {
					uni.setStorageSync('token', res.data.userinfo.token);
	
					const token = res.data.userinfo.token
					const userStore = useUserStore()
					userStore.setToken(token)
					await userStore.fetchUserInfo()
					uni.reLaunch({
						url: '/pages/index/index'
					})
	
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			}
		})
	}
</script>

<style scoped>
	.login-page {
		background: #ffffff;
		padding: 120rpx 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-box {
		width: 100%;
		max-width: 640rpx;
		display: flex;
		flex-direction: column;
		background: #fff;
		border-radius: 24rpx;
		padding: 60rpx 30rpx;
		/* box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05); */
	}

	.login-title {
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 50rpx;
		color: #222;
		text-align: left;
		margin-top: 120rpx;

	}

	.input {
		width: 100%;
		background: #f5f7fa;
		height: 90rpx;
		border-radius: 60rpx;
		padding: 20rpx 24rpx;
		font-size: 26rpx;
		margin-bottom: 50rpx;
	}

	.input-wrapper {
		position: relative;
		margin-bottom: 20rpx;
	}

	.input.full {
		width: 100%;
		padding-right: 160rpx;
	}

	.send-code-text {
		position: absolute;
		right: 24rpx;
		top: 50%;
		transform: translateY(-50%);
		color: #1677ff;
		font-size: 24rpx;
	}

	.send-code-text.disabled {
		color: #ccc;
	}

	.login-btn {
		width: 100%;
		background: #1677ff;
		color: #fff;
		font-size: 28rpx;
		border-radius: 10rpx;
		padding: 5rpx 0;
		margin-top: 70rpx;
		margin-bottom: 12rpx;
	}

	.login-switch {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30rpx 0;
		font-size: 26rpx;
		color: #999;
	}

	.login-switch .active {
		color: #1677ff;
		font-weight: bold;
	}

	.divider {
		margin: 0 16rpx;
		color: #ccc;
	}

	.agreement-check {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #999;
		margin-bottom: 40rpx;
		text-align: center;
		gap: 12rpx;
	}

	.checkbox {
		transform: scale(0.8);
		border-radius: 50%;
		background-color: #fff;
		border: 2rpx solid #ccc;
		width: 32rpx;
		height: 32rpx;
	}

	.link {
		color: #1677ff;
	}

	.wechat-login {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 20rpx;
	}

	.wechat-icon {
		width: 72rpx;
		height: 72rpx;
		margin-bottom: 8rpx;
	}

	.wechat-text {
		font-size: 22rpx;
		color: #888;
	}
</style>