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
  (fuiDialog + TnModal + TnIcon + fuiBottomPopup + fuiUpload + fuiNavBar + TnAvatar + _easycom_fui_icon + fuiSafeArea)();
}
const TnModal = () => "../../uni_modules/tuniaoui-vue3/components/modal/src/modal.js";
const TnIcon = () => "../../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const fuiUpload = () => "../../components/fui-upload.js";
const fuiBottomPopup = () => "../../components/fui-bottom-popup.js";
const TnAvatar = () => "../../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const fuiSafeArea = () => "../../components/fui-safe-area.js";
const fuiNavBar = () => "../../components/fui-nav-bar.js";
const fuiDialog = () => "../../components/fui-dialog.js";
const _sfc_main = {
  __name: "room",
  setup(__props) {
    const uploadRef = common_vendor.ref(null);
    const uploadUrl = util_env.baseUrl + "/common/upload";
    const uploadStatus = common_vendor.ref(false);
    const settlementImage = common_vendor.ref(null);
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
    const teraRatio = common_vendor.computed(() => {
      return parseFloat(4500);
    });
    const sellerTera = common_vendor.computed(() => {
      const cost = parseFloat(teraCost.value || 0);
      return cost > 0 ? (cost * 0.9 / 6).toFixed(2) : "0.00";
    });
    const realTera = common_vendor.computed(() => {
      const cost = parseFloat(teraCost.value || 0);
      const self = parseFloat(sellerTera.value || 0);
      const result = cost * 0.9 - self;
      return result > 0 ? result.toFixed(2) : "0.00";
    });
    const cashProfit = common_vendor.computed(() => {
      const tera = parseFloat(realTera.value || 0);
      const ratio = teraRatio.value;
      return tera > 0 ? (tera * 1e4 / ratio).toFixed(2) : "0.00";
    });
    common_vendor.onLoad((params) => {
      if (params.share_uid) {
        common_vendor.index.setStorageSync("share_uid", params.share_uid);
        common_vendor.index.__f__("log", "at pages/room/room.vue:456", "换成分享uid" + params.share_uid);
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
    const waitingTimeText = common_vendor.ref("");
    const progressTimeText = common_vendor.ref("");
    let timer = null;
    const startTime = common_vendor.ref(0);
    const status = common_vendor.ref("");
    common_vendor.ref(Date.now());
    const formatTime = (seconds) => {
      const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const m = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
      const s = String(seconds % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    };
    const updateTimer = () => {
      const current = Math.floor(Date.now() / 1e3);
      const start = Number(startTime.value || 0);
      const seconds = Math.max(0, current - start);
      if (status.value === "waiting") {
        waitingTimeText.value = formatTime(seconds);
      } else if (status.value === "in_progress") {
        progressTimeText.value = formatTime(seconds);
      }
    };
    const initCounter = (room) => {
      common_vendor.index.__f__("log", "at pages/room/room.vue:499", room);
      status.value = room.status;
      if (status.value === "waiting") {
        startTime.value = Number(room.waiting_start_at);
      } else if (status.value === "in_progress") {
        startTime.value = Number(room.progress_start_at);
      }
      updateTimer();
      clearInterval(timer);
      if (status.value === "waiting" || status.value === "in_progress") {
        timer = setInterval(updateTimer, 1e3);
      }
    };
    common_vendor.onUnmounted(() => {
      clearInterval(timer);
    });
    const handlePhras = () => {
      common_vendor.index.__f__("log", "at pages/room/room.vue:519", "执行我");
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
      common_vendor.index.__f__("log", "at pages/room/room.vue:532", "点击事件触发了，type：", e);
      if (e.index === 1 && typeof onConfirm.value === "function") {
        common_vendor.index.__f__("log", "at pages/room/room.vue:534", "点击确定");
        onConfirm.value();
      }
      dialogShow.value = false;
    };
    const onClose = () => {
      dialogShow.value = false;
      common_vendor.index.__f__("log", "at pages/room/room.vue:541", "关闭点击");
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
      var _a;
      const room = (_a = roomData.value) == null ? void 0 : _a.room;
      if (!room) {
        common_vendor.index.__f__("log", "at pages/room/room.vue:609", "不存在信息");
        return false;
      }
      if (room.is_terache) {
        return room.joined_role_code === "seller";
      } else {
        return room.joined_role_code === "dps";
      }
    });
    const onKickMember = (pos) => {
      const room = roomData.value.room;
      const currentUserId = room == null ? void 0 : room.user_id;
      common_vendor.index.__f__("log", "at pages/room/room.vue:627", pos);
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
      common_vendor.index.__f__("log", "at pages/room/room.vue:742", "接口信息:", res);
      if (res.code === 1) {
        msgList.value = res.data.list;
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const commonPhrases = common_vendor.ref([]);
    const getCommonPhrases = async () => {
      const res = await common_vendor.index.$http.post("/room/getCommonPhrases", {});
      common_vendor.index.__f__("log", "at pages/room/room.vue:759", "接口信息:", res);
      if (res.code === 1) {
        commonPhrases.value = res.data;
      }
    };
    const getRoomData = async () => {
      const res = await common_vendor.index.$http.post("/dungeon/info", {
        room_id: room_id.value
      });
      common_vendor.index.__f__("log", "at pages/room/room.vue:772", "接口信息:", res);
      if (res.code === 1) {
        roomData.value = res.data;
        onCheckRoom();
        initCounter(res.data.room);
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
      if (settlementImage.value == "") {
        common_vendor.index.showToast({
          title: "请上传结算截图",
          icon: "none"
        });
        return false;
      }
      let SettlementUrl = "/dungeon/completeRoom";
      if (roomData.value.room.is_terache) {
        SettlementUrl = "/dungeon/submitSettlement";
      }
      const res = await common_vendor.index.$http.post(SettlementUrl, {
        room_id: roomData.value.room.id,
        image_url: settlementImage.value,
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
      common_vendor.index.__f__("log", "at pages/room/room.vue:976", roomData.value.room);
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
      common_vendor.index.__f__("log", "at pages/room/room.vue:1049", e);
      let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}");
      uploadStatus.value = e.status;
      if (res.data.url) {
        settlementImage.value = res.data.url;
      }
    };
    const uploadError = (e) => {
      uploadStatus.value = e.status;
      common_vendor.index.showModal({
        content: JSON.stringify(e)
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
      common_vendor.index.__f__("log", "at pages/room/room.vue:1086", item);
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
    common_vendor.ref(null);
    const scrollTo = common_vendor.ref("");
    common_vendor.watch(
      () => msgList.value.length,
      (len) => {
        if (len > 0) {
          scrollTo.value = "msg-" + (len - 1);
        }
      }
    );
    const playNumberVoice = (num) => {
      const audio = common_vendor.index.createInnerAudioContext();
      audio.src = `/static/sounds/${num}.mp3`;
      audio.play();
      audio.onEnded(() => audio.destroy());
      audio.onError(() => audio.destroy());
    };
    common_vendor.onMounted(() => {
      getRoomData();
      getChatList();
      getCommonPhrases();
      util_ws.ws.on("room_update", (msg) => {
        common_vendor.index.__f__("log", "at pages/room/room.vue:1144", "收到 room_update:", msg.data);
        roomData.value = msg.data;
        onCheckRoom();
        initCounter(msg.data.room);
      });
      util_ws.ws.on("chat", (msg) => {
        msgList.value.push(msg.data);
      });
      util_ws.ws.on("member_join_voice", (msg) => {
        const num = msg.joined_number;
        if (num >= 1 && num <= 6) {
          playNumberVoice(num);
        }
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
            common_vendor.index.__f__("error", "at pages/room/room.vue:1187", "页面跳转失败:", err);
          });
        };
      });
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J;
      return common_vendor.e({
        a: common_vendor.o(onClick),
        b: common_vendor.o(onClose),
        c: common_vendor.p({
          show: dialogShow.value,
          content: content.value,
          confirmText: confirmText.value,
          maskClosable: true
        }),
        d: common_vendor.sr("modalRef", "49055c66-1"),
        e: common_vendor.p({
          name: "close",
          color: "#000"
        }),
        f: common_vendor.o(($event) => phrasShow.value = false),
        g: common_vendor.f(commonPhrases.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.text),
            b: common_vendor.o(($event) => phrasSend(item.text), index),
            c: index
          };
        }),
        h: common_vendor.p({
          show: phrasShow.value,
          zIndex: "4000"
        }),
        i: common_vendor.p({
          name: "close",
          color: "#000"
        }),
        j: common_vendor.o(($event) => completeShow.value = false),
        k: (_a = roomData.value.room) == null ? void 0 : _a.is_terache
      }, ((_b = roomData.value.room) == null ? void 0 : _b.is_terache) ? common_vendor.e({
        l: isGoldCar.value === "0"
      }, isGoldCar.value === "0" ? {} : {}, {
        m: isGoldCar.value === "0" ? 1 : "",
        n: common_vendor.o(($event) => isGoldCar.value = "0"),
        o: isGoldCar.value === "1"
      }, isGoldCar.value === "1" ? {} : {}, {
        p: isGoldCar.value === "1" ? 1 : "",
        q: common_vendor.o(($event) => isGoldCar.value = "1"),
        r: isGoldCar.value === "0"
      }, isGoldCar.value === "0" ? common_vendor.e({
        s: teraCost.value,
        t: common_vendor.o(($event) => teraCost.value = $event.detail.value),
        v: hasCard.value === "0"
      }, hasCard.value === "0" ? {} : {}, {
        w: hasCard.value === "0" ? 1 : "",
        x: common_vendor.o(($event) => hasCard.value = "0"),
        y: hasCard.value === "1"
      }, hasCard.value === "1" ? {} : {}, {
        z: hasCard.value === "1" ? 1 : "",
        A: common_vendor.o(($event) => hasCard.value = "1"),
        B: hasCard.value === "1"
      }, hasCard.value === "1" ? {
        C: cardPrice.value,
        D: common_vendor.o(($event) => cardPrice.value = $event.detail.value)
      } : {}, {
        E: common_vendor.t(realTera.value),
        F: common_vendor.t(cashProfit.value)
      }) : {}) : {}, {
        G: common_vendor.sr(uploadRef, "49055c66-6,49055c66-4", {
          "k": "uploadRef"
        }),
        H: common_vendor.o(uploadSuccess),
        I: common_vendor.o(uploadError),
        J: common_vendor.p({
          borderColor: "#eee",
          background: "#fff",
          radius: "10",
          immediate: true,
          width: "500",
          height: "300",
          url: uploadUrl,
          max: 2
        }),
        K: common_vendor.o(doCompleteRoom),
        L: common_vendor.p({
          show: completeShow.value,
          zIndex: "8000"
        }),
        M: common_vendor.o(($event) => linkTo("/pages/index/index", "tabbar")),
        N: common_vendor.p({
          name: "left",
          size: "35rpx",
          color: "#fff"
        }),
        O: ((_c = roomData.value.room) == null ? void 0 : _c.channel) === "wechat"
      }, ((_d = roomData.value.room) == null ? void 0 : _d.channel) === "wechat" ? {} : {}, {
        P: ((_e = roomData.value.room) == null ? void 0 : _e.channel) === "QQ"
      }, ((_f = roomData.value.room) == null ? void 0 : _f.channel) === "QQ" ? {} : {}, {
        Q: ((_g = roomData.value.room) == null ? void 0 : _g.channel) === "wechat"
      }, ((_h = roomData.value.room) == null ? void 0 : _h.channel) === "wechat" ? {} : {}, {
        R: ((_i = roomData.value.room) == null ? void 0 : _i.channel) === "QQ"
      }, ((_j = roomData.value.room) == null ? void 0 : _j.channel) === "QQ" ? {} : {}, {
        S: common_vendor.t((_k = roomData.value.room) == null ? void 0 : _k.mode_title),
        T: common_vendor.t((_l = roomData.value.room) == null ? void 0 : _l.id),
        U: common_vendor.p({
          custom: true,
          padding: "12",
          background: "none"
        }),
        V: roomData.value && ((_m = roomData.value.room) == null ? void 0 : _m.status) != "completed"
      }, roomData.value && ((_n = roomData.value.room) == null ? void 0 : _n.status) != "completed" ? common_vendor.e({
        W: roomData.value && ((_o = roomData.value.room) == null ? void 0 : _o.status) === "waiting"
      }, roomData.value && ((_p = roomData.value.room) == null ? void 0 : _p.status) === "waiting" ? {
        X: common_vendor.t(waitingTimeText.value)
      } : {}, {
        Y: roomData.value && ((_q = roomData.value.room) == null ? void 0 : _q.status) === "in_progress"
      }, roomData.value && ((_r = roomData.value.room) == null ? void 0 : _r.status) === "in_progress" ? {
        Z: common_vendor.t(progressTimeText.value)
      } : {}) : {}, {
        aa: `url(${(_s = roomData.value.room) == null ? void 0 : _s.mode_image})`,
        ab: common_vendor.f(roomData.value.positions, (pos, index, i0) => {
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
        ac: common_vendor.f(msgList.value, (msg, index, i0) => {
          return {
            a: "49055c66-9-" + i0,
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
        ad: scrollTo.value,
        ae: roomData.value.room && isRoomOperator.value
      }, roomData.value.room && isRoomOperator.value ? common_vendor.e({
        af: roomData.value.room.status === "waiting"
      }, roomData.value.room.status === "waiting" ? {
        ag: common_vendor.o(($event) => onStartGame())
      } : {}, {
        ah: roomData.value.room.status === "in_progress"
      }, roomData.value.room.status === "in_progress" ? {
        ai: common_vendor.o(($event) => completeShow.value = true)
      } : {}, {
        aj: roomData.value.room.status === "waiting"
      }, roomData.value.room.status === "waiting" ? {
        ak: common_vendor.o(($event) => refresh())
      } : {}, {
        al: roomData.value.room.status === "in_progress"
      }, roomData.value.room.status === "in_progress" ? {
        am: common_vendor.o(($event) => onResetToWait())
      } : {}) : {}, {
        an: roomData.value.room && roomData.value.room["status"] != "completed" && roomData.value.room["status"] != "disbanded" && roomData.value.room["status"] != "settling"
      }, roomData.value.room && roomData.value.room["status"] != "completed" && roomData.value.room["status"] != "disbanded" && roomData.value.room["status"] != "settling" ? common_vendor.e({
        ao: common_vendor.o(($event) => checkMemberAccess(handlePhras)),
        ap: !((_t = roomData.value.room) == null ? void 0 : _t.is_member),
        aq: msgTime.value,
        ar: common_vendor.o(() => checkMemberAccess()),
        as: common_vendor.o(focusChange),
        at: common_vendor.o(blurChange),
        av: common_vendor.o(($event) => sendChat()),
        aw: inputMsg.value,
        ax: common_vendor.o(($event) => inputMsg.value = $event.detail.value),
        ay: common_vendor.o(() => checkMemberAccess(faceChange)),
        az: common_vendor.p({
          name: !faceShow.value ? "face" : "keyboard"
        }),
        aA: inputMsg.value
      }, inputMsg.value ? {
        aB: common_vendor.o(($event) => checkMemberAccess(sendChat))
      } : {
        aC: common_vendor.o(($event) => checkMemberAccess(onLeaveRoom))
      }, {
        aD: faceShow.value
      }, faceShow.value ? {
        aE: common_vendor.f(common_vendor.unref(pages_room_emoji.faceList), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => faceClick(item), index)
          };
        }),
        aF: faceShow.value ? 1 : 0,
        aG: common_vendor.p({
          name: "backspace",
          size: 56
        }),
        aH: common_vendor.o(delMsg)
      } : {}, {
        aI: common_vendor.p({
          background: "none"
        })
      }) : {}, {
        aJ: roomData.value.room && roomData.value.room["status"] == "disbanded"
      }, roomData.value.room && roomData.value.room["status"] == "disbanded" ? {} : {}, {
        aK: roomData.value.room && roomData.value.room["status"] == "completed" || roomData.value.room["status"] == "settling"
      }, roomData.value.room && roomData.value.room["status"] == "completed" || roomData.value.room["status"] == "settling" ? common_vendor.e({
        aL: common_vendor.f(roomData.value.room.settlement_images, (img, idx, i0) => {
          return {
            a: common_vendor.o(($event) => previewImage(img), idx),
            b: idx,
            c: img
          };
        }),
        aM: common_vendor.t(roomData.value.room.start_time),
        aN: common_vendor.t(roomData.value.room.teamup_time),
        aO: roomData.value.room && roomData.value.room["status"] == "completed"
      }, roomData.value.room && roomData.value.room["status"] == "completed" ? {} : {}, {
        aP: roomData.value.room && roomData.value.room["status"] == "settling"
      }, roomData.value.room && roomData.value.room["status"] == "settling" ? {} : {}, {
        aQ: (_u = roomData.value.room) == null ? void 0 : _u.is_member
      }, ((_v = roomData.value.room) == null ? void 0 : _v.is_member) ? common_vendor.e({
        aR: ((_w = roomData.value.room) == null ? void 0 : _w.joined_role_code) == "leader"
      }, ((_x = roomData.value.room) == null ? void 0 : _x.joined_role_code) == "leader" ? common_vendor.e({
        aS: (_y = roomData.value.room) == null ? void 0 : _y.complaint_status.can_complain
      }, ((_z = roomData.value.room) == null ? void 0 : _z.complaint_status.can_complain) ? {
        aT: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/send?room_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.id}`);
        })
      } : {}, {
        aU: ((_A = roomData.value.room) == null ? void 0 : _A.complaint_status.complaint_status) == "pending" || ((_B = roomData.value.room) == null ? void 0 : _B.complaint_status.complaint_status) == "processing"
      }, ((_C = roomData.value.room) == null ? void 0 : _C.complaint_status.complaint_status) == "pending" || ((_D = roomData.value.room) == null ? void 0 : _D.complaint_status.complaint_status) == "processing" ? {
        aV: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/complaint?complaint_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.complaint_status.complaint_id}`);
        })
      } : {}, {
        aW: ((_E = roomData.value.room) == null ? void 0 : _E.complaint_status.complaint_status) == "resolved" || ((_F = roomData.value.room) == null ? void 0 : _F.complaint_status.complaint_status) == "cancelled"
      }, ((_G = roomData.value.room) == null ? void 0 : _G.complaint_status.complaint_status) == "resolved" || ((_H = roomData.value.room) == null ? void 0 : _H.complaint_status.complaint_status) == "cancelled" ? {
        aX: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/complaint?complaint_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.complaint_status.complaint_id}`);
        })
      } : {}) : {}, {
        aY: ((_I = roomData.value.room) == null ? void 0 : _I.is_terache) || roomData.value.room["status"] == "settling"
      }, ((_J = roomData.value.room) == null ? void 0 : _J.is_terache) || roomData.value.room["status"] == "settling" ? {
        aZ: common_vendor.o(($event) => {
          var _a2;
          return linkTo(`/pages/complaint/index?room_id=${(_a2 = roomData.value.room) == null ? void 0 : _a2.id}`);
        })
      } : {}) : {}) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-49055c66"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/room/room.js.map
