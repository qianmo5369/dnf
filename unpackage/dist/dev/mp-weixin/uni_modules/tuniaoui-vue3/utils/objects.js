"use strict";
const uni_modules_tuniaouiVue3_libs_lodash_get = require("../libs/lodash/get.js");
const uni_modules_tuniaouiVue3_libs_lodash_set = require("../libs/lodash/set.js");
require("../libs/lodash/_baseToString.js");
const getProp = (obj, path, defaultValue) => {
  return {
    get value() {
      return uni_modules_tuniaouiVue3_libs_lodash_get.get(obj, path, defaultValue);
    },
    set value(val) {
      uni_modules_tuniaouiVue3_libs_lodash_set.set(obj, path, val);
    }
  };
};
exports.getProp = getProp;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/utils/objects.js.map
