"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_tokens_avatar = require("../../../../tokens/avatar.js");
const uni_modules_tuniaouiVue3_utils_isEmpty = require("../../../../utils/is-empty.js");
require("../../../../libs/lodash/_baseToString.js");
const useAvatarBadgeProps = (props) => {
  const avatarGroup = common_vendor.inject(uni_modules_tuniaouiVue3_tokens_avatar.avatarGroupContextKey, void 0);
  const max = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.max,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.max
    );
  });
  const type = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.type,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.type,
      "primary"
    );
  });
  const bgColor = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.bgColor,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.bgColor
    );
  });
  const textColor = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.textColor,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.textColor
    );
  });
  const fontSize = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.fontSize,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.fontSize
    );
  });
  const size = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.size,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.size
    );
  });
  const bold = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.bold,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.bold,
      false
    );
  });
  const dot = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.dot,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.dot,
      false
    );
  });
  const absolutePosition = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.absolutePosition,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.absolutePosition,
      {}
    );
  });
  const absoluteCenter = common_vendor.computed(() => {
    var _a, _b;
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyDoubleVariableInDefault(
      (_a = props == null ? void 0 : props.badgeConfig) == null ? void 0 : _a.absoluteCenter,
      (_b = avatarGroup == null ? void 0 : avatarGroup.badgeConfig) == null ? void 0 : _b.absoluteCenter,
      true
    );
  });
  const badgeConfig = common_vendor.computed(() => {
    return {
      value: props.badge,
      max: max.value,
      type: type.value,
      bgColor: bgColor.value,
      textColor: textColor.value,
      fontSize: fontSize.value,
      size: size.value,
      bold: bold.value,
      customClass: "",
      customStyle: {},
      dot: dot.value,
      absolute: true,
      absolutePosition: absolutePosition.value,
      absoluteCenter: absoluteCenter.value,
      index: ""
    };
  });
  return {
    badgeConfig
  };
};
exports.useAvatarBadgeProps = useAvatarBadgeProps;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/avatar/src/composables/use-avatar-badge-props.js.map
