"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_tokens_avatar = require("../../../../tokens/avatar.js");
const uni_modules_tuniaouiVue3_utils_isEmpty = require("../../../../utils/is-empty.js");
require("../../../../libs/lodash/_baseToString.js");
const uni_modules_tuniaouiVue3_utils_rand = require("../../../../utils/rand.js");
const uni_modules_tuniaouiVue3_utils_error = require("../../../../utils/error.js");
const uni_modules_tuniaouiVue3_hooks_useSelectorQuery_index = require("../../../../hooks/use-selector-query/index.js");
require("../../../../hooks/use-z-index/index.js");
const useAvatar = (props, emits) => {
  const instance = common_vendor.getCurrentInstance();
  if (!instance) {
    uni_modules_tuniaouiVue3_utils_error.debugWarn("TnAvatarGroup", "请在 setup 中使用 useAvatarGroup");
  }
  const { uid } = instance;
  const avatarGroup = common_vendor.inject(uni_modules_tuniaouiVue3_tokens_avatar.avatarGroupContextKey, void 0);
  avatarGroup == null ? void 0 : avatarGroup.addItem({ uid });
  const componentId = `ta-${uni_modules_tuniaouiVue3_utils_rand.generateId()}`;
  const { getSelectorNodeInfo } = uni_modules_tuniaouiVue3_hooks_useSelectorQuery_index.useSelectorQuery(instance);
  const groupAvatarCount = common_vendor.computed(() => {
    return uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(avatarGroup == null ? void 0 : avatarGroup.avatarItems.length, 0);
  });
  const avatarGroupIndex = common_vendor.ref(-1);
  common_vendor.nextTick$1(() => {
    const avatarIndex = avatarGroup == null ? void 0 : avatarGroup.avatarItems.findIndex(
      (item) => item.uid === uid
    );
    avatarGroupIndex.value = uni_modules_tuniaouiVue3_utils_isEmpty.isEmptyVariableInDefault(avatarIndex, -1);
    if (!avatarWidth.value && avatarGroupIndex.value !== -1) {
      getAvatarWidthNodeInfo();
    }
  });
  const avatarWidth = common_vendor.ref(0);
  let initCount = 0;
  const getAvatarWidthNodeInfo = async () => {
    try {
      const rectInfo = await getSelectorNodeInfo(`#${componentId}`);
      if (!rectInfo.width) {
        throw new Error("获取头像宽度信息失败");
      }
      avatarWidth.value = rectInfo.width || 0;
    } catch (err) {
      if (initCount > 10) {
        initCount = 0;
        uni_modules_tuniaouiVue3_utils_error.debugWarn("TnAvatar", `获取头像宽度信息失败：${err}`);
        return;
      }
      initCount++;
      setTimeout(() => {
        getAvatarWidthNodeInfo();
      }, 150);
    }
  };
  const avatarClick = () => {
    avatarGroup == null ? void 0 : avatarGroup.handleItemClick(uid);
    emits("click");
  };
  common_vendor.onUnmounted(() => {
    avatarGroup == null ? void 0 : avatarGroup.removeItem(uid);
  });
  return {
    componentId,
    groupAvatarCount,
    avatarGroupIndex,
    avatarWidth,
    avatarClick
  };
};
exports.useAvatar = useAvatar;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/avatar/src/composables/use-avatar.js.map
