"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_tokens_avatar = require("../../../../tokens/avatar.js");
const useAvatarIconConfig = (config) => {
  const avatarGroup = common_vendor.inject(uni_modules_tuniaouiVue3_tokens_avatar.avatarGroupContextKey, void 0);
  const iconColor = common_vendor.computed(() => {
    var _a;
    return (config == null ? void 0 : config.color) || ((_a = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a.color) || "";
  });
  const iconSize = common_vendor.computed(() => {
    var _a;
    return (config == null ? void 0 : config.size) || ((_a = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a.size) || "";
  });
  const iconBold = common_vendor.computed(() => {
    var _a;
    return (config == null ? void 0 : config.bold) || ((_a = avatarGroup == null ? void 0 : avatarGroup.iconConfig) == null ? void 0 : _a.bold) || false;
  });
  return {
    iconColor,
    iconSize,
    iconBold
  };
};
exports.useAvatarIconConfig = useAvatarIconConfig;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/avatar/src/composables/use-avatar-icon-props.js.map
