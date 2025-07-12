<template>
	<view class="room-container">
		<fui-dialog :show="dialogShow" :content="content" :title="title" :confirmText="confirmText" maskClosable
			@click="onClick" @close="onClose"></fui-dialog>
		<TnModal ref="modalRef" />

		<view v-if="rechargeShow" style="z-index: 1000001;">
			<Recharge v-model="rechargeShow" :orderInfo="orderInfo"></Recharge>
		</view>

		<TnPopup z-index="20076" :model-value="contentShow" width="90%" height="70vh" borderRadius="16rpx">
			<Parse v-if="contentShow" v-model="contentShow" :contentId="contentId"></Parse>
		</TnPopup>


		<TnPopup :model-value="gameLinkShow" width="80%" height="450rpx" borderRadius="16rpx">
			<view class="game-link-card-box">
				<view class="game-link-popup-header">创建游戏房间链接</view>
				<view class="fui-icon__close" @tap="gameLinkShow = false;">
					<TnIcon name="close" size="35" color="#999" />
				</view>
				<view class="game-link-content">
					<view class="link-input-box">
						<input class="game-link-input" v-model="gameLinkInput" placeholder="请输入游戏房间链接" type="text" />
						<view class="paste-btm" @tap="pasteText">
							粘贴链接
						</view>
					</view>
					<view class="link-desc">
						<view>
							只需要三步，15秒告别繁琐邀请流程
						</view>
						<view>
							(匹配成功后，可再次填写)
						</view>
					</view>
				</view>
				<view class="link-btn-layout">
					<view class="link-btn-close" @tap="handleContent(6)">
						如何填写?
					</view>
					<view class="line"></view>
					<view class="link-btn" @tap="updateGameUrl">
						确认填写
					</view>
				</view>

			</view>
		</TnPopup>

		<fui-bottom-popup :show="phrasShow" :zIndex="4000">
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
		<fui-bottom-popup :show="completeShow" :zIndex="8000">
			<view class="complete-popup">

				<!-- 标题 -->
				<view class="popup-header">完成结算</view>
				<view class="fui-icon__close" @tap="completeShow = false">
					<TnIcon name="close" color="#000" />
				</view>


				<view class="popup-alert">
					<TnIcon name="tip-fill" color="#f53f3f" />
					<text v-if="roomData.room?.settle_model != 'leilong'" class="tn-ml">上传截图，可作为纠纷评判依据</text>
					<text class="tn-ml" v-else>没有达到13阶段直接解散</text>
				</view>


				<!--  泰拉车结算表单 -->
				<template v-if="roomData.room?.settle_model == 'terache'">
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
							<view class="Profit">
								<text>支出泰拉:{{ realTera }} 万 | </text>
								<text>收益:{{ cashProfit }} 元 | </text>
								<text>卡片分红:{{cardProfit}} </text>
							</view>
							<view class="sumProfit">
								本次预估收益:{{sumProfit}}元
							</view>
						</view>

					</view>
				</template>


				<!-- 雷龙结算表单 -->
				<view v-if="roomData.room?.settle_model === 'leilong'">
					<view class="form-group" style="flex-direction: column; align-items: flex-start;">
						<view class="label required">请选择通过阶段</view>
						<view class="circle-radio-group" style="margin: 10rpx 0rpx;">
							<view v-for="item in leilongStages" :key="item.value" class="circle-radio-item"
								:class="{ selected: leilongStage === item.value }" @tap="leilongStage = item.value">
								<view class="circle-outer">
									<view class="circle-inner" v-if="leilongStage === item.value" />
								</view>
								<text>{{ item.label }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 公共上传区域 -->
				<view v-if="!(roomData.room?.settle_model === 'leilong' && leilongStage === 'disband')" class="form-group"
					style="flex-direction: column; align-items: flex-start;">
					<text class="label required" style="margin-bottom: 10rpx;">上传结算截图</text>
					<fui-upload borderColor="#eee" background="#fff" radius="10" immediate width="320" height="200"
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
					<text class="zone-title">{{roomData.room?.mode_title}} {{roomData.room?.id}}</text>
				</view>
			</fui-nav-bar>

			<!-- <view class="room-top-info">
				<text class="zone-tag">微信区 - 包车155</text>
			</view> -->
			<!-- <image class="room-bg" src="https://dnf.hanyunkeji.cn/static/room/20.png" mode="aspectFill" /> -->
			<view class="room-overlay">
				<view class="room-status">
					<!-- 先判断基础条件：仅当 channel==='wechat' 且 map_code 为 'terache' 或 'baoche' -->
					<view
						v-if="roomData.room?.channel === 'wechat' && ['terache','baoche'].includes(roomData.room?.settle_model)">

						<!-- 未匹配链接 -->
						<view class="room-tag" v-if="!roomData.room?.game_link_status" @tap="handleContent(6)">

							<image class="room-tag-icon" src="https://dnf.hanyunkeji.cn/static/01.png" mode="aspectFit">
							</image>
							<text class="room-tag-label">暂未匹配游戏房间链接</text>
						</view>
						<!-- 已配置链接，用 else 或者 else-if -->
						<view @tap="gameLinkShow =true" class="room-tag" v-else>
							<image class="room-tag-icon" src="https://dnf.hanyunkeji.cn/static/game1.png"
								mode="aspectFit"></image>
							<text class="room-tag-label">游戏房间链接已经配置</text>
						</view>
					</view>

					<!-- 其他 settle_model 的标签保持不变 -->
					<view class="room-tag" v-if="roomData.room?.settle_model === 'leilong'">
						<image class="room-tag-icon" src="https://dnf.hanyunkeji.cn/static/coin.png" mode="aspectFit">
						</image>
						<text class="room-tag-label">
							13阶{{ roomData.room?.thirteen_stage_coin }}个币 | 斩杀{{ roomData.room?.finish_stage_coin }}个币
						</text>
					</view>
					<view class="room-tag"
						v-if="roomData.room?.settle_model === 'normal'">

						<image class="room-tag-icon" src="https://dnf.hanyunkeji.cn/static/coin.png" mode="aspectFit">
						</image>
						<text class="room-tag-label">{{roomData.room?.leader_pay}}个 助战币</text>
					</view>

					<view class="room-time" v-if="roomData && roomData.room?.status !== 'completed'">
						<text v-if="roomData.room?.status === 'waiting'">等待中 {{ waitingTimeText }}</text>
						<text v-else-if="roomData.room?.status === 'in_progress'" style="color: green">
							进行中 {{ progressTimeText }}
						</text>
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
		
		
		
		<view class="message-wrap">
			<scroll-view scroll-y enable-flex class="scroll-list" scroll-with-animation  :scroll-top="scrollTop">
				<view class="message-item-wrap">
					<view class="team-tips">
						<view class="team-tips-item" v-for="(tips, index0) in roomData.room?.config_json?.tips"
							:key="index0" v-if="roomData.room?.config_json && roomData.room?.config_json.tips">
							{{ tips }}
						</view>
					
					</view>
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
				</view>
			</scroll-view>
		</view>
		
		
		


		<!-- 右侧功能按钮区域 -->
		<view class="room-actions" >
			<template v-if="roomData.room && isRoomOperator">
				
				<!-- 等待中状态才能开始游戏 -->
				<view class="room-action start-btn" v-if="roomData.room?.status === 'waiting'" @tap="onStartGame()">
					<text>开始</text>
				</view>
				
				<!-- 进行中状态可以上传结算图 -->
				<view class="room-action end-btn" v-if="roomData.room?.status === 'in_progress'" @tap="completeShow = true">
					<text>完成</text>
				</view>
				
				<!-- 等待中可刷新 -->
				<view class="room-action refresh-btn" v-if="roomData.room?.status === 'waiting'" @tap="refresh()">
					<text>刷新</text>
				</view>
				
				
				<!-- 进行中可重置 -->
				<view class="room-action reset-btn" v-if="roomData.room?.status === 'in_progress'" @tap="onResetToWait()">
					<view>重新</view>
					<view>等待</view>
				</view>
				
				
			</template>
			<template v-if="roomData.room?.status === 'in_progress' && roomData.room?.game_link && roomData.room?.joined_role_code != null">
				<view class="room-action game-link-btn"  @tap="onJoinGameRoom()">
					<view>进入</view>
					<view>游戏</view>
				</view>
			</template>

		</view>
		
		
		
		
		
		
		
		

		<!-- </view> -->
		<!-- 常用语和输入栏 -->
		<view class="room-footer"
			v-if="roomData.room && roomData.room?.status != 'completed' && roomData.room?.status != 'disbanded' && roomData.room?.status != 'settling' ">
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
		<view>
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
					<image v-if="roomData.room && roomData.room['status'] == 'settled'"
						src="https://dnf.hanyunkeji.cn/static/success_3.png" class="stamp" />
					<view class="actions" v-if="roomData.room?.is_member">
						<view class="btn-outline"
							v-if="roomData.room?.joined_role_code == 'leader' || roomData.room?.joined_role_code == 'baoche'">
							<text v-if="roomData.room?.complaint_status.can_complain"
								@tap="linkTo(`/pages/complaint/send?room_id=${roomData.room?.id}`)">发起申诉</text>
							<text
								@tap="linkTo(`/pages/complaint/complaint?complaint_id=${roomData.room?.complaint_status.complaint_id}`)"
								v-if="roomData.room?.complaint_status.complaint_status == 'pending' || roomData.room?.complaint_status.complaint_status == 'processing'">申诉中</text>
							<text
								@tap="linkTo(`/pages/complaint/complaint?complaint_id=${roomData.room?.complaint_status.complaint_id}`)"
								v-if="roomData.room?.complaint_status.complaint_status == 'resolved' || roomData.room?.complaint_status.complaint_status == 'cancelled'">申诉完成</text>
						</view>
						<view class="btn-outline btn-default"
							v-if="roomData.room?.is_terache && roomData.room['status'] == 'settling'">
							<text @tap="linkTo(`/pages/complaint/index?room_id=${roomData.room?.id}`)">查看结算单</text>
						</view>
						<view class="btn-outline btn-default"
							v-if="roomData.room?.is_terache && roomData.room['status'] == 'completed'">
							<text @tap="linkTo(`/pages/complaint/index?room_id=${roomData.room?.id}`)">结算完成</text>
						</view>
						<!-- <view class="btn-primary">联系客服</view> -->
						<button class="btn-default btn-primary" open-type="contact">联系客服</button>
			
					</view>
				</view>
				
				
				
			</view>
			<fui-safe-area background="none"></fui-safe-area>
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
		nextTick,
		reactive

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
	import Recharge from "@/components/recharge.vue";
	import fuiBottomPopup from "@/components/fui-bottom-popup.vue"
	import TnAvatar from '@/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.vue'
	import fuiSafeArea from "@/components/fui-safe-area.vue"
	import fuiNavBar from "@/components/fui-nav-bar.vue"
	import fuiDialog from "@/components/fui-dialog.vue"
	import TnPopup from '@/uni_modules/tuniaoui-vue3/components/popup/src/popup.vue';
	import Parse from "@/components/parse.vue"
	const uploadRef = ref(null)
	const uploadUrl = baseUrl + '/common/upload'
	const uploadStatus = ref(false);
	const settlementImage = ref([]); // 游戏结算图
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
	const gameLinkInput = ref(null)
	const rechargeShow = ref(false)
	const orderInfo = ref({})
	const WebSocketStatus = ref(true)
	
	const translateY = reactive(520)

	const teraRatio = computed(() => {
		// return parseFloat(4500)
		return parseFloat(roomData.value.room?.tera_ratio || 5000)
	})
	const scrollTop = ref();
	const contentId = ref(null)
	const contentShow = ref(false)
	const handleContent = (id) => {
		contentId.value = id;
		contentShow.value = true;
	}


	// 计算卖家自己分得（六人平分）
	const sellerTera = computed(() => {
		const cost = parseFloat(teraCost.value || 0)
		return cost > 0 ? (cost * 0.95 / 6).toFixed(2) : '0.00'
	})

	// 实际支出泰拉
	const realTera = computed(() => {
		const cost = parseFloat(teraCost.value || 0)
		const self = parseFloat(sellerTera.value || 0)
		const cardcost = parseFloat(cardPrice.value || 0)
		const result = cost * 0.95 - self - (cardcost * 0.9)
		return result > 0 ? result.toFixed(2) : '0.00'
	})

	// 预计收益（元）
	const cashProfit = computed(() => {
		const tera = parseFloat(realTera.value || 0)
		const ratio = teraRatio.value
		return tera > 0 ? ((tera * 10000) / ratio).toFixed(2) : '0.00'
	})

	const cardProfit = computed(() => {
		const cost = parseFloat(teraCost.value || 0)
		const cardcost = parseFloat(cardPrice.value || 0)
		return ((cost * 0.95 / 6 * 2 * 5 - (cost * 0.95 - cost * 0.95 / 6 - cardcost * 0.9) * 2) * 0.2).toFixed(2)

	})

	const sumProfit = computed(() => {
		const result = parseFloat(cashProfit.value) + parseFloat(cardProfit.value);
		return result.toFixed(2)

	})

	const leilongStages = ref([{
			label: '解散房间',
			value: 'disband'
		},
		{
			label: '13阶段',
			value: 'stage13'
		},
		{
			label: '斩杀',
			value: 'kill'
		}
	])

	const leilongStage = ref('kill')
	const gameLinkShow = ref(false)
	const gameLink = ref(null)
	
	const onJoinGameRoom = () => {
	    wx.navigateToMiniProgram({
	      shortLink: roomData.value.game_link,
	      fail: function (e) {
			  uni.showToast({
			  	title: "启动失败，请检查链接是否配置正确",
			  	icon: 'none'
			  })
	       
	      }
	    })
	  }


	onShow(() => {
		getRoomData()
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

	const waitingTimeText = ref('00:00:00')
	const progressTimeText = ref('00:00:00')
	let timer = null;
	
	const startTime = ref(0)
	const status = ref('')
	
	
	const startTimestamp = ref(0)
	const roomStatus = ref('')
	// let timer = null
	
	// 格式化秒为 HH:mm:ss
	const formatTime = (seconds) => {
	  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
	  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
	  const s = String(seconds % 60).padStart(2, '0')
	  return `${h}:${m}:${s}`
	}
	
	
	// const formatTime = (seconds) => {
	// 	const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
	// 	const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
	// 	const s = String(seconds % 60).padStart(2, '0')
	// 	return `${h}:${m}:${s}`
	// }
	
	// const updateTimer = () => {
	// 	const current = Math.floor(Date.now() / 1000)
		
	// 	console.log(current);
		
	// 	const start = Number(startTime.value || 0)
	// 	console.log(start);
	// 	const seconds = Math.max(0, current - start)
	// console.log(seconds);
	// 	if (status.value === 'waiting') {
	// 		waitingTimeText.value = formatTime(seconds)
	// 	} else if (status.value === 'in_progress') {
	// 		progressTimeText.value = formatTime(seconds)
	// 	}
	// }
	
	
	// 每秒更新显示时间
	const updateTimer = () => {
	  const current = Math.floor(Date.now() / 1000)
	  const start = startTimestamp.value
	  const elapsed = Math.max(0, current - start)
	  const formatted = formatTime(elapsed)
	
	  // console.log('[Timer Debug] 当前状态:', status.value)
	  // console.log('[Timer Debug] 当前时间戳:', current)
	  // console.log('[Timer Debug] 开始时间戳:', start)
	  // console.log('[Timer Debug] 已过秒数:', elapsed)
	  // console.log('[Timer Debug] 显示格式:', formatted)
	
	  if (status.value === 'waiting') {
	    waitingTimeText.value = formatted
	  } else if (status.value === 'in_progress') {
	    progressTimeText.value = formatted
	  }
	}
	
	const initCounter = (room) => {
		clearInterval(timer) // 先清
		status.value = room.status
		if (status.value === 'waiting') {
			startTime.value = Number(room.waiting_start_at)
			startTimestamp.value = Number(room.waiting_start_at || 0)
		} else if (status.value === 'in_progress') {
			startTime.value = Number(room.progress_start_at)
			startTimestamp.value = Number(room.progress_start_at || 0)
		}
	
		updateTimer() // 立刻更新一次
	
		if (status.value === 'waiting' || status.value === 'in_progress') {
			timer = setInterval(() => {
				updateTimer()
			}, 1000)
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

	const toView = ref('');
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

	// const isRoomOperator = computed(() => {
	// 	const room = roomData.value?.room
	// 	if (!room) {
	// 		console.log("不存在信息");
	// 		return false;
	// 	}
	// 	if (room.is_terache) {
	// 		return room.joined_role_code === 'seller'
	// 	} else {
	// 		return room.joined_role_code === 'dps'
	// 	}
	// })


	const isRoomOperator = computed(() => {
		const positions = roomData.value.positions || []
		const room = roomData.value.room || {}
		if (!room || !positions.length) return false

		// 泰拉车：只有卖家能结算
		if (room.is_terache) {
			return room.joined_role_code === 'seller'
		}

		// 包车房
		if (room.settle_model === 'baoche') {
			const hasDps = positions.some(pos => pos.code === 'dps')

			if (hasDps) {
				return room.joined_role_code === 'dps'
			} else {
				return room.joined_role_code === 'baoche'
			}
		}

		// 雷龙
		if (room.settle_model === 'leilong') {
			return room.joined_role_code === 'dps'
		}
		
	
		// 其它（普通副本）
		return room.joined_role_code === 'dps'
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
			// 滚动到底部
			scrollTop.value = 0;
			nextTick(() => {
				scrollTop.value = undefined;
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


	const updateGameUrl = async () => {
		if (gameLinkInput.value == '') {
			uni.showToast({
				title: '请填写游戏组队链接',
				icon: 'none'
			})
			return false;
		}
		const res = await uni.$http.post('/dungeon/updateGameUrl', {
			room_id: room_id.value,
			game_url: gameLinkInput.value
		})
		if (res.code === 1) {
			gameLinkShow.value = false;
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
			gameLinkInput.value = roomData.value.room?.game_link;
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


		if (res.code == 100) {
			rechargeShow.value = true;
			orderInfo.value = res.data;
			return false;
		}

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

		if (settlementImage.value == "" && leilongStage.value != 'disband') {
			uni.showToast({
				title: "请上传结算截图",
				icon: 'none'
			})
			return false;
		}
		let SettlementUrl = '/dungeon/completeRoom';
		if (roomData.value.room.settle_model == 'normal') {
			SettlementUrl = '/dungeon/completeRoom';
		}
		if (roomData.value.room.settle_model == 'terache') {
			SettlementUrl = '/dungeon/submitSettlement';
		}

		if (roomData.value.room.settle_model == 'leilong') {
			SettlementUrl = '/dungeon/completeLeilongRoom';
		}
		if (roomData.value.room.settle_model == 'baoche') {
			SettlementUrl = '/dungeon/completeBaocheRoom';
		}




		const imagesList = settlementImage.value.join(',')
		const res = await uni.$http.post(SettlementUrl, {
			room_id: roomData.value.room.id,
			image_url: imagesList,
			stage: leilongStage.value,
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
			title: "角色名字已复制~",
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
			settlementImage.value.push(res.data.url);

		}
	}

	// const audio = uni.createInnerAudioContext()
	// audio.src = `/static/sounds/start.mp3`
	// audio.play()

	const uploadError = (e) => {
		uploadStatus.value = e.status
		uni.showModal({
			content: JSON.stringify(e)
		})
	}

	const pasteText = () => {
		uni.getClipboardData({
			success: (res) => {
				// 粘贴的内容
				gameLinkInput.value = res.data;
				uni.showToast({
					title: '粘贴成功',
					icon: 'none',
					duration: 1000
				});
			},
			fail: () => {
				uni.showToast({
					title: '粘贴失败，请重试',
					icon: 'none',
					duration: 1000
				});
			}
		});
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


	

	


	const scrollTo = ref('')

	


	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;


	const destroyAudio = () => {
		if (innerAudioContext) {
			innerAudioContext.stop();
			innerAudioContext.destroy();
			innerAudioContext = null;
		}
	};
	// 创建音频
	const createAudio = (audioSrc) => {
		// destroyAudio(); // 每次创建将上一个实例销毁

		setTimeout(() => {
			innerAudioContext.src = audioSrc;
		}, 100)
		// 播放事件
		innerAudioContext.onPlay(() => {
			console.log("play audio");
		});
		// 播放结束事件
		innerAudioContext.onEnded(() => {
			console.log("ended audio");
		});
		// 播放错误事件
		innerAudioContext.onError((error) => {
			console.log("play audio error", error);
			// 兼容ios（估计是官方bug），可能是ios资源没准备好时，播放会发生错误返回errCode为-1，这时需要重新播放，直至播放成功
			if (error.errCode === -1) {
				createAudio(audioSrc);
			} else {
				// 比如文件不存在等情况，会进入到这个提示
				uni.showToast({
					title: "播放失败：" + error.errMsg,
					icon: "none",
				});
			}
		});
		// innerAudioContext.play();
	};



	

	onMounted(async () => {
		await getRoomData()
		await getChatList()
		await getCommonPhrases()
		// if(roomData.room?.status === 'waiting' && isRoomOperator && roomData.value?.room.channel === 'wechat' && ['terache','baoche'].includes(roomData.value.room?.map_code) && !roomData.value.room.game_link_status){
		// 	gameLinkShow.value = true;
		// }

		if (isRoomOperator.value && roomData.value?.room.status === 'waiting' && roomData.value?.room
			.channel === 'wechat' && ['terache', 'baoche'].includes(roomData.value.room?.settle_model) && !roomData
			.value.room.game_link_status) {
			gameLinkShow.value = true;
		}

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
			// 滚动到底部
			scrollTop.value = 0;
			nextTick(() => {
				scrollTop.value = undefined;
			})
		})

		ws.on('member_join_voice', (msg) => {
			const num = msg.joined_number
			if (num >= 2 && num <= 6) {
				// playAudio(`/static/sounds/${num}.mp3`);
				createAudio(`/static/sounds/${num}.mp3`);
				// playNumberVoice(num)
			}
		})
		ws.on('start', (msg) => {
			// playAudio('/static/sounds/start.mp3');
			createAudio('/static/sounds/start.mp3');
			// const audio = uni.createInnerAudioContext()
			// audio.src = `/static/sounds/start.mp3`
			// audio.play()

			// audio.onEnded(() => audio.destroy())
			// audio.onError(() => audio.destroy())
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
		position: fixed;
		width: 100%;
		top: 0;
		background-color: #fff;
		color: #fff;
		height: 100vh;
		display: flex;
		flex-direction: column;
		// justify-content: space-between;
	}
	
	
	
	
	
	.message-wrap {
		height: 0;
		flex: 1;
	
		.scroll-list {
			height: 100%;
			transform: scaleY(-1);
		}
	
		.message-item-wrap {
			min-height: 100%;
			transform: scaleY(-1);
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding: 40rpx;
		}
	
		.loading-wrap {
			transform: scaleY(-1);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10rpx;
		}
	}

	.room-tag-icon {
		width: 30rpx;
		height: 30rpx;
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
		// padding: 0rpx 20rpx;
	}

	.team-tips-item {
		color: red;
		font-size: 26rpx;
		margin: 5rpx 0rpx;
	}



	.room-status {
		display: flex;
		justify-content: space-between;
		margin-top: 20rpx;
	}

	.room-time {
		margin-left: auto;
	}

	.room-tag {
		border-radius: 0rpx 50rpx 50rpx 0rpx;
	}

	.room-time {
		border-radius: 50rpx 0rpx 0rpx 50rpx;
	}

	.room-tag,
	.room-time {
		background: rgba(0, 0, 0, 0.8);
		// border-radius: 50rpx;
		padding: 15rpx 30rpx;
		font-size: 28rpx;
		font-weight: 500;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.room-tag-label {
		margin-left: 10rpx;
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
		// padding: 0 20rpx;
		flex: 1;
		overflow-y: auto;
	}

	.Profit {
		color: #007aff;
		font-size: 30rpx;
		font-weight: 500;
		margin: 10rpx 0rpx;
	}

	.sumProfit {
		color: red;
		font-size: 30rpx;
		font-weight: 500;
		width: 100%;
		text-align: center;
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
		padding: 0rpx 20rpx;
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
		z-index: 1;
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
		height: 82rpx;
		display: flex;
		align-items: center;
		background: #fff;
		border-radius: 10 rpx;
		padding: 16rpx;
	}

	.input {
		flex: 1;
		background: transparent;
		color: #000;
		font-size: 26rpx;
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
	
	
	.game-link-btn {
		background: rgba(128, 0, 2, 1.0);
		box-shadow: 0rpx 4rpx 9rpx 0rpx #fc0107;
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
		height: 70vh;
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
		color: #007aff;
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
		font-size: 30rpx !important;
	}

	.input-with-unit {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10rpx;
	}

	.unit {
		font-size: 28rpx;
		color: #888;
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
		margin-top: 10rpx;
	}

	.popup-footer {
		// margin: 30rpx;
		width: 100%;
		padding: 30rpx;
		position: absolute;
		bottom: 20rpx;
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
		// font-weight: bold;
		font-size: 28rpx;
		color: #888;
		margin-right: 10rpx;
	}

	.value {
		font-size: 28rpx;
		color: #888;
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

	.btn-default {
		box-sizing: border-box;
		height: 60rpx !important;
		display: flex;
		align-items: center;
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

	.game-link-popup-header {
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

	.game-link-card-box {
		position: relative;
		// padding: 20rpx;
	}

	.game-link-content {
		padding: 0rpx 20rpx;
		height: 230rpx;
	}

	.link-input-box {
		margin: 30rpx 0rpx;
		display: flex;
		align-items: center;
	}

	.paste-btm {
		margin: 0rpx 20rpx;
		background-color: #3366ff;
		color: #fff;
		padding: 15rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
		text-align: center;
	}

	.game-link-input {
		color: #333;
		flex: 1;
	}

	.link-desc {
		margin-top: 40rpx;
		color: darkred;
		font-size: 28rpx;
	}

	.link-btn-layout {
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 100rpx;
		border-top: 1rpx solid #eee;
	}

	.link-btn-close {
		width: 50%;
		// background-color: #3366ff;
		color: #000;
		padding: 20rpx 0;
		font-size: 28rpx;

		border-radius: 10rpx;
		text-align: center;
	}

	.link-btn {
		width: 50%;
		// background-color: #3366ff;
		color: #3366ff;
		padding: 20rpx 0;
		font-size: 28rpx;
		border-radius: 10rpx;
		text-align: center;
	}

	.line {
		width: 1rpx;
		height: 100%;
		background: #eee;
	}
</style>