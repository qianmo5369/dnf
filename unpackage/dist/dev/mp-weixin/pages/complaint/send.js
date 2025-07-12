"use strict";
const common_vendor = require("../../common/vendor.js");
const util_env = require("../../util/env.js");
if (!Array) {
  const _easycom_tn_avatar2 = common_vendor.resolveComponent("tn-avatar");
  _easycom_tn_avatar2();
}
const _easycom_tn_avatar = () => "../../uni_modules/tuniaoui-vue3/components/avatar/src/avatar.js";
if (!Math) {
  (_easycom_tn_avatar + fuiUpload)();
}
const fuiUpload = () => "../../components/fui-upload.js";
const _sfc_main = {
  __name: "send",
  setup(__props) {
    const room_id = common_vendor.ref(null);
    const uploadUrl = util_env.baseUrl + "/common/upload";
    const selectedIds = common_vendor.ref([]);
    const uploadStatus = common_vendor.ref(false);
    const reason = common_vendor.ref("");
    const imageUrl = common_vendor.ref([]);
    const targets = common_vendor.ref([]);
    common_vendor.onLoad((params) => {
      if (params.room_id) {
        room_id.value = params.room_id;
      } else {
        common_vendor.index.showToast({
          title: "房间不存在",
          icon: "none"
        });
      }
    });
    common_vendor.onMounted(() => {
      getComplaintTargets();
    });
    const selectRole = (index) => {
      if (selectedIds.value.includes(index)) {
        selectedIds.value = selectedIds.value.filter((i) => i !== index);
      } else {
        selectedIds.value.push(index);
      }
    };
    const getComplaintTargets = async () => {
      const res = await common_vendor.index.$http.post("/room/getComplaintTargets", { room_id: room_id.value });
      if (res.code === 1) {
        targets.value = res.data;
      }
    };
    const uploadSuccess = (e) => {
      common_vendor.index.__f__("log", "at pages/complaint/send.vue:102", e);
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
    const submitAppeal = async () => {
      if (selectedIds.value.length === 0) {
        return common_vendor.index.showToast({ title: "请选择被投诉人", icon: "none" });
      }
      if (!reason.value.trim()) {
        return common_vendor.index.showToast({
          title: "请填写投诉内容",
          icon: "none"
        });
      }
      const imagesList = imageUrl.value.join(",");
      const res = await common_vendor.index.$http.post("/room/submitComplaint", {
        room_id: room_id.value,
        target_ids: selectedIds.value.map((i) => targets.value[i].user_id),
        reason: reason.value,
        images: imagesList
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: "发起申诉成功，请耐心等待",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(targets.value, (role, index, i0) => {
          return {
            a: "fa321729-0-" + i0,
            b: common_vendor.p({
              url: role.hero_avatar,
              size: "80rpx"
            }),
            c: common_vendor.t(role.resist_power),
            d: common_vendor.t(role.hero_name),
            e: common_vendor.t(role.user_nickname),
            f: index,
            g: selectedIds.value.includes(index) ? 1 : "",
            h: common_vendor.o(($event) => selectRole(index), index)
          };
        }),
        b: reason.value,
        c: common_vendor.o(($event) => reason.value = $event.detail.value),
        d: common_vendor.sr("uploadRef", "fa321729-1"),
        e: common_vendor.o(uploadSuccess),
        f: common_vendor.o(uploadError),
        g: common_vendor.p({
          borderColor: "#eee",
          background: "#Fff",
          radius: "10",
          immediate: true,
          width: "200",
          height: "200",
          url: uploadUrl,
          max: 3
        }),
        h: common_vendor.o(submitAppeal)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fa321729"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/complaint/send.js.map
