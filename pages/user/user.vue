<template>
	<view class="profile-page">
		<fui-dialog :show="dialogShow" :content="system.config.email" title="请发送邮箱至" confirmText="复制邮箱" maskClosable @click="onClick"
			></fui-dialog>
		<!-- 顶部信息区域 -->
		<view class="profile-header">
			<template v-if="userStore.isLoggedIn">
				<TnAvatar :url="userStore.userInfo.avatar" size="xl" type="primary" />
				<view class="profile-info">
					<text class="nickname">{{userStore.userInfo.nickname}}</text>
					<view class="userid">
						编号：{{userStore.userInfo.id}}
						<TnIcon name="copy" @tap="copy(userStore.userInfo.id)" />
						<!-- <image class="copy-icon" src="https://dnf.hanyunkeji.cn/static/icon-copy.png" /> -->
					</view>
				</view>
				<TnIcon name="set" size="45" @tap="linkTo('/pages/user/setting')" />
			</template>

			<template v-else>
				<TnAvatar size="xl" url="https://dnf.hanyunkeji.cn/static/user/10.png"
					@click="linkTo('/pages/login/login')" />
				<view class="profile-info" @click="linkTo('/pages/login/login')">
					<text class="nickname">未登录用户</text>
					<view class="userid">
						请先登录以使用全部功能
					</view>
				</view>
			</template>
		</view>

		<!-- 余额卡片 -->
		<view class="balance-card">
			<view class="balance-item" @click="linkTo('/pages/user/balance')">
				<image src="https://dnf.hanyunkeji.cn/static/user/icon-money1.png" class="balance-icon" />
				<text class="balance-text">余额：¥{{userStore.userInfo.balance}}</text>
			</view>
			<view class="balance-item" @click="linkTo('/pages/user/deposit')">
				<image src="https://dnf.hanyunkeji.cn/static/user/icon-coin.png" class="balance-icon" />
				<text class="balance-text">助战币：{{userStore.userInfo.sum_coin}}</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-list">
			<view class="menu-item" v-for="(item, index) in menus" :key="index" @click="linkTo(item.path,item.type)">
				<image :src="item.icon" class="menu-icon" />
				<text class="menu-text">{{ item.text }}</text>
				<image class="arrow-icon" src="https://dnf.hanyunkeji.cn/static/user/09.png" />
			</view>
		</view>

		<!-- 客服按钮 -->
		<!-- <view class="service-btn">
      <image src="https://dnf.hanyunkeji.cn/static/kefu.png" class="kefu-img" />
      <view class="kefu-tag">客服</view>
    </view> -->

		<button class="top-kefu" open-type="contact">
			客服
		</button>

		<!-- 留空占位的群 banner -->
		<!-- <view class="group-banner">
      <image src="https://dnf.hanyunkeji.cn/static/group-placeholder.png" mode="widthFix" />
    </view> -->
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import fuiDialog from "@/components/fui-dialog.vue"
	import {
		useUserStore
	} from '@/stores/user'
	import {
		useSystemStore
	} from '@/stores/system'
	const dialogShow = ref(false)
	const system = useSystemStore()
	// console.log(system.config.email);
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app'
		import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'
	const menus = [{
			text: '组队记录',
			icon: 'https://dnf.hanyunkeji.cn/static/user/01.png',
			path: "/pages/user/team-record",
			type: "url"
		},
		{
			text: '申诉记录',
			icon: 'https://dnf.hanyunkeji.cn/static/user/06.png',
			path: "/pages/user/complaint-record",
			type: "url"
		},
		{
			text: '角色管理',
			icon: 'https://dnf.hanyunkeji.cn/static/user/02.png',
			path: "/pages/hero/hero",
			type: "url"
		},
		{
			text: '邀请好友',
			icon: 'https://dnf.hanyunkeji.cn/static/user/05.png',
			path:"/pages/red/red",
			type: "urlTab"
		},
		{
			text: '建议反馈',
			icon: 'https://dnf.hanyunkeji.cn/static/user/04.png',
			path: "/pages/user/feedback",
			type: "url"
		},
		{
			text: '商务合作',
			icon: 'https://dnf.hanyunkeji.cn/static/user/03.png',
			type: "popup"
		},
	]
	
	onShow(()=>{
		getUserInfo()
	})


	const userStore = useUserStore()
	onMounted(() => {
		getUserInfo()
		// system.fetchConfig()
	})

	const getUserInfo = async () => {
		await userStore.fetchUserInfo()
	}
	const linkTo = (path,type = 'url') => {
		if(type ==  'url'){
			uni.navigateTo({
				url: path
			})
		}
		if(type ==  'popup'){
			dialogShow.value =  true
			
		}
		
		if(type == 'urlTab'){
			uni.switchTab({
				url:path
			})
		}
		
		
		
	}
	const onClick = (e) => {
		console.log('点击事件触发了，type：', e)
		if (e.index === 1) {
			console.log("点击确定");
			copy(system.config.email) // 只在点击确认按钮时执行
		}
		dialogShow.value = false
	}
	
	const copy = (val) => {
		uniCopy({
			content: val,
			title:"复制成功",
			success: (res) => {
				uni.showToast({
					title: res,
					icon: 'none'
				})
			},
			error: (e) => {
				uni.showToast({
					title: e,
					icon: 'none',
					duration: 3000,
				})
			}
		})
	}
