"use strict";
const common_vendor = require("../../common/vendor.js");
const util_env = require("../../util/env.js");
if (!Math) {
  fuiUpload();
}
const fuiUpload = () => "../../components/fui-upload.js";
const _sfc_main = {
  __name: "feedback",
  setup(__props) {
    const uploadRef = common_vendor.ref(null);
    const uploadUrl = util_env.baseUrl + "/common/upload";
    const uploadStatus = common_vendor.ref(false);
    const typeList = ["需求建议", "功能异常", "其他"];
    const selectedType = common_vendor.ref("需求建议");
    const desc = common_vendor.ref("");
    const imageList = common_vendor.ref([]);
    const uploadSuccess = (e) => {
      common_vendor.index.__f__("log", "at pages/user/feedback.vue:53", e);
      let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}");
      uploadStatus.value = e.status;
      if (res.data.url) {
        imageList.value = res.data.url;
      }
    };
    const uploadError = (e) => {
      uploadStatus.value = e.status;
      common_vendor.index.showModal({
        content: JSON.stringify(e)
      });
    };
    const submit = async () => {
      if (!desc.value.trim()) {
        common_vendor.index.showToast({
          title: "请填写问题描述",
          icon: "none"
        });
        return;
      }
      const res = await common_vendor.index.$http.post("/dungeon/submitFeedback", {
        content: desc.value,
        type: selectedType.value,
        images: imageList.value
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1e3);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(typeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: selectedType.value === item ? 1 : "",
            c: common_vendor.o(($event) => selectedType.value = item, _ctx.type)
          };
        }),
        b: _ctx.type,
        c: desc.value,
        d: common_vendor.o(($event) => desc.value = $event.detail.value),
        e: common_vendor.sr(uploadRef, "fff60cbe-0", {
          "k": "uploadRef"
        }),
        f: common_vendor.o(uploadSuccess),
        g: common_vendor.o(uploadError),
        h: common_vendor.p({
          borderColor: "#eee",
          background: "#Fff",
          radius: "10",
          immediate: true,
          width: "200",
          height: "200",
          url: uploadUrl,
          max: 3
        }),
        i: common_vendor.o(submit)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fff60cbe"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/feedback.js.map
