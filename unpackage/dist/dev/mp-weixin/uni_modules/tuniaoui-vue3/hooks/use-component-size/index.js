"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_constants_size = require("../../constants/size.js");
const useComponentSize = (size) => {
  const sizeType = common_vendor.computed(() => {
    if (!size)
      return "none";
    return uni_modules_tuniaouiVue3_constants_size.componentSizes.includes(size) ? "inner" : "custom";
  });
  return {
    sizeType
  };
};
exports.useComponentSize = useComponentSize;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/hooks/use-component-size/index.js.map
