"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    common_vendor.ref("account");
    common_vendor.ref(0);
    const isChecked = common_vendor.ref(true);
    common_vendor.ref("");
    common_vendor.ref("");
    common_vendor.ref("");
    common_vendor.ref(false);
    common_vendor.onMounted(() => {
    });
    const mpLogin = () => {
      common_vendor.index.login({
        success: async (loginRes) => {
          const res = await common_vendor.index.$http.post("/user/wechatLogin", {
            "code": loginRes.code,
            "anonymousCode": loginRes.anonymousCode
          });
          if (res.code === 1) {
            common_vendor.index.setStorageSync("token", res.data.userinfo.token);
            const token = res.data.userinfo.token;
            const userStore = stores_user.useUserStore();
            userStore.setToken(token);
            await userStore.fetchUserInfo();
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
            common_vendor.index.showToast({
              title: res.msg,
              icon: "none"
            });
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          } else {
            common_vendor.index.showToast({
              title: res.msg,
              icon: "none"
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(mpLogin),
        b: isChecked.value,
        c: common_vendor.o(($event) => isChecked.value = !isChecked.value)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
