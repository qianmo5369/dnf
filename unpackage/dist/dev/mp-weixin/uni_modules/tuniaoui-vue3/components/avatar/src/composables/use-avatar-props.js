"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_tokens_avatar = require("../../../../tokens/avatar.js");
const uni_modules_tuniaouiVue3_utils_isEmpty = require("../../../../utils/is-empty.js");
require("../../../../libs/lodash/_baseToString.js");
const useAvatarProps = (props) => {
  const avatarGroup = common_vendor.inject(uni_modules_tuniaouiVue3_tokens_avatar.avatarGroupContextKey, void 0);
  const type = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(props == null ? void 0 : props.type, avatarGroup == null ? void 0 : avatarGroup.type, "");
  });
  const size = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(props == null ? void 0 : props.size, avatarGroup == null ? void 0 : avatarGroup.size, "");
  });
  const shape = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      props == null ? void 0 : props.shape,
      avatarGroup == null ? void 0 : avatarGroup.shape,
      "circle"
    );
  });
  const imgMode = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      props == null ? void 0 : props.imgMode,
      avatarGroup == null ? void 0 : avatarGroup.imgMode,
      "aspectFill"
    );
  });
  const bgColor = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      props == null ? void 0 : props.bgColor,
      avatarGroup == null ? void 0 : avatarGroup.bgColor,
      "tn-gray-light"
    );
  });
  const border = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      props == null ? void 0 : props.border,
      avatarGroup == null ? void 0 : avatarGroup.border,
      false
    );
  });
  const borderColor = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      props == null ? void 0 : props.borderColor,
      avatarGroup == null ? void 0 : avatarGroup.borderColor,
      ""
    );
  });
  const borderBold = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      props == null ? void 0 : props.borderBold,
      avatarGroup == null ? void 0 : avatarGroup.borderBold,
      false
    );
  });
  const shadow = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      props == null ? void 0 : props.shadow,
      avatarGroup == null ? void 0 : avatarGroup.shadow,
      false
    );
  });
  const shadowColor = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      props == null ? void 0 : props.shadowColor,
      avatarGroup == null ? void 0 : avatarGroup.shadowColor,
      ""
    );
  });
  const avatarGap = common_vendor.computed(() => {
    let gap = Number(uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(avatarGroup == null ? void 0 : avatarGroup.gap, 0));
    if (gap < 0)
      gap = 0;
    if (gap > 1)
      gap = 1;
    return gap;
  });
  return {
    type,
    size,
    shape,
    imgMode,
    bgColor,
    border,
    borderColor,
    borderBold,
    shadow,
    shadowColor,
    avatarGap
  };
};
exports.useAvatarProps = useAvatarProps;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/avatar/src/composables/use-avatar-props.js.map
