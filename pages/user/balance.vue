<template>
	<view class="balance-page">

		<TnPopup :model-value="rechargeShow" width="80%" height="400rpx" borderRadius="16rpx">
			<view class="recharge-card-box">
				<view class="popup-header">余额充值</view>
				<view class="fui-icon__close" @tap="rechargeShow = false;amount = null">
					<TnIcon name="close" />
				</view>
				<view class="pay-input-box">
					<view class="input-title">
						充值未使用的余额可以申请退款
					</view>
					<view class="input-box">
						<text class="yuan-text">￥</text>
						<input class="input" type="text" v-model="amount" placeholder="请输入充值金额" />
					</view>
				</view>
				<view class="recharge-btn" @tap="doRecharge()">
					确认充值
				</view>
			</view>
		</TnPopup>

		<!-- 顶部余额卡片 -->
		<view class="balance-card">
			<view class="balance-left">
				<view class="label">账号余额（元）</view>
				<view class="amount">{{ balance }}</view>
			</view>
			<view class="balance-right" @click="goWithdraw">去提现</view>
			<view class="balance-right btn-charge" @tap="onCharge">去充值</view>
		</view>

		<!-- 收支明细标题 -->
		<view class="section-title">收支明细</view>

		<!-- 明细列表 -->
		<view class="record-list">
			<z-paging
			  ref="paging"
			  v-model="fundList"
			  @query="getFundLogs"
				:fixed="false"
			>
			<view class="record-item" v-for="(item,index) in fundList" :key="item.id">
				<view class="left">
					<view class="title">
						{{item.remark}}
						<!-- <text v-if="item.type == 'recharge'">充值</text> -->
						 <text class="tip" v-if="item.tip">?</text>
					</view>
					<view class="desc">余额：{{ item.balance }}</view>
				</view>
				<view class="right">
					<view :class="['amount', item.direction == 'in' ? 'positive' : 'negative']">
						{{ item.direction  == 'in' ? '+' : '' }}{{ item.amount }}
					</view>
					<!-- <view class="time">{{ item.time }}</view> -->
				</view>
			</view>
			</z-paging>
		</view>

		<!-- 充值按钮 -->
		<!-- <view class="btn-footer">
			<view class="btn-charge" @click="onCharge">充值</view>
		</view> -->
	</view>
</template>

<script setup>
	import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
	import {
		ref
	} from 'vue'
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue';
	const paging = ref(null)
	useZPaging(paging)
	const balance = ref(null)
	const amount = ref(null)
	const rechargeShow = ref(false)
	
	
	const fundList = ref([])
	
	const getFundLogs = async (pageNo, pageSize) => {
	  const res = await uni.$http.post('/dungeon/fundLogs', {
	    page: pageNo,
	    page_size: pageSize
	  })
	  if (res.code === 1) {
	    balance.value = res.data.balance
	    paging.value.complete(res.data.list)
	  } else {
	    paging.value.complete(false)
	  }
	}
	
	

	const goWithdraw = () => {
		// uni.navigateTo({
		// 	url: '/pages/withdraw/index'
		// })
		uni.showToast({
			title: '暂无提现接口',
			icon: 'none'
		})
	}

	const doRecharge = async () => {
		if (amount.value <= 0) {
			uni.showToast({
				title: '请输入充值金额',
				icon: 'none'
			})
			return false;
		}
		
		// // #ifdef H5
		//     uni.showToast({
		//     	title: '未配置h5支付',
		//     	icon: 'none'
		//     })
		// 	return false;
		// // #endif

		
		const res = await uni.$http.post('/dungeon/recharge', {
			amount: amount.value
		})
		if (res.code === 1) {
			
			uni.requestPayment({
			 appId: res.data.result.appId,
			 timeStamp: res.data.result.timeStamp,
			 nonceStr: res.data.result.nonceStr,
			 package: res.data.result.package,
			 signType: res.data.result.signType,
			 paySign: res.data.result.paySign,
			 success: (res) => {
			  uni.showToast({
			  	title: '已完成支付',
			  	icon: 'none'
			  })
			  // getInfo();
			  paging.value.reload();
			  rechargeShow.value = false;
			 },
			 fail: (err) => {
			  console.log(err)
			  uni.showToast({
			  	title: '未付款',
			  	icon: 'none'
			  })
			 }
			});
			// 可刷新房间状态或跳转
		} else {
			uni.showToast({
				title: res.msg || '请求支付错误',
				icon: 'none'
			})
		}


	}

	const onCharge = () => {
		rechargeShow.value = true
		// uni.navigateTo({ url: '/pages/charge/index' })
	}
</script>

<style scoped lang="scss">
	.balance-page {
		position: relative;
		// height: 100vh;
		/* background: #f6f6f6; */
		/* min-height: 100vh; */
		/* display: flex;
  flex-direction: column; */
	}

	.balance-card {
		background: url("https://dnf.hanyunkeji.cn/static/user/card.png");
		height: 300rpx;
		background-size: 100% 100%;
		margin: 30rpx;
		/* border-bottom-left-radius: 24rpx;
  border-bottom-right-radius: 24rpx; */
		padding: 40rpx 30rpx;
		color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.balance-left .label {
		display: block;
		font-size: 28rpx;
		opacity: 0.9;
	}

	.balance-left .amount {
		font-size: 52rpx;
		font-weight: bold;
		margin-top: 32rpx;
	}

	.balance-right {
		position: absolute;
		background: #ffffff;
		color: #1e90ff;
		font-size: 26rpx;
		padding: 12rpx 32rpx;
		border-top-left-radius: 32rpx;
		border-bottom-left-radius: 32rpx;
		right: 0;
		top: 80rpx;
	}


	.btn-charge {
		right: 0;
		background-color: #3366ff;
		color: #fff;
		top: 180rpx;
	}

	.section-title {
		padding: 30rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.record-list {
		padding: 0 24rpx;
		height: 60vh;
	}

	.record-item {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.record-item .title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	.record-item .desc {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.tip {
		font-size: 20rpx;
		background: #eee;
		border-radius: 50%;
		width: 28rpx;
		height: 28rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-left: 10rpx;
		color: #888;
	}

	.right .amount {
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

	.right .time {
		font-size: 22rpx;
		color: #999;
		margin-top: 10rpx;
		text-align: right;
	}

	.btn-footer {
		width: 100%;
		position: absolute;
		bottom: 50rpx;
		padding: 30rpx;
		background: #fff;
		/* margin-top: auto; */
	}

	// .btn-charge {
	// 	background: linear-gradient(135deg, #1e90ff, #3a8bff);
	// 	color: #fff;
	// 	font-size: 30rpx;
	// 	padding: 20rpx 0;
	// 	text-align: center;
	// 	border-radius: 60rpx;
	// 	width: 100%;
	// }






	.recharge-card-box {
		background-color: #fff;
		border-radius: 10rpx;

		.pay-input-box {
			margin-bottom: 40rpx;

			.input-title {
				font-size: 30rpx;
				color: red;
				padding: 25rpx 20rpx;
			}

			.input-box {
				padding: 0rpx 20rpx;
				display: flex;
				align-items: center;

				.yuan-text {
					font-size: 33rpx;
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
		border-bottom: 1rpx solid #eee;
	}

	.fui-icon__close {
		position: absolute;
		top: 24rpx;
		right: 54rpx;

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