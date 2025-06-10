"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_libs_lodash_isNumber = require("../../../../libs/lodash/is-number.js");
require("../../../../libs/lodash/_baseToString.js");
const useBadge = (props, emits) => {
  const showBadge = common_vendor.computed(() => {
    return !!props.dot || props.value !== "" && props.value !== void 0;
  });
  const contentType = common_vendor.computed(() => {
    let type = "string";
    if (uni_modules_tuniaouiVue3_libs_lodash_isNumber.isNumber(props.value))
      type = "number";
    if (common_vendor.isString(props.value) && props.value.startsWith("icon-"))
      type = "icon";
    return type;
  });
  const content = common_vendor.computed(() => {
    if (props.dot)
      return "";
    if (contentType.value === "number" && props.max) {
      const value = Number(props.value || 0);
      const max = Number(props.max || 0);
      return value > max ? `${max}+` : `${value}`;
    }
    if (contentType.value === "icon")
      return props.value.replace("icon-", "");
    return props.value;
  });
  const badgeClick = () => {
    if (emits)
      emits("click", props.index);
  };
  return {
    showBadge,
    contentType,
    content,
    badgeClick
  };
};
exports.useBadge = useBadge;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/badge/src/composables/use-badge.js.map
