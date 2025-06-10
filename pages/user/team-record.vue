<template>
  <view class="team-record-page">
    <!-- 顶部导航 -->
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="{ active: activeTab === tab.value }"
        @tap="activeTab = tab.value"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 列表内容 -->
	<view class="line"></view>
    <view class="record-list">
      <view class="record-item" v-for="(item, index) in filteredList" :key="index">
        <image class="avatar" :src="item.avatar" />
        <view class="info">
          <view class="top">
            <text class="level">{{ item.level }}</text>
            <text class="desc">{{ item.remark }}</text>
          </view>
          <view class="bottom">
            <text class="map">🗡 {{ item.map }}</text>
            <view class="tag" :class="item.role === '打手' ? 'red' : 'blue'">{{ item.role }}</view>
          </view>
        </view>
        <view class="right">
          <view class="status">{{ item.status }}</view>
          <view class="time">{{ item.time }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'progress' },
  { label: '已完成', value: 'done' },
  { label: '已解散', value: 'closed' }
]

const activeTab = ref('all')

const teamList = ref([])

const filteredList = computed(() => {
  if (activeTab.value === 'all') return teamList.value
  return teamList.value.filter(item => item.state === activeTab.value)
})
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
  padding: 20rpx;
}

.record-item {
  display: flex;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  /* box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05); */
  margin-bottom: 20rpx;
  align-items: flex-start;
  border-bottom: 1rpx solid #eee;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.info {
  flex: 1;
}

.top {
  font-size: 26rpx;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.bottom {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #888;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.tag {
  padding: 6rpx 18rpx;
  border-radius: 10rpx;
  font-size: 22rpx;
  color: #fff;
}

.tag.red {
  background: #f56c6c;
}

.tag.blue {
  background: #409eff;
}

.right {
  text-align: right;
  color: #999;
  font-size: 24rpx;
}
.status {
  margin-bottom: 10rpx;
}
</style>
