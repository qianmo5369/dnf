"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const stores_system = require("../../stores/system.js");
const js_sdk_xbCopy_uniCopy = require("../../js_sdk/xb-copy/uni-copy.js");
if (!Math) {
  (fuiDialog + TnAvatar + TnIcon)();
}
const TnAvatar = () => "../../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
const TnIcon = () => "../../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const fuiDialog = () => "../../components/fui-dialog.js";
const _sfc_main = {
  __name: "user",
  setup(__props) {
    const dialogShow = common_vendor.ref(false);
    const system = stores_system.useSystemStore();
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
        path: "/pages/red/red",
        type: "urlTab"
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
        type: "popup"
      }
    ];
    common_vendor.onShow(() => {
      getUserInfo();
    });
    const userStore = stores_user.useUserStore();
    common_vendor.onMounted(() => {
      getUserInfo();
    });
    const getUserInfo = async () => {
      await userStore.fetchUserInfo();
    };
    const linkTo = (path, type = "url") => {
      if (type == "url") {
        common_vendor.index.navigateTo({
          url: path
        });
      }
      if (type == "popup") {
        dialogShow.value = true;
      }
      if (type == "urlTab") {
        common_vendor.index.switchTab({
          url: path
        });
      }
    };
    const onClick = (e) => {
      common_vendor.index.__f__("log", "at pages/user/user.vue:165", "点击事件触发了，type：", e);
      if (e.index === 1) {
        common_vendor.index.__f__("log", "at pages/user/user.vue:167", "点击确定");
        copy(system.config.email);
      }
      dialogShow.value = false;
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
        a: common_vendor.o(onClick),
        b: common_vendor.p({
          show: dialogShow.value,
          content: common_vendor.unref(system).config.email,
          title: "请发送邮箱至",
          confirmText: "复制邮箱",
          maskClosable: true
        }),
        c: common_vendor.unref(userStore).isLoggedIn
      }, common_vendor.unref(userStore).isLoggedIn ? {
        d: common_vendor.p({
          url: common_vendor.unref(userStore).userInfo.avatar,
          size: "xl",
          type: "primary"
        }),
        e: common_vendor.t(common_vendor.unref(userStore).userInfo.nickname),
        f: common_vendor.t(common_vendor.unref(userStore).userInfo.id),
        g: common_vendor.o(($event) => copy(common_vendor.unref(userStore).userInfo.id)),
        h: common_vendor.p({
          name: "copy"
        }),
        i: common_vendor.o(($event) => linkTo("/pages/user/setting")),
        j: common_vendor.p({
          name: "set",
          size: "45"
        })
      } : {
        k: common_vendor.o(($event) => linkTo("/pages/login/login")),
        l: common_vendor.p({
          size: "xl",
          url: "https://dnf.hanyunkeji.cn/static/user/10.png"
        }),
        m: common_vendor.o(($event) => linkTo("/pages/login/login"))
      }, {
        n: common_vendor.t(common_vendor.unref(userStore).userInfo.balance),
        o: common_vendor.o(($event) => linkTo("/pages/user/balance")),
        p: common_vendor.t(common_vendor.unref(userStore).userInfo.sum_coin),
        q: common_vendor.o(($event) => linkTo("/pages/user/deposit")),
        r: common_vendor.f(menus, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.text),
            c: index,
            d: common_vendor.o(($event) => linkTo(item.path, item.type), index)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