</script>

<style scoped>
	page {
		background: #f4f7fb;
	}

	.profile-page {
		bottom: 0;
		margin: 0;
		background: #f4f7fb;
		height: 100vh;
	}

	.profile-header {
		display: flex;
		align-items: center;
		padding: 200rpx 40rpx 20rpx;
		background: linear-gradient(to bottom, #66ccff, #ffffff);
		position: relative;
		/* background: linear-gradient(177.16deg, #fff 0%, #d9ecff 33.13%, #fff 69.08%, #fff 100%); */
		/* background-image: url('https://resource.tuniaokj.com/images/cool_bg_image/icon_bg.png'); */
	}
	.setting{
		position: absolute;
		right: 10;
		top: 10;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 24rpx;
	}

	.profile-info {
		flex: 1;
		margin-left: 30rpx;
	}

	.nickname {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}

	.userid {
		font-size: 28rpx;
		color: #666;
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-top: 10rpx;
	}

	.copy-icon {
		width: 28rpx;
		height: 28rpx;
	}
	
	

	.balance-card {
		background: #2e2b27;
		color: #ffe8b6;
		font-size: 29rpx;
		margin: 20rpx;
		padding: 25rpx 30rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.menu-list {
		background: #fff;
		margin: 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: 33rpx 30rpx;
		border-bottom: 1rpx solid #f2f2f2;
		position: relative;
		/* margin: 0rpx 90rpx; */
	}

	.menu-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 24rpx;
	}

	.menu-text {
		font-size: 28rpx;
		color: #333;
		flex: 1;
	}

	.arrow-icon {
		width: 24rpx;
		height: 24rpx;
	}

	.service-btn {
		position: absolute;
		right: 30rpx;
		bottom: 300rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 9;
	}

	.kefu-img {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		border: 6rpx solid #fff;
		box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.kefu-tag {
		background: #ff7c1f;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
		margin-top: -12rpx;
	}

	.group-banner {
		margin: 32rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.group-banner image {
		width: 100%;
		display: block;
	}

	.balance-item {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.balance-icon {
		width: 36rpx;
		height: 36rpx;
	}

	.balance-text {
		color: #ffe8b6;
		font-size: 30rpx;
	}


	.top-kefu {
		position: absolute;
		right: 10rpx;
		bottom: 200rpx;
		width: 146rpx;
		height: 70rpx;
		color: #fff;
		background-image: url('https://dnf.hanyunkeji.cn/static/home/04.png');
		background-size: 100% 100%;
		font-size: 25rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 10rpx;
		background-color: transparent;
	}

	.top-kefu::after{
		
		border: none !important;
		height: 100rpx !important;
	}	
</style>