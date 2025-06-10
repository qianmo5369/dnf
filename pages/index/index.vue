<template>
	<view class="container">
		<view :style="{ height: navBarHeight + 'px' }" />
		<!-- 顶部状态栏（真实系统状态） -->
		<!-- <view class="real-status-bar"></view> -->

		<fui-bottom-popup :show="show" zIndex="1000000">
			<Roles v-model="show"></Roles>
		</fui-bottom-popup>
		
		
		<!-- 房间创建 -->
		<TnPopup :model-value="shareShow" width="80%" height="415rpx" borderRadius="16rpx">
			<view class="share-card-box">
				<view class="share-header">创建成功</view>
				<view class="fui-icon__close" @tap="shareShowHandle">
					<TnIcon name="close" />
				</view>
				<view class="share-body">
					<image class="ok-icon" src="https://dnf.hanyunkeji.cn/static/home/ok.png" mode="aspectFit"></image>
					<view class="share-remark">
						分享房间，更快完成组队哦~
					</view>
				</view>
				<button class="share-btn" open-type="share" @tap="onShare()">
					分享房间
				</button>
			</view>
		</TnPopup>
		
		<TnPopup :model-value="contentShow" width="80%" height="60vh" borderRadius="16rpx">
			<Parse v-if="contentShow" v-model="contentShow" :contentId="contentId"></Parse>
		</TnPopup>

		

		<TnPopup :model-value="teamShow" width="90%" height="70%" borderRadius="16rpx" >
			<Team v-model="teamShow" :modeMapTree="modeMapTree" :channel="currentTab" :useUserStore="userStore" @confirm-select="handleShowSelector" @confirm-share="handleShowShare" ></Team>
		</TnPopup>
		<TnPopup :model-value="dungeonShow" width="90%" height="70%" borderRadius="16rpx" >
			<dungeonSelect   v-if="childReady" v-model="dungeonShow" defaultDungeonCode="ozma_assault"
					defaultMapCode="terache"
					:defaultRoleCode="defaultRoleCode"     :modeMapTree="modeMapTree" :channel="currentTab" :useUserStore="userStore" @confirm-select="handleShowSelector" @confirm-share="handleShowShare" ></dungeonSelect>
		</TnPopup>
		
		<!-- 进行中的组队 -->
		<view class="progress-layout" v-if="showContinue">
			<view class="progress-wrap">
				<view class="lable">
					你存在进行中的组队
				</view>
				<view class="link-btn" @tap="handleActiveRoom">
					前往房间
				</view>
			</view>
		</view>

		<!-- 顶部标签栏 -->
		<view class="top-tabs-wrap" id="header">
			<!-- <view class="top-kefu">
				客服
			</view> -->
			<view class="refresh" @tap="refresh()"></view>
			<view class="top-tabs">
	
				
				<view class="tab" :class="{ active: currentTab === item.value }" @tap="selectTab(item.value)"
					v-for="(item, index) in tabs" :key="item.value" >
					<image class="tab-icon" :src="item.icon" mode="aspectFill" />
					{{ item.label }}
				</view>
				
			</view>
		</view>

		<view class="team-layout" id="team">
			<view class="create-join-btn" @click="teamShow = true">
				<image class="fighting-icon" src="https://dnf.hanyunkeji.cn/static/01.png" mode="aspectFill" />
				<text class="join-title">创建/加入</text>
			</view>
			<view class="team-panel">

				<view class="team-header" v-if="!userStore.userInfo?.default_user_hero_id">
					<image src="https://dnf.hanyunkeji.cn/static/t3.jpeg" mode="aspectFit" class="team-avatar"></image>
					<text class="team-title">未选角色</text>
				</view>

				<view class="team-header" v-else>
					<image :src="userStore.userInfo.default_hero?.hero_avatar" mode="aspectFit" class="team-avatar" />
					<text class="team-title">{{userStore.userInfo.default_hero?.resist_power|| ''}}
						{{ userStore.userInfo.default_hero?.hero_name || '默认角色' }}</text>
				</view>

				<view class="team-cards">


					<view class="team-btn orange" @tap="handleRoleCode('seller')">
						<image class="buy-icon" src="https://dnf.hanyunkeji.cn/static/06.png" mode="aspectFit"></image>
						<text class="team-btn-title">卖家</text>
					</view>
					<view class="team-btn yellow" @tap="handleRoleCode('deck')">
						<image class="buy-icon" src="https://dnf.hanyunkeji.cn/static/05.png" mode="aspectFit"></image>
						<text class="team-btn-title">买家</text>
					</view>

					<view class="team-btn" @click="show =true">
						<image class="buy-icon primary" src="https://dnf.hanyunkeji.cn/static/home/03.png" mode="aspectFit"></image>
						<text class="team-btn-title">角色</text>
					</view>


				</view>
			</view>
		</view>
		<view class="app" @tap="handleContent(1)">
			<view class="gz">了解平台规则-上车更容易</view>
		</view>

		<!-- <tn-button @click="show = true">打开弹窗</tn-button> -->

		<!-- 主体左右结构 -->
		<view class="main-layout">
			<!-- 左侧侧边栏（结合优化） -->
			<view class="left-sidebar">
				<view class="left-layout">
					<view class="rule-btn">游戏分类</view>
					<view class="left-category">
						<!-- 可滚动副本分类 -->
						<scroll-view scroll-y class="left-scroll">
							<view v-for="(mode, index) in modeMapTree" :key="mode.id" 
								:class="['nav-item', selectedModeIndex === index ? 'active' : '']"
								:style="{ backgroundImage: `url(${mode.image})` }"

								@tap="onSelectMode(index)">
								<view class="game-title">
									{{ mode.title }}
								</view>
								<view  :class="['mask', selectedModeIndex === index ? 'mask-hidden' : '']"></view>
							</view>
						</scroll-view>
					</view>
				</view>

				<!-- <view class="banner-box">
					<image class="banner" src="https://dnf.hanyunkeji.cn/static/banner.png" mode="aspectFill" />
				</view> -->

				<!-- <view class="kefu-btn">
					<image class="kefu-img" src="https://dnf.hanyunkeji.cn/static/kefu.png" mode="aspectFill" />
					<view class="kefu-tag">客服</view>
				</view> -->
			</view>

			<!-- 右侧列表内容（示例） -->
			<view class="right-content">

				
				<view class="card-layout">
					<view class="right-tabs-wrapper">
						<view class="right-tabs">
					
							<view v-for="(map, idx) in currentMode?.maps || []" :key="map.id"
								:class="['right-tab', selectedMapIndex === idx ? 'active' : '']" @tap="onSelectMap(idx)">
								<image class="right-tab-icon" src="https://dnf.hanyunkeji.cn/static/avatar.png" mode="aspectFit" />
								<text class="right-tab-text">{{ map.title }}</text>
								<view class="right-tab-underline" v-if="selectedMapIndex === idx"></view>
							</view>
						</view>
					</view>
					
					<!-- <scroll-view scroll-y style="height: 100vh;"> -->
					<view :style="scrollViewStyle" class="room-list">
						<z-paging ref="paging" :fixed="false"  v-model="roomList" @query="getRoomList">
							<view class="card" v-for="room in roomList" :key="room.id" @click="linkTo(`/pages/room/room?room_id=${room.id}`)">
								<!-- <view class="card-tag" v-if="item == 3">
									<text v-if="item == 3">等待中</text>
								</view> -->
								<view class="corner-tag" :class="room.status" v-if="room.status == 'waiting'">
									<text class="corner-text">等待中</text>
								</view>
								<view class="corner-tag" :class="room.status" v-if="room.status == 'in_progress'">
									<text class="corner-text">进行中</text>
								</view>
								<view class="card-content">
									<view class="card-avatar">
										<image class="user-avatar" :src="room.creator_hero.hero_avatar" />
									</view>
									<view class="card-info">
										<view class="card-top">
											<view class="nickname">{{room.creator_hero.resist_power|| ''}}
												{{room.creator_hero.hero_name || ''}}</view>
										</view>
										<view class="card-time">
											<image class="time-img" src="https://dnf.hanyunkeji.cn/static/time.png" mode="aspectFill"></image>
											{{room.created_text}}
										</view>
									</view>
									<view class="card-status" v-if="room.status == 'completed'">
										<image class="success-img" src="https://dnf.hanyunkeji.cn/static/success_3.png" mode="aspectFill"></image>
									</view>
									<view class="card-status" v-if="room.status == 'disbanded'">
										<image class="success-img" src="https://dnf.hanyunkeji.cn/static/room/200.png" mode="aspectFill"></image>
									</view>
								</view>
								<view class="card-bottom">
									<view class="card-bottom-tag" v-if="room.tera_own">
										比例{{room.tera_ratio}}
									</view>
									<view class="card-icons">
										<image v-for="pos in room.positions" :key="pos.role_id" class="tag-img"
											:src="getRoleIcon(pos.code, pos.filled)" mode="aspectFill" />
									</view>
						
								</view>
							</view>
							</z-paging>
					</view>
					
					<!-- </scroll-view> -->
				</view>

			</view>
		</view>
	</view>
