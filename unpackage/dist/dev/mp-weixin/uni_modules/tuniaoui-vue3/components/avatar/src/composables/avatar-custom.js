"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_hooks_useNamespace_index = require("../../../../hooks/use-namespace/index.js");
const uni_modules_tuniaouiVue3_hooks_useComponentColor_index = require("../../../../hooks/use-component-color/index.js");
const uni_modules_tuniaouiVue3_hooks_useComponentSize_index = require("../../../../hooks/use-component-size/index.js");
require("../../../../libs/lodash/_baseToString.js");
const uni_modules_tuniaouiVue3_utils_dom_unit = require("../../../../utils/dom/unit.js");
require("../../../../hooks/use-z-index/index.js");
const uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatarProps = require("./use-avatar-props.js");
const useAvatarCustomStyle = (props, groupIndex, avatarWidth) => {
  const ns = uni_modules_tuniaouiVue3_hooks_useNamespace_index.useNamespace("avatar");
  const {
    type,
    size,
    shape,
    bgColor,
    border,
    borderColor,
    shadow,
    shadowColor,
    avatarGap
  } = uni_modules_tuniaouiVue3_components_avatar_src_composables_useAvatarProps.useAvatarProps(props);
  const [bgColorClass, bgColorStyle] = uni_modules_tuniaouiVue3_hooks_useComponentColor_index.useComponentColor(bgColor, "bg");
  const [borderColorClass, borderColorStyle] = uni_modules_tuniaouiVue3_hooks_useComponentColor_index.useComponentColor(
    borderColor,
    "border"
  );
  const [shadowColorClass] = uni_modules_tuniaouiVue3_hooks_useComponentColor_index.useComponentColor(shadowColor, "shadow");
  const { sizeType } = uni_modules_tuniaouiVue3_hooks_useComponentSize_index.useComponentSize(size.value);
  const avatarClass = common_vendor.computed(() => {
    const cls = [];
    cls.push(ns.b());
    if (type.value)
      cls.push(`tn-type-${type.value}_bg`);
    if (!type.value && bgColorClass.value)
      cls.push(bgColorClass.value);
    if (sizeType.value === "inner")
      cls.push(ns.m(size.value));
    if (shape.value)
      cls.push(ns.m(shape.value));
    if (border.value) {
      cls.push("tn-border");
      if (borderColorClass.value)
        cls.push(borderColorClass.value);
    }
    if (shadow.value) {
      cls.push("tn-shadow");
      if (shadowColorClass.value)
        cls.push(shadowColorClass.value);
    }
    return cls.join(" ");
  });
  const avatarStyle = common_vendor.computed(() => {
    const style = {};
    if (sizeType.value === "custom") {
      style.width = uni_modules_tuniaouiVue3_utils_dom_unit.formatDomSizeValue(size.value);
      style.height = style.width;
    }
    if (bgColorStyle.value)
      style.backgroundColor = bgColorStyle.value;
    if (border.value && borderColorStyle.value)
      style.borderColor = borderColorStyle.value;
    if (groupIndex.value != -1) {
      style.zIndex = groupIndex.value + 1;
      if (groupIndex.value > 0) {
        style.marginLeft = `calc(-${avatarWidth.value * avatarGap.value}px)`;
      } else {
        style.marginLeft = "0px";
      }
    }
    return style;
  });
  return {
    ns,
    avatarClass,
    avatarStyle
  };
};
exports.useAvatarCustomStyle = useAvatarCustomStyle;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/avatar/src/composables/avatar-custom.js.map
