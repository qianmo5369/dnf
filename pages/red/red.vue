<template>
  <view class="team-reward-page">
	  <fui-nav-bar custom padding="12" background="none"></fui-nav-bar>
	  
	  
	 <TnPopup v-model="shareShow" width="100%" height="250rpx" borderRadius="16rpx" overlay-closeable open-direction="bottom" close-btn>
	 	<view class="share-card-box">
	 		<view class="share-body">
	 			<view class="share-item">
	 				<button class="share-btn" open-type="share" >
						<image class="share-icon" src="https://dnf.hanyunkeji.cn/static/room/wechat2.png" mode="aspectFit"></image>
	 					发送给好友
	 				</button>
	 			</view>
				<view class="share-item">
					<button class="share-btn" open-type="share" >
						<image class="share-icon" src="https://dnf.hanyunkeji.cn/static/red/04.png" mode="aspectFit"></image>
						专属邀请码
					</button>
				</view>
	 		</view>
	 	</view>
	 </TnPopup> 
	  
    <!-- 背景与标题 -->
    <view class="header-bg">
		<image class="hd" src="https://dnf.hanyunkeji.cn/static/red/01.png" mode="aspectFit"></image>
      <view class="title">结伴组队赚红包</view>
      <!-- <view class="subtitle">每阶段解锁一个红包</view> -->

<!--      <view class="score-steps">
        <view class="step" v-for="s in [30, 100, 200]" :key="s">
          <image src="/static/lock.png" class="lock-icon" />
          <text>{{ s }}分</text>
        </view>
      </view> -->
	  
    </view>
	
		<view class="score-card">
			 <view class="subtitle">每阶段解锁一个红包</view>
			 <view class="score-steps">
			         <view class="step" v-for="s in [30, 100, 200]" :key="s">
			           <image src="/static/lock.png" class="lock-icon" />
			           <text>{{ s }}分</text>
			         </view>
			       </view> 
		  <view class="score-title">恭喜您当前得分</view>
		  <view class="score-value">0<text class="unit">分</text></view>
		  <view class="btn-invite" @tap="shareShow = true" >立即邀请 领红包</view>
		</view>
	
    <!-- 统计条 -->
    <view class="stats-bar">
      <text>邀请人数：<text class="red">0</text></text>
      <text>完成组队：<text class="red">0</text></text>
    </view>

    <!-- 列表 -->
    <view class="list">
      <view class="list-header">
        <text>邀请用户</text>
        <text>完成组队</text>
        <text>邀请时间</text>
      </view>
      <view class="list-item" v-for="(user, index) in userList" :key="index">
        <view class="user">
          <image :src="user.avatar" class="avatar" />
          <text class="name">{{ user.name }}</text>
        </view>
        <text class="center">-</text>
        <text class="date">{{ user.date }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
	} from 'vue'
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
	import fuiNavBar from "@/components/fui-nav-bar.vue";
	import fuiBackgroundImage from "@/components/fui-background-image.vue";
	import { onShareAppMessage, onLoad } from '@dcloudio/uni-app'
	import {
		useUserStore
	} from '@/stores/user'
	const userStore = useUserStore()
	const shareShow = ref(false)
	
	
	onShareAppMessage(() => {
	  return {
	    title: `【8868打团】快来组队吧：`,
	    path: `/pages/index/index?share_uid=${userStore.userInfo.id}`,
	    imageUrl: ''
	  }
	})
	
	
const userList = [
  // { avatar: '/static/cat1.jpg', name: '玩家001', date: '5月20日' },
  // { avatar: '/static/cat2.jpg', name: '玩家002', date: '5月20日' },
  // { avatar: '/static/cat3.jpg', name: '玩家003', date: '5月20日' },
  // { avatar: '/static/cat4.jpg', name: '玩家004', date: '5月20日' },
  // { avatar: '/static/cat5.jpg', name: '玩家005', date: '5月20日' },
  // { avatar: '/static/cat6.jpg', name: '玩家006', date: '5月20日' }
]
</script>

<style scoped>
	
