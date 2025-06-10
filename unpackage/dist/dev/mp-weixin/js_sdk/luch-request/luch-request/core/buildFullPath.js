"use strict";
const js_sdk_luchRequest_luchRequest_helpers_isAbsoluteURL = require("../helpers/isAbsoluteURL.js");
const js_sdk_luchRequest_luchRequest_helpers_combineURLs = require("../helpers/combineURLs.js");
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !js_sdk_luchRequest_luchRequest_helpers_isAbsoluteURL.isAbsoluteURL(requestedURL)) {
    return js_sdk_luchRequest_luchRequest_helpers_combineURLs.combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
exports.buildFullPath = buildFullPath;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/js_sdk/luch-request/luch-request/core/buildFullPath.js.map
