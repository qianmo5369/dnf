<template>
	<!-- 标题 -->
	<view class="wrap">
		<view class="popup-header">选择角色</view>
		<view class="fui-icon__close" @tap="onClose">
			<TnIcon name="close" />
		</view>

		<scroll-view scroll-y class="popup-body">
			<view class="role-list">
				<view v-for="(role,index) in userHeroList" :key="index" class="role-card" :class="{ 'card-active': activeRoleId === role.id }" @click="selectRole(role)">
					<tn-avatar :url="role.hero_avatar" size="80rpx" />
					<view class="role-info">
						<view class="role-value">{{ role.resist_power }} {{ role.hero_name }}</view>
						<view class="role-subtitle">{{role.nickname}}</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部自定义按钮组 -->
		<view class="popup-footer">
			<view class="btn btn-default" @click="linkTo('/pages/hero/hero')">管理角色</view>
			<view class="btn btn-primary" @click="linkTo('/pages/hero/edit')">新建角色</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref,
		defineProps,
		defineEmits,
		onMounted
	} from 'vue'
	import { onShow } from '@dcloudio/uni-app';
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import TnButton from '@/uni_modules/tuniaoui-vue3/components/button/src/button.vue'
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
	import { useUserStore } from '@/stores/user'
	const userStore = useUserStore()
	const show = ref(true)
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false
		}
	})
	const emit = defineEmits(['update:modelValue'])

	function onClose() {
		emit('update:modelValue', false)
	}

	const userHeroList = ref([])

	const activeRoleId = ref(1)
	
	const  selectRole = async (role) => {
	  activeRoleId.value = role.id
	  const res = await uni.$http.post('/dungeon/setDefaultUserHero',{
		  hero_id:role.id
	  })
	  	
	  if (res.code === 1) {
		  const userStore = useUserStore()
		  await userStore.fetchUserInfo()
	  	onClose()
	  } else {
	  	uni.showToast({
	  		title: res.msg,
	  		icon: 'none'
	  	})
	  }
	}

	const linkTo = (path)=>{
		uni.navigateTo({
			url: path
		})
	}
	
	const getUserHeroList = async () => {
		
		const res = await uni.$http.get('/dungeon/getUserHeroList')
	
		if (res.code === 1) {
			userHeroList.value = res.data;
			if (userStore.userInfo?.default_user_hero_id) {
			    activeRoleId.value = userStore.userInfo.default_user_hero_id
			  }
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}
	
	onMounted(() => {
		getUserHeroList()
	})
	
	onShow(() => {
		getUserHeroList()
	})
</script>

<style scoped>
	.wrap {
		position: relative;
		height: 1000rpx;
		display: flex;
		flex-direction: column;
		/* background: #fff; */
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
		color: #3366ff;
		border-bottom: 1rpx solid #eee;
	}

	/* 主体滚动区 */
	.popup-body {
		height: 800rpx;	
		padding: 0rpx 30rpx;
		background-color: #f8f7f8;
	}

	/* 原生 CSS Grid 两列布局 */
	.role-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 20rpx;
		/* padding: 30rpx; */
		margin-top: 30rpx;
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
	  width: 90rpx;   /* 三角边长 */
	  height: 60rpx;
	  background-color: #409eff;
	  clip-path: polygon(
	    100% 0%,    /* 顶点：右上 */
	    100% 100%,  /* 底点：右下 */
	    0% 0%       /* 左顶点：左上 */
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
		/* position: absolute; */
		/* bottom: 120rpx;
		 */
		/* #ifdef APP */
		bottom: calc(env(safe-area-inset-bottom) - 40rpx);
		/* #endif */

		/* #ifdef H5 */
		bottom: var(--window-bottom);
		/* #endif */
		left: 0;
		width: 100%;

		padding: 20rpx;
		flex-direction: row;
		display: flex;
		padding: 20rpx;
		background: #fff;
		/* border-top: 1rpx solid #eee; */
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
</style>