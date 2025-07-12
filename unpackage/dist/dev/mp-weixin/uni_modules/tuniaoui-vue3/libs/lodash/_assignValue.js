"use strict";
const uni_modules_tuniaouiVue3_libs_lodash__eq = require("./_eq.js");
const objectProto = Object.prototype;
const hasOwnProperty = objectProto.hasOwnProperty;
function assignValue(object, key, value) {
  const objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && uni_modules_tuniaouiVue3_libs_lodash__eq.eq(objValue, value)) || value === void 0 && !(key in object)) {
    object[key] = value;
  }
}
exports.assignValue = assignValue;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/_assignValue.js.map
