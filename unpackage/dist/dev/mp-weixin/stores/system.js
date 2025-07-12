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
      common_vendor.index.__f__("log", "at stores/system.js:16", "请求公共配置");
      try {
        const res = await common_vendor.index.$http.get("/index/config");
        if (res.code === 1) {
          common_vendor.index.__f__("log", "at stores/system.js:21", "进入配置");
          this.setConfig(res.data);
          common_vendor.index.setStorageSync("config", res.data);
          common_vendor.index.__f__("log", "at stores/system.js:24", res.data);
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
