<template>
	<view class="balance-page">
		
		
		<TnPopup :model-value="depositShow" width="80%" height="500rpx" borderRadius="16rpx">
			<view class="recharge-card-box">
				<view class="popup-header">助战币提现</view>
				<view class="fui-icon__close" @tap="depositShow = false;amount = null">
					<TnIcon name="close" />
				</view>
				<view class="pay-input-box">
					<view class="input-box">
						<text class="yuan-text">数量</text>
						<input class="input" type="text" v-model="amount" placeholder="请输入提现数量" />
					</view>
					<view class="input-price">
						单价：{{unitPrice}} | 预计收益：￥{{ actualAmount }}
					</view>
					<view class="input-title">
						提现手续费：{{feeRate*100}}%
					</view>
					<!-- <view class="input-box">
						<text class="yuan-text">￥</text>
						<input class="input" type="text" v-model="num" placeholder="请输入提现数量" />
					</view> -->
				</view>
				<view class="recharge-btn" @tap="doDeposit()">
					确定
				</view>
			</view>
		</TnPopup>
		<z-paging
		  ref="paging"
		  v-model="coinList"
		  @query="getCoinLogs"
			
		>
		<template #top>
		<!-- 顶部余额卡片 -->
		<view class="balance-card assist-card">
			<view class="assist-left">
				<view class="title">助战币 </view>
				<view class="amount">{{sum_coin}}</view>
			</view>
			<view class="assist-right" @tap="depositShow = true">
				<view class="withdraw-btn">申请提现</view>
			</view>
			<view class="assist-stats">
				<view class="item">
					<view class="desc">绑定币</view>
					<view class="value">{{is_coin}}</view>
					
					</view>
				<view class="divider"></view>
				<view class="item">
					<view class="desc">提现中</view>
					<view class="value">{{deposit_coin}}</view>
					
					</view>
				<view class="divider"></view>
				<view class="item">
					<view class="desc">可提现</view>
					<view class="value">{{coin}}</view>
					
					</view>
			</view>
		</view>

		<!-- 标签栏 -->
		<view class="tab-bar">
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
		
		</template>

		<!-- 明细列表 -->
		<view class="record-list">
			
			<view class="record-item" v-for="(item, index) in coinList" :key="index">
				<template v-if="activeTab == 'coin_log'">
					<view class="left">
						<view class="title">{{item.remark}}</view>
						<view class="time">{{item.created_text}}</view>
					</view>
					<view class="right">
						<view :class="['amount', item.type == 'in' ? 'positive' : 'negative']"  >{{ item.type  == 'in' ? '+' : '-' }}{{ item.amount }}</view>
						<!-- <view class="timestamp">2025-05-28 18:02</view> -->
					</view>
				</template>
				<template v-else>
					<view class="left">
						<view class="num">数量:{{item.amount}}</view>
						<view class="expect_amount">预计收益:￥{{item.expect_amount}}</view>
						<view class="time">{{item.created_text}}</view>
					</view>
					<view class="d-right">
						<view class="status-text">
							<text v-if="item.status == 'pending'">审核中</text>
							<text class="blue" v-if="item.status == 'approved'">审核通过</text>
							<text  class="ren" v-if="item.status == 'rejected'">已拒绝</text>
							<text  class="green" v-if="item.status == 'cancelled'">用户取消</text>
						</view>
						<view class="rejected-remark" v-if="item.status == 'rejected'" >{{item.remark}}</view>
						<view class="status-btn" v-if="item.status == 'pending'" @click="cancelWithdraw(item.id)" >
							取消提现
						</view>
						<!-- <view class="timestamp">2025-05-28 18:02</view> -->
					</view>
				</template>
			</view>

			<!-- <view class="record-item">
				<view class="left">
					<view class="title">提现</view>
					<view class="time">1天前</view>
				</view>
				<view class="right">
					<view class="amount positive">-8.0</view>
					<view class="timestamp">2025-05-27 14:03</view>
				</view>
			</view> -->
			
		</view>
		</z-paging>
	</view>
