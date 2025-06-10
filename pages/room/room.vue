<template>
	<view class="room-container">
		<fui-dialog :show="dialogShow" :content="content" :confirmText="confirmText" maskClosable @click="onClick"
			@close="onClose"></fui-dialog>
		<TnModal ref="modalRef" />

		<fui-bottom-popup :show="phrasShow" zIndex="4000">
			<view class="phras-popup">
				<view class="phras-header">常用语</view>
				<view class="fui-icon__close" @tap="phrasShow  = false">
					<TnIcon name="close" color="#000" />
				</view>
				<view class="phras-list">
					<view class="phras-item" v-for="(item,index) in commonPhrases" :key="index">
						<view class="phras-desc">
							{{item.text}}
						</view>
						<view class="phras-send" @tap="phrasSend(item.text)">
							发送
						</view>
					</view>
				</view>
			</view>
		</fui-bottom-popup>

		<!-- 结算图上传 -->
		<!-- <fui-bottom-popup :show="completeShow" zIndex="8000">
			<view class="complete-popup">
				<view class="popup-header">完成结算</view>
				<view class="fui-icon__close" @tap="completeShow  = false">
					<TnIcon name="close" color="#000" />
				</view>
				<view class="popup-alert">
					上传截图，可作为纠纷评判依据
				</view>
				<view class="form-group">
					<text class="label required">拍卖结算图或者通关翻牌图</text>
					<view class="upload-box">
						<fui-upload borderColor="#eee" background="#Fff" radius="10" immediate width="500" height="300"
							:url="uploadUrl" :max="2" ref="uploadRef" @success="uploadSuccess"
							@error="uploadError"></fui-upload>
					</view>
				</view>
				<view class="popup-footer">
					<view class="submit-btn" @tap="doCompleteRoom">确定完成</view>
				</view>
			</view>

		</fui-bottom-popup> -->


		<fui-bottom-popup :show="completeShow" zIndex="8000">
			<view class="complete-popup">

				<!-- 标题 -->
				<view class="popup-header">完成结算</view>
				<view class="fui-icon__close" @tap="completeShow = false">
					<TnIcon name="close" color="#000" />
				</view>

				<!--  泰拉车结算表单 -->
				<template v-if="roomData.room?.is_terache">
					<view class="form-group">
						<text class="label required">是否金币车</text>
						<view class="circle-radio-group">
							<view class="circle-radio-item" :class="{ selected: isGoldCar === '0' }"
								@tap="isGoldCar = '0'">
								<view class="circle-outer">
									<view class="circle-inner" v-if="isGoldCar === '0'" />
								</view>
								<text>否</text>
							</view>
							<view class="circle-radio-item" :class="{ selected: isGoldCar === '1' }"
								@tap="isGoldCar = '1'">
								<view class="circle-outer">
									<view class="circle-inner" v-if="isGoldCar === '1'" />
								</view>
								<text>是</text>
							</view>
						</view>
					</view>




					<!-- 非金币车才填写泰拉和卡片 -->
					<view v-if="isGoldCar === '0'">

						<!-- 花费泰拉 -->
						<view class="form-group">
							<text class="label required">花费泰拉</text>
							<view class="input-box input-with-unit">
								<input v-model="teraCost" type="number" placeholder="请输入" class="input" />
								<text class="unit">万</text>
							</view>
						</view>

						<!-- 是否有卡片 -->
						<!-- 卡片/宝珠选择 -->
						<view class="form-group">
							<text class="label required">卡片/宝珠</text>
							<view class="circle-radio-group">
								<view class="circle-radio-item" :class="{ selected: hasCard === '0' }"
									@tap="hasCard = '0'">
									<view class="circle-outer">
										<view class="circle-inner" v-if="hasCard === '0'" />
									</view>
									<text>无</text>
								</view>
								<view class="circle-radio-item" :class="{ selected: hasCard === '1' }"
									@tap="hasCard = '1'">
									<view class="circle-outer">
										<view class="circle-inner" v-if="hasCard === '1'" />
									</view>
									<text>有</text>
								</view>
							</view>
						</view>

						<!-- 卡片拍卖价（仅当选择“有”时） -->
						<view v-if="hasCard === '1'" class="form-group">
							<text class="label required">拍卖价</text>
							<view class="input-box input-with-unit">
								<input v-model="cardPrice" type="number" placeholder="请输入" class="input" />
								<text class="unit">万</text>
							</view>
						</view>



						<!-- 动态计算展示 -->
						<view class="form-group" style="flex-direction: column; align-items: flex-start;">
							<text class="label">结算参考</text>
							<view style="padding-top: 10rpx;">
								<text>➤ 支出泰拉：{{ realTera }} 万</text><br />
								<text>➤ 泰拉收益：{{ cashProfit }} 元</text>
							</view>
						</view>

					</view>
				</template>

				<!-- ✅ 普通副本：仅提示上传截图 -->
				<template v-else>
					<view class="popup-alert">上传截图，可作为纠纷评判依据</view>
				</template>

				<!-- ✅ 公共上传区域 -->
				<view class="form-group" style="flex-direction: column; align-items: flex-start;">
					<text class="label required" style="margin-bottom: 10rpx;">上传结算截图</text>
					<fui-upload borderColor="#eee" background="#fff" radius="10" immediate width="500" height="300"
						:url="uploadUrl" :max="2" ref="uploadRef" @success="uploadSuccess" @error="uploadError" />
				</view>

				<!-- 提交按钮 -->
				<view class="popup-footer">
					<view class="submit-btn" @tap="doCompleteRoom">确定完成</view>
				</view>

			</view>
		</fui-bottom-popup>
		<!-- 顶部背景与状态栏 -->
		<view class="room-header" :style="{ backgroundImage: `url(${roomData.room?.mode_image })` }">
			<fui-nav-bar custom padding="12" background="none">
				<view class="fui-nav__left">
					<TnIcon name="left" size="35rpx" color="#fff" @tap="linkTo('/pages/index/index','tabbar')" />
				</view>
				<view class="room-top-info">
					<image class="zone-icon" src="https://dnf.hanyunkeji.cn/static/room/wechat2.png"
						v-if="roomData.room?.channel === 'wechat'" mode="aspectFill" />
					<image class="zone-icon" src="https://dnf.hanyunkeji.cn/static/home/qq.png"
						v-if="roomData.room?.channel === 'QQ'" mode="aspectFill" />
					<text class="zone-tag" v-if="roomData.room?.channel === 'wechat'">微信区</text>
					<text class="zone-tag" v-if="roomData.room?.channel === 'QQ'">QQ区</text>
					<text class="zone-title">{{roomData.room?.mode_title}} -{{roomData.room?.id}}</text>
				</view>
			</fui-nav-bar>

			<!-- <view class="room-top-info">
				<text class="zone-tag">微信区 - 包车155</text>
			</view> -->
			<!-- <image class="room-bg" src="https://dnf.hanyunkeji.cn/static/room/20.png" mode="aspectFill" /> -->
			<view class="room-overlay">
				<view class="room-status">
					<view class="room-tag">暂未匹配游戏房间链接 <text class="i">i</text></view>
					<view class="room-time" v-if="roomData && roomData.room?.status != 'completed'">
						<text v-if="roomData && roomData.room?.status === 'waiting'">等待中 {{ waitingTimeText }}</text>
						<text v-if="roomData && roomData.room?.status === 'in_progress'" style="color: green">进行中
							{{ progressTimeText }}</text>

					</view>
				</view>
			</view>
		</view>


		<view class="room-cards">
			<view class="role-card" :class="pos.code" v-for="(pos, index) in roomData.positions" :key="pos.id"
				@tap="onSelectPosition(pos)" @longpress="onKickMember(pos)">
				<view class="role-tag-box">
					<view class="role-tag" :class="getRoleColor(pos.code)"> {{pos.title}}</view>
				</view>
				<view class="role-info" v-if="pos.user && pos.code != 'seller'">
					<view class="role-meta">
						<image class="role-avatar" v-if="pos.user" :src="pos.user['hero_avatar']" mode="aspectFill" />
						<text class="role-level">{{ pos.user.resist_power }}</text>
						<text class="role-name">{{ pos.user.hero_name }}</text>
					</view>
					<view class="tn-flex-1">

						<image v-if="pos.user.status == 'escaped'" class="icon-escaped"
							src="https://dnf.hanyunkeji.cn/static/room/escaped.png" />
						<text class="role-desc">{{ pos.user.nickname }}</text>
					</view>
				</view>
				<view class="seller-layout" v-if="pos.user && pos.code == 'seller'">
					<view class="role-meta">
						<image class="role-avatar" v-if="pos.user" :src="pos.user['hero_avatar']" mode="aspectFill" />
						{{roomData.room.tera_own}}
					</view>
					<view class="tn-flex-1">
						<view class="tera-ratio">比例{{roomData.room.tera_ratio}}</view>
					</view>
				</view>
				<view class="role-info-empty" :class="getRoleColor(pos.code)" v-if="pos.code != 'lock' && !pos.user">
					加入位置
				</view>
				<view class="role-info-empty" v-if="pos.code == 'lock'">
					位置锁定
				</view>

			</view>
		</view>
		<view class="room-chat">
			<scroll-view class="room-chat" scroll-y ref="scrollViewRef" :scroll-into-view="scrollTo"
				:scroll-with-animation="true">
				<view class="chat-msg" v-for="(msg, index) in msgList" :key="index" :id="'msg-' + index">
					<view class="chat-header">
						<TnAvatar size="60rpx" :url="msg.hero_avatar" />
						<view class="chat-meta">
							<view class="chat-nickname">
								<text class="chat-role" :class="msg.role_code">
									{{msg.role_title}}
								</text>
								<text class="chat-tag" :class="getRoleColor(msg.role_code)">
									{{ msg.hero_nickname }}
								</text>

							</view>
							<text class="chat-text">{{ msg.content }}</text>
						</view>
					</view>
				</view>
				<view id="chat-bottom"></view>
			</scroll-view>
		</view>


		<!-- 右侧功能按钮区域 -->
		<view class="room-actions" v-if="roomData.room && isRoomOperator">

			<!-- 等待中状态才能开始游戏 -->
			<view class="room-action start-btn" v-if="roomData.room.status === 'waiting'" @tap="onStartGame()">
				<text>开始</text>
			</view>

			<!-- 进行中状态可以上传结算图 -->
			<view class="room-action end-btn" v-if="roomData.room.status === 'in_progress'" @tap="completeShow = true">
				<text>完成</text>
			</view>

			<!-- 等待中可刷新 -->
			<view class="room-action refresh-btn" v-if="roomData.room.status === 'waiting'" @tap="refresh()">
				<text>刷新</text>
			</view>

			<!-- 进行中可重置 -->
			<view class="room-action reset-btn" v-if="roomData.room.status === 'in_progress'" @tap="onResetToWait()">
				<view>重新</view>
				<view>等待</view>
			</view>

		</view>

		<!-- </view> -->
		<!-- 常用语和输入栏 -->
		<view class="room-footer"
			v-if="roomData.room && roomData.room['status'] != 'completed' && roomData.room['status'] != 'disbanded' && roomData.room['status'] != 'settling' ">
			<view class="input-layout">
				<view class="chat-shortcuts">
					<view class="shortcut" @tap="checkMemberAccess(handlePhras)">常用语</view>
				</view>
				<view class="chat-input">
					<input class="input" ref="inputaRef" confirm-type="send" :disabled="!roomData.room?.is_member"
						:placeholder="msgTime" v-model="inputMsg" @tap="() => checkMemberAccess()" @focus="focusChange"
						@blur="blurChange" @confirm="sendChat()" />
					<fui-icon @tap="() => checkMemberAccess(faceChange)" :name="!faceShow?'face':'keyboard'"></fui-icon>

					<image v-if="inputMsg" @tap="checkMemberAccess(sendChat)" class="icon-send"
						src="https://dnf.hanyunkeji.cn/static/room/send.png" />
					<image v-else @tap="checkMemberAccess(onLeaveRoom)" class="icon-send"
						src="https://dnf.hanyunkeji.cn/static/room/23.png" />
				</view>
			</view>
			<view class="fui-scroll__box" v-if="faceShow">
				<scroll-view scroll-y class="fui-face__box" :style="{opacity:faceShow?1:0}">
					<view class="fui-face__inner">
						<text class="fui-face__text fui--active" v-for="(item,index) in faceList" :key="index"
							@click="faceClick(item)">{{item}}</text>
					</view>
				</scroll-view>
				<view class="fui-del__box" @tap.stop="delMsg">
					<fui-icon name="backspace" :size="56"></fui-icon>
				</view>
			</view>
			<fui-safe-area background="none"></fui-safe-area>
		</view>
		<view class="bottom-status" v-if="roomData.room &&  roomData.room['status'] == 'disbanded'">
			<image class="bottom-status-img" src="https://dnf.hanyunkeji.cn/static/room/200.png" mode="aspectFit">
			</image>
		</view>

		<view class="room-summary"
			v-if="roomData.room  &&   roomData.room['status'] == 'completed' || roomData.room['status'] == 'settling' ">
			<view class="summary-left">
				<view class="summary-item">
					<text class="summary-label">结算图:</text>
					<view class="images">
						<image @tap="previewImage(img)" v-for="(img, idx) in roomData.room.settlement_images" :key="idx"
							:src="img" class="settle-img" mode="aspectFill" />
					</view>
				</view>
				<view class="summary-item">
					<text class="summary-label">组队时间:</text>
					<text class="value">{{ roomData.room.start_time }}</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">累计用时:</text>
					<text class="value">{{ roomData.room.teamup_time }}</text>
				</view>
			</view>

			<!-- 右下角印章和客服 -->
			<view class="summary-right">
				<image v-if="roomData.room && roomData.room['status'] == 'completed'"
					src="https://dnf.hanyunkeji.cn/static/room/300.png" class="stamp" />
					
					<image v-if="roomData.room && roomData.room['status'] == 'settling'"
						src="https://dnf.hanyunkeji.cn/static/room/400.png" class="stamp" />
				<view class="actions" v-if="roomData.room?.is_member">
					<view class="btn-outline" v-if="roomData.room?.joined_role_code == 'leader'">
						<text v-if="roomData.room?.complaint_status.can_complain"
							@tap="linkTo(`/pages/complaint/send?room_id=${roomData.room?.id}`)">发起申诉</text>
						<text
							@tap="linkTo(`/pages/complaint/complaint?complaint_id=${roomData.room?.complaint_status.complaint_id}`)"
							v-if="roomData.room?.complaint_status.complaint_status == 'pending' || roomData.room?.complaint_status.complaint_status == 'processing'">申诉中</text>
						<text
							@tap="linkTo(`/pages/complaint/complaint?complaint_id=${roomData.room?.complaint_status.complaint_id}`)"
							v-if="roomData.room?.complaint_status.complaint_status == 'resolved' || roomData.room?.complaint_status.complaint_status == 'cancelled'">申诉完成</text>
					</view>
					<view class="btn-outline" v-if="roomData.room?.is_terache || roomData.room['status'] == 'settling'">
						<text @tap="linkTo(`/pages/complaint/index?room_id=${roomData.room?.id}`)">查看结算单</text>
					</view>
					<view class="btn-primary">联系客服</view>
				</view>
			</view>
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
		onUnmounted,
		nextTick

	} from 'vue'
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app';
	import {
		baseUrl
	} from "@/util/env";
	import ws from '@/util/ws.js'
	import faceList from './emoji.js'
	import fuiBottomPopup from "@/components/fui-bottom-popup.vue"
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
	import fuiSafeArea from "@/components/fui-safe-area.vue"
	import fuiNavBar from "@/components/fui-nav-bar.vue"
	import fuiDialog from "@/components/fui-dialog.vue"
	const uploadRef = ref(null)
	const uploadUrl = baseUrl + '/common/upload'
	const uploadStatus = ref(false);
	const settlementImage = ref(null); // 游戏结算图
	const dialogShow = ref(false);
	const completeShow = ref(false);
	const title = ref(null)
	const content = ref(null)
	const confirmText = ref(null)
	const roomData = ref({})
	const onConfirm = ref(null) // 动态绑定的回调函数
	const selectedHeroId = ref(null)
	const msgTime = ref("该房间最新消息，2小时前")
	const inputMsg = ref('');
	const room_id = ref(null)
	const msgList = ref([])
	const phrasShow = ref(false)
	const isGoldCar = ref('0')
	const teraCost = ref('')
	const hasCard = ref('0')
	const cardPrice = ref('')

	const teraRatio = computed(() => {
		return parseFloat(4500)
		// return parseFloat(roomData.value.room?.tera_ratio || 5000)
	})


	// 计算卖家自己分得（六人平分）
	const sellerTera = computed(() => {
		const cost = parseFloat(teraCost.value || 0)
		return cost > 0 ? (cost * 0.9 / 6).toFixed(2) : '0.00'
	})

	// 实际支出泰拉
	const realTera = computed(() => {
		const cost = parseFloat(teraCost.value || 0)
		const self = parseFloat(sellerTera.value || 0)
		const result = cost * 0.9 - self
		return result > 0 ? result.toFixed(2) : '0.00'
	})

	// 预计收益（元）
	const cashProfit = computed(() => {
		const tera = parseFloat(realTera.value || 0)
		const ratio = teraRatio.value
		return tera > 0 ? ((tera * 10000) / ratio).toFixed(2) : '0.00'
	})





	onLoad((params) => {
		if (params.share_uid) {
			uni.setStorageSync('share_uid', params.share_uid)
			console.log("换成分享uid" + params.share_uid);
		}

		if (params.room_id) {
			room_id.value = params.room_id;
		} else {
			uni.showToast({
				title: "房间不存在",
				icon: 'none'
			})
		}
	})

	const waitingTimeText = ref('')
	const progressTimeText = ref('')
	let timer = null

	// room 为接口返回的 room 数据
	const startTime = ref(0)
	const status = ref('')
	const now = ref(Date.now())

	const formatTime = (seconds) => {
		const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
		const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
		const s = String(seconds % 60).padStart(2, '0')
		return `${h}:${m}:${s}`
	}


	const updateTimer = () => {
		const current = Math.floor(Date.now() / 1000)
		const start = Number(startTime.value || 0)
		const seconds = Math.max(0, current - start)

		if (status.value === 'waiting') {
			waitingTimeText.value = formatTime(seconds)
		} else if (status.value === 'in_progress') {
			progressTimeText.value = formatTime(seconds)
		}
	}

	const initCounter = (room) => {
		console.log(room)
		status.value = room.status
		if (status.value === 'waiting') {
			startTime.value = Number(room.waiting_start_at)
		} else if (status.value === 'in_progress') {
			startTime.value = Number(room.progress_start_at)
		}

		updateTimer()
		clearInterval(timer)
		if (status.value === 'waiting' || status.value === 'in_progress') {
			timer = setInterval(updateTimer, 1000)
		}
	}

	onUnmounted(() => {
		clearInterval(timer)
	})

	const handlePhras = () => {
		console.log("执行我");
		phrasShow.value = true;
		if (faceShow.value) {
			faceShow.value = false;
		}
	}

	// 跳转申诉页面
	const complaintLink = () => {
		linkTo(`/pages/complaint/send?room_id=${roomData.value.room?.id}`)
	}

	const onClick = (e) => {
		console.log('点击事件触发了，type：', e)
		if (e.index === 1 && typeof onConfirm.value === 'function') {
			console.log("点击确定");
			onConfirm.value() // 只在点击确认按钮时执行
		}
		dialogShow.value = false
	}
	const onClose = () => {
		dialogShow.value = false
		console.log("关闭点击");
	}

	const refresh = async () => {

		await getChatList()
		await getRoomData()

		uni.showToast({
			title: "刷新成功",
			icon: 'none'
		})
	}


	const onStartGame = () => {
		const positions = roomData.value.positions || []
		const room = roomData.value.room || {}

		// 统计当前已加入的成员数（user 存在）
		const joinedMembers = positions.filter(pos => pos.user).length

		// //判断泰拉车是否满员
		// if (room.is_terache && joinedMembers < 6) {
		// 	uni.showToast({
		// 		title: '泰拉车需满 6 人才能开始游戏',
		// 		icon: 'none'
		// 	})
		// 	return
		// }

		// 普通副本至少 2 人才能开始
		if (!room.is_terache && joinedMembers <= 1) {
			uni.showToast({
				title: '至少需要两名成员才能开始游戏',
				icon: 'none'
			})
			return
		}

		title.value = "确认开始游戏"
		content.value = "确定开始游戏吗？请确认房间人员准备完成"
		confirmText.value = "确认开始"
		dialogShow.value = true

		onConfirm.value = doStartGame
	}


	const openEmojiPanel = () => {
		console.log("表情");
	}

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

	const isRoomOperator = computed(() => {
		const room = roomData.value?.room
		if (!room) {
			console.log("不存在信息");
			return false;
		}
		if (room.is_terache) {
			return room.joined_role_code === 'seller'
		} else {
			return room.joined_role_code === 'dps'
		}
	})




	const onKickMember = (pos) => {
		const room = roomData.value.room
		const currentUserId = room?.user_id

		// console.log(currentUserId);
		console.log(pos);

		// 非房主不能操作
		if (!room?.is_owner) return

		// 空位或锁定位不能操作
		if (!pos.user || pos.code === 'lock') return

		// 不能踢自己（静默 return，无提示）
		if (pos.user.user_id === currentUserId) return

		// 确认弹窗
		title.value = "踢出成员"
		content.value = `确定将【${pos.user.nickname}】踢出房间吗？`
		confirmText.value = "确认踢出"
		dialogShow.value = true

		onConfirm.value = () => doKickMember(pos.id)
	}



	const doKickMember = async (memberId) => {
		const res = await uni.$http.post('/dungeon/kick', {
			room_id: roomData.value.room.id,
			member_id: memberId
		})
		if (res.code === 1) {
			uni.showToast({
				title: '已踢出',
				icon: 'none'
			})
			getRoomData()
			// 建议广播 WebSocket 通知更新房间
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}



	const sendChat = async () => {
		if (!inputMsg.value.trim()) {
			return uni.showToast({
				title: '请输入内容',
				icon: 'none'
			})
		}


		ws.send({
			type: 'chat',
			room_id: `room_${roomData.value.room.id}`,
			content: inputMsg.value
		})

		// const res = await uni.$http.post('/dungeon/sendChat', {
		// 	room_id: room_id.value,
		// 	content: inputMsg.value
		// })
		if (faceShow.value) {
			faceShow.value = false;
		}
		inputMsg.value = '';
		// console.log('接口信息:', res)

		// if (res.code === 1) {
		// 	if(faceShow.value){
		// 		faceShow.value = false;
		// 	}
		// 	inputMsg.value = '';
		// 	getChatList()

		// 	uni.showToast({
		// 		title: res.msg,
		// 		icon: 'none'
		// 	})

		// }
	}

	const phrasSend = async (value) => {
		// const res = await uni.$http.post('/dungeon/sendChat', {
		// 	room_id: room_id.value,
		// 	content: value
		// })

		ws.send({
			type: 'chat',
			room_id: `room_${roomData.value.room.id}`,
			content: value
		})
		phrasShow.value = false;


		// if (res.code === 1) {
		// 	phrasShow.value = false;
		// 	// getChatList()
		// 	uni.showToast({
		// 		title: res.msg,
		// 		icon: 'none'
		// 	})

		// }
	}

	const getChatList = async () => {

		const res = await uni.$http.post('/dungeon/chatList', {
			room_id: room_id.value,
			last_id: null
		})
		console.log('接口信息:', res)

		if (res.code === 1) {
			msgList.value = res.data.list;
			scrollToBottom()
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
		}
	}

	const commonPhrases = ref([]);
	const getCommonPhrases = async () => {

		const res = await uni.$http.post('/room/getCommonPhrases', {})
		console.log('接口信息:', res)

		if (res.code === 1) {
			commonPhrases.value = res.data;

		}
	}


	const getRoomData = async () => {
		const res = await uni.$http.post('/dungeon/info', {
			room_id: room_id.value
		})
		console.log('接口信息:', res)

		if (res.code === 1) {
			roomData.value = res.data;
			onCheckRoom()
			initCounter(res.data.room)
			// modeMapTree.value = res.data
		}
	}

	const onSelectPosition = async (pos) => {

		if (pos.code == 'lock') {
			return false;
		}
		if (pos.user) {
			copy(pos.user.nickname)
			// uni.showToast({ title: '该位置已被占用', icon: 'none' })
			return
		}
		if (roomData.value.room.is_member) {
			return false;
		}

		const res = await uni.$http.post('/dungeon/join', {
			payload: {
				room_id: roomData.value.room.id,
				member_id: pos.id,
				user_hero_id: selectedHeroId.value // 当前用户选择的英雄 ID
			}
		})

		if (res.code === 1) {
			uni.showToast({
				title: '加入成功',
				icon: 'success'
			})

			ws.send({
				type: 'join',
				room_code: `room_${roomData.value.room.id}`
			})
			getRoomData() // 重新刷新
		} else {
			uni.showToast({
				title: res.msg,
				icon: 'none'
			})
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
	const onLeaveRoom = () => {
		const room = roomData.value.room
		if (room.status === 'completed') {
			// 提示不能退出
			uni.showToast({
				title: '游戏已经完成无须退出',
				icon: 'none'
			})
			return false;
		} else if (room.is_owner && room.status === 'waiting') {
			// 提示解散房间确认
			title.value = "解散房间";
			content.value = "你作为房主 退出将会解散房间";
			confirmText.value = "确定解散";
		} else if (room.is_owner && room.status === 'in_progress') {
			// 提示游戏中退出会解散，不结算
			title.value = "解散房间";
			content.value = "游戏进行中，退出将会无法结算";
			confirmText.value = "确认解散";
		} else {
			// 普通成员退出提示
			title.value = "退出房间";
			content.value = "退出房间将无法发言";
			confirmText.value = "确认退出";
		}

		onConfirm.value = confirmLeaveRoom
		dialogShow.value = true
	}

	// 开始游戏
	const doStartGame = async () => {
		const res = await uni.$http.post('/dungeon/start', {
			room_id: roomData.value.room.id
		})
		if (res.code === 1) {
			uni.showToast({
				title: '游戏已开始',
				icon: 'success'
			})
			// getRoomData()
		} else {
			uni.showToast({
				title: res.msg || '开始失败',
				icon: 'none'
			})
		}
	}
	// 重新等待执行
	const doResetToWait = async () => {
		const result = await uni.$http.post('/dungeon/resetWait', {
			room_id: roomData.value.room.id
		})
		if (result.code === 1) {
			// getRoomData()
			uni.showToast({
				title: result.msg || '失败',
				icon: 'none'
			})
		}
	}
	//重新等待
	const onResetToWait = async () => {
		title.value = "提示";
		content.value = "将房间变为等候中，和长按踢人，重新组人";
		confirmText.value = "确认变更";
		dialogShow.value = true;
		// 绑定弹窗确认的操作
		onConfirm.value = doResetToWait
	}

	const doCompleteRoom = async () => {

		if (settlementImage.value == "") {
			uni.showToast({
				title: "请上传结算截图",
				icon: 'none'
			})
			return false;
		}
		
		let SettlementUrl = '/dungeon/completeRoom';
		if(roomData.value.room.is_terache){
			SettlementUrl = '/dungeon/submitSettlement'
		}

		const res = await uni.$http.post(SettlementUrl, {
			room_id: roomData.value.room.id,
			image_url: settlementImage.value,
			tera_cost: parseFloat(teraCost.value || 0), // 花费泰拉（单位：万）← 用户填的
			is_gold_car: isGoldCar.value, // 是否金币车（0/1）← 用户选择
			has_card: hasCard.value, // 是否有卡片（0/1）← 用户勾选
			card_price: hasCard.value ? parseFloat(cardPrice.value || 0) : 0 // 卡片拍卖价（单位：万）
		})


		if (res.code === 1) {
			uni.showToast({
				title: res.msg || '',
				icon: 'none'
			})
			completeShow.value = false;
			// 可刷新房间状态或跳转
			// getRoomData()
		} else {
			uni.showToast({
				title: res.msg || '开始失败',
				icon: 'none'
			})
		}
	}



	const onCheckRoom = async () => {


		if (roomData.value.room.status == 'completed' && !roomData.value.room.is_member) {
			title.value = "提示";
			content.value = "该房间已经完成";
			confirmText.value = "更多房间";
			dialogShow.value = true;
			// 绑定弹窗确认的操作
			onConfirm.value = toHome
			return false;
		}
		const positions = roomData.value.positions || []
		// 统计当前已加入的成员数
		const joinedMembers = positions.filter(pos => pos.user).length;
		if (positions.length == joinedMembers && !roomData.value.room.is_member) {
			title.value = "提示";
			content.value = "该房间已满员";
			confirmText.value = "更多房间";
			dialogShow.value = true;
			// 绑定弹窗确认的操作
			onConfirm.value = toHome
		}

	}
	const toHome = () => {
		uni.switchTab({
			url: "/pages/index/index"
		})
	}
	const checkMemberAccess = (callback) => {
		console.log(roomData.value.room);
		if (!roomData.value.room?.is_member) {
			uni.showToast({
				title: '请先加入房间',
				icon: 'none'
			})
			return
		}
		// 已加入房间时执行回调
		callback && callback()
	}

	const getRoleColor = (code) => {
		if (code === 'leader') return 'blue'
		if (code === 'dps') return 'red'
		if (code === 'support') return 'green'
		if (code === 'leech') return 'green'
		if (code === 'baoche') return code
		if (code === 'team') return code
		if (code === 'deck') return code
		if (code === 'lock') return code
		if (code === 'seller') return code
		return ''
	}

	const getRoleIcon = (code) => {
		const map = {
			leader: 'https://dnf.hanyunkeji.cn/static/room/09.png',
			dps: 'https://dnf.hanyunkeji.cn/static/room/10.png',
			support: 'https://dnf.hanyunkeji.cn/static/room/11.png'
		}
		return map[code] || ''
	}
	// 退出房间确认
	const confirmLeaveRoom = async () => {
		const result = await uni.$http.post('/dungeon/leave', {
			room_id: roomData.value.room.id
		})
		if (result.code === 1) {
			uni.showToast({
				title: result.msg || '退出失败',
				icon: 'none'
			})
			// getRoomData()
			return true;
			// 可以返回房间列表或首页
			// uni.navigateBack()
		} else {
			uni.showToast({
				title: result.msg || '退出失败',
				icon: 'none'
			})
		}
	}
	const copy = (val) => {
		uniCopy({
			content: val,
			success: (res) => {
				uni.showToast({
					title: res,
					icon: 'none'
				})
			},
			error: (e) => {
				uni.showToast({
					title: e,
					icon: 'none',
					duration: 3000,
				})
			}
		})
	}
	const uploadSuccess = (e) => {
		console.log(e)
		//上传成功回调，处理服务器返回数据【此处根据实际返回数据进行处理】
		let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}")
		uploadStatus.value = e.status
		if (res.data.url) {
			settlementImage.value = res.data.url;
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

	const focus = ref(false)
	const faceShow = ref(false)
	const inputaRef = ref(null)
	const focusChange = () => {
		focus.value = true;
	}
	const blurChange = () => {
		focus.value = false
	}
	const faceChange = () => {
		faceShow.value = !faceShow.value;
		uni.hideKeyboard()
		// // #ifdef APP-NVUE
		inputaRef.value.blur()
		// // #endif
	}
	const faceClick = (item) => {
		console.log(item);
		if (!faceShow.value) return;
		inputMsg.value += item;
	}

	const delMsg = () => {
		if (!inputMsg.value) return;
		let number = 1;
		if (inputMsg.value.length > 1) {
			number = inputMsg.value.substr(inputMsg.value.length - 2, inputMsg.value.length).search(
				/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/i) == -1 ? 1 : 2;
		}
		inputMsg.value = inputMsg.value.substr(0, inputMsg.value.length - number);
	}


	const scrollViewRef = ref(null)

	const scrollToBottom = () => {
		// nextTick(() => {
		// 	// 使用 scroll-into-view 的方式
		// 	const el = document.getElementById('chat-bottom')
		// 	if (el && typeof el.scrollIntoView === 'function') {
		// 		el.scrollIntoView({ behavior: 'smooth' })
		// 	}
		// })
	}


	const scrollTo = ref('')

	watch(
		() => msgList.value.length,
		(len) => {
			if (len > 0) {
				scrollTo.value = 'msg-' + (len - 1)
			}
		}
	)

	const playNumberVoice = (num) => {
		const audio = uni.createInnerAudioContext()
		audio.src = `/static/sounds/${num}.mp3`
		audio.play()

		audio.onEnded(() => audio.destroy())
		audio.onError(() => audio.destroy())
	}




	onMounted(() => {
		getRoomData()
		getChatList()
		getCommonPhrases()
		// playJoinSound()
		ws.on('room_update', (msg) => {
			console.log('收到 room_update:', msg.data)
			roomData.value = msg.data
			onCheckRoom()
			initCounter(msg.data.room)
			// positions.value = msg.data.positions
		})


		ws.on('chat', (msg) => {
			msgList.value.push(msg.data)
			scrollToBottom()
		})

		ws.on('member_join_voice', (msg) => {
			const num = msg.joined_number
			if (num >= 1 && num <= 6) {
				playNumberVoice(num)
			}
		})
		ws.on('completeRoom', (res) => {
			// console.log(res);
			if (res.data.show_completed_modal) {
				title.value = "组队完成";
				content.value = "结算阶段： 是否存在未通关、虚假结算、违规竞拍、等问题?";
				confirmText.value = "发起申诉";
				dialogShow.value = true;
				// 绑定弹窗确认的操作
				onConfirm.value = complaintLink
			}

		})

		ws.on('kicked', () => {
			title.value = '提示'
			content.value = '你已被房主踢出该房间'
			confirmText.value = '返回首页'
			dialogShow.value = true

			onConfirm.value = () => {
				uni.reLaunch({
						url: '/pages/index/index'
					})
					.catch(err => {
						console.error('页面跳转失败:', err)
					})
			}

		})


	})
</script>

<style scoped lang="scss">
	.room-container {
		// position: fixed;
		width: 100%;
		top: 0;
		background-color: #fff;
		color: #fff;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.room-header {
		/* background-image: url('https://dnf.hanyunkeji.cn/static/room/20.png'); */
		background-size: 100% 100%;
		position: relative;
		height: 380rpx;
	}

	.room-bg {
		width: 100%;
		height: 100%;
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
	}

	.fui-nav__left {
		width: 60rpx;
		height: 60rpx;
		background: rgb(0, 0, 0, 0.8);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.room-top-info {
		height: 60rpx;
		box-sizing: border-box;
		background: rgb(0, 0, 0, 0.8);
		border-radius: 50rpx;
		padding: 10rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 30rpx;
		font-size: 25rpx;
		font-weight: 500;
	}

	.zone-icon {
		width: 48rpx;
		height: 48rpx;
	}

	.zone-tag {
		margin: 0rpx 15rpx;
	}

	.room-content {
		/* height: 100%;
	position: relative; */
	}

	.tag-icon {
		width: 25rpx;
		height: 25rpx;
		margin-right: 10rpx;
	}

	.room-overlay {
		position: absolute;
		/* top: 0; */
		bottom: 10rpx;
		left: 0;
		width: 100%;
		/* height: 100rpx; */
		bottom: 20rpx;
		padding: 0rpx 20rpx;
	}



	.room-status {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.room-time {
		margin-left: auto;
	}

	.room-tag,
	.room-time {
		background: rgba(0, 0, 0, 0.8);
		border-radius: 30rpx;
		padding: 15rpx 30rpx;
		font-size: 28rpx;
		font-weight: 500;
	}

	.room-members {
		padding: 20rpx;
	}

	.room-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}



	.role {
		font-size: 24rpx;
		padding: 2rpx 12rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
	}

	.role-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 5rpx;
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

	.user-nickname {
		font-size: 38rpx;
	}

	.green-title {
		background: #22cc88;
		color: #fff;
	}

	.role.blue {
		background: #0284FE;
		color: #fff;
	}

	.role.red {
		background: #ff3a3a;
		color: #fff;
	}

	.role.green {
		background: #22cc88;
		color: #fff;
	}

	.fail {
		font-size: 20rpx;
		color: #ccc;
	}

	.room-icon-lock,
	.room-icon-chair {
		width: 80rpx;
		height: 80rpx;
		background: #444;
		border-radius: 20rpx;
	}

	.room-chat {
		padding: 0 20rpx;
		flex: 1;
		overflow-y: auto;
	}

	.chat-msg {
		/* background: #2a2a38; */
		border-radius: 12rpx;
		padding: 12rpx;
		margin-bottom: 12rpx;
		color: #000;
	}

	.chat-tag {
		color: #58a6ff;
		margin-right: 8rpx;
	}

	.chat-role {
		font-size: 20rpx;
		padding: 5rpx 20rpx;
		border-radius: 30rpx;
		color: #fff;
		margin: 0rpx 10rpx;
	}

	.chat-role.green {
		color: #48d6a2;
		margin-right: 8rpx;
	}

	.chat-text {
		color: #333 !important;
	}

	.seller-layout {}

	.tera-aown {}

	.tera-ratio {
		width: 131rpx;
		height: 40rpx;
		background: #EF6A22;
		// opacity: 0.8;
		border-radius: 10rpx;
		font-weight: 500;
		font-size: 23rpx;
		line-height: 40rpx;
		color: #fff;
		text-align: center;
	}













	.room-chat {
		padding: 20rpx;
	}

	.chat-msg {
		margin-bottom: 20rpx;
	}

	.chat-header {
		display: flex;
		align-items: flex-start;
	}

	.chat-meta {
		margin-left: 20rpx;
		flex: 1;
	}

	.chat-nickname {
		font-weight: bold;
		margin-bottom: 6rpx;
	}

	.chat-tag {
		margin-right: 12rpx;
		font-size: 24rpx;
	}

	.chat-role {
		font-size: 20rpx;
		// opacity: 0.8;
	}

	.chat-text {
		font-size: 28rpx;
		color: #333;
	}













	.room-footer {
		// padding: 20rpx;
		background: #f8f8f8;
		z-index: 3000;
		/* border-top: 1rpx solid #333; */
	}

	.input-layout {
		padding: 20rpx;
	}

	.chat-shortcuts {
		display: flex;
		gap: 20rpx;
		margin-bottom: 16rpx;
		// padding: 20rpx;
	}

	.shortcut {
		background: #fff;
		color: #000;
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		// margin: 20rpx;
	}

	.icon-escaped {
		width: 48rpx;
		height: 48rpx;
	}

	.chat-input {
		height: 72rpx;
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 10 rpx;
		padding: 8rpx 16rpx;
	}

	.input {
		flex: 1;
		background: transparent;
		color: #000;
		font-size: 24rpx;
		border: none;
		outline: none;
	}

	.icon-face,
	.icon-send {
		width: 60rpx;
		height: 60rpx;
		margin-left: 16rpx;
	}




	.room-members-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24rpx;
		padding: 20rpx;
		justify-items: center;
	}

	.room-player {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.avatar-frame {
		width: 100rpx;
		height: 100rpx;
		position: relative;
		margin-bottom: 6rpx;
	}

	.avatar-bg {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		position: absolute;
		top: 8rpx;
		left: 8rpx;
		z-index: 2;
	}

	.room-icon-placeholder {
		width: 100rpx;
		height: 100rpx;
	}


	.room-icon-placeholder {
		width: 100rpx;
		height: 100rpx;
	}

	.room-actions {
		position: absolute;
		bottom: 500rpx;
		right: 20rpx;
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	.start-btn {
		background: #1677ff;
		box-shadow: 0rpx 4rpx 9rpx 0rpx rgba(33, 56, 225, 0.98);
	}

	.refresh-btn {
		background: #5b2ae5;
		box-shadow: 0rpx 4rpx 9rpx 0rpx rgb(6 30 255);
	}

	.reset-btn {
		background: #1677ff;
		box-shadow: 0rpx 4rpx 9rpx 0rpx rgba(33, 56, 225, 0.98);
	}

	.forced-two-line {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.end-btn {
		background: rgba(128, 0, 2, 1.0);
		box-shadow: 0rpx 4rpx 9rpx 0rpx #fc0107;
	}

	.room-action {
		width: 100rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 25rpx;
		text-align: center;
		border-radius: 50%;
	}

	.room-action image {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: 4rpx;
	}

	.leave-room {
		width: 160rpx;
		height: 160rpx;
		background: url('https://dnf.hanyunkeji.cn/static/room/12.png');
		background-size: 100% 100%;
	}


	.room-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24rpx;
		padding: 24rpx;
	}

	.role-avatar {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		margin-right: 5rpx;
	}

	.role-info {}

	.role-meta {
		display: flex;
		align-items: center;
		/* gap: 10rpx; */
		color: #333;
		margin: 5rpx 0rpx;
	}

	.role-level {
		font-weight: bold;
	}

	.chat-role.dps {
		background: #ff4d4f;
	}

	.chat-role.leader {
		background: #1677ff;
	}

	.chat-role.support {
		background: #00c292;
		color: #fff;
	}

	.chat-role.baoche {
		background: #5b2ae5;
		color: #fff;
	}

	.chat-role.team {
		background: #fbbd12;
		color: #fff;
	}

	.chat-role.deck {
		background: #0198cc;
		color: #fff;
	}



	.lock {
		color: #000;
	}

	.role-tag {
		font-size: 20rpx;
		padding: 4rpx 10rpx;
		border-radius: 20rpx;
		color: #fff;
	}

	.role-tag.red {
		background: #ff4d4f;
		color: #fff;
	}

	.role-tag.blue {
		background: #1677ff;
		color: #fff;
	}

	.role-tag.green {
		background: #00c292;
		color: #fff;
	}


	.role-tag.baoche {
		background: #5b2ae5;
		color: #fff;
	}

	.role-tag.team {
		background: #fbbd12;
		color: #fff;
	}

	.baoche {
		color: #5b2ae5;
	}

	.team {
		color: #fbbd12;
	}

	.deck {
		color: #0198cc;
	}

	.chat-role.seller {
		background: #EF6A22;
		color: #fff;
	}

	.role-tag.deck {
		background: #0198cc;
		color: #fff;
	}

	.role-tag.seller {
		background: #EF6A22;
		color: #fff;
	}

	.seller {
		color: #EF6A22;
	}

	.role-tag.lock {
		background: #000;
	}


	.role-desc {
		font-size: 22rpx;
		color: #888;
		text-align: center;
		flex: 1;
	}



	.role-card.dps {
		border: 1rpx solid #ff4d4f !important;
	}

	.role-card.leader {
		border: 1rpx solid #1677ff !important;
	}

	.role-card.support {
		border: 1rpx solid #00c292 !important;
	}

	.role-card.baoche {
		border: 1rpx solid #5b2ae5 !important;
	}

	.role-card.team {
		border: 1rpx solid #fbbd12 !important;
	}

	.role-card.deck {
		border: 1rpx solid #0198cc !important;
	}

	.role-card.lock {
		border: 1rpx solid #000 !important;
	}

	.role-card.seller {
		border: 1rpx solid #EF6A22 !important;
	}



	.role-card {
		/* background: #f8f9fa; */
		border-radius: 10rpx;
		height: 110rpx;
		/* padding: 16rpx; */
		display: flex;
		align-items: center;
		margin-right: 10rpx;
		justify-content: center;
		/* gap: 12rpx; */
		position: relative;
		border: 1rpx #ccc solid;
	}

	.role-tag-box {
		position: absolute;
		top: -20rpx;
		right: -10rpx;
		z-index: 1;
	}

	.phrase-popup {
		position: relative;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		/* padding: 0rpx 40rpx; */
	}


	.phras-header {
		text-align: left;
		font-size: 30rpx;
		padding: 24rpx;
		color: #000;
		border-bottom: 1rpx solid #eee;
	}

	.complete-popup {
		position: relative;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		/* padding: 0rpx 40rpx; */
	}

	.phras-list {}

	.phras-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		color: #333;
		font-size: 26rpx;
		// border-bottom: 1rpx solid #ccc;
	}

	.phras-send {
		color: #3366ff;
		border-radius: 26rpx;
		padding: 5rpx 15rpx;
		border: 1rpx solid #3366ff;
	}


	/* 弹窗头 */
	.popup-header {
		text-align: center;
		font-size: 30rpx;
		padding: 24rpx;
		color: #3366ff;
		border-bottom: 1rpx solid #eee;
	}

	.fui-icon__close {
		position: absolute;
		top: 24rpx;
		right: 54rpx;

	}

	.popup-alert {
		background-color: #fff0f0;
		color: #f53f3f;
		font-size: 28rpx;
		padding: 25rpx;
		/* border-radius: 12rpx; */
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}



	// .label {
	// 	font-size: 28rpx;
	// 	color: #333;
	// 	margin-bottom: 20rpx;
	// 	display: block;
	// }

	.label.required::before {
		content: '*';
		color: red;
		margin-right: 6rpx;
	}

	.label {
		width: 300rpx;
		font-weight: bold;
		font-size: 28rpx;
		color: #333;
	}

	.form-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 0;
		color: #333;
		margin: 20rpx 30rpx;
	}

	.radio-box,
	.input-box {
		flex: 1;
		text-align: right;
		color: #333;
	}

	.input-with-unit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10rpx;
	}

	.unit {
		font-size: 28rpx;
		color: #666;
	}

	.circle-radio-group {
		display: flex;
		gap: 40rpx;
		align-items: center;
	}

	.circle-radio-item {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333;
	}

	/* 外圈默认灰色 */
	.circle-outer {
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		border: 2rpx solid #999;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10rpx;
		// background: red;
	}

	/* 内部圆点 */
	.circle-inner {
		width: 14rpx;
		height: 14rpx;
		border-radius: 50%;
		background-color: #007aff;
	}

	/* ✅ 选中状态时 外圈变蓝 */
	.circle-radio-item.selected .circle-outer {
		border-color: #007aff;
	}





	/* .upload-box {
	  width: 200rpx;
	  height: 200rpx;
	  background-color: #f8f8f8;
	  border-radius: 16rpx;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  border: 2rpx dashed #ccc;
	} */



	.upload-text {
		font-size: 24rpx;
		color: #888;
		margin-top: 10rpx;
	}

	.popup-footer {
		margin: 30rpx;

	}

	.submit-btn {
		background-color: #007aff;
		color: #fff;
		font-size: 30rpx;
		border-radius: 12rpx;
		padding: 24rpx 0;
		width: 100%;
		text-align: center;
	}


	.room-summary {
		display: flex;
		height: 300rpx;
		justify-content: space-between;
		padding: 30rpx;
		background: #fff;
		border-top: 1rpx solid #eee;
		position: relative;
	}

	.summary-left {
		flex: 1;
	}

	.summary-item {
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.summary-label {
		font-weight: bold;
		font-size: 28rpx;
		color: #666;
		margin-right: 10rpx;
	}

	.value {
		font-size: 28rpx;
		color: #666;
	}

	.images {
		display: flex;
		gap: 10rpx;
		margin-top: 10rpx;
	}

	.settle-img {
		width: 160rpx;
		height: 100rpx;
		border-radius: 8rpx;
		object-fit: cover;
	}

	.summary-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: space-between;
	}

	.stamp {
		width: 150rpx;
		height: 150rpx;
		margin-bottom: 20rpx;
	}

	.actions {
		display: flex;
		// flex-direction: column;
		gap: 10rpx;
	}

	.btn-outline {
		background: #fff;
		color: #ff4d4f;
		border: 1rpx solid #ff4d4f;
		border-radius: 12rpx;
		padding: 10rpx 20rpx;
		font-size: 26rpx;
	}

	.btn-primary {
		background: #007aff;
		color: #fff;
		border-radius: 12rpx;
		padding: 10rpx 20rpx;
		font-size: 26rpx;
	}

	.bottom-status {
		position: absolute;
		right: 50rpx;
		bottom: 200rpx;
	}

	.bottom-status-img {
		width: 200rpx;
		height: 200rpx;
	}





	.fui-face__hidden {
		transform: translate3d(0, 520rpx, 0);
	}


	.fui-face__show {
		transform: translate3d(0, 0, 0);

		transform: translateY(0);
	}


	.fui-scroll__box {
		position: relative;
	}

	.fui-face__box {
		width: 100%;
		// width: 750rpx;
		height: 520rpx;
		background-color: #f8f8f8;
	}

	.fui-face__inner {
		width: 100%;
		display: flex;
		box-sizing: border-box;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 32rpx 2rpx;
	}

	.fui-face__text {
		display: flex;
		width: 106rpx;
		font-size: 60rpx;
		padding: 16rpx 0;
		text-align: center;
		justify-content: center;
		align-items: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.fui-del__box {
		position: absolute;
		right: 32rpx;
		bottom: 32rpx;
		width: 120rpx;
		height: 72rpx;
		background-color: #fff;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.fui-del__box:active {
		background-color: #ddd;
	}
</style>