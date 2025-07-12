"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_libs_lodash__common = require("./_common.js");
function isKey(value, object) {
  if (Array.isArray(value)) {
    return false;
  }
  const type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || common_vendor.isSymbol(value)) {
    return true;
  }
  return uni_modules_tuniaouiVue3_libs_lodash__common.reIsPlainProp.test(value) || !uni_modules_tuniaouiVue3_libs_lodash__common.reIsDeepProp.test(value) || // eslint-disable-next-line unicorn/new-for-builtins
  object != null && value in Object(object);
}
exports.isKey = isKey;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/_isKey.js.map
