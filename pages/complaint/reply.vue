<template>
	<view class="appeal-form-page">
		<!-- 输入投诉内容 -->
		<view class="form-section">
			<text class="label required">补充内容</text>
			<textarea class="textarea" v-model="content" placeholder="请输入补充内容" />
		</view>

		<!-- 上传截图 -->
		<view class="form-section">
			<text class="label">凭证补充(可选)</text>
			<view class="upload-box">
				<fui-upload borderColor="#eee" background="#Fff" radius="10" immediate width="200" height="200"
					:url="uploadUrl" :max="3                                                                                                                                                                                                                                                                          " ref="uploadRef" @success="uploadSuccess"
					@error="uploadError"></fui-upload>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="bottom-btn">
			<view class="submit-btn" @tap="addComplaintReply">提交回复</view>
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
	const complaint_id = ref(null)
	const uploadUrl = baseUrl + '/common/upload';
	const selectedIds = ref([])
	const uploadStatus = ref(false);
	const content = ref('')
	const imageUrl = ref([])
	const targets = ref([

	])
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
	
	

	function chooseImage(e) {
		uni.previewImage({
			urls: [e], // 需要预览的图片http链接列表
			current: '', // 当前显示图片的http链接，默认是第一个
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	}
	
	const uploadSuccess = (e) => {
		console.log(e)
		//上传成功回调，处理服务器返回数据【此处根据实际返回数据进行处理】
		let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}")
		uploadStatus.value = e.status
		if (res.data.url) {
			// imageUrl.value = res.data.url;
			imageUrl.value.push(res.data.url)
		}
	}
	
	// const uploadSuccess = (e) => {
	// 	console.log(e)
	// 	//上传成功回调，处理服务器返回数据【此处根据实际返回数据进行处理】
	// 	let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}")
	// 	uploadStatus.value = e.status
	// 	if (res.data.url) {
	// 		imageUrl.value = res.data.url;
	// 		//处理结果返回给组件 
	// 		//data.url为上传成功后返回的图片地址
	// 		//e.index为图片索引值
	// 		// this.$refs.upload.result(res.data.url, e.index)
	// 	}
	// }
	
	
	
	const uploadError = (e) => {
		uploadStatus.value = e.status
		uni.showModal({
			content: JSON.stringify(e)
		})
	}

	const addComplaintReply =  async () =>{
		
		if (!content.value.trim()) {
			return uni.showToast({
				title: '请填写回复内容',
				icon: 'none'
			})
		}
		const imagesList = imageUrl.value.join(',')  
		const res = await uni.$http.post('/room/addComplaintReply', {
		    complaint_id: complaint_id.value,	
		    content: content.value,
		    images: imagesList
		  })
		if (res.code === 1) {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
			
			setTimeout(()=>{
				uni.navigateBack()
			},1200)
			
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