"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_components_base_composables_useComponentCommonProps_index = require("../../base/composables/use-component-common-props/index.js");
const uni_modules_tuniaouiVue3_utils_vue_props_runtime = require("../../../utils/vue/props/runtime.js");
require("../../../libs/lodash/_baseToString.js");
const uni_modules_tuniaouiVue3_constants_imgMode = require("../../../constants/img-mode.js");
const uni_modules_tuniaouiVue3_constants_types = require("../../../constants/types.js");
const uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatarIconProps = require("./composables/use-avatar-icon-props.js");
const uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatarProps = require("./composables/use-avatar-props.js");
const uni_modules_tuniaouiVue3_components_avatar_src_composables_avatarCustom = require("./composables/avatar-custom.js");
const uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatar = require("./composables/use-avatar.js");
require("../../../hooks/use-z-index/index.js");
const uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatarBadgeProps = require("./composables/use-avatar-badge-props.js");
const avatarShape = ["circle", "square"];
const avatarProps = uni_modules_tuniaouiVue3_utils_vue_props_runtime.buildProps({
  /**
   * @description 头像地址(url地址和绝对地址)
   */
  url: String,
  /**
   * @descripttion 头像图标
   */
  icon: String,
  /**
   * @description 头像图标配置
   */
  iconConfig: {
    type: uni_modules_tuniaouiVue3_utils_vue_props_runtime.definePropType(Object),
    default: () => ({})
  },
  /**
   * @description 头像颜色类型
   */
  type: {
    type: String,
    values: uni_modules_tuniaouiVue3_constants_types.componentTypes,
    default: ""
  },
  /**
   * @description 头像大小
   */
  size: {
    type: [String, Number]
  },
  /**
   * @description 头像形状
   */
  shape: {
    type: String,
    values: avatarShape,
    default: "circle"
  },
  /**
   * @description 头像图片模式
   */
  imgMode: {
    type: String,
    values: uni_modules_tuniaouiVue3_constants_imgMode.componentImgModes,
    default: "aspectFill"
  },
  /**
   * @description 背景颜色
   */
  bgColor: String,
  /**
   * @description 显示边框
   */
  border: uni_modules_tuniaouiVue3_components_base_composables_useComponentCommonProps_index.useComponentBoolean,
  /**
   * @description 边框颜色
   */
  borderColor: String,
  /**
   * @description 是否加粗边框
   */
  borderBold: uni_modules_tuniaouiVue3_components_base_composables_useComponentCommonProps_index.useComponentBoolean,
  /**
   * @description 显示阴影
   */
  shadow: uni_modules_tuniaouiVue3_components_base_composables_useComponentCommonProps_index.useComponentBoolean,
  /**
   * @description 阴影颜色
   */
  shadowColor: String,
  /**
   * @description 角标内容
   */
  badge: {
    type: [String, Number]
  },
  /**
   * @description 角标配置
   */
  badgeConfig: {
    type: uni_modules_tuniaouiVue3_utils_vue_props_runtime.definePropType(Object),
    default: () => ({})
  }
});
const avatarEmits = {
  /**
   * @description 点击事件
   */
  click: () => true
};
if (!Math) {
  (TnIcon + TnBadge)();
}
const TnIcon = () => "../../icon/src/icon.js";
const TnBadge = () => "../../badge/src/badge.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "avatar",
  props: avatarProps,
  emits: avatarEmits,
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const { componentId, avatarGroupIndex, avatarWidth, avatarClick } = uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatar.useAvatar(
      props,
      emits
    );
    const { ns, avatarClass, avatarStyle } = uni_modules_tuniaouiVue3_components_avatar_src_composables_avatarCustom.useAvatarCustomStyle(
      props,
      avatarGroupIndex,
      avatarWidth
    );
    const { imgMode } = uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatarProps.useAvatarProps(props);
    const { iconSize, iconColor, iconBold } = uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatarIconProps.useAvatarIconConfig(props.iconConfig);
    const { badgeConfig } = uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatarBadgeProps.useAvatarBadgeProps(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.url
      }, _ctx.url ? {
        b: _ctx.url,
        c: common_vendor.unref(imgMode),
        d: common_vendor.n(common_vendor.unref(ns).e("image"))
      } : _ctx.icon ? {
        f: common_vendor.p({
          name: _ctx.icon,
          color: common_vendor.unref(iconColor),
          size: common_vendor.unref(iconSize),
          bold: common_vendor.unref(iconBold)
        }),
        g: common_vendor.n(common_vendor.unref(ns).e("icon"))
      } : {
        h: common_vendor.n(common_vendor.unref(ns).e("custom"))
      }, {
        e: _ctx.icon,
        i: common_vendor.p({
          ...common_vendor.unref(badgeConfig)
        }),
        j: common_vendor.unref(componentId),
        k: common_vendor.n(common_vendor.unref(avatarClass)),
        l: common_vendor.s(common_vendor.unref(avatarStyle)),
        m: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(avatarClick) && common_vendor.unref(avatarClick)(...args)
        )
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aba3476d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js.map
