"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const js_sdk_xbCopy_uniCopy = require("../../js_sdk/xb-copy/uni-copy.js");
if (!Math) {
  (TnAvatar + TnIcon)();
}
const TnAvatar = () => "../../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const TnIcon = () => "../../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const menus = [
      {
        text: "组队记录",
        icon: "https://dnf.hanyunkeji.cn/static/user/01.png",
        path: "/pages/user/team-record",
        type: "url"
      },
      {
        text: "申诉记录",
        icon: "https://dnf.hanyunkeji.cn/static/user/06.png",
        path: "/pages/user/complaint-record",
        type: "url"
      },
      {
        text: "角色管理",
        icon: "https://dnf.hanyunkeji.cn/static/user/02.png",
        path: "/pages/hero/hero",
        type: "url"
      },
      {
        text: "邀请好友",
        icon: "https://dnf.hanyunkeji.cn/static/user/05.png",
        type: "url"
      },
      {
        text: "建议反馈",
        icon: "https://dnf.hanyunkeji.cn/static/user/04.png",
        path: "/pages/user/feedback",
        type: "url"
      },
      {
        text: "商务合作",
        icon: "https://dnf.hanyunkeji.cn/static/user/03.png",
        type: "Popup"
      }
    ];
    const userStore = stores_user.useUserStore();
    common_vendor.onMounted(() => {
      getUserInfo();
    });
    const getUserInfo = async () => {
      await userStore.fetchUserInfo();
    };
    const linkTo = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    const copy = (val) => {
      js_sdk_xbCopy_uniCopy.uniCopy({
        content: val,
        title: "复制成功",
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userStore).isLoggedIn
      }, common_vendor.unref(userStore).isLoggedIn ? {
        b: common_vendor.p({
          url: common_vendor.unref(userStore).userInfo.avatar,
          size: "xl",
          type: "primary"
        }),
        c: common_vendor.t(common_vendor.unref(userStore).userInfo.nickname),
        d: common_vendor.t(common_vendor.unref(userStore).userInfo.id),
        e: common_vendor.o(($event) => copy(common_vendor.unref(userStore).userInfo.id)),
        f: common_vendor.p({
          name: "copy"
        })
      } : {
        g: common_vendor.o(($event) => linkTo("/pages/login/login")),
        h: common_vendor.p({
          size: "xl",
          url: "https://dnf.hanyunkeji.cn/static/user/10.png"
        }),
        i: common_vendor.o(($event) => linkTo("/pages/login/login"))
      }, {
        j: common_vendor.t(common_vendor.unref(userStore).userInfo.balance),
        k: common_vendor.o(($event) => linkTo("/pages/user/balance")),
        l: common_vendor.t(common_vendor.unref(userStore).userInfo.sum_coin),
        m: common_vendor.o(($event) => linkTo("/pages/user/deposit")),
        n: common_vendor.f(menus, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.text),
            c: index,
            d: common_vendor.o(($event) => linkTo(item.path), index)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
