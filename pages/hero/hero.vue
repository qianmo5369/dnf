<template>
	<!-- 标题 -->
	<view class="wrap">
		<view class="popup-header">点击角色卡片 即可修改角色信息</view>
		<view style="height: 100vh;">
			<scroll-view scroll-y="true" style="height: 100%;">
				<view class="role-list">
					<view v-for="(role,index) in userHeroList" :key="index" class="role-card"
						:class="{ 'card-active': activeRoleId === role.id }" @click="selectRole(role)">
						<tn-avatar :url="role.hero_avatar" size="80rpx" />
						<view class="role-info">
							<view class="role-value">{{ role.resist_power }} {{ role.hero_name }}</view>
							<view class="role-subtitle">{{role.nickname}}</view>
						</view>
					</view>
					<fui-safe-area></fui-safe-area>
				</view>
			</scroll-view>
		</view>
		<!-- 底部自定义按钮组 -->
		<view class="popup-footer">
			<view class="fui-tabbar__content">
				<view class="btn btn-primary" @click="linkTo('/pages/hero/edit')">新建角色</view>
			</view>

			<fui-safe-area></fui-safe-area>
		</view>
	</view>
</template>


<script setup>
	import {
		ref,
		defineProps,
		defineEmits,
		onMounted
	} from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
	import fuiSafeArea from "@/components/fui-safe-area.vue"
	import {
		useUserStore
	} from '@/stores/user'
	const userStore = useUserStore()
	const linkTo = (path) => {
		uni.navigateTo({
			url: path
		})
	}

	const userHeroList = ref([])

	const activeRoleId = ref(null)
	const showRoleSelect = ref(true)
	const isEdit = ref(false)

	const selectRole = (item) => {
		linkTo(`/pages/hero/edit?id=${item.id}`)
	}

	const getUserHeroList = async () => {

		const res = await uni.$http.get('/dungeon/getUserHeroList')

		if (res.code === 1) {
			userHeroList.value = res.data;
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}


	onMounted(() => {
		getUserHeroList()
		if (userStore.userInfo?.default_user_hero_id) {
			activeRoleId.value = userStore.userInfo.default_user_hero_id
		}
	})
	
	onShow(() => {
		getUserHeroList()
	})
</script>

<style scoped>
	/* page{
		height: 100vh;
	} */
	.wrap {
		padding: 0;
		background: #fff;
		/* background: #f0f2f5; */
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: fixed;
		width: 100%;
	}




	.role-group-scroll {
		/* flex: 1 1 auto;
	  height: 100%;
	  overflow: auto;
	  flex: 1; */
		padding: 20rpx;
	}


	.btn {
		flex: 1;
		margin: 0 10rpx;
		padding: 20rpx 0;
		text-align: center;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	/* 默认按钮 */
	.btn-default {
		background-color: #fff;
		color: #3366ff;
		border: 1rpx solid #3366ff;
	}

	/* 主要按钮 */
	.btn-primary {
		background-color: #3366ff;
		color: #fff;
	}

	/* 弹窗头 */
	.popup-header {
		text-align: center;
		font-size: 30rpx;
		padding: 24rpx;
		color: #888;
		border-bottom: 1rpx solid #eee;
	}

	/* 原生 CSS Grid 两列布局 */
	.role-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 30rpx;
		padding: 10rpx 40rpx;
	}

	/* 单个角色卡片 */
	.role-card {
		position: relative;
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	/* 三角形背景——尖朝左下，位于右上角 */
	.card-active::before {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		width: 90rpx;
		/* 三角边长 */
		height: 60rpx;
		background-color: #409eff;
		clip-path: polygon(100% 0%,
				/* 顶点：右上 */
				100% 100%,
				/* 底点：右下 */
				0% 0%
				/* 左顶点：左上 */
			);
	}

	/* 对勾 */
	.card-active::after {
		content: "当前";
		position: absolute;
		top: 4rpx;
		right: 4rpx;
		font-size: 20rpx;
		/* line-height: 50rpx; */
		color: #fff;
		/* line-height: 2; */
	}

	/* 文字区域 */
	.role-info {
		margin-left: 20rpx;
	}

	.role-value {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
	}

	.role-subtitle {
		font-size: 24rpx;
		color: #888;
		margin-top: 8rpx;
	}

	/* 底部按钮区 */
	.popup-footer {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}

	.fui-icon__close {
		position: absolute;
		top: 24rpx;
		right: 54rpx;

	}

	/* .role-list > .role-card:nth-child(-n+2) {
	  margin-top: 20rpx;
	}
	.role-list>.role-card:last-child {
		margin-bottom: 150rpx;
	} */


	/* 新加 */
	.popup-container {
		padding: 30rpx;
	}

	.form-item {
		margin-bottom: 30rpx;
	}

	.label {
		font-size: 26rpx;
		color: #333;
		margin-bottom: 12rpx;
		display: block;
	}

	.input,
	.input-select {
		background: #f7f8fa;
		border-radius: 12rpx;
		padding: 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.input-select {
		border: 1px solid #ddd;
	}

	.button-group {
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
	}

	.save-btn,
	.delete-btn {
		flex: 1;
		padding: 20rpx 0;
		font-size: 28rpx;
		border-radius: 12rpx;
		text-align: center;
		color: #fff;
	}

	.save-btn {
		background-color: #1677ff;
		margin-right: 20rpx;
	}

	.delete-btn {
		background-color: #ff4d4f;
	}

	.role-list-popup {
		max-height: 400rpx;
		padding: 20rpx;
	}

	.role-option {
		padding: 24rpx;
		border-bottom: 1px solid #eee;
		font-size: 28rpx;
	}

	.fui-tabbar__content {
		/* border: 1rpx solid #fff; */
		width: 100%;
		height: 100rpx;
		/* background: #fff; */
		display: flex;
		align-items: center;
		padding: 0 32rpx;
		box-sizing: border-box;
	}
</style>