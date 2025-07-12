<template>
	<view class="appeal-detail-page">
		<!-- 状态栏 & 标题 -->
		<view class="page-header">
			<text v-if="complaintInfo.status == 'pending'" class="status green">待处理</text>
			<text v-if="complaintInfo.status == 'processing'" class="status green">处理中</text>
			<text v-if="complaintInfo.status == 'resolved'" class="status green">同意和解</text>
			<text v-if="complaintInfo.status == 'cancelled'" class="status">处理完成</text>
		</view>
		<fui-steps :items="steps" direction="column" :current="steps.length - 0">
			<template #default="{ item, index }">
				<view class="appeal-card" v-if="item.type === 'complaint'" :key="index">
					<view class="appeal-user">
						<view class="info">
							<TnAvatar class="avatar" size="lg" :url="complaintInfo.from_user.avatar" />
							<view class="from_user">
								<view class="name">{{complaintInfo.from_user.nickname}}</view>
								<view class="user_id">{{complaintInfo.from_user.id}}</view>
							</view>
						</view>
						<view class="time">{{complaintInfo.created_at_text}}</view>
					</view>

					<view class="appeal-body">
						<view class="role-info">
							<text class="label">投诉方：</text>
							<view class="role-card">
								<TnAvatar size="70rpx" :url="complaintInfo.from_user.hero_avatar" />
								<view class="role-card-info">
									<view class="role-value">{{complaintInfo.from_user.hero_name}} <text
											class="tag blue">{{complaintInfo.from_user.role_title}}</text></view>
									<view class="role-subtitle">{{complaintInfo.from_user.hero_nickname}}</view>
								</view>
							</view>
						</view>



						<view class="role-info with-multi">
							<text class="label">被投诉方：</text>
							<view class="target-list">
								<view v-for="(target, idx) in complaintInfo.target_users" :key="idx" class="role-card">
									<TnAvatar size="70rpx" :url="target.hero_avatar" />
									<view class="role-card-info">
										<view class="role-value">{{target.hero_name}}<text
												class="tag red">{{target.role_title}}</text></view>
										<view class="role-subtitle">{{target.hero_nickname}}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="appeal-text">
							<text class="label">投诉内容：</text>
							<text>{{complaintInfo.reason}}</text>
						</view>
						<view class="reply-images" v-if="complaintInfo.image_urls">
							<image @tap="previewImage(replyImg)" class="reply-img" v-for="(replyImg,i) in complaintInfo.image_urls" :src="replyImg" :key="i" mode="aspectFit" />
						</view>
					</view>
				</view>


				<!-- 回复记录步骤 -->
				<view v-if="item.type === 'reply' " :key="index">
					<view class="reply-card">
						<view class="reply-header">
							<TnAvatar size="70rpx" :url="item.hero_avatar" />
							
							<view class="name">
								<view >{{ item.hero_name }}</view>
								<view class="role-subtitle">{{ item.hero_nickname }}</view>
							</view>
							<text class="reply-time">{{ item.reply_time }}</text>
						</view>
						<view class="reply-content">
							<text>{{ item.content }}</text>
						</view>
						<view class="reply-images" v-if="item.images">
							<image @tap="previewImage(replyImg)" class="reply-img" v-for="(replyImg,i) in item.images" :src="replyImg" :key="i" mode="aspectFit" />
						</view>
					</view>
				</view>

				<view v-if="item.type === 'tips' " class="appeal-tip">
					若 <text class="red">24小时内</text> 对方未提供证词，平台将介入处理。
				</view>
				
				<view v-if="item.type === 'status' " class="appeal-tip">
					处理结果 <text class="red">{{item.content}}</text>
				</view>

			</template>
		</fui-steps>
		<!-- 底部按钮栏 -->
		<view class="footer" v-if="complaintInfo.status != 'cancelled' && complaintInfo.status != 'resolved'">
			<view class="fui-tabbar__content">
				<view class="bottom-btns">
					<view class="btn light" v-if="complaintInfo.self_role == 'initiator'">
						<text v-if="complaintInfo.is_platform_involved">已申请平台介入</text>
						<text v-else  @tap="requestPlatformIntervention">平台介入</text>
					</view>
					<view class="right-btns">
						<view v-if="complaintInfo.self_role == 'target' && complaintInfo.status != 'cancelled'"
							class="btn primary" @tap="agreeToSettlement">同意和解</view>
						<view v-if="complaintInfo.self_role == 'initiator' && complaintInfo.status != 'cancelled'"
							class="btn primary" @tap="cancelComplaint">撤回申诉</view>
						<view class="btn primary" @tap="linkTo(`/pages/complaint/reply?complaint_id=${complaintInfo.id}`)">回复内容
						</view>
					</view>
				</view>
			</view>
			<fui-safe-area></fui-safe-area>
		</view>
		

	</view>
