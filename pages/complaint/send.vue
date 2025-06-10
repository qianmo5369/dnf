<template>
	<view class="appeal-form-page">
		<!-- 选择被投诉人 -->
		<view class="form-section">
			<text class="label required">被投诉人</text>
			<view class="role-list">
				<view v-for="(role,index) in targets" :key="index" class="role-card" :class="{ selected: selectedIds.includes(index) }"
					  @click="selectRole(index)">
					<tn-avatar :url="role.hero_avatar" size="80rpx" />
					<view class="role-info">
						<view class="role-value">{{ role.resist_power }} {{ role.hero_name }}</view>
						<view class="role-subtitle">{{role.user_nickname}}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 输入投诉内容 -->
		<view class="form-section">
			<text class="label required">投诉内容</text>
			<textarea class="textarea" v-model="reason" placeholder="请输入投诉的详细内容" />
		</view>

		<!-- 上传截图 -->
		<view class="form-section">
			<text class="label">凭证补充</text>
			<view class="upload-box">
				<fui-upload borderColor="#eee" background="#Fff" radius="10" immediate width="200" height="200"
					:url="uploadUrl" :max="3                                                                                                                                                                                                                                                                          " ref="uploadRef" @success="uploadSuccess"
					@error="uploadError"></fui-upload>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="bottom-btn">
			<view class="submit-btn" @tap="submitAppeal">提交申诉</view>
		</view>
	</view>
</template>


<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		baseUrl
	} from "@/util/env";
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app';
	import fuiUpload from "@/components/fui-upload.vue"
	const room_id = ref(null)
	const uploadUrl = baseUrl + '/common/upload';
	const selectedIds = ref([])
	const uploadStatus = ref(false);
	const reason = ref('')
	const imageUrl = ref('')
	const targets = ref([])
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
	
	onMounted(() => {
		getComplaintTargets()
	})
	
	
	const selectRole = (index)=>{
		if (selectedIds.value.includes(index)) {
		    selectedIds.value = selectedIds.value.filter(i => i !== index)
		  } else {
		    selectedIds.value.push(index)
		  }
	}

	const getComplaintTargets = async () => {
		const res = await uni.$http.post('/room/getComplaintTargets', {room_id: room_id.value})
		if (res.code === 1) {
			targets.value = res.data;
		}
	}
	function chooseImage() {
		uni.chooseImage({
			count: 1,
			success(res) {
				imageUrl.value = res.tempFilePaths[0]
			}
		})
	}
	
	const uploadSuccess = (e) => {
		console.log(e)
		//上传成功回调，处理服务器返回数据【此处根据实际返回数据进行处理】
		let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}")
		uploadStatus.value = e.status
		if (res.data.url) {
			imageUrl.value = res.data.url;
		}
	}
	
	const uploadError = (e) => {
		uploadStatus.value = e.status
		uni.showModal({
			content: JSON.stringify(e)
		})
	}

	const submitAppeal =  async () =>{
		if (selectedIds.value.length === 0) {
		    return uni.showToast({ title: '请选择被投诉人', icon: 'none' })
		  }
		if (!reason.value.trim()) {
			return uni.showToast({
				title: '请填写投诉内容',
				icon: 'none'
			})
		}
		

		const res = await uni.$http.post('/room/submitComplaint', {
		    room_id: room_id.value,
		    target_ids: selectedIds.value.map(i => targets.value[i].user_id),
		    reason: reason.value,
		    images: imageUrl.value
		  })
		if (res.code === 1) {
			uni.showToast({
				title: '发起申诉成功，请耐心等待',
				icon: 'none'
			})
			setTimeout(()=>{
				uni.navigateBack()
			},1500)
		}
	}
</script>
<style scoped>
	.appeal-form-page {
		padding: 30rpx;
		background-color: #fff;
		/* min-height: 100vh; */
	}

	.form-header {
		text-align: center;
		margin-bottom: 40rpx;
	}

	.form-title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.label {
		font-size: 30rpx;
		color: #333;
		margin: 20rpx 0rpx;
		display: block;
		font-weight: 500;
	}

	.label.required::before {
		content: '*';
		color: red;
		margin-right: 6rpx;
	}

	.complain-target {
		display: flex;
		align-items: center;
		background: #f5f5f5;
		border-radius: 12rpx;
		padding: 20rpx;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.info .name {
		font-size: 30rpx;
		font-weight: bold;
	}

	.info .sub {
		font-size: 24rpx;
		color: #999;
	}

	.textarea {
		width: 100%;
		height: 200rpx;
		background: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		font-size: 28rpx;
		border: 2rpx solid #f7f7f7;
	}

	.upload-box {
		/* background: #f7f7f7; */
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		/* justify-content: center; */
	}

	.upload-placeholder {
		font-size: 60rpx;
		color: #ccc;
	}

	.preview {
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}

	.bottom-btn {
		margin-top: 80rpx;
	}

	.submit-btn {
		background: #007aff;
		color: #fff;
		font-size: 28rpx;
		border-radius: 10rpx;
		padding: 25rpx 0;
		text-align: center;
	}

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
		border: 2rpx solid transparent;
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
	
	.selected {
	  border: 2rpx solid #2e89ff;
	  background: #e6f0ff;
	}
</style>