.share-card-box {
		background-color: #fff;
		border-radius: 10rpx;
	}
	
	.share-remark {
		margin-top: 16rpx;
		font-size: 28rpx;
		color: #808080;
	}

	
	.share-header {
		text-align: center;
		font-size: 30rpx;
		padding: 24rpx;
		color: #000;
		font-weight: 500;
		border-bottom: 1rpx solid #eee;
	}
	
	.fui-icon__close {
		position: absolute;
		top: 24rpx;
		right: 54rpx;
	
	}
	.share-body{
		margin-top: 30rpx;
		padding: 25rpx 0rpx;
		text-align: center;
		display: flex;
		justify-content: space-evenly;
		/* border-bottom: 1rpx solid #eee; */
	}
	.share-icon{
		width: 80rpx;
		height: 80rpx;
	}
	.share-item{
		
	}
	
	.share-btn {
		background: #fff;
		border: none !important;
		margin: 0rpx 20rpx;
		 /* background-color: #3366ff; */
		color: #333;
		/* padding: 20rpx 0; */
		font-size: 28rpx;
		border-radius: 10rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
	.share-btn::after{
		border: none !important;
		height: 100rpx !important;
	}	
	
	
	
.team-reward-page {
 background: url('https://dnf.hanyunkeji.cn/static/red/bg.png');
  background-size: 100% 100%;
  position: fixed;
  width: 100%;
  min-height: 100vh;
}

.header-bg {
  /* background: linear-gradient(to bottom right, #ff4e50, #f9d423); */
  /* padding: 00rpx 30rpx 240rpx; */
  /* height: 800rpx; */
  color: #fff;
  position: relative;
  text-align: center;
}

.back-btn {
  position: absolute;
  top: 30rpx;
  left: 30rpx;
  font-size: 32rpx;
  color: #fff;
}

.title {
  font-weight: bold;
  font-family: PangMenZhengDao, PangMenZhengDao;
  font-weight: 500;
  font-size: 80rpx;
  color: #FFFFFF;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 30rpx;
  margin-top: 10rpx;
  font-weight: 500;
  color: #FFFFFF;
}

.score-steps {
  display: flex;
  justify-content: center;
  margin-top: 40rpx;
  gap: 40rpx;
  height: 61rpx;
  background: rgba(190,55,55,0.27);
  border-radius: 26rpx;
  margin: 30rpx 100rpx;
}

.step {
  font-size: 24rpx;
  color: #fff;
  text-align: center;
}

.lock-icon {
  width: 32rpx;
  height: 32rpx;
  margin-bottom: 6rpx;
}

.score-card {
	height:750rpx;
	background: url('https://dnf.hanyunkeji.cn/static/red/red.png');
	 background-size: 100% 100%;
 text-align: center;
}
.hd{
	width: 163.08rpx;
	height: 91.27rpx;
	position: absolute;
	left: 80rpx;
	top: 250rpx;
}

.score-title {
  color: #000;
  font-size: 36rpx;
   font-weight: bold;
   margin-top: 70rpx;
}

.score-value {
  font-size: 150rpx;
  color: #f8494a;
  font-weight: bold;
  /* margin-top: 30rpx; */
}

.unit {
  font-size: 28rpx;
  margin-left: 6rpx;
}

.btn-invite {
  /* background: linear-gradient(to right, #ff4e50, #ff6f61); */
  background: url('https://dnf.hanyunkeji.cn/static/red/btn.png');
  background-size: 100% 100%;
  color: #fff;
  font-weight: 500;
  width: 430rpx;
  height: 110rpx;
  line-height: 110rpx;
  margin: 50rpx auto;
  font-size: 36rpx;
  text-align: center;
}

.stats-bar {
  background: #fff;
  margin: 30rpx;
  padding: 20rpx 30rpx;
  border-radius: 20rpx;
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  color: #333;
}

.red {
  color: #f8494a;
}

.list {
  margin: 0 30rpx 60rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.list-header, .list-item {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  font-size: 26rpx;
  border-bottom: 1px solid #f5f5f5;
}

.list-header {
  font-weight: bold;
  color: #666;
  background: #fafafa;
}

.user {
  display: flex;
  align-items: center;
}

.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.name {
  color: #333;
}

.center {
  text-align: center;
  width: 80rpx;
  color: #999;
}

.date {
  color: #999;
}
</style>
