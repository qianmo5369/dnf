"use strict";
const common_vendor = require("../../common/vendor.js");
const js_sdk_xbCopy_uniCopy = require("../../js_sdk/xb-copy/uni-copy.js");
const util_env = require("../../util/env.js");
const util_ws = require("../../util/ws.js");
const pages_room_emoji = require("./emoji.js");
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  _easycom_fui_icon2();
}
const _easycom_fui_icon = () => "../../components/fui-icon/fui-icon.js";
if (!Math) {
  (fuiDialog + TnModal + Recharge + Parse + TnPopup + TnIcon + fuiBottomPopup + fuiUpload + fuiNavBar + TnAvatar + _easycom_fui_icon + fuiSafeArea)();
}
const TnModal = () => "../../uni_modules/tuniaoui-vue3/components/modal/src/modal.js";
const TnIcon = () => "../../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const fuiUpload = () => "../../components/fui-upload.js";
const Recharge = () => "../../components/recharge.js";
const fuiBottomPopup = () => "../../components/fui-bottom-popup.js";
const TnAvatar = () => "../../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const fuiSafeArea = () => "../../components/fui-safe-area.js";
const fuiNavBar = () => "../../components/fui-nav-bar.js";
const fuiDialog = () => "../../components/fui-dialog.js";
const TnPopup = () => "../../uni_modules/tuniaoui-vue3/components/popup/src/popup.js";
const Parse = () => "../../components/parse.js";
const _sfc_main = {
  __name: "room",
  setup(__props) {
    const uploadRef = common_vendor.ref(null);
    const uploadUrl = util_env.baseUrl + "/common/upload";
    const uploadStatus = common_vendor.ref(false);
    const settlementImage = common_vendor.ref([]);
    const dialogShow = common_vendor.ref(false);
    const completeShow = common_vendor.ref(false);
    const title = common_vendor.ref(null);
    const content = common_vendor.ref(null);
    const confirmText = common_vendor.ref(null);
    const roomData = common_vendor.ref({});
    const onConfirm = common_vendor.ref(null);
    const selectedHeroId = common_vendor.ref(null);
    const msgTime = common_vendor.ref("该房间最新消息，2小时前");
    const inputMsg = common_vendor.ref("");
    const room_id = common_vendor.ref(null);
    const msgList = common_vendor.ref([]);
    const phrasShow = common_vendor.ref(false);
    const isGoldCar = common_vendor.ref("0");
    const teraCost = common_vendor.ref("");
    const hasCard = common_vendor.ref("0");
    const cardPrice = common_vendor.ref("");
    const gameLinkInput = common_vendor.ref(null);
    const rechargeShow = common_vendor.ref(false);
    const orderInfo = common_vendor.ref({});
    common_vendor.ref(true);
    common_vendor.reactive(520);
    const teraRatio = common_vendor.computed(() => {
      var _a;
      return parseFloat(((_a = roomData.value.room) == null ? void 0 : _a.tera_ratio) || 5e3);
    });
    const scrollTop = common_vendor.ref();
    const contentId = common_vendor.ref(null);
    const contentShow = common_vendor.ref(false);
    const handleContent = (id) => {
      contentId.value = id;
      contentShow.value = true;
    };
    const sellerTera = common_vendor.computed(() => {
      const cost = parseFloat(teraCost.value || 0);
      return cost > 0 ? (cost * 0.95 / 6).toFixed(2) : "0.00";
    });
    const realTera = common_vendor.computed(() => {
      const cost = parseFloat(teraCost.value || 0);
      const self = parseFloat(sellerTera.value || 0);
      const cardcost = parseFloat(cardPrice.value || 0);
      const result = cost * 0.95 - self - cardcost * 0.9;
      return result > 0 ? result.toFixed(2) : "0.00";
    });
    const cashProfit = common_vendor.computed(() => {
      const tera = parseFloat(realTera.value || 0);
      const ratio = teraRatio.value;
      return tera > 0 ? (tera * 1e4 / ratio).toFixed(2) : "0.00";
    });
    const cardProfit = common_vendor.computed(() => {
      const cost = parseFloat(teraCost.value || 0);
      const cardcost = parseFloat(cardPrice.value || 0);
      return ((cost * 0.95 / 6 * 2 * 5 - (cost * 0.95 - cost * 0.95 / 6 - cardcost * 0.9) * 2) * 0.2).toFixed(2);
    });
    const sumProfit = common_vendor.computed(() => {
      const result = parseFloat(cashProfit.value) + parseFloat(cardProfit.value);
      return result.toFixed(2);
    });
    const leilongStages = common_vendor.ref([
      {
        label: "解散房间",
        value: "disband"
      },
      {
        label: "13阶段",
        value: "stage13"
      },
      {
        label: "斩杀",
        value: "kill"
      }
    ]);
    const leilongStage = common_vendor.ref("kill");
    const gameLinkShow = common_vendor.ref(false);
    common_vendor.ref(null);
    const onJoinGameRoom = () => {
      common_vendor.wx$1.navigateToMiniProgram({
        shortLink: roomData.value.game_link,
        fail: function(e) {
          common_vendor.index.showToast({
            title: "启动失败，请检查链接是否配置正确",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onShow(() => {
      getRoomData();
    });
    common_vendor.onLoad((params) => {
      if (params.share_uid) {
        common_vendor.index.setStorageSync("share_uid", params.share_uid);
        common_vendor.index.__f__("log", "at pages/room/room.vue:641", "换成分享uid" + params.share_uid);
      }
      if (params.room_id) {
        room_id.value = params.room_id;
      } else {
        common_vendor.index.showToast({
          title: "房间不存在",
          icon: "none"
        });
      }
    });
    const waitingTimeText = common_vendor.ref("00:00:00");
    const progressTimeText = common_vendor.ref("00:00:00");
    let timer = null;
    const startTime = common_vendor.ref(0);
    const status = common_vendor.ref("");
    const startTimestamp = common_vendor.ref(0);
    common_vendor.ref("");
    const formatTime = (seconds) => {
      const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const m = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
      const s = String(seconds % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    };
    const updateTimer = () => {
      const current = Math.floor(Date.now() / 1e3);
      const start = startTimestamp.value;
      const elapsed = Math.max(0, current - start);
      const formatted = formatTime(elapsed);
      if (status.value === "waiting") {
        waitingTimeText.value = formatted;
      } else if (status.value === "in_progress") {
        progressTimeText.value = formatted;
      }
    };
    const initCounter = (room) => {
      clearInterval(timer);
      status.value = room.status;
      if (status.value === "waiting") {
        startTime.value = Number(room.waiting_start_at);
        startTimestamp.value = Number(room.waiting_start_at || 0);
      } else if (status.value === "in_progress") {
        startTime.value = Number(room.progress_start_at);
        startTimestamp.value = Number(room.progress_start_at || 0);
      }
      updateTimer();
      if (status.value === "waiting" || status.value === "in_progress") {
        timer = setInterval(() => {
          updateTimer();
        }, 1e3);
      }
    };
    common_vendor.onUnmounted(() => {
      clearInterval(timer);
    });
    const handlePhras = () => {
      common_vendor.index.__f__("log", "at pages/room/room.vue:750", "执行我");
      phrasShow.value = true;
      if (faceShow.value) {
        faceShow.value = false;
      }
    };
    const complaintLink = () => {
      var _a;
      linkTo(`/pages/complaint/send?room_id=${(_a = roomData.value.room) == null ? void 0 : _a.id}`);
    };
    const onClick = (e) => {
      common_vendor.index.__f__("log", "at pages/room/room.vue:763", "点击事件触发了，type：", e);
      if (e.index === 1 && typeof onConfirm.value === "function") {
        common_vendor.index.__f__("log", "at pages/room/room.vue:765", "点击确定");
        onConfirm.value();
      }
      dialogShow.value = false;
    };
    const onClose = () => {
      dialogShow.value = false;
      common_vendor.index.__f__("log", "at pages/room/room.vue:772", "关闭点击");
    };
    const refresh = async () => {
      await getChatList();
      await getRoomData();
      common_vendor.index.showToast({
        title: "刷新成功",
        icon: "none"
      });
    };
    const onStartGame = () => {
      const positions = roomData.value.positions || [];
      const room = roomData.value.room || {};
      const joinedMembers = positions.filter((pos) => pos.user).length;
      if (!room.is_terache && joinedMembers <= 1) {
        common_vendor.index.showToast({
          title: "至少需要两名成员才能开始游戏",
          icon: "none"
        });
        return;
      }
      title.value = "确认开始游戏";
      content.value = "确定开始游戏吗？请确认房间人员准备完成";
      confirmText.value = "确认开始";
      dialogShow.value = true;
      onConfirm.value = doStartGame;
    };
    common_vendor.ref("");
    const linkTo = (path, type = "") => {
      if (type == "tabbar") {
        common_vendor.index.switchTab({
          url: path
        });
      } else {
        common_vendor.index.navigateTo({
          url: path
        });
      }
    };
    const isRoomOperator = common_vendor.computed(() => {
      const positions = roomData.value.positions || [];
      const room = roomData.value.room || {};
      if (!room || !positions.length)
        return false;
      if (room.is_terache) {
        return room.joined_role_code === "seller";
      }
      if (room.settle_model === "baoche") {
        const hasDps = positions.some((pos) => pos.code === "dps");
        if (hasDps) {
          return room.joined_role_code === "dps";
        } else {
          return room.joined_role_code === "baoche";
        }
      }
      if (room.settle_model === "leilong") {
        return room.joined_role_code === "dps";
      }
      return room.joined_role_code === "dps";
    });
    const onKickMember = (pos) => {
      const room = roomData.value.room;
      const currentUserId = room == null ? void 0 : room.user_id;
      common_vendor.index.__f__("log", "at pages/room/room.vue:891", pos);
      if (!(room == null ? void 0 : room.is_owner))
        return;
      if (!pos.user || pos.code === "lock")
        return;
      if (pos.user.user_id === currentUserId)
        return;
      title.value = "踢出成员";
      content.value = `确定将【${pos.user.nickname}】踢出房间吗？`;
      confirmText.value = "确认踢出";
      dialogShow.value = true;
      onConfirm.value = () => doKickMember(pos.id);
    };
    const doKickMember = async (memberId) => {
      const res = await common_vendor.index.$http.post("/dungeon/kick", {
        room_id: roomData.value.room.id,
        member_id: memberId
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: "已踢出",
          icon: "none"
        });
        getRoomData();
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const sendChat = async () => {
      if (!inputMsg.value.trim()) {
        return common_vendor.index.showToast({
          title: "请输入内容",
          icon: "none"
        });
      }
      util_ws.ws.send({
        type: "chat",
        room_id: `room_${roomData.value.room.id}`,
        content: inputMsg.value
      });
      if (faceShow.value) {
        faceShow.value = false;
      }
      inputMsg.value = "";
    };
    const phrasSend = async (value) => {
      util_ws.ws.send({
        type: "chat",
        room_id: `room_${roomData.value.room.id}`,
        content: value
      });
      phrasShow.value = false;
    };
    const getChatList = async () => {
      const res = await common_vendor.index.$http.post("/dungeon/chatList", {
        room_id: room_id.value,
        last_id: null
      });
      common_vendor.index.__f__("log", "at pages/room/room.vue:1006", "接口信息:", res);
      if (res.code === 1) {
        msgList.value = res.data.list;
        scrollTop.value = 0;
        common_vendor.nextTick$1(() => {
          scrollTop.value = void 0;
        });
      }
    };
    const commonPhrases = common_vendor.ref([]);
    const getCommonPhrases = async () => {
      const res = await common_vendor.index.$http.post("/room/getCommonPhrases", {});
      common_vendor.index.__f__("log", "at pages/room/room.vue:1021", "接口信息:", res);
      if (res.code === 1) {
        commonPhrases.value = res.data;
      }
    };
    const updateGameUrl = async () => {
      if (gameLinkInput.value == "") {
        common_vendor.index.showToast({
          title: "请填写游戏组队链接",
          icon: "none"
        });
        return false;
      }
      const res = await common_vendor.index.$http.post("/dungeon/updateGameUrl", {
        room_id: room_id.value,
        game_url: gameLinkInput.value
      });
      if (res.code === 1) {
        gameLinkShow.value = false;
      }
    };
    const getRoomData = async () => {
      var _a;
      const res = await common_vendor.index.$http.post("/dungeon/info", {
        room_id: room_id.value
      });
      common_vendor.index.__f__("log", "at pages/room/room.vue:1050", "接口信息:", res);
      if (res.code === 1) {
        roomData.value = res.data;
        onCheckRoom();
        initCounter(res.data.room);
        gameLinkInput.value = (_a = roomData.value.room) == null ? void 0 : _a.game_link;
      }
    };
    const onSelectPosition = async (pos) => {
      if (pos.code == "lock") {
        return false;
      }
      if (pos.user) {
        copy(pos.user.nickname);
        return;
      }
      if (roomData.value.room.is_member) {
        return false;
      }
      const res = await common_vendor.index.$http.post("/dungeon/join", {
        payload: {
          room_id: roomData.value.room.id,
          member_id: pos.id,
          user_hero_id: selectedHeroId.value
          // 当前用户选择的英雄 ID
        }
      });
      if (res.code == 100) {
        rechargeShow.value = true;
        orderInfo.value = res.data;
        return false;
      }
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: "加入成功",
          icon: "success"
        });
        util_ws.ws.send({
          type: "join",
          room_code: `room_${roomData.value.room.id}`
        });
        getRoomData();
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const previewImage = (e) => {
      common_vendor.index.previewImage({
        urls: [e],
        // 需要预览的图片http链接列表
        current: "",
        // 当前显示图片的http链接，默认是第一个
        success: function(res) {
        },
        fail: function(res) {
        },
        complete: function(res) {
        }
      });
    };
    const onLeaveRoom = () => {
      const room = roomData.value.room;
      if (room.status === "completed") {
        common_vendor.index.showToast({
          title: "游戏已经完成无须退出",
          icon: "none"
        });
        return false;
      } else if (room.is_owner && room.status === "waiting") {
        title.value = "解散房间";
        content.value = "你作为房主 退出将会解散房间";
        confirmText.value = "确定解散";
      } else if (room.is_owner && room.status === "in_progress") {
        title.value = "解散房间";
        content.value = "游戏进行中，退出将会无法结算";
        confirmText.value = "确认解散";
      } else {
        title.value = "退出房间";
        content.value = "退出房间将无法发言";
        confirmText.value = "确认退出";
      }
      onConfirm.value = confirmLeaveRoom;
      dialogShow.value = true;
    };
    const doStartGame = async () => {
      const res = await common_vendor.index.$http.post("/dungeon/start", {
        room_id: roomData.value.room.id
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: "游戏已开始",
          icon: "success"
        });
      } else {
        common_vendor.index.showToast({
          title: res.msg || "开始失败",
          icon: "none"
        });
      }
    };
    const doResetToWait = async () => {
      const result = await common_vendor.index.$http.post("/dungeon/resetWait", {
        room_id: roomData.value.room.id
      });
      if (result.code === 1) {
        common_vendor.index.showToast({
          title: result.msg || "失败",
          icon: "none"
        });
      }
    };
    const onResetToWait = async () => {
      title.value = "提示";
      content.value = "将房间变为等候中，和长按踢人，重新组人";
      confirmText.value = "确认变更";
      dialogShow.value = true;
      onConfirm.value = doResetToWait;
    };
    const doCompleteRoom = async () => {
      if (settlementImage.value == "" && leilongStage.value != "disband") {
        common_vendor.index.showToast({
          title: "请上传结算截图",
          icon: "none"
        });
        return false;
      }
      let SettlementUrl = "/dungeon/completeRoom";
      if (roomData.value.room.settle_model == "normal") {
        SettlementUrl = "/dungeon/completeRoom";
      }
      if (roomData.value.room.settle_model == "terache") {
        SettlementUrl = "/dungeon/submitSettlement";
      }
      if (roomData.value.room.settle_model == "leilong") {
        SettlementUrl = "/dungeon/completeLeilongRoom";
      }
      if (roomData.value.room.settle_model == "baoche") {
        SettlementUrl = "/dungeon/completeBaocheRoom";
      }
      const imagesList = settlementImage.value.join(",");
      const res = await common_vendor.index.$http.post(SettlementUrl, {
        room_id: roomData.value.room.id,
        image_url: imagesList,
        stage: leilongStage.value,
        tera_cost: parseFloat(teraCost.value || 0),
        // 花费泰拉（单位：万）← 用户填的
        is_gold_car: isGoldCar.value,
        // 是否金币车（0/1）← 用户选择
        has_card: hasCard.value,
        // 是否有卡片（0/1）← 用户勾选
        card_price: hasCard.value ? parseFloat(cardPrice.value || 0) : 0
        // 卡片拍卖价（单位：万）
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: res.msg || "",
          icon: "none"
        });
        completeShow.value = false;
      } else {
        common_vendor.index.showToast({
          title: res.msg || "开始失败",
          icon: "none"
        });
      }
    };
    const onCheckRoom = async () => {
      if (roomData.value.room.status == "completed" && !roomData.value.room.is_member) {
        title.value = "提示";
        content.value = "该房间已经完成";
        confirmText.value = "更多房间";
        dialogShow.value = true;
        onConfirm.value = toHome;
        return false;
      }
      const positions = roomData.value.positions || [];
      const joinedMembers = positions.filter((pos) => pos.user).length;
      if (positions.length == joinedMembers && !roomData.value.room.is_member) {
        title.value = "提示";
        content.value = "该房间已满员";
        confirmText.value = "更多房间";
        dialogShow.value = true;
        onConfirm.value = toHome;
      }
    };
    const toHome = () => {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    };
    const checkMemberAccess = (callback) => {
      var _a;
      common_vendor.index.__f__("log", "at pages/room/room.vue:1275", roomData.value.room);
      if (!((_a = roomData.value.room) == null ? void 0 : _a.is_member)) {
        common_vendor.index.showToast({
          title: "请先加入房间",
          icon: "none"
        });
        return;
      }
      callback && callback();
    };
    const getRoleColor = (code) => {
      if (code === "leader")
        return "blue";
      if (code === "dps")
        return "red";
      if (code === "support")
        return "green";
      if (code === "leech")
        return "green";
      if (code === "baoche")
        return code;
      if (code === "team")
        return code;
      if (code === "deck")
        return code;
      if (code === "lock")
        return code;
      if (code === "seller")
        return code;
      return "";
    };
    const confirmLeaveRoom = async () => {
      const result = await common_vendor.index.$http.post("/dungeon/leave", {
        room_id: roomData.value.room.id
      });
      if (result.code === 1) {
        common_vendor.index.showToast({
          title: result.msg || "退出失败",
          icon: "none"
        });
        return true;
      } else {
        common_vendor.index.showToast({
          title: result.msg || "退出失败",
          icon: "none"
        });
      }
    };
    const copy = (val) => {
      js_sdk_xbCopy_uniCopy.uniCopy({
        content: val,
        title: "角色名字已复制~",
        success: (res) => {
          common_vendor.index.showToast({
            title: res,
            icon: "none"
          });
        },
        error: (e) => {
          common_vendor.index.showToast({
            title: e,
            icon: "none",
            duration: 3e3
          });
        }
      });
    };
    const uploadSuccess = (e) => {
      common_vendor.index.__f__("log", "at pages/room/room.vue:1349", e);
      let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}");
      uploadStatus.value = e.status;
      if (res.data.url) {
        settlementImage.value.push(res.data.url);
      }
    };
    const uploadError = (e) => {
      uploadStatus.value = e.status;
      common_vendor.index.showModal({
        content: JSON.stringify(e)
      });
    };
    const pasteText = () => {
      common_vendor.index.getClipboardData({
        success: (res) => {
          gameLinkInput.value = res.data;
          common_vendor.index.showToast({
            title: "粘贴成功",
            icon: "none",
            duration: 1e3
          });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "粘贴失败，请重试",
            icon: "none",
            duration: 1e3
          });
        }
      });
    };
    const focus = common_vendor.ref(false);
    const faceShow = common_vendor.ref(false);
    common_vendor.ref(null);
    const focusChange = () => {
      focus.value = true;
    };
    const blurChange = () => {
      focus.value = false;
    };
    const faceChange = () => {
      faceShow.value = !faceShow.value;
      common_vendor.index.hideKeyboard();
    };
    const faceClick = (item) => {
      common_vendor.index.__f__("log", "at pages/room/room.vue:1409", item);
      if (!faceShow.value)
        return;
      inputMsg.value += item;
    };
    const delMsg = () => {
      if (!inputMsg.value)
        return;
      let number = 1;
      if (inputMsg.value.length > 1) {
        number = inputMsg.value.substr(inputMsg.value.length - 2, inputMsg.value.length).search(
          /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/i
        ) == -1 ? 1 : 2;
      }
      inputMsg.value = inputMsg.value.substr(0, inputMsg.value.length - number);
    };
    common_vendor.ref("");
    const innerAudioContext = common_vendor.index.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    const createAudio = (audioSrc) => {
      setTimeout(() => {
        innerAudioContext.src = audioSrc;
      }, 100);
      innerAudioContext.onPlay(() => {
        common_vendor.index.__f__("log", "at pages/room/room.vue:1455", "play audio");
      });
      innerAudioContext.onEnded(() => {
        common_vendor.index.__f__("log", "at pages/room/room.vue:1459", "ended audio");
      });
      innerAudioContext.onError((error) => {
        common_vendor.index.__f__("log", "at pages/room/room.vue:1463", "play audio error", error);
        if (error.errCode === -1) {
          createAudio(audioSrc);
        } else {
          common_vendor.index.showToast({
            title: "播放失败：" + error.errMsg,
            icon: "none"
          });
        }
      });
    };
    common_vendor.onMounted(async () => {
      var _a, _b, _c;
      await getRoomData();
      await getChatList();
      await getCommonPhrases();
      if (isRoomOperator.value && ((_a = roomData.value) == null ? void 0 : _a.room.status) === "waiting" && ((_b = roomData.value) == null ? void 0 : _b.room.channel) === "wechat" && ["terache", "baoche"].includes((_c = roomData.value.room) == null ? void 0 : _c.settle_model) && !roomData.value.room.game_link_status) {
        gameLinkShow.value = true;
      }
      util_ws.ws.on("room_update", (msg) => {
        common_vendor.index.__f__("log", "at pages/room/room.vue:1498", "收到 room_update:", msg.data);
        roomData.value = msg.data;
        onCheckRoom();
        initCounter(msg.data.room);
      });
      util_ws.ws.on("chat", (msg) => {
        msgList.value.push(msg.data);
        scrollTop.value = 0;
        common_vendor.nextTick$1(() => {
          scrollTop.value = void 0;
        });
      });
      util_ws.ws.on("member_join_voice", (msg) => {
        const num = msg.joined_number;
        if (num >= 2 && num <= 6) {
          createAudio(`/static/sounds/${num}.mp3`);
        }
      });
      util_ws.ws.on("start", (msg) => {
        createAudio("/static/sounds/start.mp3");
      });
      util_ws.ws.on("completeRoom", (res) => {
        if (res.data.show_completed_modal) {
          title.value = "组队完成";
          content.value = "结算阶段： 是否存在未通关、虚假结算、违规竞拍、等问题?";
          confirmText.value = "发起申诉";
          dialogShow.value = true;
          onConfirm.value = complaintLink;
        }
      });
      util_ws.ws.on("kicked", () => {
        title.value = "提示";
        content.value = "你已被房主踢出该房间";
        confirmText.value = "返回首页";
        dialogShow.value = true;
        onConfirm.value = () => {
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          }).catch((err) => {
            common_vendor.index.__f__("error", "at pages/room/room.vue:1557", "页面跳转失败:", err);
          });
        };
      });
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa, _Ba, _Ca, _Da, _Ea;
      return common_vendor.e({
        a: common_vendor.o(onClick),
        b: common_vendor.o(onClose),
        c: common_vendor.p({
          show: dialogShow.value,
          content: content.value,
          title: title.value,
          confirmText: confirmText.value,
          maskClosable: true
        }),
        d: common_vendor.sr("modalRef", "49055c66-1"),
        e: rechargeShow.value
      }, rechargeShow.value ? {
        f: common_vendor.o(($event) => rechargeShow.value = $event),
        g: common_vendor.p({
          orderInfo: orderInfo.value,
          modelValue: rechargeShow.value
        })
      } : {}, {
        h: contentShow.value
      }, contentShow.value ? {
        i: common_vendor.o(($event) => contentShow.value = $event),
        j: common_vendor.p({
          contentId: contentId.value,
          modelValue: contentShow.value
        })
      } : {}, {
        k: common_vendor.p({
          ["z-index"]: "20076",
          ["model-value"]: contentShow.value,
          width: "90%",
          height: "70vh",
          borderRadius: "16rpx"
        }),
        l: common_vendor.p({
          name: "close",
          size: "35",
          color: "#999"
        }),
        m: common_vendor.o(($event) => {
          gameLinkShow.value = false;
        }),
        n: gameLinkInput.value,
        o: common_vendor.o(($event) => gameLinkInput.value = $event.detail.value),
        p: common_vendor.o(pasteText),
        q: common_vendor.o(($event) => handleContent(6)),
        r: common_vendor.o(updateGameUrl),
        s: common_vendor.p({
          ["model-value"]: gameLinkShow.value,
          width: "80%",
          height: "450rpx",
          borderRadius: "16rpx"
        }),
        t: common_vendor.p({
          name: "close",
          color: "#000"
        }),
        v: common_vendor.o(($event) => phrasShow.value = false),
        w: common_vendor.f(commonPhrases.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.text),
            b: common_vendor.o(($event) => phrasSend(item.text), index),
            c: index
          };
        }),
        x: common_vendor.p({
          show: phrasShow.value,
          zIndex: 4e3
        }),
        y: common_vendor.p({
          name: "close",
          color: "#000"
        }),
        z: common_vendor.o(($event) => completeShow.value = false),
        A: common_vendor.p({
          name: "tip-fill",
          color: "#f53f3f"
        }),
        B: ((_a = roomData.value.room) == null ? void 0 : _a.settle_model) != "leilong"
      }, ((_b = roomData.value.room) == null ? void 0 : _b.settle_model) != "leilong" ? {} : {}, {
        C: ((_c = roomData.value.room) == null ? void 0 : _c.settle_model) == "terache"
      }, ((_d = roomData.value.room) == null ? void 0 : _d.settle_model) == "terache" ? common_vendor.e({
        D: isGoldCar.value === "0"
      }, isGoldCar.value === "0" ? {} : {}, {
        E: isGoldCar.value === "0" ? 1 : "",
        F: common_vendor.o(($event) => isGoldCar.value = "0"),
        G: isGoldCar.value === "1"
      }, isGoldCar.value === "1" ? {} : {}, {
        H: isGoldCar.value === "1" ? 1 : "",
        I: common_vendor.o(($event) => isGoldCar.value = "1"),
        J: isGoldCar.value === "0"
      }, isGoldCar.value === "0" ? common_vendor.e({
        K: teraCost.value,
        L: common_vendor.o(($event) => teraCost.value = $event.detail.value),
        M: hasCard.value === "0"
      }, hasCard.value === "0" ? {} : {}, {
        N: hasCard.value === "0" ? 1 : "",
        O: common_vendor.o(($event) => hasCard.value = "0"),
        P: hasCard.value === "1"
      }, hasCard.value === "1" ? {} : {}, {
        Q: hasCard.value === "1" ? 1 : "",
        R: common_vendor.o(($event) => hasCard.value = "1"),
        S: hasCard.value === "1"
      }, hasCard.value === "1" ? {
        T: cardPrice.value,
        U: common_vendor.o(($event) => cardPrice.value = $event.detail.value)
      } : {}, {
        V: common_vendor.t(realTera.value),
        W: common_vendor.t(cashProfit.value),
        X: common_vendor.t(cardProfit.value),
        Y: common_vendor.t(sumProfit.value)
      }) : {}) : {}, {
        Z: ((_e = roomData.value.room) == null ? void 0 : _e.settle_model) === "leilong"
      }, ((_f = roomData.value.room) == null ? void 0 : _f.settle_model) === "leilong" ? {
        aa: common_vendor.f(leilongStages.value, (item, k0, i0) => {
          return common_vendor.e({
            a: leilongStage.value === item.value
          }, leilongStage.value === item.value ? {} : {}, {
            b: common_vendor.t(item.label),
            c: item.value,
            d: leilongStage.value === item.value ? 1 : "",
            e: common_vendor.o(($event) => leilongStage.value = item.value, item.value)
          });
        })
      } : {}, {
        ab: !(((_g = roomData.value.room) == null ? void 0 : _g.settle_model) === "leilong" && leilongStage.value === "disband")
      }, !(((_h = roomData.value.room) == null ? void 0 : _h.settle_model) === "leilong" && leilongStage.value === "disband") ? {
        ac: common_vendor.sr(uploadRef, "49055c66-12,49055c66-9", {
          "k": "uploadRef"
        }),
        ad: common_vendor.o(uploadSuccess),
        ae: common_vendor.o(uploadError),
        af: common_vendor.p({
          borderColor: "#eee",
          background: "#fff",
          radius: "10",
          immediate: true,
          width: "320",
          height: "200",
          url: uploadUrl,
          max: 2
        })
      } : {}, {
        ag: common_vendor.o(doCompleteRoom),
        ah: common_vendor.p({
          show: completeShow.value,
          zIndex: 8e3
        }),
        ai: common_vendor.o(($event) => linkTo("/pages/index/index", "tabbar")),
        aj: common_vendor.p({
          name: "left",
          size: "35rpx",
          color: "#fff"
        }),
        ak: ((_i = roomData.value.room) == null ? void 0 : _i.channel) === "wechat"
      }, ((_j = roomData.value.room) == null ? void 0 : _j.channel) === "wechat" ? {} : {}, {
        al: ((_k = roomData.value.room) == null ? void 0 : _k.channel) === "QQ"
      }, ((_l = roomData.value.room) == null ? void 0 : _l.channel) === "QQ" ? {} : {}, {
        am: ((_m = roomData.value.room) == null ? void 0 : _m.channel) === "wechat"
      }, ((_n = roomData.value.room) == null ? void 0 : _n.channel) === "wechat" ? {} : {}, {
        an: ((_o = roomData.value.room) == null ? void 0 : _o.channel) === "QQ"
      }, ((_p = roomData.value.room) == null ? void 0 : _p.channel) === "QQ" ? {} : {}, {
        ao: common_vendor.t((_q = roomData.value.room) == null ? void 0 : _q.mode_title),
        ap: common_vendor.t((_r = roomData.value.room) == null ? void 0 : _r.id),
        aq: common_vendor.p({
          custom: true,
          padding: "12",
          background: "none"
        }),
        ar: ((_s = roomData.value.room) == null ? void 0 : _s.channel) === "wechat" && ["terache", "baoche"].includes((_t = roomData.value.room) == null ? void 0 : _t.settle_model)
      }, ((_u = roomData.value.room) == null ? void 0 : _u.channel) === "wechat" && ["terache", "baoche"].includes((_v = roomData.value.room) == null ? void 0 : _v.settle_model) ? common_vendor.e({
        as: !((_w = roomData.value.room) == null ? void 0 : _w.game_link_status)
      }, !((_x = roomData.value.room) == null ? void 0 : _x.game_link_status) ? {
        at: common_vendor.o(($event) => handleContent(6))
      } : {
        av: common_vendor.o(($event) => gameLinkShow.value = true)
      }) : {}, {
        aw: ((_y = roomData.value.room) == null ? void 0 : _y.settle_model) === "leilong"
      }, ((_z = roomData.value.room) == null ? void 0 : _z.settle_model) === "leilong" ? {
        ax: common_vendor.t((_A = roomData.value.room) == null ? void 0 : _A.thirteen_stage_coin),
        ay: common_vendor.t((_B = roomData.value.room) == null ? void 0 : _B.finish_stage_coin)
      } : {}, {
        az: ((_C = roomData.value.room) == null ? void 0 : _C.settle_model) === "normal"
      }, ((_D = roomData.value.room) == null ? void 0 : _D.settle_model) === "normal" ? {
        aA: common_vendor.t((_E = roomData.value.room) == null ? void 0 : _E.leader_pay)
      } : {}, {
        aB: roomData.value && ((_F = roomData.value.room) == null ? void 0 : _F.status) !== "completed"
      }, roomData.value && ((_G = roomData.value.room) == null ? void 0 : _G.status) !== "completed" ? common_vendor.e({
        aC: ((_H = roomData.value.room) == null ? void 0 : _H.status) === "waiting"
      }, ((_I = roomData.value.room) == null ? void 0 : _I.status) === "waiting" ? {
        aD: common_vendor.t(waitingTimeText.value)
      } : ((_J = roomData.value.room) == null ? void 0 : _J.status) === "in_progress" ? {
        aF: common_vendor.t(progressTimeText.value)
      } : {}, {
        aE: ((_K = roomData.value.room) == null ? void 0 : _K.status) === "in_progress"
      }) : {}, {
        aG: `url(${(_L = roomData.value.room) == null ? void 0 : _L.mode_image})`,
        aH: common_vendor.f(roomData.value.positions, (pos, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(pos.title),
            b: common_vendor.n(getRoleColor(pos.code)),
            c: pos.user && pos.code != "seller"
          }, pos.user && pos.code != "seller" ? common_vendor.e({
            d: pos.user
          }, pos.user ? {
            e: pos.user["hero_avatar"]
          } : {}, {
            f: common_vendor.t(pos.user.resist_power),
            g: common_vendor.t(pos.user.hero_name),
            h: pos.user.status == "escaped"
          }, pos.user.status == "escaped" ? {} : {}, {
            i: common_vendor.t(pos.user.nickname)
          }) : {}, {
            j: pos.user && pos.code == "seller"
          }, pos.user && pos.code == "seller" ? common_vendor.e({
            k: pos.user
          }, pos.user ? {
            l: pos.user["hero_avatar"]
          } : {}, {
            m: common_vendor.t(roomData.value.room.tera_own),
            n: common_vendor.t(roomData.value.room.tera_ratio)
          }) : {}, {
            o: pos.code != "lock" && !pos.user
          }, pos.code != "lock" && !pos.user ? {
            p: common_vendor.n(getRoleColor(pos.code))
          } : {}, {
            q: pos.code == "lock"
          }, pos.code == "lock" ? {} : {}, {
            r: common_vendor.n(pos.code),
            s: pos.id,
            t: common_vendor.o(($event) => onSelectPosition(pos), pos.id),
            v: common_vendor.o(($event) => onKickMember(pos), pos.id)
          });
        }),
        aI: ((_M = roomData.value.room) == null ? void 0 : _M.config_json) && ((_N = roomData.value.room) == null ? void 0 : _N.config_json.tips)
      }, ((_O = roomData.value.room) == null ? void 0 : _O.config_json) && ((_P = roomData.value.room) == null ? void 0 : _P.config_json.tips) ? {
        aJ: common_vendor.f((_R = (_Q = roomData.value.room) == null ? void 0 : _Q.config_json) == null ? void 0 : _R.tips, (tips, index0, i0) => {
          return {
            a: common_vendor.t(tips),
            b: index0
          };
        })
      } : {}, {
        aK: common_vendor.f(msgList.value, (msg, index, i0) => {
          return {
            a: "49055c66-15-" + i0,
            b: common_vendor.p({
              size: "60rpx",
              url: msg.hero_avatar
            }),
            c: common_vendor.t(msg.role_title),
            d: common_vendor.n(msg.role_code),
            e: common_vendor.t(msg.hero_nickname),
            f: common_vendor.n(getRoleColor(msg.role_code)),
            g: common_vendor.t(msg.content),
            h: index,
            i: "msg-" + index
          };
        }),
        aL: scrollTop.value,
        aM: roomData.value.room && isRoomOperator.value
      }, roomData.value.room && isRoomOperator.value ? common_vendor.e({
        aN: ((_S = roomData.value.room) == null ? void 0 : _S.status) === "waiting"
      }, ((_T = roomData.value.room) == null ? void 0 : _T.status) === "waiting" ? {
        aO: common_vendor.o(($event) => onStartGame())
      } : {}, {
        aP: ((_U = roomData.value.room) == null ? void 0 : _U.status) === "in_progress"
      }, ((_V = roomData.value.room) == null ? void 0 : _V.status) === "in_progress" ? {
        aQ: common_vendor.o(($event) => completeShow.value = true)
      } : {}, {
        aR: ((_W = roomData.value.room) == null ? void 0 : _W.status) === "waiting"
      }, ((_X = roomData.value.room) == null ? void 0 : _X.status) === "waiting" ? {
        aS: common_vendor.o(($event) => refresh())
      } : {}, {
        aT: ((_Y = roomData.value.room) == null ? void 0 : _Y.status) === "in_progress"
      }, ((_Z = roomData.value.room) == null ? void 0 : _Z.status) === "in_progress" ? {
        aU: common_vendor.o(($event) => onResetToWait())
      } : {}) : {}, {
        aV: ((__ = roomData.value.room) == null ? void 0 : __.status) === "in_progress" && ((_$ = roomData.value.room) == null ? void 0 : _$.game_link) && ((_aa = roomData.value.room) == null ? void 0 : _aa.joined_role_code) != null
      }, ((_ba = roomData.value.room) == null ? void 0 : _ba.status) === "in_progress" && ((_ca = roomData.value.room) == null ? void 0 : _ca.game_link) && ((_da = roomData.value.room) == null ? void 0 : _da.joined_role_code) != null ? {
        aW: common_vendor.o(($event) => onJoinGameRoom())
      } : {}, {
        aX: roomData.value.room && ((_ea = roomData.value.room) == null ? void 0 : _ea.status) != "completed" && ((_fa = roomData.value.room) == null ? void 0 : _fa.status) != "disbanded" && ((_ga = roomData.value.room) == null ? void 0 : _ga.status) != "settling"
      }, roomData.value.room && ((_ha = roomData.value.room) == null ? void 0 : _ha.status) != "completed" && ((_ia = roomData.value.room) == null ? void 0 : _ia.status) != "disbanded" && ((_ja = roomData.value.room) == null ? void 0 : _ja.status) != "settling" ? common_vendor.e({
        aY: common_vendor.o(($event) => checkMemberAccess(handlePhras)),
        aZ: !((_ka = roomData.value.room) == null ? void 0 : _ka.is_member),
        ba: msgTime.value,
        bb: common_vendor.o(() => checkMemberAccess()),
        bc: common_vendor.o(focusChange),
        bd: common_vendor.o(blurChange),
        be: common_vendor.o(($event) => sendChat()),
        bf: inputMsg.value,
        bg: common_vendor.o(($event) => inputMsg.value = $event.detail.value),
        bh: common_vendor.o(() => checkMemberAccess(faceChange)),
        bi: common_vendor.p({
          name: !faceShow.value ? "face" : "keyboard"
        }),
        bj: inputMsg.value
      }, inputMsg.value ? {
        bk: common_vendor.o(($event) => checkMemberAccess(sendChat))
      } : {
        bl: common_vendor.o(($event) => checkMemberAccess(onLeaveRoom))
      }, {
        bm: faceShow.value
      }, faceShow.value ? {
        bn: common_vendor.f(common_vendor.unref(pages_room_emoji.faceList), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => faceClick(item), index)
          };
        }),
        bo: faceShow.value ? 1 : 0,
        bp: common_vendor.p({
          name: "backspace",
          size: 56
        }),
        bq: common_vendor.o(delMsg)
      } : {}, {
        br: common_vendor.p({
          background: "none"
        })
      }) : {}, {
        bs: roomData.value.room && roomData.value.room["status"] == "disbanded"
      }, roomData.value.room && roomData.value.room["status"] == "disbanded" ? {} : {}, {
        bt: roomData.value.room && roomData.value.room["status"] == "completed" || roomData.value.room["status"] == "settling"
      }, roomData.value.room && roomData.value.room["status"] == "completed" || roomData.value.room["status"] == "settling" ? common_vendor.e({
        bv: common_vendor.f(roomData.value.room.settlement_images, (img, idx, i0) => {
          return {
            a: common_vendor.o(($event) => previewImage(img), idx),
            b: idx,
            c: img
          };
        }),
        bw: common_vendor.t(roomData.value.room.start_time),
        bx: common_vendor.t(roomData.value.room.teamup_time),
        by: roomData.value.room && roomData.value.room["status"] == "completed"
      }, roomData.value.room && roomData.value.room["status"] == "completed" ? {} : {}, {
        bz: roomData.value.room && roomData.value.room["status"] == "settling"
      }, roomData.value.room && roomData.value.room["status"] == "settling" ? {} : {}, {
        bA: roomData.value.room && roomData.value.room["status"] == "settled"
      }, roomData.value.room && roomData.value.room["status"] == "settled" ? {} : {}, {
        bB: (_la = roomData.value.room) == null ? void 0 : _la.is_member
      }, ((_ma = roomData.value.room) == null ? void 0 : _ma.is_member) ? common_vendor.e({
        bC: ((_na = roomData.value.room) == null ? void 0 : _na.joined_role_code) == "leader" || ((_oa = roomData.value.room) == null ? void 0 : _oa.joined_role_code) == "baoche"
      }, ((_pa = roomData.value.room) == null ? void 0 : _pa.joined_role_code) == "leader" || ((_qa = roomData.value.room) == null ? void 0 : _qa.joined_role_code) == "baoche" ? common_vendor.e({
        bD: (_ra = roomData.value.room) == null ? void 0 : _ra.complaint_status.can_complain
      }, ((_sa = roomData.value.room) == null ? void 0 : _sa.complaint_status.can_complain) ? {
        bE: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/send?room_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.id}`);
        })
      } : {}, {
        bF: ((_ta = roomData.value.room) == null ? void 0 : _ta.complaint_status.complaint_status) == "pending" || ((_ua = roomData.value.room) == null ? void 0 : _ua.complaint_status.complaint_status) == "processing"
      }, ((_va = roomData.value.room) == null ? void 0 : _va.complaint_status.complaint_status) == "pending" || ((_wa = roomData.value.room) == null ? void 0 : _wa.complaint_status.complaint_status) == "processing" ? {
        bG: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/complaint?complaint_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.complaint_status.complaint_id}`);
        })
      } : {}, {
        bH: ((_xa = roomData.value.room) == null ? void 0 : _xa.complaint_status.complaint_status) == "resolved" || ((_ya = roomData.value.room) == null ? void 0 : _ya.complaint_status.complaint_status) == "cancelled"
      }, ((_za = roomData.value.room) == null ? void 0 : _za.complaint_status.complaint_status) == "resolved" || ((_Aa = roomData.value.room) == null ? void 0 : _Aa.complaint_status.complaint_status) == "cancelled" ? {
        bI: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/complaint?complaint_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.complaint_status.complaint_id}`);
        })
      } : {}) : {}, {
        bJ: ((_Ba = roomData.value.room) == null ? void 0 : _Ba.is_terache) && roomData.value.room["status"] == "settling"
      }, ((_Ca = roomData.value.room) == null ? void 0 : _Ca.is_terache) && roomData.value.room["status"] == "settling" ? {
        bK: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/index?room_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.id}`);
        })
      } : {}, {
        bL: ((_Da = roomData.value.room) == null ? void 0 : _Da.is_terache) && roomData.value.room["status"] == "completed"
      }, ((_Ea = roomData.value.room) == null ? void 0 : _Ea.is_terache) && roomData.value.room["status"] == "completed" ? {
        bM: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/index?room_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.id}`);
        })
      } : {}) : {}) : {}, {
        bN: common_vendor.p({
          background: "none"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-49055c66"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/room/room.js.map