</template>
<script setup>
	import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'
	import TnModal from '@/uni_modules/tuniaoui-vue3/components/modal/src/modal.vue'
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import fuiUpload from "@/components/fui-upload.vue"
	import {
		ref,
		defineProps,
		computed,
		watch,
		onMounted,
		onUnmounted

	} from 'vue'
	import ws from '@/util/ws.js'
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app';
	import {
		baseUrl
	} from "@/util/env";
	import fuiBottomPopup from "@/components/fui-bottom-popup.vue"
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
	import fuiSafeArea from "@/components/fui-safe-area.vue"
	import fuiNavBar from "@/components/fui-nav-bar.vue"
	import fuiDialog from "@/components/fui-dialog.vue"
	import fuiSteps from "@/components/fui-steps.vue"
	
	const complaint_id = ref(null)
	const complaintInfo = ref({})
	onLoad((params) => {
		if (params.complaint_id) {
			complaint_id.value = params.complaint_id;
		} else {
			uni.showToast({
				title: "房间不存在",
				icon: 'none'
			})
		}
	})

	const steps = ref([])

	const current = ref(0)
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

	// 获取投诉详细
	const getComplaintDetail = async () => {
		const res = await uni.$http.post('/room/complaintDetail', {
			complaint_id: complaint_id.value
		})
		if (res.code === 1) {
			complaintInfo.value = res.data;
			buildSteps(res.data);
		}
	}
	
	const requestPlatformIntervention = async () => {
		const res = await uni.$http.post('/room/requestPlatformIntervention', {
			complaint_id: complaint_id.value
		})
		if (res.code === 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			getComplaintDetail()
		}
	}
	
	const agreeToSettlement =  async () => {
		const res = await uni.$http.post('/room/agreeToSettlement', {
			complaint_id: complaint_id.value
		})
		if (res.code === 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			getComplaintDetail()
		}
	}
	
	const cancelComplaint = async () => {
		const res = await uni.$http.post('/room/cancelComplaint', {
			complaint_id: complaint_id.value
		})
		if (res.code === 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			getComplaintDetail()
		}
	}
	
	
	const previewImage = (e) => {
		uni.previewImage({
			urls: [e], // 需要预览的图片http链接列表
			current: '', // 当前显示图片的http链接，默认是第一个
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	}


	const buildSteps = (data) => {
		const result = []

		// 投诉信息
		result.push({
			type: 'complaint',
			title: "玩家发起投诉",
			from_user: data.from_user,
			target_users: data.target_users,
			reason: data.reason,
			created_at_text: data.created_at_text
		})

		// 第二步及以后：回复内容
		if (Array.isArray(data.replies)) {

			data.replies.forEach(reply => {
				console.log(reply);
				result.push({
					type: 'reply',
					title:"回复",
					nickname: reply.nickname,
					hero_avatar: reply.hero_avatar,
					hero_name: reply.hero_name,
					hero_nickname: reply.hero_nickname,
					content: reply.content,
					role_title: reply.role_title,
					images:reply.images,
					reply_time: reply.created_at_text
				})
			})
		}

		if (data.status == 'pending') {
			result.push({
				type: 'tips',
				title:"提示"
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
		
		console.log(result);
		steps.value = result
	}

	onMounted(() => {
		getComplaintDetail()
		
		ws.on('complaintUpdated', (msg) => {
			
			buildSteps(msg.data);
		})
		
	})
</script>

<style scoped>
	.appeal-detail-page {
		background: #fff;
		padding: 30rpx;
		/* min-height: 100vh; */
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: center;
		/* margin-bottom: 30rpx; */
	}

	.status {
		color: #00c292;
		font-size: 35rpx;
		margin: 30rpx 0rpx;
		font-weight: 500;
	}

	.blue {
		color: #0284FE;
	}

	.red {
		color: #ff3a3a;
	}

	.green {
		color: #22cc88;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.appeal-card {
		background: #f8f8f8;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}

	.appeal-user {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.info {
		display: flex;
		align-items: center;
	}

	.info .name {
		font-size: 30rpx;
		font-weight: bold;
	}

	.time {
		flex: 1;
		text-align: right;
		font-size: 26rpx;
		color: #999;
	}

	.appeal-body .role-info {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.role-avatar {
		width: 80rpx;
		height: 80rpx;
		margin: 0 12rpx;
	}

	.from_user {
		margin-left: 10rpx;
	}

	.from_user .name {
		font-size: 30rpx;
	}

	.user_id {
		margin-top: 10rpx;
		font-size: 25rpx;
		color: #555;
	}

	.hero_name {
		font-size: 25rpx;
		color: #000;
	}

	.hero_nickname {
		font-size: 25rpx;
		color: #333;
	}

	.label {
		width: 150rpx;
		font-size: 28rpx;
		color: #555;
	}

	.role-card {
		position: relative;
		display: flex;
		align-items: center;
		/* padding: 20rpx; */
	}

	.role-card-info {
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

	.tag {
		font-size: 22rpx;
		padding: 4rpx 15rpx;
		border-radius: 10rpx;
		margin-left: 30rpx;
		color: #fff;
	}

	.tag.blue {
		background: #2e89ff;
	}

	.tag.red {
		background: #ff4d4f;
	}
	
	.reply-images{
		display: flex;
		flex-wrap: wrap;
	
		
	}
	
	.reply-img{
		width: 150rpx;
		height: 100rpx;
		margin-right: 20rpx;
	}

	.appeal-text {
		font-size: 28rpx;
		color: #333;
		margin-top: 10rpx;
		line-height: 1.6;
	}

	.appeal-tip {
		background: #f4f4f4;
		/* border-left: 6rpx solid #2e89ff; */
		padding: 24rpx;
		font-size: 26rpx;
		color: #333;
		border-radius: 10rpx;
		margin-bottom: 120rpx;
	}

	.appeal-tip .red {
		color: #e64340;
	}
	
	.footer{
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
	}
	
	.fui-tabbar__content {
		/* border: 1rpx solid #fff; */
		width: 100%;
		height: 100rpx;
		background: #fff;
		display: flex;
		align-items: center;
		padding: 0 32rpx;
		box-sizing: border-box;
	}

	.bottom-btns {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn {
		/* flex: 1; */
		text-align: center;
		padding: 10rpx 15rpx;
		border-radius: 10rpx;
		font-size: 26rpx;
	}

	.btn.light {
		background-color: #fbd9d8;
		color: #d84315;
		margin-right: 20rpx;
		/* visibility: hidden; */
	}

	.btn.primary {
		background-color: #007aff;
		color: #fff;
		margin-right: 15rpx;
	}

	.appeal-user {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}


	.appeal-user {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.target-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		/* margin-left: 80rpx; */
	}

	.role-info.with-multi {
		display: flex;
		align-items: flex-start;
		margin: 30rpx 0rpx;
	}



	.reply-card {
		background: #f9f9f9;
		border-radius: 12rpx;
		padding: 20rpx;
		margin: 20rpx 0;
	}

	.reply-header {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #ccc;
	}

	.reply-header .avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.reply-header .name {
		font-size: 28rpx;
		font-weight: bold;
		margin-right: 10rpx;
		margin-left: 10rpx;
	}

	.reply-header .reply-time {
		font-size: 24rpx;
		color: #999;
		flex: 1;
		text-align: right;
	}

	.reply-content {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
	}

	.right-btns {
		/* margin-right: auto; */
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}
</style>