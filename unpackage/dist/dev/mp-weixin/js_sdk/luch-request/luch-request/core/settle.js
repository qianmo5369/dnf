"use strict";
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  const status = response.statusCode;
  if (status && (!validateStatus || validateStatus(status))) {
    resolve(response);
  } else {
    reject(response);
  }
}
exports.settle = settle;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/js_sdk/luch-request/luch-request/core/settle.js.map
