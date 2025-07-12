"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_hooks_useZPaging = require("../../uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js");
const stores_user = require("../../stores/user.js");
const stores_system = require("../../stores/system.js");
if (!Array) {
  const _component_TnModal = common_vendor.resolveComponent("TnModal");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_component_TnModal + _easycom_z_paging2)();
}
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  (Roles + fuiBottomPopup + fuiDialog + TnIcon + TnPopup + Parse + Team + dungeonSelect + Recharge + _easycom_z_paging)();
}
const TnPopup = () => "../../uni_modules/tuniaoui-vue3/components/popup/src/popup.js";
const fuiBottomPopup = () => "../../components/fui-bottom-popup.js";
const Parse = () => "../../components/parse.js";
const TnIcon = () => "../../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const Roles = () => "../../components/Roles.js";
const Team = () => "../../components/team.js";
const dungeonSelect = () => "../../components/dungeonSelect.js";
const Recharge = () => "../../components/recharge.js";
const fuiDialog = () => "../../components/fui-dialog.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const system = stores_system.useSystemStore();
    const paging = common_vendor.ref(null);
    uni_modules_zPaging_components_zPaging_js_hooks_useZPaging.useZPaging(paging);
    common_vendor.ref(0);
    const navBarHeight = common_vendor.ref(0);
    const topHeight = common_vendor.ref(0);
    const userStore = stores_user.useUserStore();
    const windowHeight = common_vendor.ref(0);
    const shareRoomInfo = common_vendor.ref({});
    const roomList = common_vendor.ref([]);
    const contentShow = common_vendor.ref(false);
    const contentId = common_vendor.ref(0);
    const defaultRoleCode = common_vendor.ref("");
    const childReady = common_vendor.ref(false);
    const showContinue = common_vendor.ref(false);
    const rechargeShow = common_vendor.ref(false);
    const orderInfo = common_vendor.ref({});
    const modeMapTree = common_vendor.ref([]);
    const selectedModeIndex = common_vendor.ref(0);
    const selectedMapIndex = common_vendor.ref(0);
    const currentMode = common_vendor.computed(() => modeMapTree.value[selectedModeIndex.value] || {});
    const currentMap = common_vendor.computed(() => {
      var _a;
      return ((_a = currentMode.value.maps) == null ? void 0 : _a[selectedMapIndex.value]) || {};
    });
    common_vendor.computed(() => currentMap.value.roles || []);
    const shareShow = common_vendor.ref(false);
    const dungeonShow = common_vendor.ref(false);
    const dialogShow = common_vendor.ref(false);
    const onConfirm = common_vendor.ref(null);
    const title = common_vendor.ref(null);
    const content = common_vendor.ref(null);
    const confirmText = common_vendor.ref(null);
    const totalOffset = common_vendor.ref(null);
    const showPaging = common_vendor.ref(false);
    common_vendor.ref();
    const calculateBottomOffset = () => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      const { platform, screenHeight, windowHeight: windowHeight2, safeAreaInsets } = systemInfo;
      if ((safeAreaInsets == null ? void 0 : safeAreaInsets.bottom) !== void 0) {
        safeAreaInsets.bottom;
      }
      totalOffset.value = 20;
    };
    const onClick = (e) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:393", "点击事件触发了，type：", e);
      if (e.index === 1 && typeof onConfirm.value === "function") {
        common_vendor.index.__f__("log", "at pages/index/index.vue:395", "点击确定");
        onConfirm.value();
      }
      dialogShow.value = false;
    };
    const handleContent = (id) => {
      contentId.value = id;
      contentShow.value = true;
    };
    const handleRoleCode = (val) => {
      defaultRoleCode.value = val;
      setTimeout(() => {
        dungeonShow.value = true;
        childReady.value = true;
      }, 30);
    };
    common_vendor.onShow(() => {
      getActiveRoom();
      getActiveDeposit();
      getHasComplaint();
      setTimeout(() => {
        paging.value.reload();
      }, 30);
    });
    common_vendor.onLoad(() => {
      var _a;
      calculateBottomOffset();
      getModeMapTree();
      getActiveRoom();
      getHasComplaint();
      getActiveDeposit();
      const sys = common_vendor.index.getSystemInfoSync();
      common_vendor.index.__f__("log", "at pages/index/index.vue:434", sys);
      let padding = 0;
      windowHeight.value = sys.windowHeight;
      system.fetchConfig();
      if (!((_a = userStore.userInfo) == null ? void 0 : _a.default_user_hero_id)) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:440", "没有设置打团角色");
      }
      const menu = common_vendor.index.getMenuButtonBoundingClientRect();
      const btnHeight = menu.bottom - menu.top;
      const verticalPadding = (menu.top - sys.statusBarHeight) * 2;
      topHeight.value = sys.statusBarHeight;
      padding = btnHeight + verticalPadding;
      navBarHeight.value = padding;
      setTimeout(() => {
        showPaging.value = true;
      }, 200);
    });
    const tabs = [
      {
        label: "微信区",
        value: "wechat",
        icon: "https://dnf.hanyunkeji.cn/static/home/wechat.png"
      },
      {
        label: "QQ区",
        value: "QQ",
        icon: "https://dnf.hanyunkeji.cn/static/home/qq.png"
      }
    ];
    const currentTab = common_vendor.ref("wechat");
    common_vendor.ref("");
    const selectTab = (val) => {
      currentTab.value = val;
      paging.value.reload();
    };
    common_vendor.onLoad((params) => {
      if (params.share_uid) {
        common_vendor.index.setStorageSync("share_uid", params.share_uid);
        common_vendor.index.__f__("log", "at pages/index/index.vue:487", "缓存分享uid" + params.share_uid);
      }
    });
    const handleShowSelector = () => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:491", "父组件收到 show-selector 事件");
      show.value = true;
    };
    const shareShowHandle = () => {
      shareShow.value = false;
      common_vendor.index.__f__("log", "at pages/index/index.vue:498", `房间id${shareRoomInfo.value.room_id}`);
      common_vendor.index.navigateTo({
        url: `/pages/room/room?room_id=${shareRoomInfo.value.room_id}`
      });
      getActiveRoom();
    };
    const rechargeShowHandle = (val) => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:506", "接收rechargeShowHandle");
      rechargeShow.value = true;
      orderInfo.value = val;
    };
    const handleShowShare = (val, type = "create") => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:511", "父组件收到 show-share 事件" + val);
      if (type == "create") {
        shareRoomInfo.value = val;
        shareShow.value = true;
      }
      paging.value.reload();
      getActiveRoom();
    };
    function onSelectMode(index) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:521", selectedModeIndex.value);
      selectedModeIndex.value = index;
      selectedMapIndex.value = 0;
      paging.value.reload();
    }
    function onSelectMap(index) {
      selectedMapIndex.value = index;
      common_vendor.index.__f__("log", "at pages/index/index.vue:530", index);
      paging.value.reload();
    }
    const getModeMapTree = async () => {
      const res = await common_vendor.index.$http.get("/dungeon/modeMapTree");
      common_vendor.index.__f__("log", "at pages/index/index.vue:535", "用户信息:", res);
      if (res.code === 1) {
        modeMapTree.value = res.data;
        paging.value.reload();
      }
    };
    const activeRoomId = common_vendor.ref(null);
    const getActiveRoom = async () => {
      const res = await common_vendor.index.$http.get("/room/getActiveRoom");
      if (res.code === 1 && res.data.has_room) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:547", "zhix ");
        activeRoomId.value = res.data.room_id;
        showContinue.value = true;
      } else {
        showContinue.value = false;
      }
    };
    const hasComplaintActive = common_vendor.ref(null);
    const getHasComplaint = async () => {
      const res = await common_vendor.index.$http.get("/room/hasComplaint");
      if (res.code === 1 && res.data.has) {
        hasComplaintActive.value = true;
      } else {
        hasComplaintActive.value = false;
      }
    };
    const depositActive = common_vendor.ref(false);
    const getActiveDeposit = async () => {
      const res = await common_vendor.index.$http.get("/room/getActiveDeposit");
      if (res.code === 1 && res.data.has_deposit) {
        depositActive.value = true;
      } else {
        depositActive.value = false;
      }
    };
    const onDeposit = () => {
      title.value = "提取泰拉车卖家押金";
      content.value = "资金原路退还";
      confirmText.value = "确认提取";
      dialogShow.value = true;
      onConfirm.value = doDeposit;
    };
    const doDeposit = async () => {
      const res = await common_vendor.index.$http.get("/dungeon/doDeposit");
      if (res.code === 1) {
        depositActive.value = false;
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const handleActiveRoom = () => {
      linkTo(`/pages/room/room?room_id=${activeRoomId.value}`);
    };
    const refresh = () => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:600", "1111");
      paging.value.reload();
    };
    const onShare = () => {
      common_vendor.index.__f__("log", "at pages/index/index.vue:604", "分享房间");
      common_vendor.index.navigateTo({
        url: `/pages/room/room?room_id=${shareRoomInfo.value.room_id}`
      });
    };
    common_vendor.onShareAppMessage(() => {
      return {
        title: `【8868打团|${shareRoomInfo.value.channel}】快来组队吧：`,
        path: `/pages/room/room?id=${shareRoomInfo.value.room_id}&share_uid=${userStore.userInfo.id}`,
        imageUrl: shareRoomInfo.value.mode_image
      };
    });
    const getRoomList = async (pageNo, pageSize) => {
      if (!modeMapTree.value[selectedModeIndex.value]) {
        common_vendor.index.__f__("log", "at pages/index/index.vue:630", "不存在不发起请求");
        return false;
      }
      common_vendor.index.__f__("log", "at pages/index/index.vue:634", modeMapTree.value[selectedModeIndex.value].code);
      const res = await common_vendor.index.$http.post("/dungeon/list", {
        channel: currentTab.value,
        mode_code: modeMapTree.value[selectedModeIndex.value].code,
        map_code: currentMap.value.code,
        page: pageNo,
        page_size: pageSize
      });
      if (res.code === 1) {
        paging.value.complete(res.data.list);
      }
    };
    const leftMenu = common_vendor.ref([]);
    common_vendor.ref("包车");
    const show = common_vendor.ref(false);
    const teamShow = common_vendor.ref(false);
    common_vendor.ref(leftMenu.value[0]);
    const linkTo = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    const getRoleIcon = (code, filled) => {
      const map = {
        leader: "leader",
        dps: "dps",
        support: "support",
        seller: "seller",
        deck: "deck",
        team: "team",
        baoche: "baoche",
        leech: "support",
        lock: "lock"
      };
      const key = map[code] || "unknown";
      if (code == "lock") {
        return `https://dnf.hanyunkeji.cn/static/icons/lock_active.svg`;
      }
      if (code == "seller") {
        return `https://dnf.hanyunkeji.cn/static/icons/seller_active.svg`;
      }
      return `https://dnf.hanyunkeji.cn/static/icons/${key}_${filled ? "active" : "empty"}.png`;
    };
    const scrollViewStyle = common_vendor.computed(() => {
      let height = common_vendor.index.getSystemInfoSync().statusBarHeight;
      return `height:calc(100vh -  ${height}px - 600rpx)`;
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f;
      return common_vendor.e({
        a: navBarHeight.value + "px",
        b: common_vendor.o(($event) => show.value = $event),
        c: common_vendor.p({
          modelValue: show.value
        }),
        d: common_vendor.p({
          show: show.value,
          zIndex: "1000000"
        }),
        e: common_vendor.o(onClick),
        f: common_vendor.o(($event) => dialogShow.value = false),
        g: common_vendor.p({
          show: dialogShow.value,
          content: content.value,
          confirmText: confirmText.value,
          maskClosable: true
        }),
        h: common_vendor.sr("modalRef", "1cf27b2a-3"),
        i: common_vendor.p({
          name: "close"
        }),
        j: common_vendor.o(shareShowHandle),
        k: common_vendor.o(($event) => onShare()),
        l: common_vendor.p({
          ["model-value"]: shareShow.value,
          width: "80%",
          height: "415rpx",
          borderRadius: "16rpx"
        }),
        m: contentShow.value
      }, contentShow.value ? {
        n: common_vendor.o(($event) => contentShow.value = $event),
        o: common_vendor.p({
          contentId: contentId.value,
          modelValue: contentShow.value
        })
      } : {}, {
        p: common_vendor.p({
          ["model-value"]: contentShow.value,
          width: "80%",
          height: "60vh",
          borderRadius: "16rpx"
        }),
        q: common_vendor.o(handleShowSelector),
        r: common_vendor.o(handleShowShare),
        s: common_vendor.o(rechargeShowHandle),
        t: common_vendor.o(($event) => teamShow.value = $event),
        v: common_vendor.p({
          modeMapTree: modeMapTree.value,
          channel: currentTab.value,
          useUserStore: common_vendor.unref(userStore),
          modelValue: teamShow.value
        }),
        w: common_vendor.p({
          ["model-value"]: teamShow.value,
          width: "90%",
          height: "70%",
          borderRadius: "16rpx"
        }),
        x: childReady.value
      }, childReady.value ? {
        y: common_vendor.o(handleShowSelector),
        z: common_vendor.o(handleShowShare),
        A: common_vendor.o(rechargeShowHandle),
        B: common_vendor.o(($event) => dungeonShow.value = $event),
        C: common_vendor.p({
          defaultDungeonCode: "ozma_assault",
          defaultMapCode: "terache",
          defaultRoleCode: defaultRoleCode.value,
          modeMapTree: modeMapTree.value,
          channel: currentTab.value,
          useUserStore: common_vendor.unref(userStore),
          modelValue: dungeonShow.value
        })
      } : {}, {
        D: common_vendor.p({
          ["model-value"]: dungeonShow.value,
          width: "90%",
          ["z-index"]: 20078,
          height: "70%",
          borderRadius: "16rpx"
        }),
        E: rechargeShow.value
      }, rechargeShow.value ? {
        F: common_vendor.o(($event) => rechargeShow.value = $event),
        G: common_vendor.p({
          orderInfo: orderInfo.value,
          modelValue: rechargeShow.value
        })
      } : {}, {
        H: showContinue.value
      }, showContinue.value ? {
        I: common_vendor.o(handleActiveRoom),
        J: totalOffset.value + "rpx"
      } : {}, {
        K: common_vendor.o(($event) => refresh()),
        L: common_vendor.f(tabs, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.label),
            c: currentTab.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => selectTab(item.value), item.value),
            e: item.value
          };
        }),
        M: hasComplaintActive.value
      }, hasComplaintActive.value ? {
        N: common_vendor.o(($event) => linkTo("/pages/user/complaint-record"))
      } : {}, {
        O: common_vendor.o(($event) => teamShow.value = true),
        P: !((_a = common_vendor.unref(userStore).userInfo) == null ? void 0 : _a.default_user_hero_id)
      }, !((_b = common_vendor.unref(userStore).userInfo) == null ? void 0 : _b.default_user_hero_id) ? {} : {
        Q: (_c = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _c.hero_avatar,
        R: common_vendor.t(((_d = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _d.resist_power) || ""),
        S: common_vendor.t(((_e = common_vendor.unref(userStore).userInfo.default_hero) == null ? void 0 : _e.hero_name) || "默认角色")
      }, {
        T: common_vendor.o(($event) => handleRoleCode("seller")),
        U: common_vendor.o(($event) => handleRoleCode("deck")),
        V: common_vendor.o(($event) => show.value = true),
        W: common_vendor.o(($event) => handleContent(1)),
        X: common_vendor.f(modeMapTree.value, (mode, index, i0) => {
          return {
            a: common_vendor.t(mode.title),
            b: common_vendor.n(selectedModeIndex.value === index ? "mask-hidden" : ""),
            c: mode.id,
            d: common_vendor.n(selectedModeIndex.value === index ? "active" : ""),
            e: `url(${mode.image})`,
            f: common_vendor.o(($event) => onSelectMode(index), mode.id)
          };
        }),
        Y: depositActive.value
      }, depositActive.value ? {
        Z: common_vendor.o(onDeposit)
      } : {}, {
        aa: common_vendor.f(((_f = currentMode.value) == null ? void 0 : _f.maps) || [], (map, idx, i0) => {
          return common_vendor.e({
            a: map.image,
            b: common_vendor.t(map.title),
            c: selectedMapIndex.value === idx
          }, selectedMapIndex.value === idx ? {} : {}, {
            d: map.id,
            e: common_vendor.n(selectedMapIndex.value === idx ? "active" : ""),
            f: common_vendor.o(($event) => onSelectMap(idx), map.id)
          });
        }),
        ab: showPaging.value
      }, showPaging.value ? {
        ac: common_vendor.f(roomList.value, (room, k0, i0) => {
          return common_vendor.e({
            a: room.status == "waiting"
          }, room.status == "waiting" ? {
            b: common_vendor.n(room.status)
          } : {}, {
            c: room.status == "in_progress"
          }, room.status == "in_progress" ? {
            d: common_vendor.n(room.status)
          } : {}, {
            e: room.map_code != "terache"
          }, room.map_code != "terache" ? {
            f: room.creator_hero.hero_avatar
          } : {}, {
            g: room.map_code == "terache"
          }, room.map_code == "terache" ? {} : {}, {
            h: room.map_code == "terache"
          }, room.map_code == "terache" ? {
            i: common_vendor.t(room.tera_own || "")
          } : {
            j: common_vendor.t(room.creator_hero.resist_power || ""),
            k: common_vendor.t(room.creator_hero.hero_name || "")
          }, {
            l: common_vendor.t(room.created_text),
            m: room.status == "completed"
          }, room.status == "completed" ? {} : {}, {
            n: room.status == "disbanded"
          }, room.status == "disbanded" ? {} : {}, {
            o: room.tera_own
          }, room.tera_own ? {
            p: common_vendor.t(room.tera_ratio)
          } : {}, {
            q: common_vendor.f(room.positions, (pos, k1, i1) => {
              return {
                a: pos.role_id,
                b: getRoleIcon(pos.code, pos.filled)
              };
            }),
            r: room.id,
            s: common_vendor.o(($event) => linkTo(`/pages/room/room?room_id=${room.id}`), room.id)
          });
        }),
        ad: common_vendor.sr(paging, "1cf27b2a-13", {
          "k": "paging"
        }),
        ae: common_vendor.o(getRoomList),
        af: common_vendor.o(($event) => roomList.value = $event),
        ag: common_vendor.p({
          fixed: false,
          modelValue: roomList.value
        })
      } : {}, {
        ah: common_vendor.s(scrollViewStyle.value)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
