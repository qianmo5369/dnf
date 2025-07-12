<template>
  <!-- 弹窗 -->
 
    <!-- 标题栏 -->

    	<view class="hd">
    	      <text class="title">{{title}}</text>
    	      <view class="btn-close" @tap="onClose">
    	        <TnIcon name="close" />
    	      </view>
    	    </view>
    	    <!-- 滚动区域 -->
    	    <scroll-view class="bd" scroll-y>
    		<view class="content-html" v-html="content"></view>
    	
    	
    	    </scroll-view>
    	<!-- 红色提示 -->
    	      
    	    <!-- 底部按钮 -->
    	    <view class="ft">
    	      <view class="btn-group" @tap="onClose">
    	      	<view class="btn btn-primary" >我知道了</view>
    	      </view>
    	    </view>

</template>

<script setup>
import { ref,defineProps,onMounted,defineEmits } from 'vue'
import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'

// 控制弹窗显示
const show = ref(true)
const title = ref('')
const content = ref('')
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	contentId:{
		type:Number,
		default:1
	}
})
const emit = defineEmits(['update:modelValue'])

 const getContent = async () => {

  const res = await uni.$http.post('/index/content',{
	  id:props.contentId
  })
  
  if (res.code === 1) {
	  title.value = res.data.title;
	  content.value = res.data.content;
  }
}

onMounted(()=>{
	getContent()
})



const onClose = () => {
		emit('update:modelValue', false)
	}
</script>

<style scoped>
.hd {
  position: relative;
  text-align: center;
  font-size: 32rpx;
  padding: 24rpx;
  color: #333;
  border-bottom: 1rpx solid #f3f4f6;
}
.btn-close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}
.bd {
  padding: 0 24rpx 20rpx;
  height: 100%;
}
.ft {
	background: #fff;
	position: absolute;
	bottom: 0rpx;
	width: 100%;
}
.content-html{
	padding: 10rpx;
}
.btn {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  font-size: 28rpx;
  border-top: 1rpx solid #f3f4f6;
  color: #3366ff;
/*  line-height: 100rpx;
  height: 100rpx;
  box-sizing: border-box; */
}


</style>
