"use strict";
const common_vendor = require("../common/vendor.js");
if (!Math) {
  TnIcon();
}
const TnIcon = () => "../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const _sfc_main = {
  __name: "parse",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    contentId: {
      type: Number,
      default: 1
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    common_vendor.ref(true);
    const title = common_vendor.ref("");
    const content = common_vendor.ref("");
    const props = __props;
    const emit = __emit;
    const getContent = async () => {
      const res = await common_vendor.index.$http.post("/index/content", {
        id: props.contentId
      });
      if (res.code === 1) {
        title.value = res.data.title;
        content.value = res.data.content;
      }
    };
    common_vendor.onMounted(() => {
      getContent();
    });
    const onClose = () => {
      emit("update:modelValue", false);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(title.value),
        b: common_vendor.p({
          name: "close"
        }),
        c: common_vendor.o(onClose),
        d: content.value,
        e: common_vendor.o(onClose)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d8275715"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/parse.js.map
