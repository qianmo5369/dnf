"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_hooks_useNamespace_index = require("../../../../hooks/use-namespace/index.js");
const uni_modules_tuniaouiVue3_hooks_useComponentColor_index = require("../../../../hooks/use-component-color/index.js");
const uni_modules_tuniaouiVue3_hooks_useComponentSize_index = require("../../../../hooks/use-component-size/index.js");
require("../../../../libs/lodash/_baseToString.js");
const uni_modules_tuniaouiVue3_utils_types = require("../../../../utils/types.js");
const uni_modules_tuniaouiVue3_utils_dom_unit = require("../../../../utils/dom/unit.js");
require("../../../../hooks/use-z-index/index.js");
const uni_modules_tuniaouiVue3_components_badge_src_composables_useBadge = require("./use-badge.js");
const useBadgeCustomStyle = (props) => {
  const ns = uni_modules_tuniaouiVue3_hooks_useNamespace_index.useNamespace("badge");
  const contentNs = uni_modules_tuniaouiVue3_hooks_useNamespace_index.useNamespace("badge-content");
  const { contentType } = uni_modules_tuniaouiVue3_components_badge_src_composables_useBadge.useBadge(props);
  const [bgColorClass, bgColorStyle] = uni_modules_tuniaouiVue3_hooks_useComponentColor_index.useComponentColor(
    common_vendor.toRef(props, "bgColor"),
    "bg"
  );
  const [textColorClass, textColorStyle] = uni_modules_tuniaouiVue3_hooks_useComponentColor_index.useComponentColor(
    common_vendor.toRef(props, "textColor"),
    "text"
  );
  const { sizeType } = uni_modules_tuniaouiVue3_hooks_useComponentSize_index.useComponentSize(props.size);
  const badgeContentClass = common_vendor.computed(() => {
    const cls = [];
    cls.push(contentNs.b());
    if (props.dot)
      cls.push(contentNs.m("dot"));
    if (contentType.value === "icon")
      cls.push(contentNs.m("icon"));
    if (props.absolute) {
      cls.push(contentNs.e("absolute"));
      if (props.absoluteCenter)
        cls.push(contentNs.em("absolute", "center"));
    }
    if (props.type)
      cls.push(`tn-type-${props.type}_bg`);
    if (bgColorClass.value)
      cls.push(bgColorClass.value);
    if (textColorClass.value)
      cls.push(textColorClass.value);
    if (props.size && sizeType.value === "inner")
      cls.push(contentNs.m(props.size));
    if (props.bold)
      cls.push("tn-text-bold");
    if (props.customClass)
      cls.push(props.customClass);
    return cls.join(" ");
  });
  const badgeContentStyle = common_vendor.computed(() => {
    const style = {};
    if (bgColorStyle.value)
      style.backgroundColor = bgColorStyle.value;
    if (textColorStyle.value)
      style.color = textColorStyle.value;
    if (props.size && (sizeType.value === "custom" || contentType.value === "icon"))
      style.width = style.height = uni_modules_tuniaouiVue3_utils_dom_unit.formatDomSizeValue(props.size);
    if (props.fontSize)
      style.fontSize = uni_modules_tuniaouiVue3_utils_dom_unit.formatDomSizeValue(props.fontSize);
    if (props.absolutePosition.top)
      style.top = uni_modules_tuniaouiVue3_utils_dom_unit.formatDomSizeValue(props.absolutePosition.top);
    if (props.absolutePosition.right)
      style.right = uni_modules_tuniaouiVue3_utils_dom_unit.formatDomSizeValue(props.absolutePosition.right);
    if (!uni_modules_tuniaouiVue3_utils_types.isEmpty(props.customStyle)) {
      Object.assign(style, props.customStyle);
    }
    return style;
  });
  return {
    ns,
    contentNs,
    badgeContentClass,
    badgeContentStyle
  };
};
exports.useBadgeCustomStyle = useBadgeCustomStyle;
//# sourceMappingURL=../../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/badge/src/composables/badge-custom.js.map
