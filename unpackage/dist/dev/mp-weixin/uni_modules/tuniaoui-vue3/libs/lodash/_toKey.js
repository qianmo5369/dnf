"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_libs_lodash__common = require("./_common.js");
function toKey(value) {
  if (typeof value == "string" || common_vendor.isSymbol(value)) {
    return value;
  }
  const result = `${value}`;
  return result == "0" && 1 / value == -uni_modules_tuniaouiVue3_libs_lodash__common.INFINITY ? "-0" : result;
}
exports.toKey = toKey;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/_toKey.js.map
