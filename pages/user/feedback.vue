<template>
	<view class="feedback-page">

		<view class="section">
			<view class="label">问题分类：</view>
			<view class="type-list">
				<view v-for="item in typeList" :key="type" class="type-tag" :class="{ active: selectedType === item }"
					@tap="selectedType = item">
					{{ item }}
				</view>
			</view>
		</view>


		<view class="section">
			<textarea class="textarea" placeholder="请简要描述您的问题和意见" v-model="desc" />
		</view>


		<view class="section">
			<view class="upload-box">
				<!-- <text class="plus">+</text> -->
				<fui-upload borderColor="#eee" background="#Fff" radius="10" immediate width="200" height="200"
					:url="uploadUrl" :max="3" ref="uploadRef" @success="uploadSuccess"
					@error="uploadError"></fui-upload>
			</view>
		</view>

		<view class="btn-box">
			<view class="submit-btn" @click="submit">提交</view>
		</view>
	</view>
</template>

<script setup>
	import fuiUpload from "@/components/fui-upload.vue"
	import {
		baseUrl
	} from "@/util/env";
	import {
		ref
	} from 'vue'
	const uploadRef = ref(null)
	const uploadUrl = baseUrl + '/common/upload'
	const uploadStatus = ref(false);
	const typeList = ['需求建议', '功能异常', '其他']
	const selectedType = ref('需求建议')
	const desc = ref('')
	const imageList = ref([])


	const uploadSuccess = (e) => {
		console.log(e)
		//上传成功回调，处理服务器返回数据【此处根据实际返回数据进行处理】
		let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}")
		uploadStatus.value = e.status
		if (res.data.url) {
			imageList.value = res.data.url;
			//处理结果返回给组件 
			//data.url为上传成功后返回的图片地址
			//e.index为图片索引值
			// this.$refs.upload.result(res.data.url, e.index)
		}
	}

	const uploadError = (e) => {
		uploadStatus.value = e.status
		uni.showModal({
			content: JSON.stringify(e)
		})
	}



	const submit = async () => {
		if (!desc.value.trim()) {
			uni.showToast({
				title: '请填写问题描述',
				icon: 'none'
			})
			return
		}

		const res = await uni.$http.post('/dungeon/submitFeedback', {
			content: desc.value,
			type: selectedType.value,
			images: imageList.value
		})
		if (res.code === 1) {
			uni.showToast({
				title: '提交成功',
				icon: 'none'
			})
			setTimeout(()=>{
				uni.navigateBack()
			},1000)
		}


	}
</script>

<style scoped>
	.feedback-page {
		padding: 30rpx;
		background-color: #fff;

	}

	.section {
		margin-bottom: 30rpx;
		display: flex;
		align-items: center;
	}

	.label {
		font-size: 28rpx;
		color: #333;
		/* margin-bottom: 20rpx; */
	}

	.type-list {
		display: flex;
		gap: 20rpx;
		flex-wrap: wrap;
	}

	.type-tag {
		padding: 10rpx 30rpx;
		border-radius: 32rpx;
		background-color: #f5f5f5;
		color: #333;
		font-size: 26rpx;
	}

	.type-tag.active {
		background-color: #e6f0ff;
		color: #007aff;
	}

	.textarea {
		width: 100%;
		min-height: 200rpx;
		border-radius: 12rpx;
		background-color: #f8f9fb;
		padding: 20rpx;
		font-size: 28rpx;
		color: #333;
	}

	.upload-box {
		/* width: 200rpx;
		height: 140rpx; */
		/* background-color: #f8f9fb; */
		/* border-radius: 12rpx; */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.plus {
		font-size: 60rpx;
		color: #555;
	}

	.btn-box {
		margin-top: 60rpx;
	}

	.submit-btn {
		width: 100%;
		background-color: #007aff;
		color: #fff;
		font-size: 30rpx;
		padding: 24rpx 0;
		text-align: center;
		border-radius: 60rpx;
	}
</style>