"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_libs_lodash__isKey = require("./_isKey.js");
const uni_modules_tuniaouiVue3_libs_lodash__castPath = require("./_castPath.js");
const uni_modules_tuniaouiVue3_libs_lodash__toKey = require("./_toKey.js");
const uni_modules_tuniaouiVue3_libs_lodash__isIndex = require("./_isIndex.js");
const uni_modules_tuniaouiVue3_libs_lodash__assignValue = require("./_assignValue.js");
function baseSet(object, path, value, customizer) {
  if (!common_vendor.isObject(object)) {
    return object;
  }
  path = uni_modules_tuniaouiVue3_libs_lodash__isKey.isKey(path, object) ? [path] : uni_modules_tuniaouiVue3_libs_lodash__castPath.castPath(path);
  let index = -1;
  const length = path.length;
  const lastIndex = length - 1;
  let nested = object;
  while (nested != null && ++index < length) {
    const key = uni_modules_tuniaouiVue3_libs_lodash__toKey.toKey(path[index]);
    let newValue = value;
    if (index != lastIndex) {
      const objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : void 0;
      if (newValue === void 0) {
        newValue = common_vendor.isObject(objValue) ? objValue : uni_modules_tuniaouiVue3_libs_lodash__isIndex.isIndex(path[index + 1]) ? [] : {};
      }
    }
    uni_modules_tuniaouiVue3_libs_lodash__assignValue.assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}
exports.set = set;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/libs/lodash/set.js.map
