<template>
	<!-- 弹窗 -->
	<!-- 标题栏 -->
	<view class="hd">
		<text class="title">泰拉车</text>
		<view class="btn-close" @tap="onClose">
			<TnIcon name="close" />
		</view>
	</view>
	<!-- 滚动区域 -->
	<scroll-view class="bd" scroll-y>
		<!-- 团本图 -->
		<!-- <view class="dungeon-list">
			<view v-for="(d, index) in modeMapTree" :key="d.id" class="dungeon-item"
				:style="{ backgroundImage: `url(${d.image})` }" @tap="onSelectDungeon(index)">
				<view class="dungeon-label">{{ d.title }}</view>
				<view :class="['mask', selectedDungeon === d.id ? 'mask-hidden' : '']"></view>
			</view>
		</view> -->

		<view class="dungeon-list">
			<view v-if="ozmaDungeon" class="dungeon-item" :style="{ backgroundImage: `url(${ozmaDungeon.image})` }">
				<!-- <view class="dungeon-label">{{ ozmaDungeon.title }}</view> -->
				<view class="dungeon-label">查看泰拉车规则</view>
				<view class="mask mask-hidden"></view>
			</view>
		</view>



		<!-- 内部切换 Tab -->
		<view class="inner-tab" v-if="false">
			<view v-for="(map, index) in currentDungeon?.maps || []" :key="map.id" class="inner-tab-item"
				:class="{ active: selectedMapIndex === index }" @tap="selectedMapIndex = index;selectedPosition = null">
				<text>{{ map.title }}</text>
			</view>
		</view>


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
		<view class="form-group" v-if="showPositionSelector">
			<text class="label">选择位置</text>
			<view class="options">
				<view v-for="role in filteredRoles" :key="role.id" class="option-btn"
					:class="{ active: selectedPosition === role.id }" @tap="() => handleSelectPosition(role)">
					{{ role.title }}
				</view>
			</view>
		</view>


		<!-- 关闭位置 -->
		<view class="form-group" v-if="showClosureOption">
			<text class="label">关闭位置</text>
			<view class="options">
				<view v-for="opt in configOptions.closure_count" :key="opt.value" class="radio-item"
					@tap="selectedClosure = opt.value">
					<view class="radio" :class="{ checked: selectedClosure === opt.value }" />
					<text>{{ opt.label }}</text>
				</view>
			</view>
		</view>

		<!-- 雇佣打手 -->
		<view class="form-group" v-if="showHireOption">
			<view class="label-with-tip">
				<text>雇佣打手</text>
				<TnIcon name="help" size="24rpx" @tap="tip('雇佣打手说明')" />
			</view>
			<view class="options">
				<view v-for="opt in configOptions.hire_count" :key="opt.value" class="radio-item"
					@tap="selectedHire = opt.value">
					<view class="radio" :class="{ checked: selectedHire === opt.value }" />
					<text>{{ opt.label }}</text>
				</view>
			</view>
		</view>

		<!-- 是否一拖 -->
		<view class="form-group" v-if="showIsSoloOption">
			<text class="label">是否一拖</text>
			<view class="options">
				<view v-for="opt in configOptions.is_solo" :key="opt.value" class="radio-item"
					@tap="selectedIsSolo = opt.value">
					<view class="radio" :class="{ checked: selectedIsSolo === opt.value }" />
					<text>{{ opt.label }}</text>
				</view>
			</view>
		</view>


		<!-- 开启辅助位置 -->
		<view class="form-group" v-if="showEnableSupport">
			<text class="label">开启辅助位置</text>
			<view class="options">
				<view v-for="opt in configOptions.is_solo" :key="opt.value" class="radio-item"
					@tap="selectedSupport = opt.value">
					<view class="radio" :class="{ checked: selectedSupport === opt.value }" />
					<text>{{ opt.label }}</text>
				</view>
			</view>
		</view>




		<!-- 拥有泰拉 -->
		<view class="form-group" v-if="showTeraOwnOption">
			<view class="label-with-tip">
				<text>拥有泰拉</text>
				<TnIcon name="help" size="24rpx" @tap="tip('拥有泰拉说明')" />
			</view>
			<view class="options">
				<view v-for="opt in configOptions.tera_own" :key="opt.value" class="radio-item"
					@tap="selectedTeraOwn = opt.value">
					<view class="radio" :class="{ checked: selectedTeraOwn === opt.value }" />
					<text>{{ opt.label }}</text>
				</view>
			</view>
		</view>

		<view class="form-group" v-if="showTeraOptions">
			<view class="label-with-tip">
				<text>泰拉比例</text>
				<TnIcon name="help" size="24rpx" @tap="tip('泰拉比例说明')" />
			</view>
			<view class="options">
				<view v-for="opt in configOptions.tera_ratio" :key="opt.value" class="radio-item"
					@tap="selectedTeraRatio = opt.value">
					<view class="radio" :class="{ checked: selectedTeraRatio === opt.value }" />
					<text>{{ opt.label }}</text>
				</view>
			</view>
		</view>


		<!-- 是否私密房间 -->
		<view class="form-group" v-if="showPrivateOption">
			<view class="label-with-tip">
				<text>私密房间</text>
				<TnIcon name="help" size="24rpx" @tap="tip('私密房间说明')" />
			</view>
			<view class="options">
				<view v-for="opt in configOptions.is_private" :key="opt.value" class="radio-item"
					@tap="selectedPrivate = opt.value">
					<view class="radio" :class="{ checked: selectedPrivate === opt.value }" />
					<text>{{ opt.label }}</text>
				</view>
			</view>
		</view>


	</scroll-view>
	<!-- 红色提示 -->

	<!-- 底部按钮 -->
	<view class="ft">
		<view class="warning">
			{{selectedRole.tip}}
			<!-- 如被抢拍，申诉上传出价+被抢价（2张截图） -->
		</view>
		<view class="btn-group">
			<view class="btn"
			 :class="selectedRole.code === 'seller' ? 'btn-primary' : 'btn-outline'"
				v-if="selectedRole.code == 'dps' || selectedRole.code == 'seller' || selectedRole.code == 'baoche' || selectedRole.code == 'leader'"
				@tap="createRoom">创建房间</view>
			<view class="btn btn-primary" v-if="selectedRole.code != 'seller'">快速加入</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		defineProps,
		computed,
		watch,
		defineEmits
	} from 'vue'
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
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
		defaultDungeonCode: {
			type: String,
			default: "ozma_assault"
		},
		defaultMapCode: {
			type: String,
			default: "baoche"
		},
		defaultRoleCode: {
			type: String,
			default: "deck"
		}
	})
	const emit = defineEmits(['update:modelValue', 'confirm-select', 'confirm-share'])
	const handleSelectorClick = () => {
		console.log("通知父组件");
		emit('confirm-select')
	}

	const handleSelectPosition = (role) => {
		// 只能选当前可用的 role，且不是 seller 特殊情况
		if (currentMap.value?.code === 'terache' && role.code === 'seller') return
		selectedPosition.value = role.id
	}
	
	const ozmaDungeon = computed(() =>
	  props.modeMapTree.find(d => d.code === 'ozma_assault') || {}
	)



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


	const showPositionSelector = computed(() => {
		const mapCode = currentMap.value?.code
		const roleCode = selectedRole.value.code
		// 如果是特拉切地图 + 卖家，不显示
		if (mapCode === 'terache' && roleCode === 'seller') return false

		// 默认规则
		return ['deck', 'team'].includes(roleCode)
	})

	const filteredRoles = computed(() => {
		const roleCode = selectedRole.value.code
		const mapCode = currentMap.value?.code
		const roles = currentRoles.value

		if (mapCode === 'terache') {
			// 如果是 terache 地图，只显示 一队 和 甲板
			return roles.filter(r => ['team', 'deck'].includes(r.code))
		}

		if (['deck', 'team'].includes(roleCode)) {
			// 正常逻辑
			return roles.filter(r => r.code === roleCode)
		}

		return []
	})


	const roleInited = ref(false)

	watch(
		() => selectedRole.value.code,
		(code) => {
			if (roleInited.value) return // 已初始化过，后续点击不影响

			const mapCode = currentMap.value?.code
			if (mapCode === 'terache') {
				const match = currentRoles.value.find(r => ['deck', 'team'].includes(r.code))
				if (match) selectedPosition.value = match.id
				roleInited.value = true
				return
			}

			if (['deck', 'team'].includes(code)) {
				const match = currentRoles.value.find(r => r.code === code)
				if (match) selectedPosition.value = match.id
			} else {
				selectedPosition.value = null
			}

			roleInited.value = true
		}, {
			immediate: true
		}
	)





	const showClosureOption = computed(() =>
		modeMapCode.value === "ozma_assault" && ['leader', 'baoche'].includes(selectedRole.value.code)
	)

	const showHireOption = computed(() =>
		modeMapCode.value === "ozma_assault" && ['leader', 'baoche'].includes(selectedRole.value.code)
	)

	const showTeraOptions = computed(() => ['seller', 'deck', 'team'].includes(selectedRole.value.code))

	const showIsSoloOption = computed(() =>
		modeMapCode.value === "ozma_assault" && selectedRole.value.code === 'dps'
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


	console.log(currentMap.value.code);





	// 监听 modeMapTree 初始化地图/团本
	// watch(
	//   () => props.modeMapTree,
	//   (val) => {
	//     if (val.length > 0) {
	//       selectedDungeonIndex.value = 0
	//       selectedDungeon.value = val[0].id
	//       selectedMapIndex.value = 0;
	// 	  console.log(currentMap.value.code);
	//     }
	//   },
	//   { immediate: true }
	// )
	const initialized = ref(false)
	
	
	const initSelection = () => {
	  const val = props.modeMapTree
	  console.log('props.modeMapTree.length:', val.length)
	
	  const dungeon = val.find(d => d.code === props.defaultDungeonCode)
	  if (!dungeon) return
	
	  console.log('dungeon.maps:', dungeon.maps)
	  console.log('roles:', dungeon.maps?.[0]?.roles)
	
	  selectedDungeon.value = dungeon.id
	  selectedDungeonIndex.value = val.findIndex(d => d.id === dungeon.id)
	
	  const mapIndex = dungeon.maps?.findIndex(m => m.code === props.defaultMapCode)
	  selectedMapIndex.value = mapIndex >= 0 ? mapIndex : 0
	
	  const map = dungeon.maps?.[selectedMapIndex.value]
	  const role = map?.roles?.find(r => r.code === props.defaultRoleCode)
	  selectedPosition.value = role?.id ?? null
	
	  console.log('selectedMapIndex:', selectedMapIndex.value)
	  console.log('selectedPosition:', selectedPosition.value)
	}



	// watch(
	// 	() => props.modeMapTree,
	// 	(val) => {
	// 		console.log('modeMapTree 到达:', val)
	// 		if (initialized.value || !val.length) return
	// 		// if (val.length === 0) return

	// 		// 根据 code 查找 dungeon
	// 		const dungeonIndex = val.findIndex(d => d.code === props.defaultDungeonCode)
	// 		const dungeon = dungeonIndex >= 0 ? val[dungeonIndex] : val[0]
	// 		selectedDungeonIndex.value = dungeonIndex >= 0 ? dungeonIndex : 0
	// 		selectedDungeon.value = dungeon.id

	// 		// 根据 code 查找 map
	// 		const mapIndex = dungeon.maps?.findIndex(m => m.code === props.defaultMapCode)
	// 		selectedMapIndex.value = mapIndex >= 0 ? mapIndex : 0

	// 		// 根据 code 查找 role
	// 		const map = dungeon.maps?.[selectedMapIndex.value]
	// 		const role = map?.roles?.find(r => r.code === props.defaultRoleCode)
	// 		selectedPosition.value = role?.id ?? null
	// 		  initialized.value = true
	// 	}, {
	// 		immediate: true
	// 	}
	// )
	
	
	
	watch(
	  () => props.modeMapTree,
	  (val) => {
	    if (val.length) {
	      // 延迟执行，等 DOM / 数据都 ready
	      setTimeout(() => {
	        initSelection()
	      }, 50)
	    }
	  },
	  { immediate: true }
	)






	watch(() => configOptions.value.closure_count, (opts) => {
		if (opts?.length) selectedClosure.value = opts[0].value
	}, {
		immediate: true
	})

	watch(() => configOptions.value.hire_count, (opts) => {
		if (opts?.length) selectedHire.value = opts[0].value
	}, {
		immediate: true
	})

	watch(() => configOptions.value.tera_ratio, (opts) => {
		if (opts?.length) selectedTeraRatio.value = opts[0].value
	}, {
		immediate: true
	})

	watch(() => configOptions.value.tera_own, (opts) => {
		if (opts?.length) selectedTeraOwn.value = opts[0].value
	}, {
		immediate: true
	})

	watch(() => configOptions.value.is_solo, (opts) => {
		if (opts?.length) selectedIsSolo.value = opts[0].value
	}, {
		immediate: true
	})


	watch(() => configOptions.value.is_private, (opts) => {
		if (opts?.length) selectedPrivate.value = opts[0].value
	}, {
		immediate: true
	})


	watch(() => configOptions.value.enable_support, (opts) => {
		if (opts?.length) selectedSupport.value = opts[0].value
	}, {
		immediate: true
	})

	const onSelectDungeon = (index) => {
		selectedDungeonIndex.value = index
		selectedDungeon.value = props.modeMapTree[index].id
		selectedMapIndex.value = 0;
		selectedPosition.value = null;

	}

	const createRoom = async () => {
		console.log(props.channel);
		const payload = {
			channel: props.channel,
			map_id: currentMap.value?.id,
			role_id: selectedPosition.value,
			hero_id: 0, // 如果你有英雄选择逻辑
			config: []
		}
		
		
		const findOptionId = (groupKey, value) => {
		  const list = configOptions.value[groupKey] || []
		  const option = list.find(item => item.value == value)
		  return option?.id || null
		}
		
		// 然后改写你的逻辑：
		if (showClosureOption.value && selectedClosure.value) {
		  const id = findOptionId('closure_count', selectedClosure.value)
		  if (id) payload.config.push(id)
		}
		
		if (showHireOption.value && selectedHire.value) {
		  const id = findOptionId('hire_count', selectedHire.value)
		  if (id) payload.config.push(id)
		}
		
		if (showTeraOptions.value && selectedTeraRatio.value) {
		  const id = findOptionId('tera_ratio', selectedTeraRatio.value)
		  if (id) payload.config.push(id)
		}
		
		if (showTeraOwnOption.value && selectedTeraOwn.value) {
		  const id = findOptionId('tera_own', selectedTeraOwn.value)
		  if (id) payload.config.push(id)
		}
		
		if (showIsSoloOption.value && selectedIsSolo.value) {
		  const id = findOptionId('is_solo', selectedIsSolo.value)
		  if (id) payload.config.push(id)
		}
		
		if (showPrivateOption.value && selectedPrivate.value) {
		  const id = findOptionId('is_private', selectedPrivate.value)
		  if (id) payload.config.push(id)
		}
		
		if (showEnableSupport.value && selectedSupport.value) {
		  const id = findOptionId('enable_support', selectedSupport.value)
		  if (id) payload.config.push(id)
		}

		// 动态添加 config 字段
		// if (showClosureOption.value) {
		// 	payload.config.closure_count = selectedClosure.value
		// }
		// if (showHireOption.value) {
		// 	payload.config.hire_count = selectedHire.value
		// }
		// if (showTeraOptions.value && selectedTeraRatio.value) {
		// 	payload.config.tera_ratio = selectedTeraRatio.value
		// }
		// if (showTeraOwnOption.value && selectedTeraOwn.value) {
		// 	payload.config.tera_own = selectedTeraOwn.value
		// }
		// if (showIsSoloOption.value && selectedIsSolo.value) {
		// 	payload.config.is_solo = selectedIsSolo.value
		// }
		// if (showPrivateOption.value && selectedPrivate.value) {
		// 	payload.config.is_private = selectedPrivate.value
		// }
		// if (showEnableSupport.value && selectedSupport.value) {
		// 	payload.config.enable_support = selectedSupport.value
		// }
		const res = await uni.$http.post('/dungeon/create', {
			payload
		})
		console.log('用户信息:', res)

		if (res.code === 1) {
			emit('update:modelValue', false)
			emit('confirm-share', res.data.roomInfo)
			// modeMapTree.value = res.data
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
		gap: 10rpx;
		margin-bottom: 24rpx;
	}

	.dungeon-item {
		position: relative;
		background-size: 100% 100%;
		/* margin: 15rpx 10rpx; */
		height: 280rpx;
		flex: 1;
		/* background: #fff; */
		/* padding: 20rpx; */
		border-radius: 10rpx;
		color: #888;
		font-size: 24rpx;
	}

	.dungeon-label {
		position: absolute;
		right: 0rpx;
		bottom: 5rpx;
		padding: 15rpx 35rpx;
		font-size: 26rpx;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		border-radius: 100rpx 0rpx 0rpx 100rpx;
	}

	/* 内部 Tab */
	.inner-tab {
		flex-direction: row;
		display: flex;
		/* border: 1rpx solid #eee; */
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		/* 阴影效果 */
	}

	.inner-tab-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		color: #666;
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
	}

	.radio.checked {
		border-color: #3366ff;
	}

	.radio.checked::after {
		content: "";
		position: absolute;
		top: 6rpx;
		left: 6rpx;
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
</style>