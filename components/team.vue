<template>
	<!-- 弹窗 -->
	<TnPopup :model-value="contentShow" width="100%" height="100%" borderRadius="16rpx">
		<Parse v-if="contentShow" v-model="contentShow" :contentId="contentId"></Parse>
	</TnPopup>
	<!-- 标题栏 -->
	<view class="hd">
		<text class="title">选择团本</text>
		<view class="btn-close" @tap="onClose">
			<TnIcon name="close" />
		</view>
	</view>



	<!-- 滚动区域 -->
	<!-- <scroll-view class="bd" scroll-y> -->
		<!-- 团本图 -->
<view class="bd">
	

		<fui-horizontal-scroll background="rgba(255, 43, 43, .08)" scrollBarColor="#007aff">
			<view class="dungeon-list">
				<view v-for="(d, index) in modeMapTree" :key="d.id" class="dungeon-item"
					:style="{ backgroundImage: `url(${d.image})` }" @tap="onSelectDungeon(index)">
					<view class="dungeon-label">{{ d.title }}</view>
					<view :class="['mask', selectedDungeon === d.id ? 'mask-hidden' : '']"></view>
				</view>
			</view>
		</fui-horizontal-scroll>





		<!-- 内部切换 Tab -->
		<!-- <view class="inner-tab" v-if="modeMapCode != 'ozma_leilong'">
	    <view
	      v-for="(map, index) in currentDungeon?.maps || []"
	      :key="map.id"
	      class="inner-tab-item"
	      :class="{ active: selectedMapIndex === index }"
	      @tap="selectedMapIndex = index;selectedPosition = null"
	    >
		<image class="right-tab-icon" :src="map.image"
			mode="aspectFit" />
	      <text>{{ map.title }}</text>
	    </view>
	  </view>
	  <view @tap="handleContent(5)" class="leilong-btn" v-else>
	  	雷龙跨区组队教程
	  </view> -->


		<view class="inner-tab">
			<view v-for="(map, index) in currentDungeon?.maps || []" :key="map.id" class="inner-tab-item"
				:class="{ active: selectedMapIndex === index }" @tap="onSelectMap(index)">
				<image class="right-tab-icon" :src="map.image" mode="aspectFit" />
				<text>{{ map.title }}</text>
			</view>
		</view>
		<!-- <view @tap="handleContent(5)" class="leilong-btn" v-else>
	  	雷龙跨区组队教程
	  </view> -->


		<!-- 当前角色 -->
		<view class="current-role">
			<text class="label">当前角色</text>
			<view class="role-display" @click="handleSelectorClick()">
				<TnAvatar :url="userStore.userInfo.default_hero?.hero_avatar" size="70rpx" />
				<text class="role-name">{{userStore.userInfo.default_hero?.resist_power|| ''}}
					{{ userStore.userInfo.default_hero?.hero_name || '默认角色' }}</text>
				<text class="role-seller" v-if="selectedRole.code == 'seller'">(卖家)</text>
				<text class="role-buy" v-if="selectedRole.code == 'deck' || selectedRole.code == 'team'">(买家)</text>
			</view>
		</view>

		<!-- 选择位置 -->
		<view class="form-group" v-if="!selectedRole.code != 'seller'">
			<text class="label">选择位置</text>
			<view class="options">
				<view v-for="role in currentRoles" :key="role.id" class="option-btn"
					:class="{ active: selectedPosition === role.id }"  @tap="onSelectRole(role)">
					{{ role.title }}
				</view>
			</view>
		</view>
		

		
		<view v-if="currentConfigOptions && currentConfigOptions.length">
		  <view
		    class="form-group"
		    v-for="opt in currentConfigOptions"
		    :key="opt.id"
		  >
		  <view class="label-with-tip">
		  	<text>{{ opt.label }}</text>
		  	<TnIcon v-if="opt.show" name="help" style="margin-left: 10rpx;" size="30rpx" @tap="onTips(opt.tips )" />
		  </view>
		  
		    <view class="options">
		      <view
		        v-for="item in opt.options"
		        :key="item.value"
		        class="radio-item"
		        @tap="selectedOptions[opt.id] = item.value"
		      >
			  
		        <view class="radio" :class="{ checked: selectedOptions[opt.id] === item.value }">
					<view v-if="selectedOptions[opt.id] === item.value" class="radio-inner"></view>
				</view>
		        <text>{{ item.label }}</text>
		      </view>
		    </view>
		  </view>
		</view>

		
		
	
		<!-- 雇佣打手 -->
		
		</view>
	<!-- </scroll-view> -->
	<!-- 红色提示 -->

	<!-- 底部按钮 -->
	<view class="ft">
		<view class="warning">
			{{selectedRole.tip}}
			<!-- 如被抢拍，申诉上传出价+被抢价（2张截图） -->
		</view>
		<view class="btn-group">
			<view class="btn" :class="selectedRole.code === 'seller' ? 'btn-primary' : 'btn-outline'"
				v-if="selectedRole.code == 'dps' || selectedRole.code == 'seller' || selectedRole.code == 'baoche' || selectedRole.code == 'leader'"
				@tap="createRoom('create')">创建房间</view>
			<view class="btn btn-primary" :class="{ 'btn-disabled': !selectedRole.code }"
				v-if="selectedRole.code != 'seller'" @tap="createRoom('join')">快速加入</view>
			<!-- <view class="btn btn-primary" v-if="selectedRole.code != 'seller'" @tap="createRoom('join1')">快速加入1</view> -->
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		defineProps,
		computed,
		watch,
		defineEmits
	} from 'vue'
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
	import Parse from "@/components/parse.vue"
	import fuiHorizontalScroll from "@/components/fui-horizontal-scroll/fui-horizontal-scroll.vue"
	import ws from '@/util/ws.js'
	import {
		useUserStore
	} from '@/stores/user'
	// 控制弹窗显示
	const show = ref(true)
	// 计算 70% 高度
	const sys = uni.getSystemInfoSync()
	const popupHeight = sys.windowHeight * 0.7 + 'px';
	const userStore = useUserStore()
	const props = defineProps({
		modelValue: {
			type: Boolean,
			default: false
		},
		modeMapTree: {
			type: Array,
			default: () => []
		},
		channel: {
			type: String,
			default: "wechat"
		}
	})
	const emit = defineEmits(['update:modelValue', 'confirm-select', 'confirm-share', 'confirm-recharge'])
	const handleSelectorClick = () => {
		console.log("通知父组件");
		emit('confirm-select')
	}
	const contentId = ref(null)
	const contentShow = ref(false)
	const handleContent = (id) => {
		contentId.value = id;
		contentShow.value = true;
	}
	
	const onTips = (tips)=>{
		
	}

	const selectedDungeon = ref(0)
	const selectedDungeonIndex = ref(0)
	const selectedMapIndex = ref(0)
	const selectedPosition = ref(null)
	const currentDungeon = computed(() => props.modeMapTree[selectedDungeonIndex.value] || {})
	const currentMap = computed(() => currentDungeon.value?.maps?.[selectedMapIndex.value] || {})
	const currentRoles = computed(() => currentMap.value?.roles || [])
	const configOptions = computed(() => currentDungeon.value?.config_option || {})
	// 当前选中角色对象
	const selectedRole = computed(() =>
		currentRoles.value.find(r => r.id === selectedPosition.value) || {}
	)

	const modeMapCode = computed(() => currentDungeon.value?.code || '')


	const selectedClosure = ref(null)
	const selectedHire = ref(null)
	const selectedTeraRatio = ref(null)
	const selectedTeraOwn = ref(null)
	const selectedIsSolo = ref(null)
	const selectedPrivate = ref(null)
	const selectedSupport = ref(null)



	const showClosureOption = computed(() =>
		modeMapCode.value === "ozma_assault" && ['leader', 'baoche'].includes(selectedRole.value.code)
	)

	const showHireOption = computed(() =>
		modeMapCode.value === "ozma_assault" && ['leader', 'baoche'].includes(selectedRole.value.code)
	)

	const showTeraOptions = computed(() => ['seller', 'deck', 'team'].includes(selectedRole.value.code))

	const showIsSoloOption = computed(() =>
		selectedRole.value.code === 'dps'
	)
	// 拥有泰拉
	const showTeraOwnOption = computed(() => ['seller', 'deck', 'team'].includes(selectedRole.value.code)

	)

	//私密房间
	const showPrivateOption = computed(() => ['seller'].includes(selectedRole.value.code))
	//开启辅助
	const showEnableSupport = computed(() =>
		modeMapCode.value === "ozma_descent" && selectedRole.value.code === 'dps'
	)
	
	const onSelectMap = (index)=>{
		selectedMapIndex.value = index;
		selectedPosition.value = null;
		currentConfigOptions.value =[];
	}
	

	const currentConfigOptions = ref([])    // 当前显示的配置项列表
	const selectedOptions = reactive({});    // 当前已选配置项的值
	const onSelectRole = (role) =>{
		selectedPosition.value = role.id;
		currentConfigOptions.value = JSON.parse(JSON.stringify(role.config_options || []))
		
		  // 每次切换角色，初始化配置项选中值
		  selectedOptionsClear()  // 先清空
		  if (currentConfigOptions.value.length) {
		    currentConfigOptions.value.forEach(opt => {
		      // 默认选中第一个选项
		      selectedOptions[opt.id] = opt.options?.[0]?.value
		    })
		  }
	}
	
	// 清空所有已选项
	function selectedOptionsClear() {
	  Object.keys(selectedOptions).forEach(key => delete selectedOptions[key])
	}



	// 监听 modeMapTree 初始化地图/团本
	watch(
		() => props.modeMapTree,
		(val) => {
			if (val.length > 0) {
				selectedDungeonIndex.value = 0
				selectedDungeon.value = val[0].id
				selectedMapIndex.value = 0;
				console.log(currentMap.value.code);
			}
		}, {
			immediate: true
		}
	)


	const onSelectDungeon = (index) => {
		selectedDungeonIndex.value = index
		selectedDungeon.value = props.modeMapTree[index].id
		selectedMapIndex.value = 0;
		selectedPosition.value = null;
		currentConfigOptions.value = []

	}
	
	
	const getPayloadConfig = ()=> {
	  if (!currentConfigOptions.value.length) return []
	  return currentConfigOptions.value.map(opt => ({
	    option_id: opt.id,
	    value: selectedOptions[opt.id]
	  }))
	}


	const createRoom = async (type = 'create') => {

		const payload = {
			channel: props.channel,
			map_id: currentMap.value?.id,
			role_id: selectedPosition.value,
			hero_id: 0, // 如果你有英雄选择逻辑
			config: getPayloadConfig()
		}
		
		
		 // console.log(getPayloadConfig());


		console.log(type);
		const res = await uni.$http.post(`/dungeon/${type}`, {
			payload
		})

		if (res.code == 100) {
			emit('confirm-recharge', res.data)
			return false;
		}

		if (res.code === 1) {
			ws.send({
				type: 'join',
				room_code: `room_${res.data.roomInfo.room_id}`
			})
			emit('update:modelValue', false)
			if (type == 'create') {
				emit('confirm-share', res.data.roomInfo)
			} else {
				emit('confirm-share', res.data.roomInfo, 'join')

				uni.navigateTo({
					url: `/pages/room/room?room_id=${res.data.roomInfo.room_id}`
				})
			}
		}
	}



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

	/* 团本列表 */
	.dungeon-list {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.dungeon-item {
		position: relative;
		background-size: 100% 100%;
		/* margin: 15rpx 10rpx; */
		width: 190rpx;
		height: 120rpx;
		/* flex: 1; */
		/* background: #fff; */
		/* padding: 20rpx; */
		border-radius: 10rpx;
		color: #888;
		font-size: 24rpx;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-right: 20rpx;
	}

	.dungeon-item:last-child {
		margin-right: 0;
	}

	.dungeon-label {
		position: absolute;
		right: 0rpx;
		bottom: 1rpx;
		padding: 10rpx 10rpx;
		font-size: 26rpx;
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		border-radius: 10rpx 0rpx 10rpx 0rpx;
	}

	/* 内部 Tab */
	.inner-tab {
		flex-direction: row;
		display: flex;
		/* border: 1rpx solid #eee; */
		border-radius: 10rpx;
		overflow: hidden;
		height: 80rpx;
		margin-top: 24rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		/* 阴影效果 */
	}

	.leilong-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80rpx;
		border-radius: 10rpx;
		background: #fff;
		color: #3366ff;
		font-weight: 500;
		border: 1rpx solid #3366ff;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		/* 阴影效果 */
		margin-bottom: 24rpx;
	}

	.inner-tab-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		color: #666;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* .inner-tab-item.active {
  color: #409eff;
  background: #f6f8ff;
} */

	.inner-tab-item text {
		display: inline-block;
		position: relative;
	}

	.inner-tab-item.active text {
		color: #007aff;
		font-weight: bold;
		font-size: 30rpx;
	}

	.inner-tab-item.active text::after {
		content: '';
		position: absolute;
		bottom: -10rpx;
		/* 距离文字底部的距离 */
		left: 0;
		width: 100%;
		height: 5rpx;
		background: linear-gradient(90deg, #366fff 0%, #5da0fc 100%);
		border-radius: 2rpx;
	}


	.right-tab-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 12rpx;
	}

	.current-role {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.role-name {
		margin-left: 20rpx;
		font-size: 30rpx;
	}

	.role-seller {
		color: #409eff;
	}

	.role-buy {
		color: red;
	}

	.tn-icon-help {
		margin-left: 10rpx;
	}

	/* 左侧标签固定宽度（可选） */
	.current-role .label {
		/* 如果想让左侧宽度固定，可以加上宽度 */
		/* width: 120rpx; */
		color: #888;
	}

	/* 右侧角色显示区不自动拉伸 */
	.current-role .role-display {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
	}

	/* 小头像 + 名字间距 */
	.current-role .role-display tn-avatar {
		margin-right: 16rpx;
	}

	/* 表单组 */
	.form-group {
		display: flex;
		justify-content: space-between;
		/* 左右拉满 */
		align-items: center;
		/* 垂直居中 */
		/* margin-bottom: 24rpx; */
		height: 80rpx;
		color: #888;
		font-size: 28rpx;
	}

	/* 标签那一块去掉 margin-bottom */
	.form-group .label-with-tip {
		margin-bottom: 0;
	}

	/* 让选项组靠右 */
	.form-group .options {
		/* 确保 options 不会被拉伸 */
		flex: 0 0 auto;
		display: flex;
		gap: 30rpx;
		color: #000;
	}

	.option-btn {
		flex: 1;
		text-align: center;
		padding: 5rpx 20rpx;
		border: 2rpx solid #ddd;
		border-radius: 5rpx;
		border-color: #3366ff;
		color: #3366ff;
		background: #fff;
	}

	.option-btn.active {
		background: #3366ff;
		color: #fff;
	}

	/* 单选 */
	.radio-item {
		flex-direction: row;
		display: flex;
		align-items: center;
	}

	.radio {
		width: 38rpx;
		height: 38rpx;
		border: 3rpx solid #ccc;
		border-radius: 50%;
		position: relative;
		font-size: 28rpx;
		margin-right: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.radio.checked {
		border-color: #3366ff;
	}

	/* .radio.checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 22rpx;
  height: 22rpx;
  background: #3366ff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
} */
	.radio-inner {
		width: 22rpx;
		height: 22rpx;
		background: #3366ff;
		border-radius: 50%;
	}



	/* 警告 */
	.warning {
		color: #e74c3c;
		font-size: 24rpx;
		text-align: center;
		margin-bottom: 24rpx;
		font-weight: 500;
	}

	/* 底部按钮 */
	.ft {
		position: absolute;
		bottom: 10rpx;
		width: 100%;
	}

	.btn-group {
		flex-direction: row;
		display: flex;
		padding: 20rpx;
		/* padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom)); */
		gap: 16rpx;
		background: #fff;
	}

	.btn {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		border-radius: 40rpx;
		font-size: 28rpx;
		/*  line-height: 100rpx;
  height: 100rpx;
  box-sizing: border-box; */
	}

	.btn-outline {
		border: 2rpx solid #3366ff;
		color: #3366ff;
		background: #fff;
	}

	.btn-primary {
		background: #3366ff;
		color: #fff;
	}


	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.4);
		/* 白色半透明 */
		pointer-events: none;
		/* 不挡点击 */
	}

	.mask-hidden {
		display: none;
	}

	.btn-disabled {
		opacity: 0.5;
		pointer-events: none;
	}
</style>