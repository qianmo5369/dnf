"use strict";
const common_vendor = require("../../common/vendor.js");
const util_env = require("../env.js");
const js_sdk_luchRequest_luchRequest_core_Request = require("../../js_sdk/luch-request/luch-request/core/Request.js");
const stores_user = require("../../stores/user.js");
const http = new js_sdk_luchRequest_luchRequest_core_Request.Request({
  baseURL: util_env.baseUrl,
  // 修改为你的地址
  timeout: 1e4,
  custom: {
    loading: true
    // 自定义字段示例
  }
});
http.interceptors.request.use((config) => {
  var _a;
  const userStore = stores_user.useUserStore();
  if (userStore.token) {
    config.header.token = userStore.token;
  }
  if ((_a = config.custom) == null ? void 0 : _a.loading) {
    common_vendor.index.__f__("log", "at util/request/index.js:23", "显示加载");
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
http.interceptors.response.use((response) => {
  common_vendor.index.hideLoading();
  if (response.data.code === 1 || response.data.code === 200 || response.data.code === 100) {
    return response.data;
  } else {
    common_vendor.index.showToast({
      title: response.data.msg || "请求错误",
      icon: "none"
    });
    return Promise.reject(response.data);
  }
}, (error) => {
  common_vendor.index.__f__("log", "at util/request/index.js:48", error.statusCode);
  if (error.statusCode == 401) {
    common_vendor.index.showToast({
      title: "请先登录",
      icon: "none"
    });
    const userStore = stores_user.useUserStore();
    userStore.logout();
    common_vendor.index.reLaunch({ url: "/pages/login/login" });
  } else {
    common_vendor.index.showToast({
      title: "网络异常",
      icon: "none"
    });
  }
  return Promise.reject(error);
});
const plugin = {
  install(app) {
    app.config.globalProperties.$http = http;
    common_vendor.index.$http = http;
  }
};
exports.plugin = plugin;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/util/request/index.js.map
