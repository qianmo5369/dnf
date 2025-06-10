"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const uni_modules_tuniaouiVue3_utils_vue_props_runtime = require("../../../utils/vue/props/runtime.js");
require("../../../libs/lodash/_baseToString.js");
const uni_modules_tuniaouiVue3_constants_zIndex = require("../../../constants/z-index.js");
const uni_modules_tuniaouiVue3_components_modal_src_composables_modalCustom = require("./composables/modal-custom.js");
const uni_modules_tuniaouiVue3_components_modal_src_composables_useModal = require("./composables/use-modal.js");
const modalProps = uni_modules_tuniaouiVue3_utils_vue_props_runtime.buildProps({
  /**
   * @description zIndex
   */
  zIndex: {
    type: Number,
    default: uni_modules_tuniaouiVue3_constants_zIndex.ZIndex.modal
  }
});
if (!Math) {
  TnPopup();
}
const TnPopup = () => "../../popup/src/popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "modal",
  props: modalProps,
  setup(__props, { expose: __expose }) {
    const {
      openModal,
      showModal,
      title,
      content,
      showCancel,
      cancelText,
      confirmText,
      mask,
      maskClosable,
      cancelStyle,
      confirmStyle,
      clickCancel,
      clickConfirm
    } = uni_modules_tuniaouiVue3_components_modal_src_composables_useModal.useModal();
    const { ns, operationBtnClass, operationBtnStyle } = uni_modules_tuniaouiVue3_components_modal_src_composables_modalCustom.useModalCustomStyle(
      cancelStyle,
      confirmStyle
    );
    __expose({
      /**
       * @description 打开模态框
       */
      showModal
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(title)
      }, common_vendor.unref(title) ? {
        b: common_vendor.t(common_vendor.unref(title)),
        c: common_vendor.n(common_vendor.unref(ns).e("title"))
      } : {}, {
        d: common_vendor.t(common_vendor.unref(content)),
        e: common_vendor.n(common_vendor.unref(ns).em("content", "text")),
        f: common_vendor.n(common_vendor.unref(ns).e("content")),
        g: common_vendor.unref(showCancel)
      }, common_vendor.unref(showCancel) ? {
        h: common_vendor.t(common_vendor.unref(cancelText)),
        i: common_vendor.n(common_vendor.unref(operationBtnClass)("cancel")),
        j: common_vendor.s(common_vendor.unref(operationBtnStyle)("cancel")),
        k: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(clickCancel) && common_vendor.unref(clickCancel)(...args)
        )
      } : {}, {
        l: common_vendor.t(common_vendor.unref(confirmText)),
        m: common_vendor.n(common_vendor.unref(operationBtnClass)("confirm")),
        n: common_vendor.s(common_vendor.unref(operationBtnStyle)("confirm")),
        o: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(clickConfirm) && common_vendor.unref(clickConfirm)(...args)
        ),
        p: common_vendor.n(common_vendor.unref(ns).e("operation")),
        q: common_vendor.n(common_vendor.unref(ns).b()),
        r: common_vendor.o(($event) => common_vendor.isRef(openModal) ? openModal.value = $event : null),
        s: common_vendor.p({
          ["open-direction"]: "center",
          ["bg-color"]: "transparent",
          radius: "0",
          width: "80%",
          overlay: common_vendor.unref(mask),
          ["overlay-closeable"]: common_vendor.unref(maskClosable),
          ["z-index"]: _ctx.zIndex,
          modelValue: common_vendor.unref(openModal)
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ce44840b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/tuniaoui-vue3/components/modal/src/modal.js.map
