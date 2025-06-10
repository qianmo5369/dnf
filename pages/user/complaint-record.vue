<template>
  <view class="team-record-page">
    <!-- 顶部导航 -->
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: activeTab === tab.value }"
        @tap="handleTab(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 列表内容 -->
	<!-- <view class="line"></view> -->
    <view class="record-list">
		<z-paging
		  ref="paging"
		  v-model="complaintList"
		  @query="getComplaintList"
		:fixed="false"
		>
     <view class="appeal-item" @tap="linkTo(`/pages/complaint/complaint?complaint_id=${item.id}`)" v-for="(item, index) in complaintList" :key="index">
            <view class="user-info">
              <image class="avatar" :src="item.hero.hero_avatar" mode="aspectFill" />
              <view class="name-wrap">
                <view class="nickname">{{item.hero.resist_power}}{{ item.hero.hero_name }}</view>
                <view class="hero-nickname">{{ item.hero.nickname }}</view>
              </view>
              <view class="cancel-btn">
				  <text v-if="item.status == 'pending'">待处理</text>
				  <text v-if="item.status  == 'processing'">处理中</text>
				  <text v-if="item.status == 'resolved'">同意和解</text>
				  <text v-if="item.status == 'cancelled'">撤回申诉</text>
			  </view>
            </view>
      
            <view class="info-text">
				<text class="label">房间信息：</text>
              <text class="room-id">{{ item.room_sn }}</text>
              <text class="tag" v-if="item.is_mine">被投诉</text>
            </view>
            <view class="label">问题描述：
			<text class="reason">{{ item.reason }}</text>
			</view>
      
            <view class="footer">
              <text class="time">{{ item.created_at_text }}</text>
              <view class="detail-btn">查看详情</view>
            </view>
          </view>
		  
		  </z-paging>
  </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
const paging = ref(null)
	useZPaging(paging)
const tabs = [
  { label: '待处理', value: 'pending' },
  { label: '处理中', value: 'processing' },
  {label: '撤回申诉', value:'resolved'},
  { label: '已完成', value: 'cancelled' },
]

const activeTab = ref('pending')

const complaintList = ref([])

const handleTab = (value) => {
	activeTab.value  = value;
	paging.value.reload();
}
const getComplaintList = async (pageNo, pageSize) => {
	  const res = await uni.$http.post('/room/complaintList', {
	    page: pageNo,
	    page_size: pageSize,
		status:activeTab.value
	  })
	  if (res.code === 1) {
		  console.log(res.data.list);
	    paging.value.complete(res.data.list)
	  } else {
	    paging.value.complete(false)
	  }
	}
const linkTo = (path)=>{
	uni.navigateTo({
		url:path
	})
}
</script>

<style scoped>
.team-record-page {
  background: #fff;
  /* min-height: 100vh; */
}

.tabs {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  /* border-bottom: 1rpx solid #eee; */
}

.tab {
  font-size: 28rpx;
  color: #666;
  margin-right: 40rpx;
  padding-bottom: 10rpx;
  position: relative;
}

.tab.active {
  color: #007aff;
  font-weight: bold;
}
.line{
	width: 100%;
	height: 30rpx;
	background: #f8f8f8;
}

/* .tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4rpx;
  background: #007aff;
  border-radius: 2rpx;
} */

.record-list {
  /* padding: 20rpx; */
  padding: 0 24rpx;
  height: 60vh;
  /* background: red; */
}






.appeal-item {
  /* background: #fff; */
  /* background: #007aff; */
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
  /* box-shadow: 8rpx 8rpx 12rpx rgba(0, 0, 0, 0.1); */
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  color: #999 !important;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.name-wrap {
  flex: 1;
}

.nickname {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.hero-nickname {
  font-size: 24rpx;
  color: #999;
}

.cancel-btn {
  color: #333;
  font-size: 26rpx;
}

.info-text {
  font-size: 26rpx;
  color: #333;
  margin: 15rpx 0rpx;
}

.room-id {
  color: #2e8cf0;
}

.tag {
  background: #f56c6c;
  color: #fff;
  padding: 4rpx 10rpx;
  border-radius: 8rpx;
  margin-left: 10rpx;
  font-size: 22rpx;
}
.label{
	color: #999;
	font-size: 26rpx;
}

.reason {
  font-size: 26rpx;
  color: #555;
  margin-bottom: 20rpx;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  color: #888;
}

.detail-btn {
  color: #2e8cf0;
  border: 1rpx solid #2e8cf0;
  padding: 8rpx 20rpx;
  border-radius: 5rpx;
  font-size: 26rpx;
}

.bottom-text {
  text-align: center;
  color: #aaa;
  font-size: 24rpx;
  margin-top: 40rpx;
}
</style>
