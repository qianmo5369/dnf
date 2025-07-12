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
  __name: "team-record",
  setup(__props) {
    const paging = common_vendor.ref(null);
    uni_modules_zPaging_components_zPaging_js_hooks_useZPaging.useZPaging(paging);
    const tabs = [
      {
        label: "全部",
        value: "all"
      },
      {
        label: "进行中",
        value: "in_progress"
      },
      {
        label: "已完成",
        value: "completed"
      },
      {
        label: "已解散",
        value: "disbanded"
      }
    ];
    const activeTab = common_vendor.ref("all");
    const teamList = common_vendor.ref([]);
    const handleTab = (value) => {
      activeTab.value = value;
      paging.value.reload();
    };
    const linkTo = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    const getTeamLogs = async (pageNo, pageSize) => {
      const res = await common_vendor.index.$http.post("/room/teamRoomList", {
        page: pageNo,
        page_size: pageSize,
        status: activeTab.value
      });
      if (res.code === 1) {
        common_vendor.index.__f__("log", "at pages/user/team-record.vue:130", res.data.list);
        paging.value.complete(res.data.list);
      } else {
        paging.value.complete(false);
      }
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
        b: common_vendor.f(teamList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.members.hero_avatar,
            b: common_vendor.t(item.members.resist_power),
            c: common_vendor.t(item.members.hero_name),
            d: common_vendor.t(item.members.hero_nickname),
            e: common_vendor.t(item.mode_title || "攻坚·奥兹玛"),
            f: common_vendor.t(item.members.role_name),
            g: common_vendor.n(item.members.role_code),
            h: item.map_code === "terache" && item.status === "completed"
          }, item.map_code === "terache" && item.status === "completed" ? {
            i: common_vendor.n(item.status)
          } : {
            j: common_vendor.t(item.statusText),
            k: common_vendor.n(item.status)
          }, {
            l: common_vendor.t(item.created_at_text),
            m: item.map_code === "terache" && item.status === "completed"
          }, item.map_code === "terache" && item.status === "completed" ? common_vendor.e({
            n: item.members.role_code == "seller"
          }, item.members.role_code == "seller" ? common_vendor.e({
            o: common_vendor.t(item.members.settle_info.tera_cost),
            p: common_vendor.t(item.members.settle_info.bonus_yuan),
            q: item.members.settle_info.card_bonus_yuan > 0
          }, item.members.settle_info.card_bonus_yuan > 0 ? {
            r: common_vendor.t(item.members.settle_info.card_bonus_yuan)
          } : {}) : common_vendor.e({
            s: common_vendor.t(item.members.settle_info),
            t: item.completeStatus === "completed"
          }, item.completeStatus === "completed" ? {
            v: common_vendor.t(item.tailaCarFee)
          } : {}, {
            w: item.members.settle_info.card_bonus_yuan
          }, item.members.settle_info.card_bonus_yuan ? {
            x: common_vendor.t(item.members.settle_info.card_bonus_yuan)
          } : {}), {
            y: common_vendor.t(item.tera_ratio || 5e3)
          }) : {}, {
            z: index,
            A: common_vendor.o(($event) => linkTo(`/pages/room/room?room_id=${item.id}`), index)
          });
        }),
        c: common_vendor.sr(paging, "e83a8c56-0", {
          "k": "paging"
        }),
        d: common_vendor.o(getTeamLogs),
        e: common_vendor.o(($event) => teamList.value = $event),
        f: common_vendor.p({
          modelValue: teamList.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e83a8c56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/team-record.js.map
