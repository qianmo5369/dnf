<template>
	<view class="container">
		<view ref="budgetcontainer" class="budget-container">

			<view class="budget-card">
				<view class="budget-header">
					<view class="header-left">
						<!-- <uni-icons class="header-icon" color="#fff" type="help" size="18"></uni-icons> -->
						<TnIcon name="help" color="#fff" />
						<text class="header-text1">本次费用预算</text>
						<view class="ratio-badge">
							比例{{detail.settle_data.config.tera_ratio}}
						</view>
					</view>
					<view class="header-right" @tap="linkTo(`/pages/room/room?room_id=${room_id}`)">
						<text>查看房间</text>
						<TnIcon name="right" color="#fff" />
					</view>
				</view>
				<view class="budget-content">
					<view class="content-section" v-if="!detail.is_seller">
						<view class="content-item">
							分红泰拉: {{formatWan(detail.my_info.bonus)}}(拍卖手续费平摊)
						</view>
						<view class="content-item">
							总费用: {{detail.my_info.final_yuan}}元(泰拉费用{{detail.my_info.final_yuan}}，车费{{detail.my_info.car_fee}})
						</view>
						<view class="content-item">
							押金: {{detail.my_info.deposit}}元
						</view>
					</view>
					<view class="content-section" v-else>
						<view class="content-item">
							泰拉收益: {{detail.my_info.bonus_yuan}}元
						</view>
						<view class="content-item">
							卡片分红: {{detail.my_info.card_bonus_yuan}}元
						</view>
						<view class="content-item">
							预计收益: {{detail.my_info.final_yuan}}元
						</view>
						<!-- <view class="content-item with-icon">
							<image class="item-icon" src="/static/uni.png" mode="heightFix"></image>
							<text>卖家红包奖励:3元</text>
						</view> -->
					</view>
					<!-- <image class="content-decoration" src="/static/uni.png" mode="heightFix"></image> -->
				</view>
			</view>
		</view>

		<view class="timeline-container">
			<fui-steps :items="steps" direction="column" :current="steps.length - 0">
				<template #default="{ item, index }">
					<view v-if="item.type ==  'step1'" class="timeline-card" :key="index">
						<view class="card-content">
							<view class="card-row">
								<text>卖家花费泰拉：</text>
								<text class="highlight-red">{{detail.settle_data.tera_cost}}万</text>
							</view>
							<view class="card-row">
								<text>是否有可交易卡片：</text>
								<text v-if="detail.settle_data.has_card">有</text>
								<text v-else>无</text>
							</view>
							<view class="card-row" v-if="detail.settle_data.has_card">
								<text>卡片低一档拍卖价格：</text>
								<text class="highlight-red">{{detail.settle_data.card_price}}万</text>

							</view>
							<view class="card-row image-row">
								<text>相关截图：</text>
								<image @tap="showimage(settle_imgs)" class="settlement-img" v-for="(settle_imgs,i) in detail.settle_imgs" :src="settle_imgs" :key="i" mode="aspectFit" />
							</view>
						</view>
					</view>
					
					<view v-if="item.type == 'step2'" class="confirmation-list" :key="index">
			
							<view class="confirmation-item" v-for="(membersItem,index1) in detail.members" :key="index1">
								<!-- <image src="/static/logo.png" mode="aspectFill" class="confirmation-avatar">
								</image> -->
								<TnAvatar size="70rpx" :url="membersItem.hero_avatar" />
								<view class="confirmation-details">
									<view class="confirmation-name-row">
										<text>{{membersItem.resist_power}}{{membersItem.hero_name}}</text>
										<text class="confirmation-team-tag">{{membersItem.role_name}}</text>
									</view>
									<view class="confirmation-comment">{{membersItem.hero_nickname}}</view>
								</view>
								<text class="confirmation-status" v-if="membersItem.confirmed == 0">待确认</text>
								<text class="confirmation-status green" v-if="membersItem.confirmed == 1">已确认</text>
							</view>
					</view>
					
					<view v-if="item.type ==  'complaintsTips'" class="notice-card">
						<view class="notice-content">
							<uni-icons class="notice-icon" color="#333" type="info" size="34"></uni-icons>
							<view class="notice-text">
								<!-- <view>结算单存在异议</view> -->
								<view><text class="highlight-red">结算单存在异议将由平台审核结算</text></view>
							</view>
						</view>
					</view>
					
					
					<view class="timeline-card" v-if="item.type == 'complaints'" >
						<view class="card-content">
							<view class="character-info">
								<!-- <image src="/static/logo.png" mode="aspectFill" class="character-avatar"></image> -->
								<TnAvatar class="character-avatar" size="70rpx" :url="item.hero_avatar" />
								<view class="character-details">
									<view class="character-name-row">
										<text class="character-name">{{item.resist_power}}{{item.hero_name}}</text>
										<text class="team-tag">{{item.role_title}}</text>
									</view>
									<view class="character-nickname">{{item.hero_nickname}}</view>
								</view>
							</view>
							<view class="card-row">
								<text>内容：</text>
								<text>{{item.content}}</text>
							</view>
							<view class="card-row image-row" v-if="item.images && item.images.length">
								<text>相关截图：</text>
								<view class="reply-images" v-if="item.images && item.images.length">
									<image @tap="showimage(replyImg)" class="reply-img" v-for="(replyImg,i) in item.images" :src="replyImg" :key="i" mode="aspectFit" />
								</view>
								<!-- <image @click="showimage('/static/uni.png')" src="/static/uni.png"
									mode="aspectFill" class="card-image"></image> -->
							</view>
						</view>
					</view>
					
					
					<view v-if="item.type ==  'tips'" class="notice-card">
						<view class="notice-content">
							<uni-icons class="notice-icon" color="#333" type="info" size="34"></uni-icons>
							<view class="notice-text">
								<view>若结算单未存在异议</view>
								<view>房间完成 <text class="highlight-red">10分钟后</text> 将由平台审核结算</view>
							</view>
						</view>
					</view>
					
					
					<view v-if="item.type ==  'completed'" class="notice-card">
						<view class="notice-content">
							<view class="notice-text">
								<view>结算完成,由平台确认完成</view>
								<view>{{item.content}}</view>
							</view>
						</view>
					</view>
					
					
					
				</template>
				</fui-steps>
			
			
			<!-- <template v-for="(item,index) in list" :key="index">
				<view class="timeline-item">
					<view class="timeline-content-wrapper">
						<view class="timeline-icon-container">
							<view class="timeline-icon-vertical">
								<uni-icons v-if="index===0" class="header-icon first-icon" color="#00aaff"
									type="checkbox-filled" size="25"></uni-icons>
								<view v-else class="timeline-dot"></view>
								<view v-if="index!==list.length-1" class="timeline-connector"></view>
							</view>
						</view>

						<view class="timeline-details">
							<view class="timeline-header">
								<text class="header-text">卖家提交初步结算</text>
								<view class="timeline-time">6分钟前</view>
							</view>

							<view v-if="index===0" class="timeline-card">
								<view class="card-content">
									<view class="card-row">
										<text>卖家花费泰拉：</text>
										<text class="highlight-red">3万</text>
									</view>
									<view class="card-row">
										<text>是否有可交易卡片：</text>
										<text>无</text>
									</view>
									<view class="card-row image-row">
										<text>相关截图：</text>
										<image @click="showimage('/static/uni.png')" src="/static/uni.png"
											mode="aspectFill" class="card-image"></image>
									</view>
								</view>
							</view>
							<view v-if="index===1" class="timeline-card">
								<view class="card-content">
									<view class="character-info">
										<image src="/static/logo.png" mode="aspectFill" class="character-avatar">
										</image>
										<view class="character-details">
											<view class="character-name-row">
												<text class="character-name">4.011奶妈</text>
												<text class="team-tag">一队</text>
											</view>
											<view class="character-nickname">银娃er</view>
										</view>
									</view>
									<view class="card-row">
										<text>是否有可交易卡片：</text>
										<text>摸鱼拉满</text>
									</view>
									<view class="card-row image-row">
										<text>相关截图：</text>
										<image @click="showimage('/static/uni.png')" src="/static/uni.png"
											mode="aspectFill" class="card-image"></image>
									</view>
								</view>
							</view>

			
							<view v-if="index===2" class="timeline-card">
								<view class="card-content">
									<view class="platform-header">
										<image src="/static/logo.png" mode="aspectFill" class="platform-avatar"></image>
										<view class="platform-info">
											<view class="platform-info-row">
												<text class="platform-title">平台修改结算</text>
												<text class="platform-date">6月1日8</text>
											</view>
										</view>
									</view>
									<view class="card-row">
										<text>卖家花费泰拉：</text>
										<text class="highlight-red">3万</text>
									</view>
									<view class="card-row">
										<text>是否有可交易卡片：</text>
										<text>摸鱼拉满</text>
									</view>
									<view class="card-row note-row">
										<text>备注：</text>
										<text class="note-text">卖家违规未按标额拉满，扣除押金等额泰拉备注费用，扣除25万泰拉收益</text>
									</view>
								</view>
							</view>

							<view v-if="index===3" class="timeline-card">
								<view class="card-content">
									<view class="platform-header">
										<image src="/static/logo.png" mode="aspectFill" class="platform-avatar"></image>
										<view class="platform-info">
											<view class="platform-info-row">
												<text class="platform-title">平台修改结算</text>
												<text class="platform-date">6月1日8</text>
											</view>
										</view>
									</view>
									<view class="card-row">
										<text style="flex: 1;">已打款19.8元至微信零钱。如需提取押金，请前往主页提取。</text>
									</view>
									<view class="card-row">
										<text style="flex: 1;">泰拉收益19.8=19.8</text>
									</view>
								</view>
							</view>

							<view v-if="index===4">
								<view class="confirmation-list">
									<template v-for="(item,index1) in 5" :key="index1">
										<view class="confirmation-item">
											<image src="/static/logo.png" mode="aspectFill" class="confirmation-avatar">
											</image>
											<view class="confirmation-details">
												<view class="confirmation-name-row">
													<text>大萨达</text>
													<text class="confirmation-team-tag">一队</text>
												</view>
												<view class="confirmation-comment">的方法发啊</view>
											</view>
											<text class="confirmation-status">已确认</text>
										</view>
									</template>
								</view>

								<view class="notice-card">
									<view class="notice-content">
										<uni-icons class="notice-icon" color="#333" type="info" size="34"></uni-icons>
										<view class="notice-text">
											<view>若结算单未存在异议</view>
											<view>房间完成 <text class="highlight-red">10分钟后</text> 将由平台审核结算</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</template> -->
		</view>

		<view class="footer-container">
			<view class="customer-service">
				<uni-icons class="customer-service-icon" color="#00aaff" type="headphones" size="14"></uni-icons>
				<text class="customer-service-text">联系客服</text>
			</view>
			<view class="action-buttons" v-if="detail.status != 'completed'">
				<view v-if="detail.can_submit_complaint" @tap="linkTo(`/pages/complaint/send?room_id=${detail.room_id}`)" class="action-button dispute-button">
					发起异议
				</view>
				<view v-if="detail.can_reply_complaint" @tap="linkTo(`/pages/complaint/reply?complaint_id=${detail.complaint_id}`)" class="action-button dispute-button">
					加入回复
				</view>
				<view @tap="confirmSettlement" v-if="detail.show_confirm_button" class="action-button confirm-button">
					确认结算
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		nextTick
	} from 'vue';
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app';
	import fuiSteps from "@/components/fui-steps.vue"
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import { formatWan } from '@/util/formatNumber.js'
	import ws from '@/util/ws.js'
	const pageType = ref(false); //true:结算中    false:结算完成
	const containerHeight = ref('100vh');
	const budgetcontainer = ref(null)
	const clientHeight = ref(200)
	const steps = ref([])
	const list = ref([1, 2, 3, 4, 5])
	const room_id = ref(null);
	const detail = ref({})
	onLoad((params) => {
		if (params.room_id) {
			room_id.value = params.room_id;
		} else {
			uni.showToast({
				title: "房间不存在",
				icon: 'none'
			})
		}
	})
	
	const linkTo = (path, type = '') => {
		if (type == 'tabbar') {
			uni.switchTab({
				url: path
			})
		} else {
			uni.navigateTo({
				url: path
			})
		}
	}
	
	
	const getSettlementDetail =  async () => {
		const res = await uni.$http.post('/dungeon/getSettlementDetail', {
			room_id: room_id.value
		})
		if (res.code === 1) {
			detail.value = res.data
			buildSteps(res.data);
		}
	}
	
	const confirmSettlement =  async () => {
		const res = await uni.$http.post('/room/confirmSettlement', {
			room_id: room_id.value
		})
		if (res.code === 1) {
			getSettlementDetail()
		}
	}
	
	onMounted(() => {
getSettlementDetail()
		ws.on('confirmSettlement', (msg) => {
			console.log("泰拉车结算更新");
			detail.value = msg.data;
			buildSteps(msg.data);
		})
		
	});
	
	
	const buildSteps = (data) => {
		const result = []
	
		// 投诉信息
		result.push({
			type: 'step1',
			title: "卖家提交初步结算",
		})
		result.push({
			type: 'step2',
			title: "买家确认结算",
		})
		
		// if (data.status == 'pending') {
		// 	result.push({
		// 		type: 'tips',
		// 		title:"提示"
		// 	})
		// }
		
		if(data.complaint_thread.length>0){
			result.push({
				type: 'tips',
				title: "",
			})
		}
		
	
		// 第二步及以后：回复内容
		if (Array.isArray(data.complaint_thread)) {
			
			
			if(data.complaint_thread.length>0){
				result.push({
					type: 'complaintsTips',
					title:"平台介入"
				})
			}
			data.complaint_thread.forEach(reply => {
				console.log(reply);
				
				let reason = '';
				if(reply.is_topic == 1){
					reason = reply.reason
				}else{
					reason = reply.content
				}
				
				result.push({
					type: 'complaints',
					title:"买家发起争议",
					nickname: reply.nickname,
					hero_avatar: reply.hero_avatar,
					hero_name: reply.hero_name,
					hero_nickname: reply.hero_nickname,
					content: reason,
					role_title: reply.role_title,
					images:reply.images,
					reply_time: reply.created_at_text
				})
			})
		}
	
		
		
		
		
		if (data.status == 'resolved') {
			result.push({
				type: 'status',
				title:"处理完成",
				content:"同意和解"
			})
		}
		
		if (data.status == 'cancelled') {
			result.push({
				type: 'status',
				title:"处理完成",
				content:"撤回申诉"
			})
		}
		
		if(data.status == 'completed'){
			result.push({
				type: 'completed',
				title:"",
				content:data.summary
			})
		}
		
		console.log(result);
		steps.value = result
	}
	const showimage = (e) => {
		uni.previewImage({
			urls: [e], // 需要预览的图片http链接列表
			current: '', // 当前显示图片的http链接，默认是第一个
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	}
</script>

<style>
	.container{
		height: 100%;
		/* height: 100vh; */
	}
	.budget-container {
		padding: 30rpx;
		position: absolute;
		height: 300rpx;
		left: 0;
		right: 0;
		top: 0;
		background-color: #f5f5f5;
		z-index: 1;

	}

	.budget-card {
		border-radius: 10rpx;
		overflow: hidden;
		border: 2rpx solid #00aaff;
		font-size: 24rpx;
	}

	.budget-header {
		background-color: #00aaff;
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		color: #fff;
		font-size: 28rpx;
	}

	.header-left {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.header-icon {
		margin-top: 2rpx;
	}

	.header-text {
		margin: 0 14rpx;
	}

	.ratio-badge {
		color: #00aaff;
		background-color: #fff;
		padding: 0 10rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
	}

	.header-right {
		display: flex;
		align-items: center;
	}

	.budget-content {
		flex-direction: column;
		position: relative;
		background-color: #fff;
		display: flex;
		padding: 20rpx 30rpx;
		color: #333;
		font-size: 28rpx;
	}

	.content-section {
		display: flex;
		flex-direction: column;
	}

	.content-item {
		margin-top: 10rpx;
	}

	.content-item:first-child {
		margin-top: 0;
	}

	.content-item.with-icon {
		display: flex;
		align-items: center;
	}

	.item-icon {
		height: 40rpx;
		margin-right: 20rpx;
	}

	.content-decoration {
		height: 140rpx;
		position: absolute;
		right: 20rpx;
		transform: translateY(-50%);
		top: 50%;
	}


	.footer-container {
		padding: 0 20rpx;
		height: 110rpx;
		background-color: #fff;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
	}

	.customer-service {
		border: 2rpx solid #00aaff;
		padding: 5rpx 20rpx;
		display: flex;
		align-items: center;
		border-radius: 10rpx;
	}

	.customer-service-icon {
		margin-right: 5rpx;
		/* Added for spacing between icon and text */
	}

	.customer-service-text {
		color: #00aaff;
	}

	.action-buttons {
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: flex-end;
	}

	.action-button {
		border-radius: 10rpx;
		padding: 10rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}

	.dispute-button {
		background-color: #f71212;
	}

	.confirm-button {
		background-color: #00aaff;
		margin-left: 30rpx;
	}


	.timeline-container {
		position: absolute;
		left: 0;
		right: 0;
		top: 330rpx;
		bottom: 110rpx;
		overflow-y: auto;
		background-color: #fff;
		padding: 30rpx;
	}

	/* Timeline Item Styles */


	.timeline-content-wrapper {
		display: flex;
	}

	.timeline-icon-container {
		display: flex;
		width: 50rpx;
		justify-content: center;
	}

	.timeline-icon-vertical {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.first-icon {
		position: relative;
	}

	.timeline-dot {
		position: relative;
		background-color: #00aaff;
		width: 20rpx;
		height: 20rpx;
		border-radius: 300rpx;
	}

	.timeline-connector {
		width: 2px;
		background-color: #f5f5f5;
		flex: 1;
		margin-top: -10rpx;
	}

	.timeline-details {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.timeline-header {
		display: flex;
		flex: 1;
		align-items: center;
	}

	.header-text {
		flex: 1;
	}

	.timeline-time {
		color: #999;
		font-size: 24rpx;
	}

	/* Card Styles */
	.timeline-card {
		font-size: 26rpx;
		margin-top: 20rpx;
		margin-left: 15rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
	}

	.card-content {
		color: #333;
		margin-top: 10rpx;
	}

	.card-row {
		margin-top: 10rpx;
	}

	.image-row {
		display: flex;
		align-items: center;
	}

	.card-image {
		display: flex;
		align-items: center;
		
	}
	.settlement-img{
		border-radius: 10rpx;
		width: 150rpx;
		height: 100rpx;
		margin-left: 20rpx;
	}

	.note-row {
		display: flex;
		align-items: center;
	}

	.note-text {
		color: #000;
		flex: 1;
	}

	.highlight-red {
		color: #ff0000;
	}

	/* Character Info Styles */
	.character-info {
		display: flex;
		align-items: center;
	}

	.character-avatar {
		border-radius: 300rpx;
		width: 80rpx;
		height: 80rpx;
		margin-right: 10rpx;
	}

	.character-details {
		display: flex;
		flex-direction: column;
	}

	.character-name-row {
		display: flex;
		align-items: center;
	}

	.character-name {
		color: #000;
		font-size: 30rpx;
	}

	.team-tag {
		padding: 4rpx 20rpx;
		background-color: #aa0000;
		border-radius: 10rpx;
		color: #fff;
		margin-left: 20rpx;
		font-size: 24rpx;
	}

	.character-nickname {
		color: #999;
	}

	/* Platform Info Styles */
	.platform-header {
		display: flex;
		align-items: center;
		border-bottom: 2rpx #999 solid;
		padding-bottom: 15rpx;
	}

	.platform-avatar {
		border-radius: 300rpx;
		width: 50rpx;
		height: 50rpx;
		margin-right: 10rpx;
	}

	.platform-info {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.platform-info-row {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.platform-title {
		color: #000;
		font-size: 30rpx;
		flex: 1;
	}

	.platform-date {
		color: #999;
		margin-left: 20rpx;
		font-size: 24rpx;
	}

	.confirmation-list {
		font-size: 26rpx;
		margin-top: 20rpx;
		margin-left: 15rpx;
		margin-bottom: 20rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
	}

	.confirmation-item {
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
	}

	.confirmation-avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 300rpx;
	}

	.confirmation-details {
		margin-left: 20rpx;
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.confirmation-name-row {
		display: flex;
		align-items: center;
		font-size: 28rpx;
	}

	.confirmation-team-tag {
		margin-left: 10rpx;
		padding: 0rpx 15rpx;
		border-radius: 10rpx;
		background-color: #aa0000;
		color: #fff;
	}

	.confirmation-comment {
		color: #999;
	}

	.confirmation-status {
		color: #aa0000;
	}
	.green{
		color: green;
	}

	/* Notice Card Styles */
	.notice-card {
		font-size: 26rpx;
		margin-top: 20rpx;
		margin-left: 15rpx;
		margin-bottom: 20rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
	}

	.notice-content {
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
	}

	.notice-icon {
		margin-right: 20rpx;
	}

	.notice-text {
		color: #333;
	}

	.header-text1 {
		margin: 0 15rpx;
	}
	
	.reply-img{
		width: 150rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}
</style>