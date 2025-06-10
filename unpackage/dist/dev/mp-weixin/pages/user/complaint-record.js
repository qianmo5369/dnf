"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_hooks_useZPaging = require("../../uni_modules/z-paging/components/z-paging/js/hooks/useZPaging.js");
if (!Array) {
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  _easycom_z_paging2();
}
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  _easycom_z_paging();
}
const _sfc_main = {
  __name: "complaint-record",
  setup(__props) {
    const paging = common_vendor.ref(null);
    uni_modules_zPaging_components_zPaging_js_hooks_useZPaging.useZPaging(paging);
    const tabs = [
      { label: "待处理", value: "pending" },
      { label: "处理中", value: "processing" },
      { label: "撤回申诉", value: "resolved" },
      { label: "已完成", value: "cancelled" }
    ];
    const activeTab = common_vendor.ref("pending");
    const complaintList = common_vendor.ref([]);
    const handleTab = (value) => {
      activeTab.value = value;
      paging.value.reload();
    };
    const getComplaintList = async (pageNo, pageSize) => {
      const res = await common_vendor.index.$http.post("/room/complaintList", {
        page: pageNo,
        page_size: pageSize,
        status: activeTab.value
      });
      if (res.code === 1) {
        common_vendor.index.__f__("log", "at pages/user/complaint-record.vue:87", res.data.list);
        paging.value.complete(res.data.list);
      } else {
        paging.value.complete(false);
      }
    };
    const linkTo = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.label),
            b: tab.value,
            c: activeTab.value === tab.value ? 1 : "",
            d: common_vendor.o(($event) => handleTab(tab.value), tab.value)
          };
        }),
        b: common_vendor.f(complaintList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.hero.hero_avatar,
            b: common_vendor.t(item.hero.resist_power),
            c: common_vendor.t(item.hero.hero_name),
            d: common_vendor.t(item.hero.nickname),
            e: item.status == "pending"
          }, item.status == "pending" ? {} : {}, {
            f: item.status == "processing"
          }, item.status == "processing" ? {} : {}, {
            g: item.status == "resolved"
          }, item.status == "resolved" ? {} : {}, {
            h: item.status == "cancelled"
          }, item.status == "cancelled" ? {} : {}, {
            i: common_vendor.t(item.room_sn),
            j: item.is_mine
          }, item.is_mine ? {} : {}, {
            k: common_vendor.t(item.reason),
            l: common_vendor.t(item.created_at_text),
            m: common_vendor.o(($event) => linkTo(`/pages/complaint/complaint?complaint_id=${item.id}`), index),
            n: index
          });
        }),
        c: common_vendor.sr(paging, "03141c4a-0", {
          "k": "paging"
        }),
        d: common_vendor.o(getComplaintList),
        e: common_vendor.o(($event) => complaintList.value = $event),
        f: common_vendor.p({
          fixed: false,
          modelValue: complaintList.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-03141c4a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/complaint-record.js.map
