"use strict";
const common_vendor = require("../common/vendor.js");
const useUserStore = common_vendor.defineStore("user", {
  state: () => ({
    token: common_vendor.index.getStorageSync("token") || "",
    userInfo: common_vendor.index.getStorageSync("user_info") || null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.userInfo
  },
  actions: {
    setToken(token) {
      this.token = token;
      common_vendor.index.setStorageSync("token", token);
    },
    setUserInfo(info) {
      this.userInfo = info;
      common_vendor.index.setStorageSync("user_info", info);
    },
    async fetchUserInfo() {
      try {
        const res = await common_vendor.index.$http.get("/dungeon/getUserInfo");
        if (res.code === 1) {
          this.setUserInfo(res.data);
          return res;
        } else {
          this.logout();
          return null;
        }
      } catch (e) {
        this.logout();
        return null;
      }
    },
    logout() {
      this.token = "";
      this.userInfo = null;
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("user_info");
    }
  }
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/user.js.map
