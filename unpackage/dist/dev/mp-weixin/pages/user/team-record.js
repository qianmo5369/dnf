"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "team-record",
  setup(__props) {
    const tabs = [
      { label: "全部", value: "all" },
      { label: "进行中", value: "progress" },
      { label: "已完成", value: "done" },
      { label: "已解散", value: "closed" }
    ];
    const activeTab = common_vendor.ref("all");
    const teamList = common_vendor.ref([]);
    const filteredList = common_vendor.computed(() => {
      if (activeTab.value === "all")
        return teamList.value;
      return teamList.value.filter((item) => item.state === activeTab.value);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.label),
            b: tab.value,
            c: activeTab.value === tab.value ? 1 : "",
            d: common_vendor.o(($event) => activeTab.value = tab.value, tab.value)
          };
        }),
        b: common_vendor.f(filteredList.value, (item, index, i0) => {
          return {
            a: item.avatar,
            b: common_vendor.t(item.level),
            c: common_vendor.t(item.remark),
            d: common_vendor.t(item.map),
            e: common_vendor.t(item.role),
            f: common_vendor.n(item.role === "打手" ? "red" : "blue"),
            g: common_vendor.t(item.status),
            h: common_vendor.t(item.time),
            i: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e83a8c56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/team-record.js.map