</template>

<script setup>
	import useZPaging from "@/uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js";
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue'
	import fuiBottomPopup from "@/components/fui-bottom-popup.vue"
	import fuiTag from "@/components/fui-tag.vue"
	import Parse from "@/components/parse.vue"
	import TnIcon from '@/uni_modules/tuniaoui-vue3/components/icon/src/icon.vue'
	import { onShareAppMessage, onLoad,onShow } from '@dcloudio/uni-app'
	import {
		ref,
		computed,
		onMounted,
	} from 'vue'
	import Roles from '@/components/Roles.vue';
	import Team from '@/components/team.vue';
	import dungeonSelect from '@/components/dungeonSelect.vue';
	import {
		useUserStore
	} from '@/stores/user'
	
	import {
		useSystemStore
	} from '@/stores/system'
	
	const system = useSystemStore()
	// import test from '@/utils/request/index.js'
	const paging = ref(null)
	useZPaging(paging)
	const statusBarHeight = ref(0)
	const navBarHeight = ref(0)
	const topHeight = ref(0);
	const userStore = useUserStore()
	const windowHeight = ref(0)
	const shareRoomInfo = ref({})
	const roomList = ref([])
	const contentShow = ref(false)
	const contentId = ref(0)
	const defaultRoleCode = ref('');
	const childReady = ref(false)
	const showContinue = ref(false)

	const modeMapTree = ref([])
	const selectedModeIndex = ref(0)
	const selectedMapIndex = ref(0)

	const currentMode = computed(() => modeMapTree.value[selectedModeIndex.value] || {})
	const currentMap = computed(() => currentMode.value.maps?.[selectedMapIndex.value] || {})
	const currentRoles = computed(() => currentMap.value.roles || [])
	
	const shareShow = ref(false)
	const dungeonShow = ref(false)
	
	const handleContent = (id)=>{
		contentId.value = id;
		contentShow.value = true;
	}
	
	const handleRoleCode = (val) =>{
		defaultRoleCode.value = val;
		// dungeonShow.value  = true;
		 setTimeout(() => {
			 dungeonShow.value  = true;
		    childReady.value = true
		  }, 30) // 延迟渲染确保
	}
	
	// 页面重新显示（切换回来时触发）
	onShow(() => {
	  getActiveRoom()
	  paging.value.reload();
	})
	
	
	const tabs = [
	  { label: '微信区', value: 'wechat', icon: 'https://dnf.hanyunkeji.cn/static/home/wechat.png' },
	  { label: 'QQ区', value: 'QQ', icon: 'https://dnf.hanyunkeji.cn/static/home/qq.png' }
	]
	const currentTab = ref('wechat')
	
	const selectTab =  (val)=>  {
	  currentTab.value = val;
	  paging.value.reload();
	}
	
	onLoad((params) => {
		if(params.share_uid){
			uni.setStorageSync('share_uid',params.share_uid)
			console.log("缓存分享uid" + params.share_uid);
		}
	})


	const handleShowSelector = ()=>{
		console.log('父组件收到 show-selector 事件');
		show.value  = true;
		// teamShow.value = true;
	}
	
	const shareShowHandle = ()=>{
		shareShow.value = false;
		handleActiveRoom()
	}
	
	const handleShowShare = (val) =>{
		console.log('父组件收到 show-share 事件'+ val);
		shareRoomInfo.value = val
		shareShow.value = true;
		paging.value.reload();
		getActiveRoom()
	}
	function onSelectMode(index) {
		console.log(selectedModeIndex.value);
		selectedModeIndex.value = index
		selectedMapIndex.value = 0 // 切换模式时默认选第一个地图
		paging.value.reload();
	}

	function onSelectMap(index) {
		selectedMapIndex.value = index;
		console.log(index);
		paging.value.reload();
	}

	const getModeMapTree = async () => {
		const res = await uni.$http.get('/dungeon/modeMapTree')
		console.log('用户信息:', res)

		if (res.code === 1) {
			modeMapTree.value = res.data;
			paging.value.reload();
		}
	}
	
	const activeRoomId = ref(null)
	const getActiveRoom = async () => {
		const res = await uni.$http.get('/room/getActiveRoom')
		if (res.code === 1 && res.data.has_room) {
			console.log("zhix ");
			activeRoomId.value = res.data.room_id;
			showContinue.value = true;
		}else{
			showContinue.value = false;
		}
	}
	
	const handleActiveRoom  = ()=>{
		linkTo(`/pages/room/room?room_id=${activeRoomId.value}`)
	}
	
	const refresh = ()=>{
		console.log("1111");
		paging.value.reload();
	}
	
	const onShare = () =>{
		console.log("分享房间");
		uni.navigateTo({
			url:`/pages/room/room?room_id=${shareRoomInfo.value.room_id}`
		})
		// if (process.env.UNI_PLATFORM === 'h5') {
		//   // H5平台逻辑
		// }
		// if (process.env.UNI_PLATFORM === 'mp-weixin') {
		//   // 微信小程序平台逻辑
		// }
		// if (process.env.UNI_PLATFORM === 'app') {
		//   // App平台逻辑
		// }

	}
	
	onShareAppMessage(() => {
	  return {
	    title: `【8868打团|${shareRoomInfo.value.channel}】快来组队吧：`,
	    path: `/pages/room/room?id=${shareRoomInfo.value.room_id}&share_uid=${userStore.userInfo.id}`,
	    imageUrl: shareRoomInfo.value.mode_image
	  }
	})
	
	
	


	// 在合适的时机调用
	onMounted(() => {
		getModeMapTree()
		getActiveRoom()
		const sys = uni.getSystemInfoSync()
		let padding = 0;
		windowHeight.value = sys.windowHeight;
		
		
		system.fetchConfig()
		

		// getRoomList();


		if (!userStore.userInfo?.default_user_hero_id) {
			// 弹窗提示去设置角色
			console.log("没有设置打团角色");
		}


		// 小程序
		// #ifdef MP
		const menu = uni.getMenuButtonBoundingClientRect()
		const btnHeight = menu.bottom - menu.top
		const verticalPadding = (menu.top - sys.statusBarHeight) * 2;
		topHeight.value = sys.statusBarHeight;
		padding = btnHeight + verticalPadding
		// #endif

		// App
		// #ifdef APP-PLUS
		// padding = sys.statusBarHeight + 44 // App 默认不带胶囊，估一个安全值
		padding = sys.statusBarHeight + 0 // App 默认不带胶囊，估一个安全值
		// #endif

		// H5
		// #ifdef H5
		padding = 0 // 默认导航栏高度（自定义的导航栏）
		// #endif

		navBarHeight.value = padding
	})

	const getRoomList =  async (pageNo, pageSize) => {
		
		if(!modeMapTree.value[selectedModeIndex.value]){
			console.log("不存在不发起请求");
			return false;
		}
		
		console.log(modeMapTree.value[selectedModeIndex.value].code);
		const res =  await uni.$http.post('/dungeon/list', {
			channel: currentTab.value,
			mode_code: modeMapTree.value[selectedModeIndex.value].code,
			map_code: currentMap.value.code,
			page: pageNo,
			page_size: pageSize
		})
		if (res.code === 1) {
			paging.value.complete(res.data.list);
			// roomList.value = res.data
			
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}




	const leftMenu = ref([])
	const activeTab = ref('包车')
	const show = ref(false)
	const teamShow = ref(false)

	const currentMenu = ref(leftMenu.value[0])

	const linkTo = (path) => {
		uni.navigateTo({
			url: path
		})
	}

	const getRoleIcon = (code, filled) => {
		const map = {
			leader: 'leader',
			dps: 'dps',
			support: 'support',
			seller: 'seller',
			deck: 'deck',
			team: 'team',
			baoche: 'baoche',
			lock: 'lock'
		}
		const key = map[code] || 'unknown'
		return `https://dnf.hanyunkeji.cn/static/icons/${key}_${filled ? 'active' : 'empty'}.png`
	}
	
	// 动态 style 样式字符串
	const scrollViewStyle = computed(() => {
		const contentHeight =  windowHeight.value - statusBarHeight.value - 273;
	  return `height: ${contentHeight}px; overflow: auto;`
	})
	// 273
	
	// console.log(`计算${scrollViewStyle}`);

	
</script>

<style scoped lang="scss">
	.container {
		padding: 0;
		background: #f0f2f5;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: fixed;
		width: 100%;
	}

	.real-status-bar {
		height: 60rpx;
		background-color: #fff;
	}

	.top-tabs-wrap {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 16rpx 20rpx;
	}

	.top-kefu {
		width: 146rpx;
		height: 70rpx;
		color: #fff;
		background-image: url('https://dnf.hanyunkeji.cn/static/home/04.png');
		background-size: 100% 100%;
		font-size: 25rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 10rpx;
	}
	.refresh{
		width: 120rpx;
		height: 120rpx;
		background-image: url('https://dnf.hanyunkeji.cn/static/home/refresh.png');
		background-size: 100% 100%;
		position: absolute;
		right: 30rpx;
		bottom: 300rpx;
		z-index: 1000;
	}

	.top-tabs {
		display: flex;
		/* gap: 20rpx; */
		background: #F2F2F2;
		padding: 8rpx 8rpx;
		border-radius: 50rpx;
		align-items: center;
		width: fit-content;
		// margin: 0 auto;
	}

	.tab {
		display: flex;
		gap: 10rpx;
		align-items: center;
		padding: 8rpx 20rpx;
		font-size: 27rpx;
		color: #A7A7A7;
		border-radius: 50rpx;
		font-weight: 700;
	}

	.tab-icon {
		width: 48rpx;
		height: 48rpx;
	}

	.tab.active {
		background: #fff;
		color: #000;
	}

	.main-layout {
		display: flex;

		/* gap: 20rpx; */
		padding: 20rpx;
	}

	.gz {
		width: 100%;
		height: 80rpx;
		background-image: url('https://dnf.hanyunkeji.cn/static/home/05.png');
		background-size: 100%;
		text-align: right;
		line-height: 80rpx;
		color: #333;
		padding-right: 15rpx;
	}

	.card-layout {
		margin-bottom: 20rpx;
	}

	/* 左侧侧边栏 */
	.left-sidebar {
		width: 200rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		align-items: center;
	}

	.left-layout {
		width: 200rpx;
		/* padding: 20rpx 20rpx; */
		background-color: #fff;
		box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.03);
		border-radius: 12rpx;
		padding-bottom: 30rpx;
	}

	.rule-btn {
		/* background-color: #1677ff; */
		color: #000;
		font-size: 28rpx;
		font-weight: 500;
		text-align: center;
		border-radius: 12rpx 12rpx 0rpx 0rpx;
		padding: 16rpx;
	}

	.side-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10rpx;
		background-color: #e0e0e0;
		color: #333;
		padding: 13rpx;
		border-radius: 12rpx;
		font-size: 26rpx;
	}

	.side-btn.primary {
		background-color: #1677ff;
		color: white;
	}

	.side-btn.orange {
		background-color: #ff6e40;
		color: white;
	}

	.side-btn.yellow {
		background-color: #ffa726;
		color: white;
	}

	.create-join-btn {
		width: 164rpx;
		height: 164rpx;
		background-color: #1677ff;
		color: white;
		border-radius: 8rpx;
		/* padding: 15rpx; */
		display: flex;
		flex-direction: column;
		justify-content: center;

		align-items: center;
		font-size: 24rpx;
		box-shadow: 0rpx 2rpx 9rpx 0rpx rgba(33, 92, 210, 0.49);
	}


	.icon-block {
		width: 80rpx;
		height: 80rpx;
		margin: 0 auto;
	}

	/* 分类项 */
	.nav-item {
		// background-image: url('https://dnf.hanyunkeji.cn/static/07.jpg');
		position: relative;
		background-size: 100% 100%;
		// border-radius: 5rpx;
		margin: 15rpx 10rpx;
		height: 100rpx;
		/* background: #fff; */
		/* padding: 20rpx; */
		border-radius: 10rpx;
		color: #888;
		font-size: 24rpx;
	}
	
	.game-title{
		position: absolute;
		right: 0rpx;
		bottom: 1rpx;
		padding: 3rpx 15rpx;
		font-size: 20rpx;
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		border-radius: 10rpx 0rpx 10rpx 0rpx;
	}
	
	.mask {
	  position: absolute;
	  top: 0;
	  left: 0;
	  width: 100%;
	  height: 100%;
	  background-color: rgba(255, 255, 255, 0.4); /* 白色半透明 */
	  pointer-events: none; /* 不挡点击 */
	}
	
	.mask-hidden {
	  display: none;
	}


	/* .nav-item.active {
	  color: #3366ff;
	  font-weight: bold;
	  border-left: 6rpx solid #6b4eff;
	} */






	/* 更加严格的隐藏方式适用于 scroll-view 组件 */
	// scroll-view ::-webkit-scrollbar,
	// scroll-view *::-webkit-scrollbar {
	// 	display: none !important;
	// 	width: 0 !important;
	// 	height: 0 !important;
	// 	-webkit-appearance: none;
	// 	background: transparent;
	// }

	.left-scroll {
		position: relative;
		height: 500rpx;
		// box-shadow: inset 0 -10rpx 10rpx -10rpx rgba(0, 0, 0, 0.2);
		/* 底部内阴影 */
	}

	.corner-tag {
		position: absolute;
		top: 0;
		right: 0;
		// width: 120rpx;
		// height: 120rpx;
		width: 100rpx;
		height: 100rpx;
		background: #2166F1;
		box-shadow: 0rpx 6rpx 8rpx 0rpx rgba(239, 106, 34, 0.22);
		color: #fff;
		font-size: 22rpx;
		text-align: right;
		line-height: 60rpx;
		padding-right: 10rpx;
		clip-path: polygon(100% 0%, 100% 100%, 0% 0%);
		border-top-right-radius: 12rpx;
	}


	// .corner-tag {
	//   position: absolute;
	//   top: 0;
	//   right: 0;
	//   width: 100rpx;
	//   height: 100rpx;
	//   overflow: hidden;
	// }

	.corner-text {
		position: absolute;
		top: 5rpx;
		right: -45rpx;
		width: 160rpx;
		// background: #2166F1;
		color: white;
		font-size: 20rpx;
		text-align: center;
		transform: rotate(45deg);
		// box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
	}
	
	.room-list{
		margin-top: 20rpx;
	}



	.fighting-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.icon-img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.profile-box {
		background: white;
		border: 1rpx solid #3366ff;
		padding: 5rpx;
		display: flex;
		align-items: center;
		border-radius: 12rpx;
		text-align: center;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
		margin: 10rpx;
	}

	.avatar {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		margin-bottom: 8rpx;
	}

	.profile-name {
		display: block;
		font-size: 20rpx;
		color: #1677ff;
		font-weight: bold;
	}

	.buy-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.banner-box {
		width: 100%;
		height: 80rpx;
	}

	.banner {
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}

	.kefu-btn {
		position: absolute;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
	}

	.kefu-img {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
	}

	.kefu-tag {
		background: #ff6b6b;
		color: white;
		font-size: 22rpx;
		border-radius: 24rpx;
		padding: 4rpx 12rpx;
		margin-top: 6rpx;
	}

	.shadow {
		box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.08);
		margin: 20rpx;
	}

	/* 右侧列表 */
	.right-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
		/* margin: 0rpx 20rpx; */
		/* gap: 20rpx;	 */
	}

	.join-title {
		margin-top: 10rpx;
	}

	.card {
		background: #fff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
		height: 191rpx;
		position: relative;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
	}
	.waiting{
		background: #EF6A22;
	}
	
	.waiting{
		background: #EF6A22;
	}
	.in_progress{
		background: #2166F1;
	}
	.disbanded{
		background: #ffa726;
	}

	.card-content {
		display: flex;
		align-items: center;
		height: 100rpx;
	}

	.card-avatar {
		width: 93rpx;
		height: 93rpx;
		margin-right: 20rpx;
	}

	.user-avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.card-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		// gap: 5rpx;	
	}

	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-status {
		flex: 1;
		text-align: right;
	}

	.success-img {
		width: 100rpx;
		height: 100rpx;
	}

	.nickname {
		font-size: 30rpx;
		// font-weight: bold;
		color: #333;
	}

	.card-tag {
		position: absolute;
		top: 0;
		right: 0;
		background-color: #ff6b00;
		/* width: 98rpx;
		height: 85rpx; */
		color: #fff;
		padding: 8rpx 30rpx;
		font-size: 25rpx;
		border-top-right-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
		box-shadow: 0rpx 6rpx 8rpx 0rpx rgba(239, 106, 34, 0.22);
		overflow: hidden;

		/* width: 98rpx;
		height: 85rpx;
		background: #EF6A22;
		box-shadow: 0rpx 6rpx 8rpx 0rpx rgba(239,106,34,0.22);
		overflow: hidden; */


	}

	.card-time {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		gap: 5rpx;
		color: #A4A4A4;
	}

	.time-img {
		width: 25rpx;
		height: 25rpx;
	}

	.card-bottom {
		display: flex;
		align-items: center;
		margin-top: 10rpx;
		/* height: 50rpx; */
	}

	.card-bottom-tag {
		width: 131rpx;
		height: 35rpx;
		background: #EFF2FF;
		border-radius: 16rpx;
		font-weight: 500;
		font-size: 20rpx;
		line-height: 35rpx;
		color: #2166F1;
		text-align: center;
	}

	.card-icons {
		flex: 1;
		display: flex;
		justify-content: flex-end;
		gap: 15rpx;
		font-size: 26rpx;
		color: #444;
	}

	.tag-img {
		width: 40rpx;
		height: 40rpx;
	}

	/* 新增右侧顶部 tabs 样式 */
	.right-tabs-wrapper {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		/* margin-bottom: 20rpx; */
	}

	.right-tabs {
		display: flex;
		justify-content: space-around;
		gap: 60rpx;
	}

	.right-tab {
		display: flex;
		align-items: center;
		position: relative;
		padding-bottom: 10rpx;
	}

	.right-tab-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 12rpx;
	}

	.right-tab-text {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		line-height: 1;
	}

	.right-tab-underline {
		position: absolute;
		bottom: 0;
		left: 48rpx;
		height: 6rpx;
		/* background-color: #1677ff; */
		background: linear-gradient(90deg, rgba(54, 111, 255, 1) 0%, rgba(93, 160, 252, 1) 100%);
		border-radius: 4rpx;
		width: calc(100% - 48rpx);
	}

	.right-tab.active .right-tab-text {
		color: #1677ff;
	}


	.team-layout {
		display: flex;
		align-items: center;
		background: #fff;
		padding: 20rpx 16rpx;
	}

	/* 右侧 浅蓝面板 */
	.team-panel {
		height: 164rpx;
		flex: 1;
		/* background: #E6F0FF; */
		background: rgba(234, 245, 246, 1);
		border-radius: 8rpx;
		margin-left: 16rpx;
		/* padding: 12rpx; */
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.team-cards {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 12rpx;
		gap: 30;
	}

	.team-btn {
		flex: 1;
		background: #FFF;
		border-radius: 6rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		/* margin: 0 4rpx; */
		margin: 0rpx 10rpx;
		border-radius: 8rpx;
		box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.1);
		color: #000;
		font-size: 24rpx;
		height: 68rpx;
	}

	.team-btn-title {
		margin-left: 10rpx;
	}


	.team-header {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 8rpx;
		margin-right: 10rpx;
		/* border-bottom: 1rpx solid #DCE6F2; */
	}

	.team-avatar {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		margin-right: 8rpx;
	}

	.team-title {
		font-size: 30rpx;
		color: #333;
		font-weight: 500;
	}

	.team-btn.primary {
		background-color: #1677ff;
		color: white;
	}

	.team-btn.orange {
		background-color: #ff6e40;
		color: white;
	}

	.team-btn.yellow {
		background-color: #ffa726;
		color: white;
	}

	.app {
		padding: 16rpx 16rpx 0rpx 16rpx;
	}
	
	.progress-layout{
		width: 100%;
		position: absolute;
		bottom: 150rpx;
		padding: 30rpx;
		z-index: 1000;
	}
	
	.progress-wrap{
		// margin: 0rpx 30rpx;	
		padding: 0rpx 30rpx;
		height: 100rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: space-between;	
		align-items: center;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
	}
	
	.link-btn{
		padding: 10rpx 25rpx;
		background: #1677ff;
		border-radius: 30rpx;
		color: #fff;
		font-size: 25rpx;
		
	}
	
	
	//创建房间弹窗
	.share-card-box {
		background-color: #fff;
		border-radius: 10rpx;
	}
	
	.share-remark {
		margin-top: 16rpx;
		font-size: 28rpx;
		color: #808080;
	}

	
	.share-header {
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
	.share-body{
		padding: 25rpx 0rpx;
		text-align: center;
		border-bottom: 1rpx solid #eee;
	}
	.ok-icon{
		width: 100rpx;
		height: 100rpx;
	}
	
	.share-btn {
		background: #fff;
		border: none !important;
		margin: 0rpx 20rpx;
		// background-color: #3366ff;
		color: #1677ff;
		padding: 20rpx 0;
		font-size: 28rpx;
		border-radius: 10rpx;
		text-align: center;
	}
	.share-btn::after{
		border: none !important;
	}
	
</style>