"use strict";
const uni_modules_tuniaouiVue3_libs_lodash__isKey = require("./_isKey.js");
const uni_modules_tuniaouiVue3_libs_lodash__castPath = require("./_castPath.js");
const uni_modules_tuniaouiVue3_libs_lodash__toKey = require("./_toKey.js");
function baseGet(object, path) {
  path = uni_modules_tuniaouiVue3_libs_lodash__isKey.isKey(path, object) ? [path] : uni_modules_tuniaouiVue3_libs_lodash__castPath.castPath(path);
  let index = 0;
  const length = path.length;
  while (object != null && index < length) {
    object = object[uni_modules_tuniaouiVue3_libs_lodash__toKey.toKey(path[index++])];
  }
  return index && index == length ? object : void 0;
}
function get(object, path, defaultValue) {
  const result = object == null ? void 0 : baseGet(object, path);
  return result === void 0 ? defaultValue : result;
}
exports.get = get;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/get.js.map
