"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (TnIcon + fuiBottomPopup)();
}
const fuiBottomPopup = () => "../../components/fui-bottom-popup.js";
const TnIcon = () => "../../uni_modules/tuniaoui-vue3/components/icon/src/icon.js";
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const showRoleSelect = common_vendor.ref(false);
    const roleName = common_vendor.ref("");
    const resist = common_vendor.ref("");
    const selectedRole = common_vendor.ref({});
    const isEdit = common_vendor.ref(false);
    common_vendor.ref({});
    const id = common_vendor.ref(null);
    const selectRole = (item) => {
      selectedRole.value = item;
      showRoleSelect.value = false;
    };
    const saveRole = async () => {
      const value = parseFloat(resist.value);
      if (!selectedRole.value.name || !roleName.value || !resist.value) {
        return common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
      }
      if (isNaN(value) || value > 999) {
        return common_vendor.index.showToast({
          title: "抗魔值不能大于999",
          icon: "none"
        });
      }
      const res = await common_vendor.index.$http.post("/dungeon/saveUserHero", {
        id: id.value,
        hero_id: selectedRole.value.id,
        nickname: roleName.value,
        resist_power: resist.value
      });
      if (res.code === 1) {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const deleteRole = () => {
      common_vendor.index.__f__("log", "at pages/hero/edit.vue:126", "删除角色");
    };
    const onResistInput = (e) => {
      let val = e.detail.value;
      if (parseFloat(val) > 999) {
        resist.value = "999";
      } else {
        resist.value = val;
      }
    };
    common_vendor.onLoad((params) => {
      if (params.id) {
        common_vendor.index.setNavigationBarTitle({
          title: "编辑角色"
        });
        isEdit.value = true;
        id.value = params.id;
        getUserHero(params.id);
      } else {
        common_vendor.index.setNavigationBarTitle({
          title: "新增角色"
        });
      }
    });
    const heroList = common_vendor.ref([]);
    const getHeroList = async () => {
      const res = await common_vendor.index.$http.get("/dungeon/heroList");
      if (res.code === 1) {
        heroList.value = res.data;
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    const getUserHero = async (id2) => {
      const res = await common_vendor.index.$http.post("/dungeon/getUserHero", {
        id: id2
      });
      if (res.code === 1) {
        roleName.value = res.data.nickname;
        resist.value = res.data.resist_power;
        selectedRole.value = {
          id: res.data.hero_id,
          name: res.data.hero_name,
          avatar: res.data.hero_avatar
        };
      } else {
        common_vendor.index.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      getHeroList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: "close"
        }),
        b: common_vendor.o(($event) => showRoleSelect.value = false),
        c: common_vendor.f(heroList.value, (group, k0, i0) => {
          return {
            a: common_vendor.t(group.name),
            b: common_vendor.f(group.heroes, (role, k1, i1) => {
              return {
                a: role.avatar,
                b: common_vendor.t(role.name),
                c: role.id,
                d: common_vendor.o(($event) => selectRole(role), role.id)
              };
            }),
            c: group.category
          };
        }),
        d: common_vendor.p({
          show: showRoleSelect.value
        }),
        e: selectedRole.value.avatar
      }, selectedRole.value.avatar ? {
        f: selectedRole.value.avatar
      } : {}, {
        g: common_vendor.t(selectedRole.value.name || "请选择职业"),
        h: common_vendor.o(($event) => showRoleSelect.value = true),
        i: roleName.value,
        j: common_vendor.o(($event) => roleName.value = $event.detail.value),
        k: common_vendor.o([($event) => resist.value = $event.detail.value, onResistInput]),
        l: resist.value,
        m: common_vendor.o(saveRole),
        n: isEdit.value
      }, isEdit.value ? {
        o: common_vendor.o(deleteRole)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ef99a890"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/hero/edit.js.map
