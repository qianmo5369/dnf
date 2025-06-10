"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const util_ws = require("./util/ws.js");
const util_request_index = require("./util/request/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/user/user.js";
  "./pages/red/red.js";
  "./pages/room/room.js";
  "./pages/login/login.js";
  "./pages/hero/hero.js";
  "./pages/hero/edit.js";
  "./pages/user/balance.js";
  "./pages/user/deposit.js";
  "./pages/user/feedback.js";
  "./pages/user/team-record.js";
  "./pages/complaint/complaint.js";
  "./pages/complaint/send.js";
  "./pages/complaint/reply.js";
  "./pages/complaint/index.js";
  "./pages/user/complaint-record.js";
}
const _sfc_main = {
  // onLaunch: function() {
  // 	uni.__f__('log','at App.vue:5','App Launch')
  // },
  onLaunch() {
    const token = common_vendor.index.getStorageSync("token");
    if (token) {
      util_ws.ws.connect(token);
      common_vendor.index.$ws = util_ws.ws;
      common_vendor.index.__f__("log", "at App.vue:12", "[WS] 全局挂载成功");
    } else {
      common_vendor.index.__f__("warn", "at App.vue:14", "[WS] 无 token，未连接");
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:18", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:21", "App Hide");
  }
};
function createApp() {
  const pinia = common_vendor.createPinia();
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$toast = function(title) {
    common_vendor.index.showToast({
      title,
      icon: "none"
    });
  };
  app.use(pinia);
  app.use(util_request_index.plugin);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
