"use strict";
const uni_modules_tuniaouiVue3_libs_lodash__common = require("./_common.js");
function isIndex(value, length) {
  length = length == null ? uni_modules_tuniaouiVue3_libs_lodash__common.MAX_SAFE_INTEGER : length;
  return !!length && (typeof value == "number" || uni_modules_tuniaouiVue3_libs_lodash__common.reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
exports.isIndex = isIndex;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/_isIndex.js.map