</template>
<script setup>
	import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
	import {
		ref,computed
	} from 'vue'
	import {
		useSystemStore
	} from '@/stores/system'
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue';
	const paging = ref(null)
	useZPaging(paging)
	const sum_coin = ref(null)
	const amount = ref(null)
	const coin = ref(null)
	const is_coin = ref(null)
	const deposit_coin = ref(null)
	const depositInfo = ref({})
	const depositShow = ref(false)
	const system = useSystemStore()
	const tabs = [
	  { label: '流水记录', value: 'coin_log' },
	  { label: '提现记录', value: 'deposit_log' },
	]
	
	const activeTab = ref('coin_log')
	
	const coinList = ref([])
	
	const handleTab = (value) => {
		activeTab.value  = value;
		paging.value.reload();
	}
	
	const getCoinLogs = async (pageNo, pageSize) => {
	  const res = await uni.$http.post('/dungeon/coinLogs', {
	    page: pageNo,
	    page_size: pageSize,
		type:activeTab.value
	  })
	  if (res.code === 1) {
	    coin.value = res.data.coin;
		is_coin.value = res.data.is_coin;
		sum_coin.value = res.data.sum_coin;
		deposit_coin.value = res.data.deposit_coin;
		unitPrice.value = res.data.unitPrice;
		feeRate.value = res.data.feeRate;
	    paging.value.complete(res.data.list)
	  } else {
	    paging.value.complete(false)
	  }
	}
	
	
	
	const unitPrice = ref(5)      
	const feeRate = ref(0.1)          
	
	// 实际到账金额（元）
	const actualAmount = computed(() => {
	  const n = parseFloat(amount.value)
	  const price = parseFloat(unitPrice.value)
	  if (!n || n <= 0 || !price || price <= 0) return 0
	  return (n * price * (1 - feeRate.value)).toFixed(2)
	})
	

	const doDeposit = async () => {
		if (amount.value <= 0) {
			uni.showToast({
				title: '请输入提现数量',
				icon: 'none'
			})
			return false;
		}
		const res = await uni.$http.post('/dungeon/applyWithdraw', {
			amount: amount.value
		})
		if (res.code === 1) {
			// 可刷新房间状态或跳转
			depositShow.value = false;
			paging.value.reload();
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}
	
	
	const cancelWithdraw = async (id) => {
		
		const res = await uni.$http.post('/dungeon/cancelWithdraw', {
			id: id
		})
		if (res.code === 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			paging.value.reload();
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}

	
</script>
<style scoped lang="scss">
	.balance-page {}

	.assist-card {
		background: url("https://dnf.hanyunkeji.cn/static/user/card.png");
		height: 320rpx;
		background-size: 100% 100%;
		padding: 40rpx 30rpx 30rpx;
		color: #fff;
		margin: 30rpx;
		position: relative;
	}

	.assist-left .title {
		font-size: 26rpx;
		margin-bottom: 10rpx;
	}

	.assist-left .amount {
		font-size: 52rpx;
		font-weight: bold;
	}

	.assist-left .row {
		margin-top: 16rpx;
		font-size: 24rpx;
		display: flex;
		align-items: center;
	}

	.assist-left .tip {
		font-size: 20rpx;
		background: #ffffff33;
		margin-left: 8rpx;
		border-radius: 50%;
		width: 28rpx;
		height: 28rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.assist-right {
		position: absolute;
		top: 40rpx;
		right: 30rpx;
	}

	.withdraw-btn {
		background: #ffffff66;
		color: #fff;
		border-radius: 32rpx;
		padding: 15rpx 25rpx;
		font-size: 24rpx;
	}

	.assist-stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 40rpx;
		padding: 0 10rpx;
		color: #fff;
		font-size: 24rpx;
		text-align: center;
	}

	.assist-stats .item .value {
		font-size: 30rpx;
		font-weight: bold;
	}
	.assist-stats .divider {
		width: 1rpx;
		height: 20rpx;
		background: rgba(255, 255, 255, 0.3);
		margin: 0 10rpx;
	}

	.tab-bar {
		display: flex;
		justify-content: space-around;
		padding: 30rpx;
		background: #fff;
		font-size: 28rpx;
		font-weight: bold;
		color: #666;
	}

	.tab {
		margin-right: 40rpx;
		color: #666;
	}

	.tab.active {
		color: #1e90ff;
		position: relative;
	}

	.tab.active::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -10rpx;
		width: 100%;
		height: 4rpx;
		background-color: #1e90ff;
		border-radius: 2rpx;
	}

	.record-list {
		padding: 0 24rpx;
		margin-top: 20rpx;
		// height: 60vh;
	}

	.record-item {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		color: #333;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.record-item .title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	.record-item .time {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}
	.status-text{
		color: #999;
		font-size: 28rpx;
	}
	.blue{
		color: #3366ff;
	}
	.red{
		color: red;
	}
	.green{
		color: #12c279;
	}
	.status-btn{
		background: #fff;
		border-radius: 10rpx;
		color: #3366ff;
		font-size: 26rpx;
		padding: 8rpx 10rpx;
		border: 1rpx solid #3366ff;
		margin-top: 30rpx;
	}
	.rejected-remark{
		font-size: 28rpx;
		color: #333;
		margin-top: 30rpx;
	}

	.record-item .amount {
		font-size: 30rpx;
		font-weight: bold;
		text-align: right;
	}

	.positive {
		color: #12c279;
	}
	
	
	.negative {
		color: red;
	}

	.timestamp {
		font-size: 22rpx;
		color: #999;
		margin-top: 10rpx;
		text-align: right;
	}
	
	
	
	
	.recharge-card-box {
		background-color: #fff;
		border-radius: 10rpx;
	
		.pay-input-box {
			margin-bottom: 40rpx;
	
			.input-title {
				font-size: 30rpx;
				color: red;
				padding: 20rpx;
			}
	
			.input-box {
				padding: 20rpx;
				display: flex;
				align-items: center;
	
				.yuan-text {
					color: #333;
					font-size: 30rpx;
				}
	
				border-bottom: 1px solid #f3f4f6;
				padding-bottom: 20rpx;
			}
		}
	}
	
	.remark {
		margin-top: 16rpx;
		font-size: 28rpx;
		color: #808080;
	}
	
	.input {
		margin-left: 14rpx;
		font-size: 33rpx;
	}
	
	.popup-header {
		text-align: center;
		font-size: 30rpx;
		padding: 24rpx;
		color: #000;
		font-weight: 500;
		// border-bottom: 1rpx solid #eee;
	}
	
	.fui-icon__close {
		position: absolute;
		top: 24rpx;
		right: 54rpx;
	
	}
	.input-price{
		font-size: 30rpx;
		color: #333;
		padding: 20rpx;
	}
	.d-right{
		display: flex;
		flex-direction: column;
	}
	.expect_amount{
		font-size: 26rpx;
		margin: 10rpx 0rpx;
		// color: #999;
	}
	
	.recharge-btn {
		margin: 0rpx 20rpx;
		background-color: #3366ff;
		color: #fff;
		padding: 20rpx 0;
		font-size: 28rpx;
		border-radius: 10rpx;
		text-align: center;
	}
</style>