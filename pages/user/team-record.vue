<template>
	<view class="team-record-page">
		<z-paging ref="paging" v-model="teamList" @query="getTeamLogs" 	>
		<template #top>
					
				
		<!-- 顶部导航 -->
		<view class="tabs">
			<view v-for="tab in tabs" :key="tab.value" class="tab" :class="{ active: activeTab === tab.value }"
				@tap="handleTab(tab.value)">
				{{ tab.label }}
			</view>
		</view>

		<!-- 列表内容 -->
		<view class="line"></view>
			</template>
		<view class="record-list">
			<!-- <z-paging ref="paging" v-model="teamList" @query="getTeamLogs" :fixed="false"> -->

				<view class="item" v-for="(item, index) in teamList" :key="index" @tap="linkTo(`/pages/room/room?room_id=${item.id}`)">
					<view class="item__content">
						<view class="role">
							<image class="role__avatar" mode="aspectFill" :src="item.members.hero_avatar"></image>
							<view>
								<view class="role__type">
									<text>{{item.members.resist_power}}{{item.members.hero_name}}</text>
									<text class="role__name">{{item.members.hero_nickname}}</text>
								</view>
								<view class="item__tuanben">
									<text class="iconfont icon-gongji item__tuanben__icon"></text>
									<text>{{item.mode_title||'攻坚·奥兹玛'}}</text>
									<text class="item__playType"
										:class="item.members.role_code">{{item.members.role_name}}</text>
								</view>
							</view>
						</view>
						<view>
							<view class="item__gameType"  style="margin-bottom: 20rpx;">
								<text class="item__status" :class="item.status"
									v-if="item.map_code==='terache' && item.status==='completed'">已结算</text>
								<text class="item__status" :class="item.status" v-else>
									{{item.statusText}}
								</text>
							</view>
							<view class="item__time">{{item.created_at_text}}</view>
						</view>
					</view>
					<view catch:tap="onFailReason" class="item__footer"
						v-if="item.map_code==='terache' && item.status==='completed'">
						<text class="iconfont icon-cz item__footer__icon"></text>
						<view class="item__footer__content">
							<text v-if="item.members.role_code =='seller'">拉满泰拉：{{item.members.settle_info.tera_cost}} ｜
								收益：{{item.members.settle_info.bonus_yuan}}元
								<block v-if="item.members.settle_info.card_bonus_yuan > 0">｜
									分红：{{item.members.settle_info.card_bonus_yuan}}元</block>
							</text>
							<text v-else>获得泰拉：{{item.members.settle_info}}万
								<block v-if="item.completeStatus === 'completed'"> ｜ 费用：{{item.tailaCarFee}}元</block>
								<block v-if="item.members.settle_info.card_bonus_yuan"> ｜
									分红：{{item.members.settle_info.card_bonus_yuan}}元</block>
							</text>
							<text class="item__footer__content__rate">比例{{item.tera_ratio||5000}}</text>
						</view>
					</view>
					<!--  <view catch:tap="onFailReason" class="item__footer" data-item="{{item}}" v-if="{{item.prizeValue}}">
		        <text class="iconfont icon-hb2 item__footer__icon"></text>
		        <view class="item__footer__content">
		            <text>本次带团获得<text class="item__footer__amount">{{item.prizeValue}}</text>红包，{{prizeIssueStatusMap[item.prizeIssueStatus]}}</text>
		            <text class="iconfont icon-help" style="margin-left: 10rpx;" v-if="{{item.prizeIssueStatus==='REFUSE'}}"></text>
		        </view>
		    </view> -->
				</view>
		</view>
		</z-paging>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue';
	const paging = ref(null)
	useZPaging(paging)
	const tabs = [{
			label: '全部',
			value: 'all'
		},
		{
			label: '进行中',
			value: 'in_progress'
		},
		{
			label: '已完成',
			value: 'completed'
		},
		{
			label: '已解散',
			value: 'disbanded'
		}
	]

	const activeTab = ref('all')

	const teamList = ref([])

	const handleTab = (value) => {
		activeTab.value = value;
		paging.value.reload();
	}
	
	
	const linkTo = (path) => {
		uni.navigateTo({
			url: path
		})
	}

	const getTeamLogs = async (pageNo, pageSize) => {
		const res = await uni.$http.post('/room/teamRoomList', {
			page: pageNo,
			page_size: pageSize,
			status: activeTab.value
		})
		if (res.code === 1) {
			console.log(res.data.list);
			paging.value.complete(res.data.list)
		} else {
			paging.value.complete(false)
		}
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

	.line {
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
		/* height: 80vh; */
	}

	.record-item {
		position: relative;
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



	.item {
		border-bottom: 1rpx solid #eee
	}

	.item__content {
		color: #333;
		padding: 34rpx 0
	}

	.item__content,
	.item__header {
		display: -webkit-flex;
		display: flex;
		justify-content: space-between
	}

	.item__header {
		margin-bottom: 20rpx
	}

	.item__gameType,
	.item__header {
		align-items: center
	}

	.item__gameType {
		color: #333;
		display: -webkit-flex;
		display: flex;
		font-size: 28rpx;
		justify-content: flex-end
	}

	.item__playType {
		border-radius: 10rpx;
		color: #fff;
		font-size: 22rpx;
		margin-left: 20rpx;
		padding: 6rpx 14rpx
	}

	.item__type {
		background-color: #0283ff;
		border-radius: 8rpx;
		color: #fff;
		font-size: 22rpx;
		margin-right: 14rpx;
		padding: 2rpx 20rpx
	}

	.item__status {
		/* color: #0283ff; */
		color: #777;
		font-size: 26rpx;
		font-weight: 500;
		margin-left: 20rpx
	}
	.completed{
		color: #000 !important;
	}

	.item__type.drag {
		background-color: #f54a4a
	}

	.item__footer {
		justify-content: space-between
	}

	.item__name {
		color: #777;
		font-size: 24rpx
	}

	.item__capacity {
		color: #666;
		font-size: 26rpx;
		font-weight: 400
	}

	.item__time {
		color: #999;
		font-size: 24rpx;
		text-align: right
	}

	.item__btn {
		justify-content: flex-end
	}

	.item__btn,
	.item__footer {
		align-items: center;
		display: -webkit-flex;
		display: flex
	}

	.item__footer {
		color: #666;
		font-size: 24rpx;
		justify-content: flex-start;
		padding-bottom: 24rpx
	}

	.item__footer__icon {
		color: #ea331e;
		font-size: 26rpx;
		margin-right: 10rpx
	}

	.item__footer__amount {
		color: #ea331e;
		font-weight: 600;
		margin: 0 4rpx
	}

	.item__footer__content {
		align-items: center;
		display: -webkit-flex;
		display: flex;
		justify-content: space-between;
		width: 100%
	}

	.item__footer__content__rate {
		background-color: #faece9;
		border-radius: 8rpx;
		color: #ea331e;
		flex-shrink: 0;
		font-size: 24rpx;
		max-width: -webkit-fit-content;
		max-width: fit-content;
		padding: 4rpx 14rpx
	}

	.item__btn__item {
		border: 1rpx solid #42b861;
		border-radius: 30rpx;
		color: #42b861;
		font-size: 26rpx;
		margin-top: 20rpx;
		padding: 6rpx 30rpx
	}

	.role {
		align-items: center;
		display: -webkit-flex;
		display: flex
	}

	.role__avatar {
		border-radius: 50%;
		height: 90rpx;
		margin-right: 14rpx;
		width: 90rpx
	}

	.role__type {
		align-items: center;
		display: -webkit-flex;
		display: flex;
		font-size: 30rpx
	}

	.role__name {
		color: #777;
		font-size: 26rpx;
		margin-left: 14rpx
	}

	.item__tuanben {
		align-items: center;
		color: #777;
		display: -webkit-flex;
		display: flex;
		font-size: 26rpx;
		margin-top: 10rpx
	}

	.item__tuanben__icon {
		font-size: 24rpx;
		margin-right: 10rpx
	}






	.dps {
		background: #ff4d4f;
		color: #fff;
	}

	.leader {
		background: #1677ff;
		color: #fff;
	}

	.support {
		background: #00c292;
		color: #fff;
	}

	.baoche {
		background: #5b2ae5;
		color: #fff;
	}

	.team {
		background: #fbbd12;
		color: #fff;
	}

	.deck {
		background: #0198cc;
		color: #fff;
	}
</style>