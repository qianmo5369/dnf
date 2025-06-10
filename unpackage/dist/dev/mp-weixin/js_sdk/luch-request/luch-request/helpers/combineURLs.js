"use strict";
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
exports.combineURLs = combineURLs;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/js_sdk/luch-request/luch-request/helpers/combineURLs.js.map
