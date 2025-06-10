"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const stores_user = require("../../stores/user.js");
if (!Math) {
  (fuiNavBar + TnPopup)();
}
const TnPopup = () => "../../uni_modules/tuniaoui-vue3/components/popup/src/popup.js";
const fuiNavBar = () => "../../components/fui-nav-bar.js";
const _sfc_main = {
  __name: "red",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const shareShow = common_vendor.ref(false);
    common_vendor.onShareAppMessage(() => {
      return {
        title: `【8868打团】快来组队吧：`,
        path: `/pages/index/index?share_uid=${userStore.userInfo.id}`,
        imageUrl: ""
      };
    });
    const userList = [
      // { avatar: '/static/cat1.jpg', name: '玩家001', date: '5月20日' },
      // { avatar: '/static/cat2.jpg', name: '玩家002', date: '5月20日' },
      // { avatar: '/static/cat3.jpg', name: '玩家003', date: '5月20日' },
      // { avatar: '/static/cat4.jpg', name: '玩家004', date: '5月20日' },
      // { avatar: '/static/cat5.jpg', name: '玩家005', date: '5月20日' },
      // { avatar: '/static/cat6.jpg', name: '玩家006', date: '5月20日' }
    ];
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          custom: true,
          padding: "12",
          background: "none"
        }),
        b: common_vendor.o(($event) => shareShow.value = $event),
        c: common_vendor.p({
          width: "100%",
          height: "250rpx",
          borderRadius: "16rpx",
          ["overlay-closeable"]: true,
          ["open-direction"]: "bottom",
          ["close-btn"]: true,
          modelValue: shareShow.value
        }),
        d: common_vendor.f([30, 100, 200], (s, k0, i0) => {
          return {
            a: common_vendor.t(s),
            b: s
          };
        }),
        e: common_assets._imports_0,
        f: common_vendor.o(($event) => shareShow.value = true),
        g: common_vendor.f(userList, (user, index, i0) => {
          return {
            a: user.avatar,
            b: common_vendor.t(user.name),
            c: common_vendor.t(user.date),
            d: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1d6df1a0"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/red/red.js.map
