"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const loginType = common_vendor.ref("account");
    const countdown = common_vendor.ref(0);
    const isChecked = common_vendor.ref(true);
    const phone = common_vendor.ref("");
    const password = common_vendor.ref("");
    const code = common_vendor.ref("");
    const sendCode = async () => {
      if (countdown.value > 0) {
        return;
      }
      if (!phone.value) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      const res = await common_vendor.index.$http.post("/sms/send", {
        mobile: phone.value,
        event: "mobilelogin"
      });
      if (res.code === 1) {
        countdown.value = 60;
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const handleLogin = async () => {
      if (!isChecked.value) {
        common_vendor.index.showToast({
          title: "请先勾选同意协议",
          icon: "none"
        });
        return;
      }
      if (!phone.value) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      if (loginType.value === "code") {
        if (!code.value) {
          common_vendor.index.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return;
        }
      } else {
        if (!password.value) {
          common_vendor.index.showToast({
            title: "请输入密码",
            icon: "none"
          });
          return;
        }
      }
      if (loginType.value == "code") {
        var res = await common_vendor.index.$http.post("/user/mobilelogin", {
          mobile: phone.value,
          captcha: code.value,
          share_uid: common_vendor.index.getStorageSync("share_uid")
        });
      } else {
        var res = await common_vendor.index.$http.post("/user/login", {
          account: phone.value,
          password: password.value,
          share_uid: common_vendor.index.getStorageSync("share_uid")
        });
      }
      if (res.code === 1) {
        common_vendor.index.setStorageSync("token", res.data.userinfo.token);
        const token = res.data.userinfo.token;
        const userStore = stores_user.useUserStore();
        userStore.setToken(token);
        await userStore.fetchUserInfo();
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
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
    };
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
      return common_vendor.e({
        a: phone.value,
        b: common_vendor.o(($event) => phone.value = $event.detail.value),
        c: loginType.value === "account"
      }, loginType.value === "account" ? {
        d: password.value,
        e: common_vendor.o(($event) => password.value = $event.detail.value)
      } : {
        f: common_vendor.t(countdown.value > 0 ? countdown.value + "s后重试" : "发送验证码"),
        g: countdown.value > 0 ? 1 : "",
        h: common_vendor.o(sendCode)
      }, {
        i: common_vendor.o(handleLogin),
        j: loginType.value === "account"
      }, loginType.value === "account" ? {
        k: loginType.value === "account" ? 1 : "",
        l: common_vendor.o(($event) => loginType.value = "code")
      } : {
        m: loginType.value === "code" ? 1 : "",
        n: common_vendor.o(($event) => loginType.value = "account")
      }, {
        o: isChecked.value,
        p: common_vendor.o(($event) => isChecked.value = !isChecked.value),
        q: common_vendor.o(mpLogin)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
