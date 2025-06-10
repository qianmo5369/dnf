"use strict";
const common_vendor = require("../../../../common/vendor.js");
require("../../libs/lodash/_baseToString.js");
const uni_modules_tuniaouiVue3_utils_error = require("../../utils/error.js");
const useSelectorQuery = (instance) => {
  let query = null;
  if (!instance) {
    instance = common_vendor.getCurrentInstance();
  }
  if (!instance) {
    uni_modules_tuniaouiVue3_utils_error.debugWarn("useSelectorQuery", "useSelectorQuery必须在setup函数中使用");
  }
  query = common_vendor.index.createSelectorQuery().in(instance);
  const getSelectorNodeInfo = (selector) => {
    return new Promise((resolve, reject) => {
      if (query) {
        query.select(selector).boundingClientRect((res) => {
          const selectRes = res;
          if (selectRes) {
            resolve(selectRes);
          } else {
            reject(new Error(`未找到对应节点: ${selector}`));
          }
        }).exec();
      } else {
        reject(new Error("未找到对应的SelectorQuery实例"));
      }
    });
  };
  const getSelectorNodeInfos = (selector) => {
    return new Promise((resolve, reject) => {
      if (query) {
        query.selectAll(selector).boundingClientRect((res) => {
          const selectRes = res;
          if (selectRes && selectRes.length > 0) {
            resolve(selectRes);
          } else {
            reject(new Error(`未找到对应节点: ${selector}`));
          }
        }).exec();
      } else {
        reject(new Error("未找到对应的SelectorQuery实例"));
      }
    });
  };
  return {
    query,
    getSelectorNodeInfo,
    getSelectorNodeInfos
  };
};
exports.useSelectorQuery = useSelectorQuery;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/hooks/use-selector-query/index.js.map
