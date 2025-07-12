"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_libs_lodash__common = require("./_common.js");
const symbolProto = Symbol ? Symbol.prototype : void 0;
const symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (common_vendor.isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  const result = `${value}`;
  return result == "0" && 1 / value == -uni_modules_tuniaouiVue3_libs_lodash__common.INFINITY ? "-0" : result;
}
exports.baseToString = baseToString;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/_baseToString.js.map
