"use strict";
const common_vendor = require("../../common/vendor.js");
const util_env = require("../../util/env.js");
if (!Math) {
  fuiUpload();
}
const fuiUpload = () => "../../components/fui-upload.js";
const _sfc_main = {
  __name: "reply",
  setup(__props) {
    const complaint_id = common_vendor.ref(null);
    const uploadUrl = util_env.baseUrl + "/common/upload";
    common_vendor.ref([]);
    const uploadStatus = common_vendor.ref(false);
    const content = common_vendor.ref("");
    const imageUrl = common_vendor.ref([]);
    common_vendor.ref([]);
    common_vendor.onLoad((params) => {
      if (params.complaint_id) {
        complaint_id.value = params.complaint_id;
      } else {
        common_vendor.index.showToast({
          title: "房间不存在",
          icon: "none"
        });
      }
    });
    const uploadSuccess = (e) => {
      common_vendor.index.__f__("log", "at pages/complaint/reply.vue:73", e);
      let res = JSON.parse(e.res.data.replace(/\ufeff/g, "") || "{}");
      uploadStatus.value = e.status;
      if (res.data.url) {
        imageUrl.value.push(res.data.url);
      }
    };
    const uploadError = (e) => {
      uploadStatus.value = e.status;
      common_vendor.index.showModal({
        content: JSON.stringify(e)
      });
    };
    const addComplaintReply = async () => {
      if (!content.value.trim()) {
        return common_vendor.index.showToast({
          title: "请填写回复内容",
          icon: "none"
        });
      }
      const imagesList = imageUrl.value.join(",");
      const res = await common_vendor.index.$http.post("/room/addComplaintReply", {
        complaint_id: complaint_id.value,
        content: content.value,
        images: imagesList
      });
      if (res.code === 1) {
        return common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: content.value,
        b: common_vendor.o(($event) => content.value = $event.detail.value),
        c: common_vendor.sr("uploadRef", "6c024c73-0"),
        d: common_vendor.o(uploadSuccess),
        e: common_vendor.o(uploadError),
        f: common_vendor.p({
          borderColor: "#eee",
          background: "#Fff",
          radius: "10",
          immediate: true,
          width: "200",
          height: "200",
          url: uploadUrl,
          max: 3
        }),
        g: common_vendor.o(addComplaintReply)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6c024c73"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/complaint/reply.js.map
