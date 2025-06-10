"use strict";
const common_vendor = require("../common/vendor.js");
const useSystemStore = common_vendor.defineStore("system", {
  state: () => {
    return {
      config: common_vendor.index.getStorageSync("config") || null
    };
  },
  actions: {
    setConfig(config) {
      this.config = config;
    },
    async fetchConfig() {
      try {
        const res = await common_vendor.index.$http.get("/index/config");
        if (res.code === 1) {
          this.config(res.data);
          common_vendor.index.setStorageSync("config", res.data);
          common_vendor.index.__f__("log", "at stores/system.js:21", res.data);
          return res;
        } else {
          return null;
        }
      } catch (e) {
        return null;
      }
    }
  },
  persist: {
    enabled: true
  }
});
exports.useSystemStore = useSystemStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/system.js.map
