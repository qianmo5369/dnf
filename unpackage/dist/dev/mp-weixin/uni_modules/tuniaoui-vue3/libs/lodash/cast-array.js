"use strict";
function castArray(value) {
  if (!value || Array.isArray(value) && !value.length) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
exports.castArray = castArray;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/cast-array.js.map
