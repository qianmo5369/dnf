"use strict";
const common_vendor = require("../../../common/vendor.js");
class TuniaoUIError extends Error {
  constructor(message) {
    super(message);
    this.name = "TuniaoUIError";
  }
}
function debugWarn(scope, message) {
  {
    const error = common_vendor.isString(scope) ? new TuniaoUIError(`[${scope}] ${message}`) : scope;
    common_vendor.index.__f__("warn", "at uni_modules/tuniaoui-vue3/utils/error.ts:22", error);
  }
}
exports.debugWarn = debugWarn;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/utils/error.js.map
