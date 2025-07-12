"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_utils_isEmpty = require("../../utils/is-empty.js");
require("../../libs/lodash/_baseToString.js");
const useProp = (name) => {
  const vm = common_vendor.getCurrentInstance();
  return common_vendor.computed(
    () => {
      var _a;
      return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault((_a = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a.$props)[name];
    }
  );
};
exports.useProp = useProp;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/hooks/use-prop/index.js.map
